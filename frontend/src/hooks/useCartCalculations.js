import { useMemo } from 'react';

/**
 * Custom hook to centralize cart calculations for consistency across Cart and Checkout pages.
 * 
 * @param {Array} items - The items in the cart
 * @param {Object} appliedCoupon - The currently applied coupon object (optional)
 * @returns {Object} Calculated values: subtotal, shipping, tax, discount, total, selectedItems
 */
const useCartCalculations = (items = [], appliedCoupon = null) => {
    return useMemo(() => {
        // 1. Filter selected items
        const selectedItems = items.filter(item => item.isSelected);

        // 2. Calculate Subtotal
        const subtotal = selectedItems.reduce((total, item) => total + (item.price), 0);

        // 3. Shipping — FREE for all orders
        const shipping = 0;

        // 4. Tax — not applicable
        const tax = 0;

        // 5. Total before discount
        const totalBeforeCoupon = subtotal + shipping;

        // 6. Calculate Discount
        const discount = appliedCoupon ? (
            subtotal >= (appliedCoupon.minPurchaseAmount || 0) 
                ? (appliedCoupon.discountType === 'percentage'
                    ? Math.min((subtotal * (appliedCoupon.discountValue || 0)) / 100, appliedCoupon.maxDiscountAmount || Infinity)
                    : (appliedCoupon.discountValue || 0))
                : 0
        ) : 0;

        // 7. Final Total
        const total = Math.max(0, totalBeforeCoupon - discount);

        return {
            selectedItems,
            subtotal,
            shipping,
            tax,
            discount,
            total,
            itemCount: selectedItems.length
        };
    }, [items, appliedCoupon]);
};

export default useCartCalculations;
