const express = require('express');
const router = express.Router();
const authRoutes = require('../features/auth/authRoutes');
const userRoutes = require('../features/user/userRoutes');
const adminRoutes = require('../features/admin/adminRoutes');
const categoryRoutes = require('../features/category/categoryRoutes');
const productRoutes = require('../features/product/productRoutes');
const couponRoutes = require('../features/coupon/couponRoutes');
const cartRoutes = require('../features/cart/cartRoutes');
const orderRoutes = require('../features/order/orderRoutes');
const wishlistRoutes = require('../features/wishlist/wishlistRoutes');
const paymentRoutes = require('../features/payment/paymentRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/coupons', couponRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;
