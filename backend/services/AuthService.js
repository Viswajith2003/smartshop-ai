const User = require("../models/User");
const {
  AuthenticationError,
  NotFoundError,
  ValidationError,
} = require("../utils/errors");
const logger = require("../utils/logger");
const MailService = require('./MailService');

class AuthService {
  static async register(userData) {
    try {
      const { email } = userData;
      const formattedEmail = email.trim().toLowerCase();
      
      const existingUser = await User.findByEmail(formattedEmail);
      if (existingUser) {
        throw new ValidationError('Email is already registered');
      }

      const user = new User({
        ...userData,
        email: formattedEmail
      });

      await user.save();
      logger.info(`New user registered: ${formattedEmail}`);
      
      return {
        user: user.getPublicProfile()
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  static async login(credentials) {
    try {
      const { email, password } = credentials;
      const formattedEmail = email.trim().toLowerCase();

      const user = await User.findByEmail(formattedEmail);
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new AuthenticationError('Invalid email or password');
      }

      if (user.status === 'blocked' || user.status === 'banned') {
        throw new AuthenticationError('Your account has been restricted. Please contact support.');
      }

      user.lastLogin = Date.now();
      await user.save();

      const { signUserToken } = require('../utils/jwt');
      const token = signUserToken(user._id);

      logger.info(`User login successful: ${formattedEmail}`);

      return {
        user: user.getPublicProfile(),
        token
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  static async updateProfile(userId, profileData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: profileData },
        { new: true, runValidators: true }
      );
      if (!user) throw new NotFoundError('User not found');
      
      logger.info(`Profile updated: ${user.email}`);
      return user.getPublicProfile();
    } catch (error) {
      logger.error('Profile update error:', error);
      throw error;
    }
  }

  static async updateAvatar(userId, filename) {
    try {
      // We store just the path relative to /uploads/avatars/
      const avatarUrl = `/uploads/avatars/${filename}`;
      const user = await User.findByIdAndUpdate(
        userId,
        { avatar: avatarUrl },
        { new: true }
      );
      if (!user) throw new NotFoundError('User not found');
      return user.getPublicProfile();
    } catch (error) {
       logger.error('Avatar update error:', error);
       throw error;
    }
  }

  static async addAddress(userId, addressData) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new NotFoundError('User not found');

      // If this is the first address, make it default
      if (user.address.length === 0) {
        addressData.isDefault = true;
      } else if (addressData.isDefault) {
        // Unset previous defaults
        user.address.forEach(addr => addr.isDefault = false);
      }

      user.address.push(addressData);
      await user.save();
      return user.address;
    } catch (error) {
      logger.error('Add address error:', error);
      throw error;
    }
  }

  static async updateAddress(userId, addressId, addressData) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new NotFoundError('User not found');

      const addressIndex = user.address.findIndex(addr => addr._id.toString() === addressId);
      if (addressIndex === -1) throw new NotFoundError('Address not found');

      // Handle default logic
      if (addressData.isDefault && !user.address[addressIndex].isDefault) {
        user.address.forEach(addr => addr.isDefault = false);
      } else if (!addressData.isDefault && user.address[addressIndex].isDefault) {
        // Prevent unsetting default if it's the only address
        if (user.address.length > 1) {
             addressData.isDefault = false;
        } else {
             addressData.isDefault = true;
        }
      }

      // Merge new data
      Object.assign(user.address[addressIndex], addressData);
      
      await user.save();
      return user.address;
    } catch (error) {
      logger.error('Update address error:', error);
      throw error;
    }
  }

  static async deleteAddress(userId, addressId) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new NotFoundError('User not found');

      user.address = user.address.filter(addr => addr._id.toString() !== addressId);
      await user.save();
      return user.address;
    } catch (error) {
      logger.error('Delete address error:', error);
      throw error;
    }
  }

  static async setDefaultAddress(userId, addressId) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new NotFoundError('User not found');

      user.address.forEach(addr => {
        addr.isDefault = addr._id.toString() === addressId;
      });

      await user.save();
      return user.address;
    } catch (error) {
      logger.error('Set default address error:', error);
      throw error;
    }
  }

  static async changePassword(userId, passwordData) {
    try {
      const { currentPassword, newPassword } = passwordData;

      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new AuthenticationError('Current password is incorrect');
      }

      user.password = newPassword;
      await user.save();

      logger.info(`Password changed for user: ${user.email}`);

      return true;
    } catch (error) {
      logger.error('Password change error:', error);
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      return user.getPublicProfile();
    } catch (error) {
      logger.error('Get user error:', error);
      throw error;
    }
  }

  static async validateUser(userId) {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      if (user.status === 'banned') {
        throw new AuthenticationError('Account has been banned');
      }

      return user;
    } catch (error) {
      logger.error('User validation error:', error);
      throw error;
    }
  }

  static async forgotPassword(email) {
    try {
      const formattedEmail = email.trim().toLowerCase();
      const user = await User.findByEmail(formattedEmail);
      if (!user) {
        throw new NotFoundError('User not found with this email');
      }

      // Generate random OTP
      const otp = this.generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      // Send OTP via Email
      try {
        await MailService.sendOTP(user.email, otp);
        logger.info(`Forgot password OTP sent to: ${email}`);
      } catch (mailError) {
        logger.error(`Failed to send forgot password OTP to ${email}:`, mailError);
        throw new Error('Failed to send verification email');
      }

      return { message: "Verification code sent to your email" };
    } catch (error) {
      logger.error('Forgot password error:', error);
      throw error;
    }
  }

  static async resetPassword({ email, otp, newPassword }) {
    try {
      const formattedEmail = email.trim().toLowerCase();
      const user = await User.findOne({ 
        email: formattedEmail, 
        otp, 
        otpExpiry: { $gt: Date.now() } 
      });

      if (!user) {
        throw new AuthenticationError('Invalid or expired OTP');
      }

      user.password = newPassword;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      logger.info(`Password reset successful for: ${email}`);
      return { message: "Password reset successful" };
    } catch (error) {
      logger.error('Reset password error:', error);
      throw error;
    }
  }

  static async verifyOtp({ email, otp }) {
    try {
      const formattedEmail = email.trim().toLowerCase();
      const user = await User.findOne({ 
        email: formattedEmail, 
        otp, 
        otpExpiry: { $gt: Date.now() } 
      });

      if (!user) {
        throw new AuthenticationError('Invalid or expired OTP');
      }

      user.isVerified = true;
      // Note: We don't clear OTP here anymore, as it's needed for the Reset Password step.
      // It will be cleared in resetPassword() or will expire naturally.
      await user.save();

      logger.info(`OTP verified for: ${email}`);
      return { message: "OTP verified successfully" };
    } catch (error) {
      logger.error('OTP verification error:', error);
      throw error;
    }
  }

  static async resendOtp(email) {
    return this.forgotPassword(email);
  }

  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

module.exports = AuthService;