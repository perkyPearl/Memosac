const express = require("express");
const { googleLogin, login, register, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/google-login", googleLogin);
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

module.exports = router;