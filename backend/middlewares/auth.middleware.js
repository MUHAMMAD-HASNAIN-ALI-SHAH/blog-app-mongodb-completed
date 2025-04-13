const jwt = require("jsonwebtoken");
const User = require("../models/user.model"); // Import Mongoose User model

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    // Decode and verify JWT
    const isVerified = jwt.verify(token, process.env.JWT_SECRET);
    if (!isVerified || !isVerified.userId) {
      return res.status(403).json({ msg: "Token verification failed" });
    }

    // Find user in MongoDB
    const user = await User.findById(isVerified.userId).select("-password"); // optionally exclude password

    if (!user) {
      return res.status(404).json({ msg: "No user found" });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (err) {
    console.error("Protected Route Middleware Error: " + err.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { protectedRoute };
