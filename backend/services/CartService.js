const Cart = require("../models/Cart");
const { NotFoundError } = require("../utils/errors");
const logger = require("../utils/logger");

class CartService {
    static async addToCart(userId, productId, quantity, price) {
        logger.info(`Adding to cart: user=${userId}, product=${productId}`);
        try {
            let cart = await Cart.findOne({ user: userId });
            if (!cart) {
                cart = new Cart({
                    user: userId,
                    items: [{ product: productId, quantity, price: price * quantity }],
                    totalPrice: price * quantity,
                    totalItems: 1
                });
            } else {
                const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
                if (itemIndex > -1) {
                    cart.items[itemIndex].quantity += quantity;
                    cart.items[itemIndex].price += price * quantity;
                } else {
                    cart.items.push({ product: productId, quantity, price: price * quantity });
                    cart.totalItems += 1;
                }
                cart.totalPrice += price * quantity;
            }
            await cart.save();
            logger.info(`Cart saved successfully for user: ${userId}`);
            return CartService.getCart(userId);
        } catch (error) {
            logger.error(`Error in addToCart: ${error.message}`);
            throw error;
        }
    }

    static async getCart(userId) {
        logger.info(`Fetching cart for user: ${userId}`);
        try {
            // Test if we can find the cart at all
            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                logger.info(`No cart found for user: ${userId}`);
                return { items: [], totalPrice: 0, totalItems: 0 };
            }
            
            // If found, try to populate
            try {
                await cart.populate("items.product", "name price images category");
                logger.info(`Cart populated successfully for user: ${userId}`);
            } catch (popError) {
                logger.error(`Populate failed: ${popError.message}`);
                // Return unpopulated cart as fallback
            }
            
            return cart;
        } catch (error) {
            logger.error(`Error in getCart: ${error.message} - ${error.stack}`);
            throw error;
        }
    }

    static async deleteCartItem(userId, productId) {
        try {
            const cart = await Cart.findOne({ user: userId });
            if (!cart) throw new NotFoundError("Cart not found");
            
            const item = cart.items.find(item => item.product.toString() === productId);
            if (!item) throw new NotFoundError("Item not found");
            
            cart.totalPrice -= item.price;
            cart.totalItems -= 1;
            cart.items = cart.items.filter(item => item.product.toString() !== productId);
            
            await cart.save();
            return this.getCart(userId);
        } catch (error) {
            throw error;
        }
    }

    static async updateQuantity(userId, productId, quantity) {
        try {
            const cart = await Cart.findOne({ user: userId }).populate("items.product");
            if (!cart) throw new NotFoundError("Cart not found");

            const item = cart.items.find(item => {
                const id = item.product._id ? item.product._id.toString() : item.product.toString();
                return id === productId;
            });
            if (!item) throw new NotFoundError("Item not found");

            // Assuming we need the unit price to recalculate item price
            const unitPrice = item.price / item.quantity;
            item.quantity = quantity;
            item.price = unitPrice * quantity;

            // Recalculate totals
            cart.totalPrice = cart.items.reduce((acc, curr) => acc + curr.price, 0);
            
            await cart.save();
            return this.getCart(userId);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CartService;