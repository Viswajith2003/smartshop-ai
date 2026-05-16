const UserService = require("./userService");
const AddressService = require("./addressService");
const { ResponseFormatter } = require("../../utils/response");

class UserController {
  static async getProfile(req, res, next) {
    try {
      const profile = await UserService.getProfile(req.user._id);
      return ResponseFormatter.success(res, "Profile fetched successfully", profile);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const profile = await UserService.updateProfile(req.user._id, req.body);
      return ResponseFormatter.success(res, "Profile updated successfully", profile);
    } catch (error) {
      next(error);
    }
  }

  static async updateAvatar(req, res, next) {
    try {
      if (!req.file) throw new Error("No image file uploaded");
      const profile = await UserService.updateAvatar(req.user._id, req.file.filename);
      return ResponseFormatter.success(res, "Avatar updated successfully", profile);
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      await UserService.changePassword(req.user._id, req.body);
      return ResponseFormatter.success(res, "Password changed successfully");
    } catch (error) {
      next(error);
    }
  }

  // Address Handlers
  static async addAddress(req, res, next) {
    try {
      const addresses = await AddressService.addAddress(req.user._id, req.body);
      return ResponseFormatter.success(res, "Address added successfully", addresses);
    } catch (error) {
      next(error);
    }
  }

  static async updateAddress(req, res, next) {
    try {
      const { addressId } = req.params;
      const addresses = await AddressService.updateAddress(req.user._id, addressId, req.body);
      return ResponseFormatter.success(res, "Address updated successfully", addresses);
    } catch (error) {
      next(error);
    }
  }

  static async deleteAddress(req, res, next) {
    try {
      const { addressId } = req.params;
      const addresses = await AddressService.deleteAddress(req.user._id, addressId);
      return ResponseFormatter.success(res, "Address deleted successfully", addresses);
    } catch (error) {
      next(error);
    }
  }

  static async setDefaultAddress(req, res, next) {
    try {
      const { addressId } = req.params;
      const addresses = await AddressService.setDefaultAddress(req.user._id, addressId);
      return ResponseFormatter.success(res, "Default address set successfully", addresses);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
