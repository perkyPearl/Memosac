const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/google-login', async (req, res) => {
    const { username, email, profilePic } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                username,
                email,
                profilePic,
            });
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: true });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;