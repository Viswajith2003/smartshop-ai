const CategoryService = require("./categoryService");
const { ResponseFormatter } = require("../../utils/response");

class CategoryController {
  static async createCategory(req, res, next) {
    try {
      const category = await CategoryService.createCategory(req.body);
      return ResponseFormatter.success(res, "Category created successfully", category, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const category = await CategoryService.updateCategory(categoryId, req.body);
      return ResponseFormatter.success(res, "Category updated successfully", category);
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      await CategoryService.deleteCategory(categoryId);
      return ResponseFormatter.success(res, "Category deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getAllCategories(req, res, next) {
    try {
      const categories = await CategoryService.getAllCategories();
      return ResponseFormatter.success(res, "Categories fetched successfully", categories);
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(req, res, next) {
    try {
      const { categoryId } = req.params;
      const category = await CategoryService.getCategoryById(categoryId);
      return ResponseFormatter.success(res, "Category fetched successfully", category);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
