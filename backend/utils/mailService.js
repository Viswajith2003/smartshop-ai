const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../utils/logger');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: config.MAIL.SERVICE,
      auth: {
        user: config.MAIL.USER,
        pass: config.MAIL.PASS
      }
    });

    // Check if credentials are still placeholders
    if (config.MAIL.USER === 'your-email@gmail.com' || config.MAIL.PASS === 'your-app-password') {
      logger.warn('WARNING: Gmail credentials in .env are still placeholders. Email features will NOT work.');
    }
  }

  async sendOTP(email, otp) {
    try {
      const mailOptions = {
        from: `"SmartShop AI" <${config.MAIL.USER}>`,
        to: email,
        subject: 'Your Verification Code - SmartShop AI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
            <h2 style="color: #9333ea; text-align: center;">SmartShop AI</h2>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #333;">Thank you for choosing SmartShop AI. Use the following OTP to verify your account or reset your password. This code is valid for 10 minutes.</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #9333ea; background: #fdf2ff; padding: 10px 20px; border-radius: 5px; border: 1px dashed #9333ea;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #777;">If you did not request this code, please ignore this email.</p>
            <p style="font-size: 14px; color: #777;">Best regards,<br/>The SmartShop AI Team</p>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      if (error.code === 'EAUTH') {
        logger.error('Email Authentication Failed: Check your MAIL_USER and MAIL_PASS in .env. If using Gmail, you MUST use an App Password.');
      } else {
        logger.error('Error sending email:', error);
      }
      throw new Error('Failed to send verification email');
    }
  }
}

module.exports = new MailService();
