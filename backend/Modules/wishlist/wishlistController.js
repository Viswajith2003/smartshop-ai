const WishlistService = require("./wishlistService");
const { ResponseFormatter } = require("../../utils/response");

class WishlistController {
  static async getWishlist(req, res, next) {
    try {
      const wishlist = await WishlistService.getWishlist(req.user.id);
      return ResponseFormatter.success(res, "Wishlist fetched successfully", wishlist);
    } catch (error) {
      next(error);
    }
  }

  static async toggleWishlist(req, res, next) {
    try {
      const { productId } = req.body;
      const result = await WishlistService.toggleWishlist(req.user.id, productId);
      return ResponseFormatter.success(res, `Product ${result.action} from wishlist`, result);
    } catch (error) {
      next(error);
    }
  }

  static async clearWishlist(req, res, next) {
    try {
      const wishlist = await WishlistService.clearWishlist(req.user.id);
      return ResponseFormatter.success(res, "Wishlist cleared successfully", wishlist);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WishlistController;
