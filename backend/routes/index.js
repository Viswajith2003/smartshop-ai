const express = require('express');
const router = express.Router();

const authRoutes = require('../Modules/auth/authRoutes');
const userRoutes = require('../Modules/user/userRoutes');
const categoryRoutes = require('../Modules/category/categoryRoutes');
const productRoutes = require('../Modules/product/productRoutes');
const couponRoutes = require('../Modules/coupon/couponRoutes');
const cartRoutes = require('../Modules/cart/cartRoutes');
const orderRoutes = require('../Modules/order/orderRoutes');
const wishlistRoutes = require('../Modules/wishlist/wishlistRoutes');
const paymentRoutes = require('../Modules/payment/paymentRoutes');
const chatbotRoutes = require('../Modules/chatbot/chatbotRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/coupons', couponRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/payments', paymentRoutes);
router.use('/chatbot', chatbotRoutes);

module.exports = router;
