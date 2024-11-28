const express = require("express");
const{validateJwtToken} = require("../middleware/jwtAuthMiddleware");
const router = express.Router();
const multer = require("multer");

const uploadMiddleware = multer({dest:"uploads/"});
const{
    createAlbum
} = require("../controllers/albumController");

router.post("/create",
    validateJwtToken,
    uploadMiddleware.fields([
        {name:"coverImage",maxCount: 1},
        {name:"images",maxCount:50}
    ]),
    createAlbum);

module.exports = router;