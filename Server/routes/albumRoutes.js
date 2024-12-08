const express = require("express");
// const{validateJwtToken} = require("../middleware/jwtAuthMiddleware");
const router = express.Router();
const{
    uploadImageMiddleware,
    uploadToGridFS
} = require("../middleware/uploadMiddleware");

const{
    createAlbum,
    getAllAlbums,
} = require("../controllers/albumController");

const{
        getFileFromGridFS,
}=require("../controllers/fileController");
console.log(uploadImageMiddleware);  // Log to check if it's correctly imported

router.post(
    "/create",
    uploadImageMiddleware.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "images", maxCount: 50 },
    ]),
    (req, res, next) => {
        console.log("Files after multer processing:", req.files); // Debugging multer
        next();
    },
    uploadToGridFS,
    createAlbum
);

router.get("/all",getAllAlbums);

router.get("/file/:fileId", getFileFromGridFS);

module.exports = router;