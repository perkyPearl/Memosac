const jwt = require("jsonwebtoken");
require('dotenv').config();

const secret = process.env.JWT_SECRET || "defaultsecret";

exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
};

exports.getProfile = (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, secret, (err, info) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    res.json(info);
  });
};