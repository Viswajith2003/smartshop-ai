import React from 'react';

const CartSummary = ({ subtotal, shipping, tax, appliedCoupon, discount, total, onCheckout, couponSection }) => {
  return (
    <div className="w-full lg:w-96">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden sticky top-28">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>

        <h3 className="text-2xl font-black mb-8 tracking-tight">Order Summary</h3>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-slate-400 font-bold">
            <span>Subtotal</span>
            <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-slate-400 font-bold">
            <span>Shipping</span>
            <span className={shipping === 0 ? 'text-emerald-400' : 'text-white'}>
              {shipping === 0 ? 'FREE' : `₹${shipping}`}
            </span>
          </div>
          <div className="flex justify-between text-slate-400 font-bold">
            <span>Tax (18% GST)</span>
            <span className="text-white">₹{tax.toLocaleString('en-IN')}</span>
          </div>
          {appliedCoupon && (
            <div className={`flex justify-between font-bold ${discount > 0 ? 'text-emerald-400' : 'text-amber-500'}`}>
              <span>Discount ({appliedCoupon.code})</span>
              <span>-₹{discount.toLocaleString('en-IN')}</span>
            </div>
          )}
          {appliedCoupon && discount === 0 && (
            <p className="text-[10px] text-amber-500 font-bold mb-2 uppercase italic text-right">
              Min purchase ₹{appliedCoupon.minPurchaseAmount.toLocaleString()} required
            </p>
          )}
          <hr className="border-slate-800 my-2" />
          <div className="flex justify-between text-xl font-black pt-2">
            <span>Total Price</span>
            <span className="text-indigo-400">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm mb-4"
        >
          Checkout Now
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
          <i className="bi bi-shield-lock-fill text-indigo-500"></i>
          Secure Checkout Guaranteed
        </div>
      </div>

      {/* Coupon Section */}
      {couponSection}
    </div>
  );
};

export default CartSummary;
