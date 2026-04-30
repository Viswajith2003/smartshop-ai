const express = require("express");
const router = express.Router();
const CouponController = require("./couponController");
const { authenticateAdmin, protect } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { couponSchema, applyCouponSchema } = require("./couponValidation");

// Public (or semi-public) routes
router.get("/", CouponController.getAllCoupons);
router.get("/:couponId", CouponController.getCouponById);

// User routes
router.post("/apply", protect, validate(applyCouponSchema), CouponController.applyCoupon);

// Admin routes
router.use(authenticateAdmin);

router.post("/", validate(couponSchema), CouponController.createCoupon);
router.put("/:couponId", validate(couponSchema), CouponController.updateCoupon);
router.delete("/:couponId", CouponController.deleteCoupon);

module.exports = router;
