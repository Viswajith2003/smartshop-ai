const express=require("express")
const router=express.Router()
const couponController=require("../controllers/couponController")
const { authenticateAdmin, authenticateUser } = require("../middlewares/auth");

// Public routes (if needed, or protected if admin only)
// Based on the request /api/admin/categories, it's likely admin-only
router.get("/", couponController.getAllCoupons)
router.get("/:couponId", couponController.getCouponById)

// Protected routes (Write operations)
router.post("/", authenticateAdmin, couponController.createCoupon)
router.put("/:couponId", authenticateAdmin, couponController.updateCoupon)
router.delete("/:couponId", authenticateAdmin, couponController.deleteCoupon)

// User route
router.post("/apply", authenticateUser, couponController.applyCoupon)

module.exports=router