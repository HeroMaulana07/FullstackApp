const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ⚠️ Path relatif ke src/models

const router = express.Router();

// ============================
// 🔥 REGISTER: POST /api/auth/register
// ============================
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validasi sederhana
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 2. Cek apakah user udah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 3. Hash password (JANGAN simpan password polos!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan ke DB
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // 5. Response sukses (Jangan kirim password balik!)
    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================
// 🔥 LOGIN: POST /api/auth/login
// ============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validasi input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 2. Cari user di DB
    const user = await User.findOne({ email });

    // 3. Cek user ada & password cocok (pake bcrypt.compare)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 4. Bikin JWT Token
    // Payload: { id: 'user_id' }, Rahasia: process.env.JWT_SECRET
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // Token expired dalam 7 hari
    );

    // 5. Kirim token ke frontend
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Di bagian atas file
const authMiddleware = require("../middleware/auth");

// ... route register & login ...

// 🔒 PROTECTED: Ambil data user dari token
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
