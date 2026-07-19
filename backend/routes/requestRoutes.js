const express = require("express");

const router = express.Router();

const requestController = require("../controllers/requestController");
const { protect } = require("../middlewares/authMiddleware");

// Buyer creates a request
router.post("/", protect, requestController.createRequest);

// Seller views requests
router.get("/", protect, requestController.getAllRequests);

// Buyer views their accepted requests (purchases)
router.get("/my-purchases", protect, requestController.getMyPurchases);

// Seller accepts a request
router.patch("/:id/accept", protect, requestController.acceptRequest);

// Seller rejects a request
router.patch("/:id/reject", protect, requestController.rejectRequest);


module.exports = router;