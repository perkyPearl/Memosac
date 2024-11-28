const formidable = require("formidable");
const Gallery = require("../models/galleryModel");
const fs = require("fs");
const path = require("path");

// Middleware to get image by ID
exports.getImageId = async (req, res, next, id) => {
    try {
        const image = await Gallery.findById(id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        req.image = image;
        next();
    } catch (error) {
        console.error("Error retrieving image by ID:", error);
        return res.status(400).json({
            message: "Error retrieving image",
            error: error.message,
        });
    }
};

// Add a new image
exports.addImage = async (req, res) => {
    const form = new formidable.IncomingForm({
        keepExtensions: true,
        allowEmptyFiles: false
    });

    form.parse(req, async (error, fields, files) => {
        if (error) {
            console.error("Form parsing error:", error);
            return res.status(500).json({
                message: "Error parsing form",
                error: error.message,
            });
        }
         console.log("Parsed Fields:", fields); // Debug fields
         console.log("Parsed Files:", files);

             const uploadedFile = Array.isArray(files.image)
                 ? files.image[0]
                 : files.image;

        if (uploadedFile && uploadedFile.filepath) {
            try {
                const imagePath = uploadedFile.filepath;
                const contentType = uploadedFile.mimetype;

                const gallery = new Gallery({
                    photo: {
                        data: fs.readFileSync(imagePath),
                        contentType: contentType,
                    },
                });

                const savedImage = await gallery.save();
                return res.status(200).json({
                    message: "Image saved successfully",
                    data: savedImage,
                });
            } catch (err) {
                console.error("Error saving image to DB:", err);
                return res.status(400).json({
                    message: "Unable to save image",
                    error: err.message,
                });
            }
        } else {
            console.error("No image uploaded or found in the request");

            return res
                .status(400)
                .json({ message: "No file uploaded" });
        }
    });
};

// Get all images
exports.getAllImages = async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 }).exec();
        if (!images.length) {
            return res.status(404).json({ message: "No images found" });
        }
        res.status(200).json(images);
    } catch (err) {
        console.error("Error fetching images:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Get image by ID
exports.getImage = (req, res) => {
    if (req.image?.photo) {
        res.set("Content-Type", req.image.photo.contentType);
        return res.send(req.image.photo.data);
    } else {
        return res.status(404).json({ message: "Image not found" });
    }
};

// Delete image
exports.deleteImage = async (req, res) => {
    try {
        const { imageId } = req.params;

        if (!imageId) {
            return res.status(400).json({ message: "Image ID is required" });
        }

        const deletedPhoto = await Gallery.findByIdAndDelete(imageId);

        if (!deletedPhoto) {
            return res.status(404).json({ message: "Photo not found" });
        }

        return res.status(200).json({ message: "Photo deleted successfully" });
    } catch (err) {
        console.error("Error deleting image:", err);
        return res.status(500).json({ message: "Server error" });
    }
};