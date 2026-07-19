const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

// Create Product
router.post(
    "/",
    protect,
    upload.single("image"),
    productController.createProduct
);

// Public Routes
router.get("/", productController.getAllProducts);
router.get("/my-products", protect, productController.getMyProducts);
router.get("/:id", productController.getProductById);

// Protected Routes
router.put("/:id", protect, productController.updateProduct);
router.delete("/:id", protect, productController.deleteProduct);
router.patch("/:id/status", protect, productController.toggleProductStatus);

module.exports = router;