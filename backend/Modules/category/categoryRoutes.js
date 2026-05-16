const express = require("express");
const router = express.Router();
const CategoryController = require("./categoryController");
const { authenticateAdmin } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { categorySchema } = require("./categoryValidation");

// Public routes
router.get("/", CategoryController.getAllCategories);
router.get("/:categoryId", CategoryController.getCategoryById);

// Admin routes
router.use(authenticateAdmin);

router.post("/", validate(categorySchema), CategoryController.createCategory);
router.put("/:categoryId", validate(categorySchema), CategoryController.updateCategory);
router.delete("/:categoryId", CategoryController.deleteCategory);

module.exports = router;
