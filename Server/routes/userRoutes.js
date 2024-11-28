const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

router.post('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

module.exports = router;