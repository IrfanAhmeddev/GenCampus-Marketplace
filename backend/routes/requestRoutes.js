const express = require("express");

const router = express.Router();

const requestController = require("../controllers/requestController");
const { protect } = require("../middlewares/authMiddleware");

// Buyer creates a request
router.post("/", protect, requestController.createRequest);

// Seller views requests
router.get("/", protect, requestController.getAllRequests);

module.exports = router;