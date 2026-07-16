const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {

  const { name, email, password } = req.body;

  // Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
  return res.status(400).json({ message: "Invalid email format" });
 }

  if (!password || password.length < 6) {
  return res.status(400).json({ message: "Password must be at least 6 characters" });
 }

 const existingUser = await User.findOne({ email });

 if (existingUser) {
  return res.status(400).json({ message: "User already exists" });
 }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed
  });

  res.json({
    token: generateToken(user._id)
  });

};

exports.login = async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    token: generateToken(user._id)
  });

};

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    name: user.name,
    email: user.email
  });
};

exports.updateProfile = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (name !== undefined) {
    user.name = name.trim();
  }

  if (email !== undefined) {
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: user._id }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    user.email = normalizedEmail;
  }

  if (password) {
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();

  res.json({
    name: user.name,
    email: user.email,
    message: "Profile updated successfully"
  });
};
