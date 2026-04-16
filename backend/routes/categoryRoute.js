const express=require("express")
const router=express.Router()
const CategoryController=require("../controllers/categoryController")
const { authenticateAdmin } = require("../middlewares/auth");

// Public routes (if needed, or protected if admin only)
// Based on the request /api/admin/categories, it's likely admin-only
router.get("/", CategoryController.getAllCategories)
router.get("/:categoryId", CategoryController.getCategoryById)

// Protected routes (Write operations)
router.post("/", authenticateAdmin, CategoryController.createCategory)
router.put("/:categoryId", authenticateAdmin, CategoryController.updateCategory)
router.delete("/:categoryId", authenticateAdmin, CategoryController.deleteCategory)

module.exports=router