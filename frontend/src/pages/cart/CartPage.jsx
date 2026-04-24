import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCartDB, updateQuantityDB, fetchCart } from '../../features/cart/cartSlice';
import { couponAPI } from '../../services/api';
import { getUser } from '../../services/axiosInstance';
import { toast } from 'react-toastify';

import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';

const CartPage = () => {
    const { items, loading, totalPrice } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        const user = getUser();
        if (user) {
            dispatch(fetchCart(user.id || user._id));
        }
    }, [dispatch]);

    const subtotal = items.reduce((total, item) => total + (item.price), 0);
    const shipping = subtotal > 5000 ? 0 : 500;
    const tax = subtotal * 0.18;

    const totalBeforeCoupon = subtotal + shipping + tax;
    
    // Dynamic Discount Calculation
    const discount = appliedCoupon ? (
        subtotal >= appliedCoupon.minPurchaseAmount 
            ? Math.min((subtotal * appliedCoupon.discountPercentage) / 100, appliedCoupon.maxDiscountAmount)
            : 0
    ) : 0;

    const total = totalBeforeCoupon - discount;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplying(true);
        try {
            const res = await couponAPI.applyCoupon({ couponCode: couponCode.trim(), cartTotal: subtotal });
            setAppliedCoupon(res.data);
            toast.success(res.message || "Coupon applied successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid or expired coupon");
            setAppliedCoupon(null);
        } finally {
            setIsApplying(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        toast.info("Coupon removed");
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (loading && items.length === 0) {
        return <div className="min-h-[70vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>;
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="w-64 h-64 bg-indigo-50 rounded-full flex items-center justify-center mb-8 animate-pulse">
                    <i className="bi bi-cart-x text-8xl text-indigo-200"></i>
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-2">Your cart is empty</h2>
                <p className="text-slate-500 font-medium mb-8 text-center max-w-md">
                    Looks like you haven't added anything to your cart yet. 
                    Explore our amazing products and find something you love.
                </p>
                <Link to="/products" className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-4 rounded-2xl shadow-xl transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm">
                    Start Shopping
                </Link>
            </div>
        );
    }

    const couponSection = (
        <div className="mt-8 bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <i className="bi bi-tag-fill text-lg"></i>
                Apply Coupon
            </h4>
            
            {!appliedCoupon ? (
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter discount code" 
                        className="flex-1 bg-white border border-indigo-100 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase tracking-wide font-bold"
                    />
                    <button 
                        onClick={handleApplyCoupon}
                        disabled={isApplying || !couponCode.trim()}
                        className={`bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-xl transition-all shadow-md ${isApplying ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 active:scale-95'}`}
                    >
                        {isApplying ? 'Applying...' : 'Apply'}
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                            <i className="bi bi-check-lg text-xl"></i>
                        </div>
                        <div>
                            <div className="text-sm font-black text-emerald-800 uppercase tracking-widest">{appliedCoupon.code}</div>
                            <div className="text-xs font-bold text-emerald-600">Savings applied!</div>
                        </div>
                    </div>
                    <button 
                        onClick={handleRemoveCoupon}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <i className="bi bi-x-circle-fill text-xl"></i>
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full py-8">
            <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight flex items-center">
                My Shopping Bag
                <span className="ml-4 text-sm font-bold bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest">
                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                </span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Cart Items List */}
                <div className="flex-grow space-y-6">
                    {items.map((item) => (
                        <CartItem key={item.product?._id} item={item} />
                    ))}
                </div>

                {/* Order Summary */}
                <CartSummary 
                    subtotal={subtotal}
                    shipping={shipping}
                    tax={tax}
                    appliedCoupon={appliedCoupon}
                    discount={discount}
                    total={total}
                    onCheckout={handleCheckout}
                    couponSection={couponSection}
                />
            </div>
        </div>
    );
};

export default CartPage;
