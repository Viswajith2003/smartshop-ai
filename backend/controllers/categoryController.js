const BaseController = require("./BaseController");
const Validation=require("../utils/validation")
const CategoryService = require("../services/CategoryService");

class CategoryController extends BaseController {
    static createCategory=BaseController.asyncHandler(async(req,res)=>{
        const validatedData=BaseController.validateRequest(
            Validation.categoryValidation,
            req.body,
        )
        const result=await CategoryService.createCategory(validatedData)
        BaseController.logAction("CATEGORY_CREATE",result)
        BaseController.handleSendSuccess(res,"Category created successfully",result,201)
    })


    static updateCategory=BaseController.asyncHandler(async(req,res)=>{
        const {categoryId}=req.params
        const validatedData=BaseController.validateRequest(
            Validation.categoryValidation,
            req.body,
        )
        const result=await CategoryService.updateCategory(categoryId, validatedData)
        BaseController.logAction("CATEGORY_UPDATE",result)
        BaseController.handleSendSuccess(res,"Category updated successfully",result)
    })

    static deleteCategory=BaseController.asyncHandler(async(req,res)=>{
        const {categoryId}=req.params
        const result=await CategoryService.deleteCategory(categoryId)
        BaseController.logAction("CATEGORY_DELETE",result)
        BaseController.handleSendSuccess(res,"Category deleted successfully",result)
    })

    static getAllCategories=BaseController.asyncHandler(async(req,res)=>{
        const result=await CategoryService.getAllCategories()
        BaseController.handleSendSuccess(res,"Categories fetched successfully",result)
    })

    static getCategoryById=BaseController.asyncHandler(async(req,res)=>{
        const {categoryId}=req.params
        const result=await CategoryService.getCategoryById(categoryId)
        BaseController.handleSendSuccess(res,"Category fetched successfully",result)
    })
}

module.exports = CategoryController;