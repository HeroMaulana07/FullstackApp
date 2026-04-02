const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // 1. Ambil token dari header request
  // Format yang diharapkan: "Bearer <token>"
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // 2. Verifikasi token pakai JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Simpan data user ke request object
    // Biar route berikutnya bisa akses: req.user.id, req.user.exp, dll
    req.user = decoded;

    // 4. Lanjut ke route handler selanjutnya
    next();
  } catch (err) {
    // Token expired atau signature nggak cocok
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
