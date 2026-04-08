require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

const app = express();

connectDB();

/* CORS CONFIGURATION */

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-task-processing-platform.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Task Processing Backend is Running 🚀");
});

app.get("/healthz", (_req, res) => {
  res.status(200).send("ok");
});

app.get("/readyz", (_req, res) => {
  if (mongoose.connection.readyState === 1) {
    return res.status(200).send("ok");
  }
  return res.status(503).json({ status: "not-ready" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
