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

        // 3. Calculate Shipping (Free over ₹5,000)
        const shipping = subtotal > 5000 ? 0 : (subtotal > 0 ? 500 : 0);

        // 4. Calculate Tax (18% GST)
        const tax = subtotal * 0.18;

        // 5. Total before discount
        const totalBeforeCoupon = subtotal + shipping + tax;

        // 6. Calculate Discount
        const discount = appliedCoupon ? (
            subtotal >= appliedCoupon.minPurchaseAmount 
                ? Math.min((subtotal * appliedCoupon.discountPercentage) / 100, appliedCoupon.maxDiscountAmount)
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
