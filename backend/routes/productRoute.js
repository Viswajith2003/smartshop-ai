const express=require("express")
const router=express.Router()
const ProductController=require("../controllers/productController")
const { authenticateAdmin } = require("../middlewares/auth");

// Public routes (if needed, or protected if admin only)
// Based on the request /api/admin/categories, it's likely admin-only
router.get("/", ProductController.getAllProducts)
router.get("/:productId", ProductController.getProductById)

// Protected routes (Write operations)
router.post("/", authenticateAdmin, ProductController.createProduct)
router.put("/:productId", authenticateAdmin, ProductController.updateProduct)
router.delete("/:productId", authenticateAdmin, ProductController.deleteProduct)

module.exports=router