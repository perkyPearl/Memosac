const Album = require("../models/albumModel");
// const Gallery = require("../models/galleryModel");
// const fs = require("fs");
// const path = require("path");
const mongoose = require("mongoose");
const {uploadToGridFS} = require("../middleware/uploadMiddleware");

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

        // Validate uploaded files
        if (!req.uploadedFiles || req.uploadedFiles.length === 0) {
            return res
                .status(400)
                .json({
                    message: "Please upload a cover image and album images.",
                });
        }

        console.log("Cover Image:", req.files.coverImage);

        console.log("Uploaded files:", req.files);
        console.log("Uploading files to GridFS...");

        const coverImageFile = req.uploadedFiles.find(
            (file) => file.type === "coverImage"
        );
        const imageFiles = req.uploadedFiles.filter(
            (file) => file.type === "images"
        );

        console.log("Cover Image ID:", coverImageFile.fileId);
        console.log(
            "Image IDs:",
            imageFiles.map((file) => file.fileId)
        );

        //create album
        const newAlbum = new Album({
            albumName: albumName.trim(),
            description: description?.trim() || "No description added",
            coverImage: coverImageFile ? coverImageFile.fileId : null,
            images: imageFiles.map((file) => file.fileId),
            tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
            isPublic: isPublic,
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
exports.getAllAlbums = async (req, res) => {
    try {
        const albums = await Album.find().sort({ createdAt: -1 });
        

        const albumsWithCoverImageUrl = albums.map((album) => {
            return {
                ...album._doc,
                coverImageUrl: album.coverImage
                    ? `${req.protocol}://${req.get("host")}/api/albums/file/${ album.coverImage}`
                    : null, // Generate a URL if coverImage exists
            };
        });

        res.status(200).json({
            success: true,
            albums: albumsWithCoverImageUrl,
        });
    } catch (error) {
        console.error("Error fetching albums:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch albums.",
            error: error.message,
        });
    }
};

//get a single album by Id
exports.getAlbumByID = async (req, res) => {
     try {
         const albumId = req.params.id;

         // Fetch the album by ID
         const album = await Album.findById(albumId);
         if (!album) {
             return res.status(404).json({ message: "Album not found." });
         }

         // Add the cover image URL to the album
         const albumWithCoverImageUrl = {
             ...album._doc,
             coverImageUrl: album.coverImage
                 ? `${req.protocol}://${req.get("host")}/file/${
                       album.coverImage
                   }`
                 : null,
         };

         res.status(200).json({ album: albumWithCoverImageUrl });
     } catch (error) {
         console.error("Error fetching album by ID:", error);
         res.status(500).json({ message: "Failed to fetch album." });
     }
};

//Update an album
exports.updateAlbum = async (req, res) => {};

//delete an album
exports.deleteAlbum = async (req, res) => {
    try {
        const albumId = req.params.id;

        // Step 1: Find the album by ID
        const album = await Album.findById(albumId);

        if (!album) {
            return res.status(404).json({ message: "Album not found." });
        }

        // Optional: Delete associated images from GridFS (cover image + album images)
        // Uncomment this block if you want to handle image deletion now
        /*
        const { coverImage, images } = album;

        if (coverImage) {
            await deleteFileFromGridFS(coverImage); // Custom function to delete GridFS file
        }
        if (images && images.length > 0) {
            for (const imageId of images) {
                await deleteFileFromGridFS(imageId);
            }
        }
        */

        // Step 2: Delete the album from MongoDB
        await Album.findByIdAndDelete(albumId);

        // Step 3: Send a success response
        res.status(200).json({
            success: true,
            message: "Album deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting album:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to delete the album.",
            error: error.message,
        });
    }
};

//searching albums
exports.searchAlbums = async (req, res) => {};

//sharing album
exports.shareAlbum = async (req, res) => {};

//fav album
exports.favoriteAlbum = async (req, res) => {};
