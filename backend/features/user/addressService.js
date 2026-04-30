const User = require("../../models/User");
const { NotFoundError } = require("../../utils/errors");
const logger = require("../../utils/logger");

class AddressService {
  static async addAddress(userId, addressData) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    if (user.address.length === 0) {
      addressData.isDefault = true;
    } else if (addressData.isDefault) {
      user.address.forEach(addr => (addr.isDefault = false));
    }

    user.address.push(addressData);
    await user.save();
    return user.address;
  }

  static async updateAddress(userId, addressId, addressData) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const addressIndex = user.address.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) throw new NotFoundError("Address not found");

    this._handleDefaultLogic(user, addressIndex, addressData);

    Object.assign(user.address[addressIndex], addressData);
    await user.save();
    return user.address;
  }

  static async deleteAddress(userId, addressId) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    user.address = user.address.filter(addr => addr._id.toString() !== addressId);
    await user.save();
    return user.address;
  }

  static async setDefaultAddress(userId, addressId) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    user.address.forEach(addr => {
      addr.isDefault = addr._id.toString() === addressId;
    });

    await user.save();
    return user.address;
  }

  // Private helper (Rule 1)
  static _handleDefaultLogic(user, index, newData) {
    if (newData.isDefault && !user.address[index].isDefault) {
      user.address.forEach(addr => (addr.isDefault = false));
    } else if (!newData.isDefault && user.address[index].isDefault) {
      if (user.address.length > 1) {
        newData.isDefault = false;
      } else {
        newData.isDefault = true;
      }
    }
  }
}

module.exports = AddressService;
