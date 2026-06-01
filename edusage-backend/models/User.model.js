const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed
  googleId: String,
  bio: { type: String },
  institution: { type: String },
  degree: { type: String },
  avatarUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
