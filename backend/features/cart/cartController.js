const CartService = require("./cartService");
const { ResponseFormatter } = require("../../utils/response");

class CartController {
  static async addToCart(req, res, next) {
    try {
      const { productId, quantity, price } = req.body;
      const cart = await CartService.addToCart(req.user.id, productId, quantity, price);
      return ResponseFormatter.success(res, "Cart updated successfully", cart);
    } catch (error) {
      next(error);
    }
  }

  static async getCart(req, res, next) {
    try {
      const cart = await CartService.getCart(req.user.id);
      return ResponseFormatter.success(res, "Cart fetched successfully", cart);
    } catch (error) {
      next(error);
    }
  }

  static async updateQuantity(req, res, next) {
    try {
      const { productId, quantity } = req.body;
      const cart = await CartService.updateQuantity(req.user.id, productId, quantity);
      return ResponseFormatter.success(res, "Cart quantity updated successfully", cart);
    } catch (error) {
      next(error);
    }
  }

  static async deleteCartItem(req, res, next) {
    try {
      const { productId } = req.params;
      const cart = await CartService.deleteCartItem(req.user.id, productId);
      return ResponseFormatter.success(res, "Cart item deleted successfully", cart);
    } catch (error) {
      next(error);
    }
  }

  static async toggleSelection(req, res, next) {
    try {
      const { productId } = req.body;
      const cart = await CartService.toggleSelection(req.user.id, productId);
      return ResponseFormatter.success(res, "Item selection toggled successfully", cart);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController;
