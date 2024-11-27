const PostModel = require("../models/Post");
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const client = new S3Client({
  region: process.env.AWS_Region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

exports.createPost = async (req, res) => {
  try {
    const fileKey = `${Date.now()}_${req.file.originalname}`;

    const uploadParams = {
      Bucket: "memosac.bucket",
      Key: `uploads/posts/${fileKey}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const upload = new Upload({ client, params: uploadParams });
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

    res.status(200).json({ message: "File uploaded and post created successfully!" });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ error: "Failed to upload file or create post." });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving posts" });
  }
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostModel.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Error retrieving the post" });
  }
};