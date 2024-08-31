const formidable = require("formidable");
const Gallery = require("../models/galleryModel")
const fs = require("fs");

// Middleware to get image by ID
exports.getImageId = async (req, res, next, id) => {
    try {
        const image = await Gallery.findById(id);
        if (!image) {
            return res.status(404).json({ message: "No image found" });
        }
        req.image = image;
        next();
    } catch (error) {
        return res.status(400).json({
            message: "Error retrieving image",
            error: error.message,
        });
    }
};

// Add a new image
exports.addImage = async (req, res) => {
    const form = new formidable.IncomingForm({ keepExtensions: true });

    form.parse(req, async (error, fields, files) => {
        if (error) {
            console.error("Form parsing error:", error);
            return res.status(500).json({
                message: "Error parsing form",
                error: error.message,
            });
        }

        if (files?.image && files.image.length > 0) {
            const file = files.image[0];
            if (!file.filepath) {
                return res
                    .status(400)
                    .json({ message: "File path is missing" });
            }

            try {
                const gallery = new Gallery();
                gallery.photo.data = fs.readFileSync(file.filepath);
                gallery.photo.contentType = file.mimetype;

                const data = await gallery.save();
                return res.status(200).json({
                    message: "Image saved successfully",
                    data,
                });
            } catch (err) {
                console.error("Error saving to DB:", err);
                if (!res.headersSent) {
                    return res.status(400).json({
                        message: "Not able to save",
                        error: err.message,
                    });
                }
            }
        } else {
            if (!res.headersSent) {
                return res
                    .status(400)
                    .json({ message: "No image found in the request" });
            }
        }
    });
};

// Get all images
exports.getAllImages = async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 }).exec();
        if (images.length === 0) {
            return res.status(404).json({ message: "No images found" });
        }
        res.json(images);
    } catch (err) {
        console.error("Error fetching images:", err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

// Get image by ID
exports.getImage = (req, res) => {
    res.set("Content-Type", req.image.photo.contentType);
    return res.send(req.image.photo.data);
};
