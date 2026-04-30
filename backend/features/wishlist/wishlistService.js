const Wishlist = require("../../models/Wishlist");
const logger = require("../../utils/logger");

class WishlistService {
  static async getWishlist(userId) {
    let wishlist = await Wishlist.findOne({ user: userId }).populate(
      "items.product",
      "name price images category stock rating"
    );
    
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
      await wishlist.save();
    }
    
    return wishlist;
  }

  static async toggleWishlist(userId, productId) {
    let wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [{ product: productId }] });
      await wishlist.save();
      return { action: "added", wishlist: await this.getWishlist(userId) };
    }

    const productIndex = wishlist.items.findIndex(item => item.product.toString() === productId);
    let action = "";

    if (productIndex > -1) {
      wishlist.items.splice(productIndex, 1);
      action = "removed";
    } else {
      wishlist.items.push({ product: productId });
      action = "added";
    }

    await wishlist.save();
    return { action, wishlist: await this.getWishlist(userId) };
  }

  static async clearWishlist(userId) {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
      wishlist.items = [];
      await wishlist.save();
    }
    return wishlist;
  }
}

module.exports = WishlistService;
