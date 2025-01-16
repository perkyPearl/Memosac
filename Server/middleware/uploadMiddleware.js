const multer = require("multer");
const stream = require("stream");
const { initGridFSBucket } = require("../gridFS");

const imageStorage = multer.memoryStorage();
const uploadImageMiddleware = multer({
  storage: imageStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
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
      cb(null, true);
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
  try {
    const gridFSBucket = await initGridFSBucket();

    if (!req.files || (!req.files.coverImage && !req.files.images)) {
      return res.status(400).send("No file uploaded");
    }
    if (!gridFSBucket) {
      return res.status(500).send("Internal server error");
    }
    const uploadedFiles = [];

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
          reject(err);
        });

        uploadStream.on("finish", () => {
          resolve({
            filename: uniqueFilename,
            fileId: uploadStream.id,
          });
        });
      });
    };

    if (req.files.coverImage) {
      const coverImageUpload = await uploadSingleFile(req.files.coverImage[0]);
      uploadedFiles.push({ type: "coverImage", ...coverImageUpload });
    }

    if (req.files.images) {
      for (const file of req.files.images) {
        const imageUpload = await uploadSingleFile(file);
        uploadedFiles.push({ type: "images", ...imageUpload });
      }
    }

    req.uploadedFiles = uploadedFiles;
    next();
  } catch (error) {
    res.status(500).send("Error uploading files in uploadMiddleware.js");
  }
};

module.exports = {
  uploadImageMiddleware,
  uploadAudioMiddleware,
  uploadVideoMiddleware,
  uploadToGridFS,
};
