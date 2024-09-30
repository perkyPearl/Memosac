const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = 'jhdbw';

const oauth2Client = new OAuth2(
  "72725116402-9951ic5ja73dj1bj77b59gaib939uevv.apps.googleusercontent.com",
  "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",
  "http://localhost:4000/oauth2callback"
);

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://memosac:memosacAdmin@memosac.peali.mongodb.net/?retryWrites=true&w=majority&appName=Memosac')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/google-login', async (req, res) => {
  const { username, email, profilePic } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        username: username || email.split('@')[0],
        email,
        profilePic,
      });
      await user.save();
    }

    const token = jwt.sign({ username, id: user._id }, secret, { expiresIn: '7d' });
    console.log('Generated Token:', token);

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: 'Lax',
    }).json({
      id: user._id,
      username,
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error while processing Google login' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ id: user._id, username: user.username }, secret, { expiresIn: '1h' });
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: false,
        sameSite: 'Lax',
      }).json({
        id: user._id,
        username,
        token
      });

      console.log("Token generated:", token);
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error while registering user' });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Successfully logged out' });
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, secret, (err, info) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    res.json(info);
  });
});

app.listen(4000, () => {
  console.log("Server is live on port 4000!");
});