const Album = require("../models/albumModel");
// const Gallery = require("../models/galleryModel");
// const fs = require("fs");
// const path = require("path");
const mongoose = require("mongoose");

//For creating a new album
exports.createAlbum = async (req, res) => {
    try {
        const { albumName, description, tags, isPublic } = req.body;
        console.log("Received Body:", req.body); // Log the entire request body

        console.log("Album Name from request body:", req.body.albumName);

        if (!albumName || albumName.trim() === "") {
            return res
                .status(400)
                .json({ message: "Your Memosac deserves a title " });
        }

        if (!req.files || !req.files.coverImage || !req.files.images) {
            return res
                .status(400)
                .json({ message: "Cover image and images are required." });
        }

        console.log("Cover Image:", req.files.coverImage);

        const coverImage = req.files.coverImage
            ? req.files.coverImage[0].filename
            : null;
        const images = req.files.images
            ? req.files.images
                  .filter((file) => file && file.filename) // Filter out invalid entries
                  .map((file) => file.filename)
            : [];

        console.log("Uploaded files:", req.files);

        if (!req.files.images || req.files.images.length < 1) {
            return res
                .status(400)
                .json({ message: "At least one image is required." });
        }

        //create album
        const newAlbum = new Album({
            albumName: albumName.trim,
            description: description || "No description added",
            coverImage,
            images,
            tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
            isPublic: isPublic || true,
            createdBy: new mongoose.Types.ObjectId(), // Temporary ObjectId as fallback
            activityLog: [
                {
                    action: "created",
                    user: new mongoose.Types.ObjectId(), // Generate a temporary ObjectId
                },
            ],
        });

        const savedAlbum = await newAlbum.save();

        res.status(201).json({
            message: "Your Keepsakes are preserved in your Memosac",
            album: savedAlbum,
        });
    } catch (error) {
        console.error("There was an error preserving your keepsakes", error);

        if (error.code === "LIMIT_FILE_SIZE") {
            return res
                .status(400)
                .json({ message: "File size exceeds limit (10MB)." });
        }

        res.status(500).json({
            message: "There was an error preserving your keepsakes!",
            error: error.message,
        });
    }
};

//get all albums
exports.getAllAlbums = async (req, res) => {};

//get a single album by Id
exports.getAlbumByID = async (req, res) => {};

//Update an album
exports.updateAlbum = async (req, res) => {};

//delete an album
exports.deleteAlbum = async (req, res) => {};

//searching albums
exports.searchAlbums = async (req, res) => {};

//sharing album
exports.shareAlbum = async (req, res) => {};

//fav album
exports.favoriteAlbum = async (req, res) => {};
