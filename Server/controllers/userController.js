const jwt = require("jsonwebtoken");
const User = require("../models/User")
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

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({  _id: req.body.data.id });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateUserProfile = async (req, res) => {
  const { username, dob, gender, relationshipStatus, profession, phone, email, address, hobbies, profilePicUrl, socialLinks } = req.body;

  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = username || user.username;
    user.dob = dob || user.dob;
    user.gender = gender || user.gender;
    user.relationshipStatus = relationshipStatus || user.relationshipStatus;
    user.profession = profession || user.profession;
    user.phone = phone || user.phone;
    user.email = email || user.email;
    user.address = address || user.address;
    user.hobbies = hobbies || user.hobbies;
    user.profilePicUrl = profilePicUrl || user.profilePicUrl;
    user.socialLinks = socialLinks || user.socialLinks;

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};