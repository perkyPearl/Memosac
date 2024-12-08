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
const galleryRoutes = require("./routes/galleryRoutes");
const albumRoutes = require("./routes/albumRoutes");
const path = require("path");
// const { initGridFSBucket } = require("./gridFS");

const app = express();
const salt = bcrypt.genSaltSync(10);
// const secret = "jhdbw";

require("dotenv").config();

const client = new S3Client({
    region: process.env.AWS_Region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
console.log("MongoDB URI:", process.env.MongoDBURI);

mongoose
    .connect(process.env.MongoDBURI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api", galleryRoutes);
app.use("/api/albums", albumRoutes);
app.use("/recipes", require("./routes/recipes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/user", require("./routes/userRoutes"));
app.use("/timecapsule", require("./routes/timeCapsules"));

// // Serve files from GridFSBucket
// app.get("/uploads/:filename", async (req, res) => {
//     try {
//         const { filename } = req.params;
//         if (!filename) {
//             console.error(
//                 "Filename parameter is missing in get route of gridFS uploadin index.js"
//             );
//             return res
//                 .status(400)
//                 .send(
//                     "Filename is required in get route of gridFS uploadin index.js"
//                 );
//         }

//         console.log(`🕵️ Retrieving file: ${filename}`);

//         const gridFSBucket = await initGridFSBucket();

//         if (!gridFSBucket) {
//             return res
//                 .status(500)
//                 .json({ error: "GridFSBucket not initialized in index.js" });
//         }
//         console.log(`🕵️ Retrieving file: ${req.params.filename}`);

//         const files = await gridFSBucket.find({ filename }).toArray();
//         if (!files || !files.length===0) {
//             console.error(
//                 "❌ File not found in get route of gridFS in index.js"
//             );
//             return res.status(404).json({
//                 error: "❌ File not found in get route of gridFS in index.js",
//             });
//         }

//         const file = files[0];
//         res.set(
//             "Content-Type",
//             file.metadata.mimeType || "application/octet-stream"
//         );

//         const downloadStream = gridFSBucket.openDownloadStreamByName(filename);
//         downloadStream.pipe(res);

//         downloadStream.on("error", (err) => {
//             console.error("Stream error:", err);
//             res.status(500).send("Error streaming file");
//         });
//         downloadStream.on("finish", () => {
//             console.log(
//                 `✅ File streamed successfully: ${req.params.filename}`
//             );
//         });
//     } catch (error) {
//         console.error(
//             "Failed to retrieve file in get route of gridFS upload in index.js:",
//             error
//         );
//         res.status(500).json({ error: "Failed to retrieve file in get route of gridFS upload in index.js" });
//     }
// });

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

        const token = jwt.sign(
            { username, id: user._id },
            process.env.PRIVATE_KEY,
            {
                expiresIn: "7d",
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: "Lax",
        }).json({
            id: user._id,
            username,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error while processing Google login",
        });
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
                process.env.PRIVATE_KEY,
                { expiresIn: "24h" }
            );
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: false,
                sameSite: "Lax",
            }).json({
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
        res.status(500).json({
            message: "Internal server error while registering user",
        });
    }
});

app.post("/create", upload.single("file"), async (req, res) => {
    try {
        const fileKey = `${Date.now()}_${req.file.originalname}`;

        console.log(req.body);

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
            author: req.body.author,
        });

        await newPost.save();

        res.status(200).json({
            message: "File uploaded and post created successfully!",
        });
    } catch (error) {
        console.error("Upload failed:", error);
        res.status(500).json({
            error: "Failed to upload file or create post.",
        });
    }
});

app.get("/posts", async (req, res) => {
    try {
        const posts = await PostModel.find().populate("author", "_id username");
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

    jwt.verify(token, process.env.PRIVATE_KEY, (err, info) => {
        if (err)
            return res
                .status(403)
                .json({ message: "Invalid or expired token" });
        res.json(info);
    });
});

app.listen(4000, () => {
    console.log("Server is live on port 4000!");
});
