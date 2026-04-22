const Product = require("../models/Product");
const { NotFoundError } = require("../utils/errors");

class ProductService {
  static createProduct = async (data) => {
    try {
      const { name, description, price, category, stock, images, isActive, rating } = data;
      const product = new Product({
        name,
        description,
        price,
        category,
        stock,
        images,
        isActive,
        rating,
      });
      await product.save();
      await product.populate("category", "name");
      return product;
    } catch (error) {
      throw error;
    }
  };

  static updateProduct = async (id, data) => {
    try {
      const { name, description, price, category, stock, images, isActive, rating } = data;
      const product = await Product.findByIdAndUpdate(
        id,
        { name, description, price, category, stock, images, isActive, rating },
        { new: true, runValidators: true }
      ).populate("category", "name");
      if (!product) throw new NotFoundError("Product not found");
      return product;
    } catch (error) {
      throw error;
    }
  };

  static deleteProduct = async (id) => {
    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) throw new NotFoundError("Product not found");
      return product;
    } catch (error) {
      throw error;
    }
  };

  static getAllProducts = async (queryParams = {}) => {
    try {
      const { 
        page = 1, 
        limit = 6, 
        sortBy = 'createdAt', 
        sortOrder = 'desc', 
        search, 
        category, 
        minPrice, 
        maxPrice, 
        rating 
      } = queryParams;

      const query = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      if (category) {
        if (category.includes(',')) {
          query.category = { $in: category.split(',') };
        } else {
          query.category = category;
        }
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) query.price.$gte = Number(minPrice);
        if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
      }

      if (rating !== undefined && rating !== null && rating !== '') {
        query.rating = { $gte: Number(rating) };
      }

      const totalProducts = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalProducts / limit);
      const skip = (page - 1) * limit;

      const products = await Product.find(query)
        .populate("category", "name")
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
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
    } catch (error) {
      throw error;
    }
  };

  static getProductById = async (id) => {
    try {
      const product = await Product.findById(id).populate("category", "name");
      if (!product) throw new NotFoundError("Product not found");
      return product;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = ProductService;