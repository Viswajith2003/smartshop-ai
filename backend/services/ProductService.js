const Product = require("../models/Product");
const { NotFoundError } = require("../utils/errors");

class ProductService {
  static createProduct = async (data) => {
    try {
      const { name, description, price, category, stock, images, isActive } = data;
      const product = new Product({
        name,
        description,
        price,
        category,
        stock,
        images,
        isActive,
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
      const { name, description, price, category, stock, images, isActive } = data;
      const product = await Product.findByIdAndUpdate(
        id,
        { name, description, price, category, stock, images, isActive },
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

  static getAllProducts = async () => {
    try {
      const products = await Product.find().populate("category", "name");
      return products;
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