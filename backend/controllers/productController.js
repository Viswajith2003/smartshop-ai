const BaseController = require("./BaseController");
const Validation = require("../utils/validation");
const ProductService = require("../services/ProductService");

class ProductController extends BaseController {
    static createProduct = BaseController.asyncHandler(async (req, res) => {
        if (req.files && req.files.length > 0) {
            req.body.images = req.files.map(file => file.path);
        } else if (typeof req.body.images === 'string') {
            req.body.images = [req.body.images];
        }

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
        
        if (req.files && req.files.length > 0) {
            req.body.images = req.files.map(file => file.path);
        } else if (typeof req.body.images === 'string') {
            req.body.images = [req.body.images];
        }

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
        const validatedQuery = BaseController.validateRequest(
            Validation.productSearchValidation,
            req.query
        );
        const { products, meta } = await ProductService.getAllProducts(validatedQuery);
        BaseController.handleSendSuccess(res, "Products fetched successfully", products, 200, meta);
    });

    static getProductById = BaseController.asyncHandler(async (req, res) => {
        const { productId } = req.params;
        const result = await ProductService.getProductById(productId);
        BaseController.handleSendSuccess(res, "Product fetched successfully", result);
    });
}

module.exports = ProductController;