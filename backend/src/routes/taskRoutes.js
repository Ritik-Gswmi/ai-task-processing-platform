const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  deleteTask
} = require("../controllers/taskController");

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.delete("/:id", protect, deleteTask);

module.exports = router;
