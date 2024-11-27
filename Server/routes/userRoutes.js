const express = require("express");
const { getProfile, authenticateToken } = require("../controllers/userController");

const router = express.Router();

router.get("/profile", authenticateToken, getProfile);

module.exports = router;