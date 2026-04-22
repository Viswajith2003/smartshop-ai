const BaseController = require("./BaseController");
const Validation = require("../utils/validation");
const CouponService = require("../services/couponService");


class CouponController extends BaseController{
    constructor(couponService){
        super();
        this.couponService=couponService;
        this.createCoupon = this.createCoupon.bind(this);
        this.updateCoupon = this.updateCoupon.bind(this);
        this.deleteCoupon = this.deleteCoupon.bind(this);
        this.getAllCoupons = this.getAllCoupons.bind(this);
        this.getCouponById = this.getCouponById.bind(this);
        this.applyCoupon = this.applyCoupon.bind(this);
    }

    async createCoupon(req,res){
        try {
            const validatedData=BaseController.validateRequest(Validation.couponValidation,req.body);
            const result=await this.couponService.createCoupon(validatedData);
            BaseController.logAction("COUPON_CREATE",result);
            BaseController.handleSendSuccess(res,"Coupon created successfully",result,201);
        } catch (error) {
            BaseController.handleSendError(res,error);
        }
    }

    async updateCoupon(req,res){
        try {
            const {couponId}=req.params;
            const validatedData=BaseController.validateRequest(Validation.couponValidation,req.body);
            const result=await this.couponService.updateCoupon(couponId,validatedData);
            BaseController.logAction("COUPON_UPDATE",result);
            BaseController.handleSendSuccess(res,"Coupon updated successfully",result);
        } catch (error) {
            BaseController.handleSendError(res,error);
        }
    }

    async deleteCoupon(req,res){
        try {
            const {couponId}=req.params;
            const result=await this.couponService.deleteCoupon(couponId);
            BaseController.logAction("COUPON_DELETE",result);
            BaseController.handleSendSuccess(res,"Coupon deleted successfully",result);
        } catch (error) {
            BaseController.handleSendError(res,error);
        }
    }

    async getAllCoupons(req,res){
        try {
            const validatedQuery=BaseController.validateRequest(Validation.couponSearchValidation,req.query);
            const {coupons,meta}=await this.couponService.getAllCoupons(validatedQuery);
            BaseController.handleSendSuccess(res,"Coupons fetched successfully",coupons,200,meta);
        } catch (error) {
            BaseController.handleSendError(res,error);
        }
    }

    async getCouponById(req,res){
        try {
            const {couponId}=req.params;
            const result=await this.couponService.getCouponById(couponId);
            BaseController.handleSendSuccess(res,"Coupon fetched successfully",result);
        } catch (error) {
            BaseController.handleSendError(res,error);
        }
    }

    async applyCoupon(req,res){
        try {
            const {couponCode,cartTotal}=req.body;
            const result=await this.couponService.applyCoupon(couponCode,cartTotal);
            BaseController.handleSendSuccess(res,"Coupon applied successfully",result);
        } catch (error) {
            BaseController.handleSendError(res,error);
        }
    }
}

module.exports = new CouponController(new CouponService());