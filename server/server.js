// MUST be first line
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const universityRoutes = require("./routes/universityRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

/* ================================
   1. Middleware
================================ */

app.use(express.json());

/* ================================
   2. CORS Fix (IMPORTANT)
================================ */

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://frontend-omkars-projects-c8ee7733.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Preflight Fix
app.options("*", cors());

/* ================================
   3. Connect MongoDB ONCE
================================ */

connectDB()
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

/* ================================
   4. Routes
================================ */

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    server_time: new Date().toISOString(),
  });
});

// API Root
app.get("/api", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is live!",
  });
});

// Main Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/ai", aiRoutes);

/* ================================
   5. 404 Handler
================================ */

app.use((req, res) => {
  res.status(404).json({
    error: `Route ${req.originalUrl} not found`,
  });
});

/* ================================
   6. EXPORT ONLY (No app.listen)
================================ */

// ❌ DO NOT USE app.listen() on Vercel
module.exports = app;
