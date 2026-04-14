const express=require("express")
const router=express.Router()
const CategoryController=require("../controllers/categoryController")

router.post("/create",CategoryController.createCategory)
router.put("/update/:categoryId",CategoryController.updateCategory)
router.delete("/delete/:categoryId",CategoryController.deleteCategory)
router.get("/getAll",CategoryController.getAllCategories)
router.get("/getById/:categoryId",CategoryController.getCategoryById)

module.exports=router