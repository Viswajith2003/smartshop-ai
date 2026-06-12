const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const { NotFoundError, BadRequestError } = require("../../utils/errors");
const logger = require("../../utils/logger");

class CartService {
  static async addToCart(userId, productId, quantity, price, variant) {
    if (!userId) throw new BadRequestError("Please login to continue");
    if (quantity <= 0) throw new BadRequestError("Quantity must be at least 1");
    if (quantity > 10) throw new BadRequestError("Maximum purchase limit reached");

    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError("Product not found");
    if (!product.isActive) throw new BadRequestError("This product is currently unavailable");

    if (variant && product.variants) {
      const isValidVariant = product.variants.some(v => v._id.toString() === variant);
      if (!isValidVariant) throw new BadRequestError("Selected variant is unavailable");
    }

    if (price && Number(price) !== product.price) {
      throw new BadRequestError("Product price has been updated");
    }

    if (product.stock === 0) {
      throw new BadRequestError("Product is out of stock");
    }

    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      if (quantity > product.stock) {
        throw new BadRequestError(`Only ${product.stock} items available in stock`);
      }
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity, price: product.price * quantity }],
        totalPrice: product.price * quantity,
        totalItems: 1
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        if (newQuantity > 10) throw new BadRequestError("Maximum purchase limit reached");
        if (newQuantity > product.stock) {
          throw new BadRequestError("Cannot add more items. Stock limit reached");
        }
        cart.items[itemIndex].quantity = newQuantity;
        cart.items[itemIndex].price = product.price * newQuantity;
      } else {
        if (quantity > product.stock) {
          throw new BadRequestError(`Only ${product.stock} items available in stock`);
        }
        cart.items.push({ product: productId, quantity, price: product.price * quantity });
        cart.totalItems += 1;
      }
      cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);
    }

    await cart.save();
    return this.getCart(userId);
  }

  static async getCart(userId) {
    if (!userId) throw new BadRequestError("Please login to continue");
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return { items: [], totalPrice: 0, totalItems: 0 };
    
    await cart.populate("items.product", "name price images category stock isActive");
    return cart;
  }

  static async updateQuantity(userId, productId, quantity) {
    if (!userId) throw new BadRequestError("Please login to continue");
    if (quantity <= 0) throw new BadRequestError("Quantity must be at least 1");
    if (quantity > 10) throw new BadRequestError("Maximum purchase limit reached");

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) throw new NotFoundError("Your cart is empty");

    const item = cart.items.find(item => item.product._id.toString() === productId);
    if (!item) throw new NotFoundError("Product not found");

    if (!item.product.isActive) throw new BadRequestError("This product is currently unavailable");

    if (item.product.stock === 0) {
      throw new BadRequestError("Product is out of stock");
    }

    if (quantity > item.product.stock) {
      throw new BadRequestError("Cannot add more items. Stock limit reached");
    }

    const currentUnitPrice = item.product.price;
    const itemUnitPrice = item.price / item.quantity;
    
    if (currentUnitPrice !== itemUnitPrice) {
      throw new BadRequestError("Product price has been updated");
    }

    item.quantity = quantity;
    item.price = currentUnitPrice * quantity;

    cart.totalPrice = cart.items.reduce((acc, curr) => acc + curr.price, 0);
    
    await cart.save();
    return this.getCart(userId);
  }

  static async deleteCartItem(userId, productId) {
    if (!userId) throw new BadRequestError("Please login to continue");
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) throw new NotFoundError("Your cart is empty");
    
    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) throw new NotFoundError("Product not found");
    
    cart.totalItems -= 1;
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    cart.totalPrice = cart.items.reduce((acc, curr) => acc + curr.price, 0);
    
    await cart.save();
    return this.getCart(userId);
  }

  static async toggleSelection(userId, productId) {
    if (!userId) throw new BadRequestError("Please login to continue");
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) throw new NotFoundError("Your cart is empty");

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) throw new NotFoundError("Product not found");

    item.isSelected = !item.isSelected;
    await cart.save();
    return this.getCart(userId);
  }
}

module.exports = CartService;
