const ProductService = require("./productService");
const { ResponseFormatter } = require("../../utils/response");

class ProductController {
  static async createProduct(req, res, next) {
    try {
      this._handleImages(req);
      const product = await ProductService.createProduct(req.body);
      return ResponseFormatter.success(res, "Product created successfully", product, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const { productId } = req.params;
      this._handleImages(req);
      const product = await ProductService.updateProduct(productId, req.body);
      return ResponseFormatter.success(res, "Product updated successfully", product);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const { productId } = req.params;
      await ProductService.deleteProduct(productId);
      return ResponseFormatter.success(res, "Product deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getAllProducts(req, res, next) {
    try {
      const { products, meta } = await ProductService.getAllProducts(req.query);
      return ResponseFormatter.success(res, "Products fetched successfully", products, 200, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const { productId } = req.params;
      const product = await ProductService.getProductById(productId);
      return ResponseFormatter.success(res, "Product fetched successfully", product);
    } catch (error) {
      next(error);
    }
  }

  // Private helper (Rule 1)
  static _handleImages(req) {
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map((file) => file.path);
    } else if (typeof req.body.images === "string") {
      req.body.images = [req.body.images];
    }
  }
}

module.exports = ProductController;
