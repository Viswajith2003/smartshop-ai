import React from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';

const CartSummary = ({ subtotal, shipping, tax, appliedCoupon, discount, total, onCheckout, couponSection }) => {
  return (
    <div className="w-full lg:w-[420px] shrink-0">
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl sticky top-28 overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>

        <h3 className="text-2xl font-black mb-10 tracking-tight flex items-center gap-3">
          Order Summary
        </h3>

        <div className="space-y-6 mb-10 pb-10 border-b border-white/10 relative z-10">
          <div className="flex justify-between text-slate-400 font-bold text-sm">
            <span className="uppercase tracking-widest text-[10px]">Bag Subtotal</span>
            <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          
          <div className="flex justify-between text-slate-400 font-bold text-sm">
            <span className="uppercase tracking-widest text-[10px]">Estimated Shipping</span>
            <span className={shipping === 0 ? 'text-emerald-400 font-black' : 'text-white'}>
              {shipping === 0 ? 'FREE' : `₹${shipping}`}
            </span>
          </div>

          <div className="flex justify-between text-slate-400 font-bold text-sm">
            <span className="uppercase tracking-widest text-[10px]">Tax & GST (18%)</span>
            <span className="text-white">₹{tax.toLocaleString('en-IN')}</span>
          </div>

          {appliedCoupon && (
            <div className={`flex justify-between font-bold text-sm ${discount > 0 ? 'text-emerald-400' : 'text-amber-500'}`}>
              <span className="uppercase tracking-widest text-[10px]">Discount ({appliedCoupon.code})</span>
              <span>-₹{discount.toLocaleString('en-IN')}</span>
            </div>
          )}

          {appliedCoupon && discount === 0 && (
            <p className="text-[10px] text-amber-500 font-black uppercase italic text-right -mt-4">
              Min purchase ₹{appliedCoupon.minPurchaseAmount.toLocaleString()} required
            </p>
          )}

          <div className="pt-6 mt-4 border-t border-white/5 flex justify-between items-center group">
            <span className="text-base font-black text-slate-300 uppercase tracking-tighter">Total Price</span>
            <span className="text-4xl font-black text-indigo-400 tracking-tighter group-hover:scale-105 transition-transform duration-300">₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-[2rem] shadow-xl shadow-indigo-600/20 transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-[0.25em] text-xs flex items-center justify-center gap-3 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          Checkout Now
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="mt-10 pt-10 border-t border-white/5 space-y-5">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-white/5 rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Buyer Protection</p>
                    <p className="text-[9px] text-slate-500 font-medium mt-1 leading-relaxed">Your transaction is secured by end-to-end encryption.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Coupon Section */}
      <div className="mt-8">
        {couponSection}
      </div>
    </div>
  );
};

export default CartSummary;
