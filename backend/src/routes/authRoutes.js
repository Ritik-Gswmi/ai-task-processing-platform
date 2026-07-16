const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

module.exports = router;
