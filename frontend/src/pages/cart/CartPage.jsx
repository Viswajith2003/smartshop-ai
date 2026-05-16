import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    removeFromCartDB,
    updateQuantityDB,
    fetchCart,
    applyCouponDB,
    removeCoupon,
    toggleSelectionDB,
} from '../../features/cart/cartSlice';
import { getUser } from '../../services/axiosInstance';
import { authAPI } from '../../features/auth/authAPI';
import { couponApi } from '../../services/api/couponApi';
import { toast } from 'react-toastify';
import { MapPin, CheckCircle, Plus, Heart, ChevronLeft, ChevronRight, X, Trash2, Tag, Ticket } from 'lucide-react';
import useCartCalculations from '../../hooks/useCartCalculations';

import Breadcrumbs from '../../components/common/Breadcrumbs';

const CartPage = () => {
    const { items, loading, appliedCoupon } = useSelector((s) => s.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [couponCode, setCouponCode] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addressLoading, setAddressLoading] = useState(true);
    const [showAddressPanel, setShowAddressPanel] = useState(false);
    const [showCouponsModal, setShowCouponsModal] = useState(false);

    /* fetch cart */
    useEffect(() => {
        const user = getUser();
        if (user) dispatch(fetchCart(user.id || user._id));
    }, [dispatch]);

    /* fetch addresses */
    useEffect(() => {
        authAPI.getProfile()
            .then((res) => {
                const list = res.data.address || [];
                setAddresses(list);
                setSelectedAddress(list.find((a) => a.isDefault) || list[0] || null);
            })
            .catch(console.error)
            .finally(() => setAddressLoading(false));
    }, []);

    const { subtotal, shipping, tax, discount, total, selectedItems } =
        useCartCalculations(items, appliedCoupon);

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) return;
        dispatch(applyCouponDB({ code: couponCode.trim(), totalPrice: subtotal }));
    };

    const handleRemoveCoupon = () => {
        dispatch(removeCoupon());
        setCouponCode('');
        toast.info('Coupon removed');
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            toast.warning('Please select at least one item to checkout');
            return;
        }
        if (!selectedAddress) {
            toast.warning('Please select a delivery address before proceeding');
            setShowAddressPanel(true);
            return;
        }
        navigate('/checkout', { state: { preSelectedAddress: selectedAddress } });
    };

    /* ── Loading ── */
    if (loading && items.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
            </div>
        );
    }

    /* ── Empty ── */
    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="w-48 h-48 bg-slate-100 rounded-full flex items-center justify-center mb-8">
                    <i className="bi bi-cart-x text-6xl text-slate-300" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
                <p className="text-slate-500 mb-8 text-center max-w-md">
                    Looks like you haven't added anything yet. Explore our products and find something you love.
                </p>
                <Link
                    to="/products"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-10 py-3 rounded-lg shadow transition-all"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <>
        <div className="w-full py-12 max-w-7xl mx-auto px-4">
            <Breadcrumbs 
                items={[
                    { label: 'Products', link: '/products' },
                    { label: 'Cart' }
                ]} 
                className="mb-12"
            />

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* ── LEFT: Product Table + Address + Footer ── */}
                <div className="flex-grow min-w-0">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                        {/* Table Header */}
                        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50">
                            <div /> {/* image placeholder */}
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Product</span>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest w-28 text-center">Quantity</span>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest w-24 text-right">Price</span>
                            <div className="w-20" /> {/* actions */}
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-slate-100">
                            {items.map((item) => (
                                <CartRow
                                    key={item.product?._id}
                                    item={item}
                                    dispatch={dispatch}
                                />
                            ))}
                        </div>

                        {/* Address selector */}
                        <div className="border-t border-slate-100 px-6 py-4">
                            <button
                                onClick={() => setShowAddressPanel((v) => !v)}
                                className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:underline"
                            >
                                <MapPin className="w-4 h-4" />
                                {selectedAddress
                                    ? `Delivering to: ${selectedAddress.fullName}, ${selectedAddress.city} — ${selectedAddress.pincode}`
                                    : 'Select delivery address'}
                                <ChevronRight className={`w-4 h-4 transition-transform ${showAddressPanel ? 'rotate-90' : ''}`} />
                            </button>

                            {showAddressPanel && (
                                <div className="mt-4 space-y-3">
                                    {addressLoading ? (
                                        <div className="flex gap-3">
                                            {[1, 2].map((i) => (
                                                <div key={i} className="flex-1 h-20 bg-slate-100 rounded-xl animate-pulse" />
                                            ))}
                                        </div>
                                    ) : addresses.length === 0 ? (
                                        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                                            <p className="text-sm text-slate-400 font-medium">No saved addresses.</p>
                                            <button
                                                onClick={() => navigate('/profile')}
                                                className="text-indigo-600 text-sm font-semibold mt-2 hover:underline"
                                            >
                                                Add in Profile →
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {addresses.map((addr) => (
                                                <div
                                                    key={addr._id}
                                                    onClick={() => {
                                                        setSelectedAddress(addr);
                                                        setShowAddressPanel(false);
                                                    }}
                                                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                                                        selectedAddress?._id === addr._id
                                                            ? 'border-indigo-600 bg-indigo-50'
                                                            : 'border-slate-200 hover:border-indigo-300'
                                                    }`}
                                                >
                                                    {selectedAddress?._id === addr._id && (
                                                        <CheckCircle className="absolute top-3 right-3 w-4 h-4 text-indigo-600" />
                                                    )}
                                                    <p className="font-bold text-slate-800">{addr.fullName}</p>
                                                    <p className="text-slate-500 mt-0.5">{addr.street}, {addr.city}, {addr.state} — {addr.pincode}</p>
                                                    <p className="text-slate-400 text-xs mt-1">{addr.phone}</p>
                                                    {addr.isDefault && (
                                                        <span className="mt-1 inline-block text-[9px] font-bold uppercase bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Default</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Add new address
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                            <Link
                                to="/products"
                                className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 border border-slate-200 px-5 py-2.5 rounded-lg transition-all hover:border-indigo-300"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Continue shopping
                            </Link>
                            
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Summary Sidebar ── */}
                <div className="w-full lg:w-80 shrink-0 space-y-4">

                    {/* Coupon Box */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <p className="font-semibold text-slate-700 mb-3">Have coupon?</p>
                        {!appliedCoupon ? (
                            <>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                        placeholder="Coupon code"
                                        className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder:text-slate-300"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={loading || !couponCode.trim()}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50"
                                    >
                                        Apply
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowCouponsModal(true)}
                                    className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#4B0082] hover:text-[#2D0081] transition-colors"
                                >
                                    <span className="w-3 h-3 bg-[#E91E63] rounded-[2px]" />
                                    View Available Coupons
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center justify-between bg-[#E8F5E9] border border-[#C8E6C9] rounded-lg px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-emerald-700 text-sm font-medium">
                                        🎉 Coupon "{appliedCoupon.code}" applied — You save ₹{discount.toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <button 
                                    onClick={handleRemoveCoupon} 
                                    className="text-[#FF5252] hover:text-red-700 transition-colors ml-2"
                                >
                                    <X className="w-5 h-5" strokeWidth={3} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Price Summary */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 space-y-6">
                            <h3 className="text-xl font-bold text-slate-800">Cart Total</h3>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between text-base text-slate-600">
                                    <span>Subtotal:</span>
                                    <span className="font-medium text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-base text-slate-600 border-t border-slate-50 pt-4">
                                    <span>Shipping:</span>
                                    <span className="font-medium text-slate-900">Free</span>
                                </div>

                                <div className="flex justify-between text-base border-t border-slate-50 pt-4">
                                    <span className="text-emerald-500 font-medium">Discount:</span>
                                    <span className="text-emerald-500 font-bold">
                                        {discount > 0 ? `-₹${discount.toLocaleString('en-IN')}` : '₹0'}
                                    </span>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-lg font-bold text-slate-800">Total:</span>
                                    <span className="text-xl font-bold text-slate-900">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-[#2D0081] hover:bg-[#1e0057] text-white font-bold py-4 rounded-lg transition-all shadow-lg active:scale-[0.98]"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Coupons Popup Modal */}
        {showCouponsModal && (
            <CouponsModal
                onClose={() => setShowCouponsModal(false)}
                onSelectCoupon={(code) => {
                    setCouponCode(code);
                    setShowCouponsModal(false);
                }}
                subtotal={subtotal}
            />
        )}
        </>
    );
};

/* ─── CartRow (inline table row matching reference design) ────────── */
const CartRow = ({ item, dispatch }) => {
    const maxQty = item.product?.stock || 20;
    const qtyOptions = Array.from({ length: Math.min(maxQty, 10) }, (_, i) => i + 1);

    return (
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50 transition-colors group">
            {/* Image */}
            <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-100 shrink-0">
                <img
                    src={item.product?.images?.[0]}
                    alt={item.product?.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
            </div>

            {/* Name + meta */}
            <div className="min-w-0">
                <Link
                    to={`/products/${item.product?._id}`}
                    className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors text-sm leading-snug block truncate"
                >
                    {item.product?.name}
                </Link>
                <p className="text-xs text-slate-400 mt-0.5">
                    {item.product?.category?.name && `Brand: ${item.product.category.name}`}
                </p>
            </div>

            {/* Quantity dropdown */}
            <div className="w-28 flex justify-center">
                <select
                    value={item.quantity}
                    onChange={(e) =>
                        dispatch(
                            updateQuantityDB({
                                productId: item.product?._id,
                                quantity: Number(e.target.value),
                            })
                        )
                    }
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                >
                    {qtyOptions.map((n) => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>
            </div>

            {/* Price */}
            <div className="w-24 text-right shrink-0">
                <p className="font-bold text-slate-900 text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-slate-400">₹{item.product?.price?.toLocaleString('en-IN')} each</p>
            </div>

            {/* Actions */}
            <div className="w-20 flex items-center justify-end gap-2 shrink-0">
                <button
                    onClick={() => dispatch(toggleSelectionDB(item.product?._id))}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all ${
                        item.isSelected
                            ? 'border-rose-300 text-rose-500 bg-rose-50'
                            : 'border-slate-200 text-slate-300 hover:border-rose-300 hover:text-rose-400'
                    }`}
                    title={item.isSelected ? 'Deselect' : 'Select'}
                >
                    <Heart className="w-4 h-4" fill={item.isSelected ? 'currentColor' : 'none'} />
                </button>
                <button
                    onClick={() => dispatch(removeFromCartDB(item.product?._id))}
                    className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors whitespace-nowrap"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                
                </button>
            </div>
        </div>
    );
};

export default CartPage;

/* ─── CouponsModal ──────────────────────────────────────────────── */
const CouponsModal = ({ onClose, onSelectCoupon, subtotal }) => {
    const [coupons, setCoupons] = useState([]);
    const [modalLoading, setModalLoading] = useState(true);

    useEffect(() => {
        couponApi.getCoupons({ limit: 50 })
            .then((res) => setCoupons(res.data || []))
            .catch(() => toast.error('Failed to load coupons'))
            .finally(() => setModalLoading(false));
    }, []);

    const activeCoupons = coupons.filter(
        (c) => c.isActive && (!c.expiryDate || new Date(c.expiryDate) > new Date())
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-bold text-slate-800 text-base">Available Coupons</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 p-4 space-y-3">
                    {modalLoading ? (
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : activeCoupons.length === 0 ? (
                        <div className="text-center py-12">
                            <Ticket className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                            <p className="text-sm font-medium text-slate-400">No coupons available right now.</p>
                        </div>
                    ) : (
                        activeCoupons.map((coupon) => {
                            const eligible = subtotal >= coupon.minPurchaseAmount;
                            return (
                                <button
                                    key={coupon._id}
                                    onClick={() => onSelectCoupon(coupon.code)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all group ${
                                        eligible
                                            ? 'border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/40 cursor-pointer'
                                            : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                                    }`}
                                    disabled={!eligible}
                                    title={!eligible ? `Min. purchase ₹${coupon.minPurchaseAmount.toLocaleString('en-IN')} required` : ''}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="font-black text-indigo-600 text-sm uppercase tracking-widest bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                                                    {coupon.code}
                                                </span>
                                                {!eligible && (
                                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                        Min. ₹{coupon.minPurchaseAmount?.toLocaleString('en-IN')}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-semibold text-slate-700">
                                                {coupon.discountPercentage}% off
                                                {coupon.maxDiscountAmount && (
                                                    <span className="text-slate-400 font-normal text-xs ml-1">
                                                        (up to ₹{coupon.maxDiscountAmount.toLocaleString('en-IN')})
                                                    </span>
                                                )}
                                            </p>
                                            {coupon.expiryDate && (
                                                <p className="text-[11px] text-slate-400 mt-0.5">
                                                    Expires {new Date(coupon.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            )}
                                        </div>
                                        {eligible && (
                                            <span className="text-xs font-bold text-indigo-600 group-hover:underline shrink-0 mt-0.5">
                                                Apply →
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
