const CouponService = require("./couponService");
const { ResponseFormatter } = require("../../utils/response");

class CouponController {
  static async createCoupon(req, res, next) {
    try {
      const coupon = await CouponService.createCoupon(req.body);
      return ResponseFormatter.success(res, "Coupon created successfully", coupon, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateCoupon(req, res, next) {
    try {
      const { couponId } = req.params;
      const coupon = await CouponService.updateCoupon(couponId, req.body);
      return ResponseFormatter.success(res, "Coupon updated successfully", coupon);
    } catch (error) {
      next(error);
    }
  }

  static async deleteCoupon(req, res, next) {
    try {
      const { couponId } = req.params;
      await CouponService.deleteCoupon(couponId);
      return ResponseFormatter.success(res, "Coupon deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  static async getAllCoupons(req, res, next) {
    try {
      const result = await CouponService.getAllCoupons(req.query);
      return ResponseFormatter.success(res, "Coupons fetched successfully", result.coupons, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getCouponById(req, res, next) {
    try {
      const { couponId } = req.params;
      const coupon = await CouponService.getCouponById(couponId);
      return ResponseFormatter.success(res, "Coupon fetched successfully", coupon);
    } catch (error) {
      next(error);
    }
  }

  static async applyCoupon(req, res, next) {
    try {
      const { code, totalPrice } = req.body;
      const result = await CouponService.applyCoupon(code, totalPrice);
      return ResponseFormatter.success(res, "Coupon applied successfully", result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CouponController;
