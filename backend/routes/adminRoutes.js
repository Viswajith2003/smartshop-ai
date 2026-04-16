const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const categoryRoutes = require('./categoryRoute');
const { authenticateAdmin } = require('../middlewares/auth');

// Public route
router.post('/login', AdminController.login);

// Protected routes
router.get('/dashboard', authenticateAdmin, AdminController.getDashboardStats);

// Category Management
router.use('/categories', categoryRoutes);

module.exports = router;

