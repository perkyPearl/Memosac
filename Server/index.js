const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const PostModel = require("./models/Post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const { Upload } = require("@aws-sdk/lib-storage");

const app = express();
const salt = bcrypt.genSaltSync(10);
const secret = "jhdbw";

require('dotenv').config();

const client = new S3Client({
  region: process.env.AWS_Region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

mongoose
  .connect(process.env.MongoDBURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/time-capsules", require("./routes/timeCapsules"))

app.post("/google-login", async (req, res) => {
  const { username, email, profilePic } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        username: username || email.split("@")[0],
        email,
        profilePic,
      });
      await user.save();
    }

    const token = jwt.sign({ username, id: user._id }, secret, {
      expiresIn: "7d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: false,
        sameSite: "Lax",
      })
      .json({
        id: user._id,
        username,
        token,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error while processing Google login" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign(
        { id: user._id, username: user.username },
        secret,
        { expiresIn: "1h" }
      );
      res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          secure: false,
          sameSite: "Lax",
        })
        .json({
          id: user._id,
          username,
          token,
        });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error during login" });
  }
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error while registering user" });
  }
});

app.post("/create", upload.single("file"), async (req, res) => {
  try {
    const fileKey = `${Date.now()}_${req.file.originalname}`;

    const uploadParams = {
      Bucket: "memosac.bucket",
      Key: `uploads/posts/${fileKey}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const upload = new Upload({
      client,
      params: uploadParams,
    });

    await upload.done();

    let region = client.config.region;
    if (typeof region === "function") {
      region = await region();
    }

    const s3Url = `https://${uploadParams.Bucket}.s3.${region}.amazonaws.com/${uploadParams.Key}`;

    const newPost = new PostModel({
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      cover: s3Url,
    });

    await newPost.save();

    res
      .status(200)
      .json({ message: "File uploaded and post created successfully!" });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ error: "Failed to upload file or create post." });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving posts" });
  }
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostModel.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);

    res.status(500).json({ message: "Error retrieving the post" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Successfully logged out" });
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, secret, (err, info) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });
    res.json(info);
  });
});

app.listen(4000, () => {
  console.log("Server is live on port 4000!");
});
