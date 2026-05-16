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

  static async getAllCategories(queryParams = {}) {
    const { page = 1, limit = 10, search = "" } = queryParams;
    const skip = (page - 1) * limit;

    const mongoQuery = {};
    if (search) {
      mongoQuery.name = { $regex: search, $options: "i" };
    }

    const categories = await Category.find(mongoQuery)
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Category.countDocuments(mongoQuery);

    return {
      categories,
      meta: {
        page: Number(page),
        limit: Number(limit),
        totalCategories: total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  static async getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) throw new NotFoundError("Category not found");
    return category;
  }
}

module.exports = CategoryService;
