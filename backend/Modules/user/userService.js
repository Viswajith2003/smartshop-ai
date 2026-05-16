const User = require("../../models/User");
const { NotFoundError } = require("../../utils/errors");
const logger = require("../../utils/logger");

class UserService {
  static async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    return user.getPublicProfile();
  }

  static async updateProfile(userId, profileData) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: profileData },
      { new: true, runValidators: true }
    );
    if (!user) throw new NotFoundError("User not found");
    
    logger.info(`Profile updated: ${user.email}`);
    return user.getPublicProfile();
  }

  static async updateAvatar(userId, filename) {
    const avatarUrl = `/uploads/avatars/${filename}`;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    );
    if (!user) throw new NotFoundError("User not found");
    return user.getPublicProfile();
  }

  static async changePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new Error("Current password is incorrect");

    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for: ${user.email}`);
    return true;
  }
}

module.exports = UserService;
