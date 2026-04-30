const Product = require("../../models/Product");
const { NotFoundError } = require("../../utils/errors");

class ProductService {
  static async createProduct(data) {
    const product = new Product(data);
    await product.save();
    await product.populate("category", "name");
    return product;
  }

  static async updateProduct(id, data) {
    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("category", "name");
    
    if (!product) throw new NotFoundError("Product not found");
    return product;
  }

  static async deleteProduct(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new NotFoundError("Product not found");
    return product;
  }

  static async getAllProducts(queryParams = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      category,
      minPrice,
      maxPrice,
      rating,
    } = queryParams;

    const query = this._buildSearchQuery({ search, category, minPrice, maxPrice, rating });

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return {
      products,
      meta: {
        totalProducts,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit),
      },
    };
  }

  static async getProductById(id) {
    const product = await Product.findById(id).populate("category", "name");
    if (!product) throw new NotFoundError("Product not found");
    return product;
  }

  // Private helper (Rule 1)
  static _buildSearchQuery({ search, category, minPrice, maxPrice, rating }) {
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category.includes(",") ? { $in: category.split(",") } : category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    return query;
  }
}

module.exports = ProductService;
