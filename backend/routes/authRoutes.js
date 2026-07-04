const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// ==========================================
// Public Routes
// ==========================================

// Student Registration
router.post("/signup", authController.signup);

// Student Login
router.post("/login", authController.login);

// ==========================================
// Protected Routes
// ==========================================

// Get Logged-in User
router.get("/me", authMiddleware.protect, authController.getMe);

module.exports = router;