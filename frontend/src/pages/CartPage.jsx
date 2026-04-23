import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCartDB, updateQuantityDB, fetchCart } from '../store/slices/cartSlice';
import { couponAPI, getUser } from '../utils/api';
import { toast } from 'react-toastify';

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
                        <div key={item.product?._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6 group transition-all hover:shadow-md">
                            {/* Product Image */}
                            <div className="w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center p-2">
                                <img 
                                    src={item.product?.images && item.product.images[0]} 
                                    alt={item.product?.name} 
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                                />
                            </div>

                            {/* Item Details */}
                            <div className="flex-grow">
                                <Link to={`/products/${item.product?._id}`} className="text-lg font-black text-slate-800 hover:text-indigo-600 transition-colors mb-1 block">
                                    {item.product?.name}
                                </Link>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">
                                    {item.product?.category?.name || 'Category'}
                                </span>
                                
                                <div className="flex items-center gap-6">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                                        <button 
                                            onClick={() => item.quantity > 1 && dispatch(updateQuantityDB({ productId: item.product?._id, quantity: item.quantity - 1 }))}
                                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                                        >
                                            <i className="bi bi-dash-lg"></i>
                                        </button>
                                        <span className="w-10 text-center font-black text-slate-800">{item.quantity}</span>
                                        <button 
                                            onClick={() => dispatch(updateQuantityDB({ productId: item.product?._id, quantity: item.quantity + 1 }))}
                                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                                        >
                                            <i className="bi bi-plus-lg"></i>
                                        </button>
                                    </div>

                                    <button 
                                        onClick={() => dispatch(removeFromCartDB(item.product?._id))}
                                        className="text-red-400 hover:text-red-500 text-sm font-bold flex items-center gap-1 transition-colors"
                                    >
                                        <i className="bi bi-trash3 text-lg"></i>
                                        <span className="hidden sm:inline">Remove</span>
                                    </button>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="text-right flex-shrink-0">
                                <span className="text-xl font-black text-slate-900 block">
                                    ₹{(item.price).toLocaleString('en-IN')}
                                </span>
                                <span className="text-xs font-bold text-slate-400">
                                    ₹{item.product?.price.toLocaleString('en-IN')} each
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
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

                        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm mb-4">
                            Checkout Now
                        </button>
                        
                        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                             <i className="bi bi-shield-lock-fill text-indigo-500"></i>
                             Secure Checkout Guaranteed
                        </div>
                    </div>

                    {/* Coupon Section */}
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
                </div>
            </div>
        </div>
    );
};

export default CartPage;
