const Coupon=require("../models/Coupon");

class CouponService{
    async createCoupon(couponData){
        try {
            const coupon=new Coupon(couponData);
            return await coupon.save();
        } catch (error) {
            throw error;
        }
    }

    async updateCoupon(id,couponData){
        try {
            const coupon=await Coupon.findByIdAndUpdate(id,couponData,{new:true});
            if(!coupon){
                throw new Error("Coupon not found");
            }
            return coupon;
        } catch (error) {
            throw error;
        }
    }

    async deleteCoupon(id){
        try {
            const coupon=await Coupon.findByIdAndDelete(id);
            if(!coupon){
                throw new Error("Coupon not found");
            }
            return coupon;
        } catch (error) {
            throw error;
        }
    }

    async getAllCoupons(query = {}) {
        try {
            const { page = 1, limit = 10, search = '' } = query;
            const skip = (page - 1) * limit;

            const mongoQuery = {};
            if (search) {
                mongoQuery.code = { $regex: search, $options: 'i' };
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
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw error;
        }
    }

    async getCouponById(id){
        try {
            const coupon=await Coupon.findById(id);
            if(!coupon){
                throw new Error("Coupon not found");
            }
            return coupon;
        } catch (error) {
            throw error;
        }
    }

    async applyCoupon(couponCode,cartTotal){
        try {
            const coupon=await Coupon.findOne({code:couponCode});
            if(!coupon){
                throw new Error("Coupon not found");
            }
            if(coupon.validUntil<new Date()){
                throw new Error("Coupon is expired");
            }
            if(coupon.usedCount>=coupon.usageLimit){
                throw new Error("Coupon is used up");
            }
            if(cartTotal<coupon.minPurchaseAmount){
                throw new Error("Cart total is less than minimum purchase amount");
            }
            const discountAmount=cartTotal*coupon.discountPercentage/100;
            if(discountAmount>coupon.maxDiscountAmount){
                throw new Error("Discount amount is greater than maximum discount amount");
            }
            return {
                discountAmount,
                discountPercentage: coupon.discountPercentage,
                maxDiscountAmount: coupon.maxDiscountAmount,
                minPurchaseAmount: coupon.minPurchaseAmount,
                code: coupon.code
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CouponService;