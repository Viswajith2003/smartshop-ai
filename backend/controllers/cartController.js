const BaseController = require("./BaseController");
const CartService = require("../services/CartService");
const Validation = require("../utils/validation");

class CartController extends BaseController {
    static addToCart = BaseController.asyncHandler(async (req, res) => {
        const validatedData = BaseController.validateRequest(
            Validation.cartValidation,
            req.body
        );
        const { userId, productId, quantity, price } = validatedData;
        const cart = await CartService.addToCart(userId, productId, quantity, price);
        BaseController.handleSendSuccess(res, "Cart updated successfully", cart);
    });

    static getCart = BaseController.asyncHandler(async (req, res) => {
        const { userId } = req.params;
        const cart = await CartService.getCart(userId);
        BaseController.handleSendSuccess(res, "Cart fetched successfully", cart);
    });

    static updateQuantity = BaseController.asyncHandler(async (req, res) => {
        const { userId, productId, quantity } = req.body;
        const cart = await CartService.updateQuantity(userId, productId, quantity);
        BaseController.handleSendSuccess(res, "Cart quantity updated successfully", cart);
    });

    static deleteCartItem = BaseController.asyncHandler(async (req, res) => {
        const { userId, productId } = req.params;
        const cart = await CartService.deleteCartItem(userId, productId);
        BaseController.handleSendSuccess(res, "Cart item deleted successfully", cart);
    });
}

module.exports = CartController;