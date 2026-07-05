const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");

// Public Routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protected Routes
router.post("/", protect, productController.createProduct);
router.put("/:id", protect, productController.updateProduct);
router.delete("/:id", protect, productController.deleteProduct);
router.patch("/:id/status", protect, productController.toggleProductStatus);

module.exports = router;