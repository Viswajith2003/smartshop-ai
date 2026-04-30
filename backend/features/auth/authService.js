const User = require("../../models/User");
const {
  AuthenticationError,
  ValidationError,
} = require("../../utils/errors");
const logger = require("../../utils/logger");
const MailService = require("../../utils/mailService");
const { generateUserToken } = require("../../utils/jwt");

class AuthService {
  static async register(userData) {
    const { email } = userData;
    const formattedEmail = email.trim().toLowerCase();

    const existingUser = await User.findByEmail(formattedEmail);
    if (existingUser) {
      throw new ValidationError("Email is already registered");
    }

    const otp = this._generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({
      ...userData,
      email: formattedEmail,
      otp,
      otpExpiry,
    });

    await user.save();
    logger.info(`New user registered: ${formattedEmail}`);

    this._sendOtpEmail(user.email, otp);

    return {
      user: user.getPublicProfile(),
    };
  }

  static async login(credentials) {
    const { email, password } = credentials;
    const formattedEmail = email.trim().toLowerCase();

    const user = await User.findByEmail(formattedEmail);
    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AuthenticationError("Invalid email or password");
    }

    if (user.status === "blocked" || user.status === "banned") {
      throw new AuthenticationError("Your account has been restricted. Please contact support.");
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateUserToken({ id: user._id });

    logger.info(`User login successful: ${formattedEmail}`);

    return {
      user: user.getPublicProfile(),
      token,
    };
  }

  static async forgotPassword(email) {
    const formattedEmail = email.trim().toLowerCase();
    const user = await User.findByEmail(formattedEmail);
    if (!user) {
      throw new ValidationError("User not found with this email");
    }

    const otp = this._generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    this._sendOtpEmail(user.email, otp);

    return { message: "Verification code sent to your email" };
  }

  static async resetPassword({ email, otp, newPassword }) {
    const formattedEmail = email.trim().toLowerCase();
    const user = await User.findOne({
      email: formattedEmail,
      otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new AuthenticationError("Invalid or expired OTP");
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    logger.info(`Password reset successful for: ${email}`);
    return { message: "Password reset successful" };
  }

  static async verifyOtp({ email, otp }) {
    const formattedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    const user = await User.findOne({
      email: formattedEmail,
      otp: cleanOtp,
      otpExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new AuthenticationError("Invalid or expired OTP");
    }

    user.isVerified = true;
    await user.save();

    logger.info(`OTP verified for: ${email}`);
    return { message: "OTP verified successfully" };
  }

  static async resendOtp(email) {
    return this.forgotPassword(email);
  }

  // Private helper methods (Rule 1: Small Functions)
  static _generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async _sendOtpEmail(email, otp) {
    try {
      await MailService.sendOTP(email, otp);
      logger.info(`OTP sent to: ${email}`);
    } catch (mailError) {
      logger.error(`Failed to send OTP to ${email}:`, mailError);
    }
  }
}

module.exports = AuthService;
