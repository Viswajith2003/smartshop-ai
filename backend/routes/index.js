const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');
const categoryRoutes = require('./categoryRoute');

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/category', categoryRoutes);

module.exports = router;
