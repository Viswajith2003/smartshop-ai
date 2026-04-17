const BaseController = require("./BaseController");
const Validation = require("../utils/validation");
const ProductService = require("../services/ProductService");

class ProductController extends BaseController {
    static createProduct = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(
            Validation.productValidation,
            req.body
        );
        const result = await ProductService.createProduct(validatedData);
        BaseController.logAction("PRODUCT_CREATE", result);
        BaseController.handleSendSuccess(res, "Product created successfully", result, 201);
    });

    static updateProduct = BaseController.asyncHandler(async (req, res) => {
        const { productId } = req.params;
        const validatedData = BaseController.validateRequest(
            Validation.productValidation,
            req.body
        );
        const result = await ProductService.updateProduct(productId, validatedData);
        BaseController.logAction("PRODUCT_UPDATE", result);
        BaseController.handleSendSuccess(res, "Product updated successfully", result);
    });

    static deleteProduct = BaseController.asyncHandler(async (req, res) => {
        const { productId } = req.params;
        const result = await ProductService.deleteProduct(productId);
        BaseController.logAction("PRODUCT_DELETE", result);
        BaseController.handleSendSuccess(res, "Product deleted successfully", result);
    });

    static getAllProducts = BaseController.asyncHandler(async (req, res) => {
        const result = await ProductService.getAllProducts();
        BaseController.handleSendSuccess(res, "Products fetched successfully", result);
    });

    static getProductById = BaseController.asyncHandler(async (req, res) => {
        const { productId } = req.params;
        const result = await ProductService.getProductById(productId);
        BaseController.handleSendSuccess(res, "Product fetched successfully", result);
    });
}

module.exports = ProductController;