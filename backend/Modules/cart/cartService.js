const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const { NotFoundError, BadRequestError } = require("../../utils/errors");
const logger = require("../../utils/logger");

class CartService {
  static async addToCart(userId, productId, quantity, price) {
    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError("Product not found");
    if (!product.isActive) throw new BadRequestError("Product is currently unavailable");

    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      if (quantity > product.stock) {
        throw new BadRequestError(`Cannot add more than available stock (${product.stock})`);
      }
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity, price: price * quantity }],
        totalPrice: price * quantity,
        totalItems: 1
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        if (newQuantity > product.stock) {
          throw new BadRequestError(`Cannot add more than available stock (${product.stock})`);
        }
        cart.items[itemIndex].quantity = newQuantity;
        cart.items[itemIndex].price += price * quantity;
      } else {
        if (quantity > product.stock) {
          throw new BadRequestError(`Cannot add more than available stock (${product.stock})`);
        }
        cart.items.push({ product: productId, quantity, price: price * quantity });
        cart.totalItems += 1;
      }
      cart.totalPrice += price * quantity;
    }

    await cart.save();
    return this.getCart(userId);
  }

  static async getCart(userId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return { items: [], totalPrice: 0, totalItems: 0 };
    
    await cart.populate("items.product", "name price images category");
    return cart;
  }

  static async updateQuantity(userId, productId, quantity) {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) throw new NotFoundError("Cart not found");

    const item = cart.items.find(item => item.product._id.toString() === productId);
    if (!item) throw new NotFoundError("Item not found");

    if (quantity > item.product.stock) {
      throw new BadRequestError(`Cannot update quantity beyond available stock (${item.product.stock})`);
    }

    const unitPrice = item.price / item.quantity;
    item.quantity = quantity;
    item.price = unitPrice * quantity;

    cart.totalPrice = cart.items.reduce((acc, curr) => acc + curr.price, 0);
    
    await cart.save();
    return this.getCart(userId);
  }

  static async deleteCartItem(userId, productId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new NotFoundError("Cart not found");
    
    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) throw new NotFoundError("Item not found");
    
    cart.totalPrice -= item.price;
    cart.totalItems -= 1;
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    
    await cart.save();
    return this.getCart(userId);
  }

  static async toggleSelection(userId, productId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new NotFoundError("Cart not found");

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) throw new NotFoundError("Item not found");

    item.isSelected = !item.isSelected;
    await cart.save();
    return this.getCart(userId);
  }
}

module.exports = CartService;
