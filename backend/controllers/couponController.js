const BaseController = require("./BaseController");
const Validation = require("../utils/validation");
const CouponService = require("../services/couponService");


class CouponController extends BaseController {
  static createCoupon = BaseController.asyncHandler(async (req, res) => {
    const validatedData = BaseController.validateRequest(Validation.couponValidation, req.body);
    const result = await CouponService.createCoupon(validatedData);
    BaseController.logAction("COUPON_CREATE", result);
    BaseController.handleSendSuccess(res, "Coupon created successfully", result, 201);
  });

  static updateCoupon = BaseController.asyncHandler(async (req, res) => {
    const { couponId } = req.params;
    const validatedData = BaseController.validateRequest(Validation.couponValidation, req.body);
    const result = await CouponService.updateCoupon(couponId, validatedData);
    BaseController.logAction("COUPON_UPDATE", result);
    BaseController.handleSendSuccess(res, "Coupon updated successfully", result);
  });

  static deleteCoupon = BaseController.asyncHandler(async (req, res) => {
    const { couponId } = req.params;
    const result = await CouponService.deleteCoupon(couponId);
    BaseController.logAction("COUPON_DELETE", result);
    BaseController.handleSendSuccess(res, "Coupon deleted successfully", result);
  });

  static getAllCoupons = BaseController.asyncHandler(async (req, res) => {
    const validatedQuery = BaseController.validateRequest(Validation.couponSearchValidation, req.query);
    const { coupons, meta } = await CouponService.getAllCoupons(validatedQuery);
    BaseController.handleSendSuccess(res, "Coupons fetched successfully", coupons, 200, meta);
  });

  static getCouponById = BaseController.asyncHandler(async (req, res) => {
    const { couponId } = req.params;
    const result = await CouponService.getCouponById(couponId);
    BaseController.handleSendSuccess(res, "Coupon fetched successfully", result);
  });

  static applyCoupon = BaseController.asyncHandler(async (req, res) => {
    const { couponCode, cartTotal } = req.body;
    const result = await CouponService.applyCoupon(couponCode, cartTotal);
    BaseController.handleSendSuccess(res, "Coupon applied successfully", result);
  });
}

module.exports = CouponController;