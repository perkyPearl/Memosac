const Album = require("../models/albumModel");
// const Gallery = require("../models/galleryModel");
// const fs = require("fs");
// const path = require("path");

//For creating a new album
exports.createAlbum = async (req, res) => {
    try {
        const { albumName, description, tags, isPublic } = req.body;
        console.log("Received Body:", req.body); // Log the entire request body

        console.log("Album Name from request body:", req.body.albumName);

        if (!albumName) {
            return res
                .status(400)
                .json({ message: "Your Memosac deserves a title " });
        }

        const coverImage = req.files[0].buffer;
        const images = req.files.slice(1).map(file=>file.buffer);

        console.log("Uploaded files:", req.files);
        if (!coverImage) {
            return res.status(400).json({ message: "Cover image is required" });
        }
        if (images.length === 0) {
            return res
                .status(400)
                .json({ message: "At least one image is required" });
        }
        

        //create album
        const newAlbum = new Album({
            albumName,
            description: description || "No description added",
            coverImage,
            images,
            tags: tags.split(','),
            isPublic: isPublic || true,
            createdBy: req.user._id,
            activityLog: [
                {
                    action: "created",
                    user: req.user._id,
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
