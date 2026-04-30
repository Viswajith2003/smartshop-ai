const express = require("express");
const router = express.Router();
const ProductController = require("./productController");
const { authenticateAdmin } = require("../../middlewares/auth");
const productUpload = require("../../middlewares/productUpload");
const validate = require("../../middlewares/validate");
const { productSchema, productSearchSchema } = require("./productValidation");

// Public routes
router.get("/", validate(productSearchSchema), ProductController.getAllProducts);
router.get("/:productId", ProductController.getProductById);

// Admin routes
router.use(authenticateAdmin);

router.post("/", productUpload.array("images", 5), validate(productSchema), ProductController.createProduct);
router.put("/:productId", productUpload.array("images", 5), validate(productSchema), ProductController.updateProduct);
router.delete("/:productId", ProductController.deleteProduct);

module.exports = router;
