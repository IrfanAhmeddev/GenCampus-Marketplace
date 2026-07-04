const express = require("express");

const router = express.Router();

// ==========================================
// Module Routes
// ==========================================

// Authentication
router.use("/auth", require("./authRoutes"));

// Future Modules
// router.use("/products", require("./productRoutes"));
// router.use("/requests", require("./requestRoutes"));
// router.use("/purchases", require("./purchaseRoutes"));

module.exports = router;