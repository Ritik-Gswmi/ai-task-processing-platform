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