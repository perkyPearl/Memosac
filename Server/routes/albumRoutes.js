const express = require("express");
// const{validateJwtToken} = require("../middleware/jwtAuthMiddleware");
const router = express.Router();
const{
    uploadImageMiddleware,
    uploadToGridFS
} = require("../middleware/uploadMiddleware");

const{
    createAlbum
} = require("../controllers/albumController");

console.log(uploadImageMiddleware);  // Log to check if it's correctly imported

router.post("/create",
    uploadImageMiddleware.fields([
        {name:"coverImage",maxCount: 1},
        {name:"images",maxCount:50}
    ]),
    uploadToGridFS,
    createAlbum);

module.exports = router;