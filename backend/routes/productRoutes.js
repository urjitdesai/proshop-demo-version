const express = require("express");
const router = express.Router();
const {
  getProducts,
  getSellerProducts,
  getTopProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  createProductReview,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");
// FETCH ALL PRODUCTS
router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/seller").post(getSellerProducts);
router.get("/top", getTopProducts);

// FIND PRODUCT BY ID
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

router.route("/:id/reviews").post(protect, createProductReview);

module.exports = router;
