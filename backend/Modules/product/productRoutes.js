const express = require("express");
const router = express.Router();
const ProductController = require("./productController");
const { authenticateAdmin, authenticateUser } = require("../../middlewares/auth");
const productUpload = require("../../middlewares/productUpload");
const validate = require("../../middlewares/validate");
const { productSchema, productSearchSchema } = require("./productValidation");

// Review routes
router.get("/my-reviews", authenticateUser, ProductController.getUserReviews);

// Public routes
router.get("/", validate(productSearchSchema), ProductController.getAllProducts);
router.get("/:productId", ProductController.getProductById);
router.post("/:productId/reviews", authenticateUser, ProductController.createProductReview);

// Admin routes
router.use(authenticateAdmin);

const handleImagesMiddleware = (req, res, next) => {
  ProductController._handleImages(req);
  next();
};

router.post("/", productUpload.array("images", 5), handleImagesMiddleware, validate(productSchema), ProductController.createProduct);
router.put("/:productId", productUpload.array("images", 5), handleImagesMiddleware, validate(productSchema), ProductController.updateProduct);
router.delete("/:productId", ProductController.deleteProduct);

module.exports = router;
