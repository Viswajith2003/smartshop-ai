const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/resend-otp', AuthController.resendOtp);

// Protected user routes
router.get('/profile', authenticateUser, AuthController.getProfile);
router.put('/profile', authenticateUser, AuthController.updateProfile);
router.put('/profile/avatar', authenticateUser, upload.single('avatar'), AuthController.updateAvatar);
router.post('/logout', authenticateUser, AuthController.logout);
router.put('/change-password', authenticateUser, AuthController.changePassword);

// Multi-address routes
router.post('/address', authenticateUser, AuthController.addAddress);
router.put('/address/:addressId', authenticateUser, AuthController.updateAddress);
router.delete('/address/:addressId', authenticateUser, AuthController.deleteAddress);
router.patch('/address/:addressId/default', authenticateUser, AuthController.setDefaultAddress);

module.exports = router;
