const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    title: String,
    input: String,
    operation: String,
    result: String,
    logs: [String],
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);