const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const couponRoutes = require('./couponRoute');

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/coupons', couponRoutes);

module.exports = router;
