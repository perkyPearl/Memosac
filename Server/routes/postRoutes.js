const express = require("express");
const { createPost, getAllPosts, getPostById } = require("../controllers/postController");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/create", upload.single("file"), createPost);
router.get("/posts", getAllPosts);
router.get("/:id", getPostById);

module.exports = router;