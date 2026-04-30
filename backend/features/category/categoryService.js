const Category = require("../../models/Category");
const { NotFoundError } = require("../../utils/errors");

class CategoryService {
  static async createCategory(data) {
    const category = new Category(data);
    return await category.save();
  }

  static async updateCategory(id, data) {
    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!category) throw new NotFoundError("Category not found");
    return category;
  }

  static async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new NotFoundError("Category not found");
    return category;
  }

  static async getAllCategories() {
    return await Category.find({}).sort({ name: 1 });
  }

  static async getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) throw new NotFoundError("Category not found");
    return category;
  }
}

module.exports = CategoryService;
