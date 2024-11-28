const express = require('express')
const router = express.Router();
const { addImage, getAllImages, getImageId, getImage, deleteImage } = require('../controllers/galleryController') 

router.param('imageId',getImageId);
router.post("/add/images", addImage);
router.get('/images',getAllImages);
router.get('/images/:imageId',getImage);
router.delete("/images/:imageId", deleteImage);

module.exports = router;