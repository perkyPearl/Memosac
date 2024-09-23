const express = require('express')
const router = express.Router();
const { addImage, getAllImages, getImageId, getImage } = require('../controllers/galleryController') 

router.param('imageId',getImageId);
router.post("/add/image", addImage);
router.get('/images',getAllImages);
router.get('/image/:imageId',getImage);

module.exports = router;