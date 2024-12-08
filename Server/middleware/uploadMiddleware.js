const multer = require("multer");
const { MongoClient, GridFSBucket } = require("mongodb");
const stream = require("stream");

const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MongoDBURI;
let gridFSBucket;
(async () => {
    const client = new MongoClient(mongoURI);
    try {
        await client.connect();
        const db = client.db();
        gridFSBucket = new GridFSBucket(db, { bucketName: "uploads" });
        console.log("GridFSBucket initialized successfully!");
    } catch (error) {
        console.error("Error initializing GridFSBucket", error);
    }
})();

const imageStorage = multer.memoryStorage();

// Multer middleware configuration
const uploadImageMiddleware = multer({
    storage: imageStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per image
    fileFilter: (req, file, cb) => {
        const allowedImageMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/jpg",
        ];
        if (allowedImageMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only image files are allowed"));
        }
    },
});

//-------------------------------------------
const audioStorage = multer.memoryStorage();
const uploadAudioMiddleware = multer({
    storage: audioStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedAudioMimeTypes = [
            "audio/wav",
            "audio/mpeg",
            "audio/webm",
            "audio/mp3",
            "audio/ogg",
        ];
        if (allowedAudioMimeTypes.includes(file.mimetype)) {
            cb(null.true);
        } else {
            cd(new Error("Invalid file type. Only audio files are allowed"));
        }
    },
});
//----------------------------------
const videoStorage = multer.memoryStorage();
const uploadVideoMiddleware = multer({
    storage: videoStorage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for video
    fileFilter: (req, file, cb) => {
        const allowedVideoMimeTypes = [
            "video/mp4",
            "video/webm",
            "video/ogg",
            "video/x-matroska",
        ];
        if (allowedVideoMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only video files are allowed"));
        }
    },
});
//-----------------------------
const uploadToGridFS = async (req, res, next) => {
    console.log("Files received in uploadToGridFS function:", req.files); // Log req.files to see if files are there

    if (!req.files || (!req.files.coverImage && !req.files.images)) {
        console.error("No file uploaded in request");

        return res.status(400).send("No file uploaded");
    }
    if (!gridFSBucket) {
        console.error("GridFSBucket not initialized");
        return res.status(500).send("Internal server error");
    }

    const uploadSingleFile = (file) => {
        return new Promise((resolve, reject) => {
            const uniqueFilename = `${Date.now()}-${file.originalname}`;
            const uploadStream = gridFSBucket.openUploadStream(uniqueFilename, {
                metadata: {
                    albumId: req.body.albumName || null,
                    userId: req.user ? req.user._id : "test-user-id",
                    mimeType: file.mimetype,
                },
            });

            const fileStream = stream.Readable.from(file.buffer);
            fileStream.pipe(uploadStream);

            uploadStream.on("error", (err) => {
                console.error("Error uploading to GridFS:", err);
                reject(err);
            });

            uploadStream.on("finish", () => {
                console.log(
                    `File ${uniqueFilename} uploaded to GridFS successfully`
                );
                resolve({ filename: uniqueFilename, fileId: uploadStream.id });
            });
        });
    };

    try {
        const uploadedFiles = [];

        // Upload coverImage if it exists
        if (req.files.coverImage) {
            const coverImageUpload = await uploadSingleFile(
                req.files.coverImage[0]
            );
            uploadedFiles.push({ type: "coverImage", ...coverImageUpload });
        }

        // Upload images array if it exists
        if (req.files.images) {
            for (const file of req.files.images) {
                const imageUpload = await uploadSingleFile(file);
                uploadedFiles.push({ type: "images", ...imageUpload });
            }
        }

        // Attach uploaded file info to request for next middleware/controller
        req.uploadedFiles = uploadedFiles;
        next();
    } catch (error) {
        console.error("Error uploading files:", error);
        res.status(500).send("Error uploading files in uploadMiddleware.js");
    }
};
module.exports = {
    uploadImageMiddleware,
    uploadAudioMiddleware,
    uploadVideoMiddleware,
    uploadToGridFS,
};
