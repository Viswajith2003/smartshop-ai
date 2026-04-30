const Coupon = require("../../models/Coupon");
const { NotFoundError, BadRequestError } = require("../../utils/errors");

class CouponService {
  static async createCoupon(data) {
    const coupon = new Coupon(data);
    return await coupon.save();
  }

  static async updateCoupon(id, data) {
    const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true });
    if (!coupon) throw new NotFoundError("Coupon not found");
    return coupon;
  }

  static async deleteCoupon(id) {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) throw new NotFoundError("Coupon not found");
    return coupon;
  }

  static async getAllCoupons(queryParams = {}) {
    const { page = 1, limit = 10, search = "" } = queryParams;
    const skip = (page - 1) * limit;

    const mongoQuery = {};
    if (search) {
      mongoQuery.code = { $regex: search, $options: "i" };
    }

    const coupons = await Coupon.find(mongoQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Coupon.countDocuments(mongoQuery);

    return {
      coupons,
      meta: {
        page: Number(page),
        limit: Number(limit),
        totalCoupons: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getCouponById(id) {
    const coupon = await Coupon.findById(id);
    if (!coupon) throw new NotFoundError("Coupon not found");
    return coupon;
  }

  static async applyCoupon(code, cartTotal) {
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) throw new BadRequestError("Invalid or inactive coupon");

    if (coupon.validUntil < new Date()) throw new BadRequestError("Coupon has expired");
    if (coupon.usedCount >= coupon.usageLimit) throw new BadRequestError("Coupon usage limit reached");
    if (cartTotal < coupon.minPurchaseAmount) {
      throw new BadRequestError(`Minimum purchase of ${coupon.minPurchaseAmount} required`);
    }

    let discountAmount = (cartTotal * coupon.discountPercentage) / 100;
    if (discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }

    return {
      discountAmount,
      discountPercentage: coupon.discountPercentage,
      code: coupon.code,
    };
  }
}

module.exports = CouponService;
