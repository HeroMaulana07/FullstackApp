require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// ⚠️ PERHATIKAN PATH: ./src/routes/auth
const authRoutes = require("./src/routes/auth");

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://backend-app-production-9c14.up.railway.app/", // ← ganti nanti pas frontend deploy
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Izinkan request tanpa origin (mobile apps, Postman, dll)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json()); // Parsing JSON body

// Routes
// Semua route di authRoutes akan diprefix dengan /api/auth
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Connect DB & Start Server
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Keluarin process kalau DB gagal connect
  });
