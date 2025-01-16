const mongoose = require("mongoose");
const { model } = mongoose;

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, min: 4, unique: true },
  password: { type: String },
  email: { type: String },
  phone: { type: String },
  profilePic: { type: String, default: "null" },
  DOB: { type: Date },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  gender: { type: String },
  address: { type: String },
  hobbies: {
    type: [String],
  },
  socialLinks: {
    facebook: {
      type: String,
      required: false,
    },
    twitter: {
      type: String,
      required: false,
    },
    instagram: {
      type: String,
      required: false,
    },
    linkedin: {
      type: String,
      required: false,
    },
  },
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;