import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  Plus, 
  ShieldCheck, 
  ArrowLeft,
  ChevronRight,
  Package,
  Truck,
  Wallet,
  Mail,
  X
} from 'lucide-react';
import { authAPI } from '../../features/auth/authAPI';
import { orderAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { clearCart } from '../../features/cart/cartSlice';
import Loader from '../../components/common/Loader';
import Breadcrumbs from '../../components/common/Breadcrumbs';

import useCartCalculations from '../../hooks/useCartCalculations';

const CheckoutPage = () => {
    const { items, appliedCoupon } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // 'Razorpay', 'COD', or 'Wallet'
    const [isProcessing, setIsProcessing] = useState(false);

    // Wallet Verification State
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [walletOtp, setWalletOtp] = useState('');
    const [isVerifyingWallet, setIsVerifyingWallet] = useState(false);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await authAPI.getProfile();
                const addressList = response.data.address || [];
                setAddresses(addressList);

                // Use the pre-selected address from CartPage if available
                const preSelected = location.state?.preSelectedAddress;
                if (preSelected) {
                    // Verify it still exists in the list (in case it was deleted)
                    const found = addressList.find(a => a._id === preSelected._id);
                    setSelectedAddress(found || addressList.find(a => a.isDefault) || addressList[0]);
                } else {
                    const defaultAddr = addressList.find(a => a.isDefault) || addressList[0];
                    setSelectedAddress(defaultAddr);
                }
            } catch (err) {
                toast.error("Failed to fetch address details");
            } finally {
                setLoading(false);
            }
        };
        fetchAddresses();
    }, []);

    const { 
        subtotal, 
        shipping, 
        tax, 
        discount,
        total, 
        selectedItems 
    } = useCartCalculations(items, appliedCoupon);

    const handlePayment = async () => {
        if (!selectedAddress) {
            toast.warning("Please select a delivery address to continue");
            return;
        }

        if (paymentMethod === 'Wallet') {
            const balance = user?.wallet?.balance || 0;
            if (balance < total) {
                toast.error("Insufficient wallet balance");
                return;
            }
            try {
                await orderAPI.sendWalletOTP();
                setShowWalletModal(true);
                toast.success("Verification code sent successfully to your mail");
            } catch (error) {
                toast.error("Failed to send verification code. Please try again.");
            }
            return;
        }

        setIsProcessing(true);
        
        try {
            const shippingData = {
                fullName: selectedAddress.fullName,
                street: selectedAddress.street,
                city: selectedAddress.city,
                district: selectedAddress.district,
                state: selectedAddress.state,
                pincode: selectedAddress.pincode,
                phone: selectedAddress.phone
            };

            const orderPayload = { 
                shippingAddress: shippingData,
                paymentMethod: paymentMethod,
                couponCode: appliedCoupon?.code
            };

            const backendOrder = await orderAPI.createOrder(orderPayload);
            
            if (!backendOrder.success) {
                throw new Error(backendOrder.message || "Failed to create order");
            }

            if (paymentMethod === 'COD') {
                toast.success("Order Placed Successfully!");
                dispatch(clearCart());
                navigate('/order-confirmation', { 
                    state: { 
                        order: backendOrder.data
                    } 
                });
                setIsProcessing(false);
                return;
            }

            // Razorpay Flow
            const { razorpayOrderId, amount, currency } = backendOrder.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: amount,
                currency: currency,
                name: "SmartShop AI",
                description: "Order Payment",
                order_id: razorpayOrderId,
                handler: async function (response) {
                    try {
                        setIsProcessing(true);
                        const verificationResult = await orderAPI.verifyPayment({
                            razorpayOrderId: razorpayOrderId,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        });

                        if (verificationResult.success) {
                            toast.success("Order Placed Successfully!");
                            dispatch(clearCart());
                            navigate('/order-confirmation', { 
                                state: { 
                                    order: verificationResult.data
                                } 
                            });
                        } else {
                            navigate('/payment-failure', { 
                                state: { 
                                    error: verificationResult.message || "Payment verification failed"
                                } 
                            });
                        }
                    } catch (err) {
                        console.error("Verification Error:", err);
                        navigate('/payment-failure', { 
                            state: { 
                                error: "An unexpected error occurred during payment verification."
                            } 
                        });
                    } finally {
                        setIsProcessing(false);
                    }
                },
                modal: {
                    ondismiss: function() {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: selectedAddress?.phone
                },
                theme: {
                    color: "#4f46e5"
                }
            };

            if (typeof window.Razorpay === 'undefined') {
                toast.error("Razorpay SDK not loaded. Please refresh.");
                setIsProcessing(false);
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Payment Initiation Error:", error);
            navigate('/payment-failure', { 
                state: { 
                    error: error.message || "We could not bridge the connection to the payment gateway."
                } 
            });
            setIsProcessing(false);
        }
    };

    const handleConfirmWalletOrder = async () => {
        if (walletOtp.length !== 6) {
            toast.error("Please enter a valid 6-digit code");
            return;
        }

        try {
            setIsVerifyingWallet(true);
            // Simulate backend call (In a real app, you'd send OTP to a verification endpoint)
            const backendOrder = await orderAPI.createOrder({
                shippingAddress: selectedAddress,
                paymentMethod: 'Wallet',
                couponCode: appliedCoupon?.code,
                walletOtp: walletOtp 
            });

            if (backendOrder.success) {
                toast.success("Order Placed Successfully!");
                dispatch(clearCart());
                navigate('/order-confirmation', { 
                    state: { order: backendOrder.data } 
                });
                setShowWalletModal(false);
            } else {
                toast.error(backendOrder.message || "Invalid verification code");
            }
        } catch (error) {
            console.error("Wallet Order Error:", error);
            toast.error("Wallet payment failed. Please try again.");
        } finally {
            setIsVerifyingWallet(false);
        }
    };

    if (loading) return <Loader fullScreen text="Preparing securing checkout..." />;

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="w-32 h-32 bg-indigo-50 rounded-3xl flex items-center justify-center mb-8 rotate-3">
                    <Package className="w-16 h-16 text-indigo-600 -rotate-3" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2">Cart is empty</h2>
                <button onClick={() => navigate('/products')} className="text-indigo-600 font-black uppercase tracking-widest text-xs mt-4">Browse Products</button>
            </div>
        );
    }

    return (
        <>
        <div className="w-full py-12 max-w-7xl mx-auto px-4">
            <Breadcrumbs 
                items={[
                    { label: 'Cart', link: '/cart' },
                    { label: 'Checkout' }
                ]} 
                className="mb-8"
            />

            

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* ── LEFT: Address & Payment ── */}
                <div className="flex-grow space-y-6">
                    
                    {/* Shipping Address Section */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-indigo-600" />
                                Delivery Address
                            </h2>
                            <button 
                                onClick={() => navigate('/profile')}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                                <Plus className="w-3.5 h-3.5" /> Manage Addresses
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {addresses.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-sm text-slate-400 mb-4">No addresses found</p>
                                    <button onClick={() => navigate('/profile')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold">Add Address</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((addr) => (
                                        <div 
                                            key={addr._id}
                                            onClick={() => setSelectedAddress(addr)}
                                            className={`p-5 rounded-xl border-2 cursor-pointer transition-all relative ${
                                                selectedAddress?._id === addr._id 
                                                ? 'border-indigo-600 bg-indigo-50/30' 
                                                : 'border-slate-100 hover:border-slate-200 bg-white'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-bold text-slate-800">{addr.fullName}</p>
                                                {selectedAddress?._id === addr._id && (
                                                    <CheckCircle className="w-5 h-5 text-indigo-600 fill-indigo-50" />
                                                )}
                                            </div>
                                            <div className="text-sm text-slate-500 space-y-1">
                                                <p>{addr.street}</p>
                                                <p>{addr.city}, {addr.district}, {addr.state}</p>
                                                <p className="font-semibold text-slate-700">{addr.pincode}</p>
                                                <p className="pt-2 text-xs text-slate-400">Phone: {addr.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Method Section */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">Payment Method</h2>
                        </div>
                        <div className="p-6 space-y-3">
                            {/* Razorpay Option */}
                            <div 
                                onClick={() => setPaymentMethod('Razorpay')}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    paymentMethod === 'Razorpay' 
                                    ? 'border-indigo-200 bg-indigo-50/40' 
                                    : 'border-slate-50 hover:border-slate-100'
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    paymentMethod === 'Razorpay' ? 'border-indigo-600' : 'border-slate-300'
                                }`}>
                                    {paymentMethod === 'Razorpay' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                                </div>
                                <CreditCard className={`w-6 h-6 ${paymentMethod === 'Razorpay' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                <div className="flex-grow">
                                    <p className="font-bold text-slate-800 text-sm">Pay with Razorpay</p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Cards, UPI, Net Banking, Wallets</p>
                                </div>
                            </div>

                            {/* COD Option */}
                            <div 
                                onClick={() => setPaymentMethod('COD')}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    paymentMethod === 'COD' 
                                    ? 'border-indigo-200 bg-indigo-50/40' 
                                    : 'border-slate-50 hover:border-slate-100'
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    paymentMethod === 'COD' ? 'border-indigo-600' : 'border-slate-300'
                                }`}>
                                    {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                                </div>
                                <Truck className={`w-6 h-6 ${paymentMethod === 'COD' ? 'text-emerald-500' : 'text-slate-400'}`} />
                                <div className="flex-grow">
                                    <p className="font-bold text-slate-800 text-sm">Cash on Delivery</p>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Pay when you receive</p>
                                </div>
                            </div>

                            {/* Wallet Option */}
                            <div 
                                onClick={() => setPaymentMethod('Wallet')}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    paymentMethod === 'Wallet' 
                                    ? 'border-indigo-200 bg-indigo-50/40' 
                                    : 'border-slate-50 hover:border-slate-100'
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                    paymentMethod === 'Wallet' ? 'border-indigo-600' : 'border-slate-300'
                                }`}>
                                    {paymentMethod === 'Wallet' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                                </div>
                                <Wallet className={`w-6 h-6 shrink-0 ${paymentMethod === 'Wallet' ? 'text-indigo-500' : 'text-slate-400'}`} />
                                <div className="flex-grow">
                                    <div className="flex items-center gap-3">
                                        <p className="font-bold text-slate-800 text-sm">Wallet</p>
                                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-md">
                                            ₹{(user?.wallet?.balance || 0).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Pay from your wallet balance</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <Package className="w-5 h-5 text-indigo-600" />
                                Order Items ({selectedItems.length})
                            </h2>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {selectedItems.map((item) => (
                                <div key={item.product?._id} className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                                    <div className="w-14 h-14 bg-white rounded-lg border border-slate-100 p-1 shrink-0 overflow-hidden">
                                        <img src={item.product?.images?.[0]} alt={item.product?.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{item.product?.name}</p>
                                        <p className="text-xs text-slate-500 mt-0.5 font-medium">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Back Button */}
                    <button 
                        onClick={() => navigate('/cart')}
                        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors py-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Cart
                    </button>
                </div>

                {/* ── RIGHT: Summary Sidebar ── */}
                <div className="w-full lg:w-[400px] shrink-0 sticky top-28">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 space-y-6">
                            <h3 className="text-xl font-bold text-slate-800">Order Summary</h3>
                            
                            {/* Items List */}
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                {selectedItems.map((item) => (
                                    <div key={item.product?._id} className="flex items-center gap-4 relative">
                                        <div className="w-16 h-16 bg-white rounded-lg border border-slate-100 p-1 shrink-0 relative">
                                            <img src={item.product?.images?.[0]} alt={item.product?.name} className="w-full h-full object-contain" />
                                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-slate-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
                                                {item.product?.name}
                                            </p>
                                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                                {item.variant || 'Standard Version'}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-bold text-slate-900">
                                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <div className="flex justify-between text-base text-slate-600">
                                    <span>Subtotal:</span>
                                    <span className="font-medium text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-base text-slate-600">
                                    <span>Shipping:</span>
                                    <span className="font-bold text-emerald-500">Free</span>
                                </div>

                                <div className="flex justify-between text-base">
                                    <span className="text-emerald-500 font-medium">Coupon ({appliedCoupon?.code || 'None'})</span>
                                    <span className="text-emerald-500 font-bold">
                                        {discount > 0 ? `-₹${discount.toLocaleString('en-IN')}` : '₹0'}
                                    </span>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-lg font-bold text-slate-800">Total:</span>
                                    <span className="text-xl font-bold text-slate-900">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            {/* Delivering To Section */}
                            {selectedAddress && (
                                <div className="pt-6 border-t border-slate-100 space-y-3">
                                    <div className="flex items-center gap-2 text-emerald-500">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="text-[11px] font-black uppercase tracking-wider">Delivering To</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-800">{selectedAddress.fullName}</p>
                                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                            {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handlePayment}
                                disabled={isProcessing || !selectedAddress}
                                className={`w-full bg-[#2D0081] hover:bg-[#1e0057] text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] ${
                                    isProcessing || !selectedAddress ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay & Place Order
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* Wallet Verification Modal */}
        {showWalletModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <Mail className="w-6 h-6 text-indigo-600" />
                            </div>
                            <button 
                                onClick={() => setShowWalletModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Verify Your Order</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                            We've sent a 6-digit verification code to <span className="text-slate-900 font-bold">{user?.email || 'your email'}</span>. Please enter it below to confirm your Wallet Payment order.
                        </p>

                        <div className="space-y-6">
                            <input 
                                type="text"
                                maxLength={6}
                                value={walletOtp}
                                onChange={(e) => setWalletOtp(e.target.value.replace(/\D/g, ''))}
                                placeholder="Enter 6-digit code"
                                className="w-full text-center py-5 rounded-2xl border-2 border-slate-100 text-2xl font-black tracking-[0.5em] focus:border-indigo-600 focus:outline-none transition-all placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-bold placeholder:text-lg"
                            />

                            <button 
                                onClick={handleConfirmWalletOrder}
                                disabled={isVerifyingWallet || walletOtp.length !== 6}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                                    isVerifyingWallet || walletOtp.length !== 6
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-[#7C74B1] text-white hover:bg-[#6860a1] shadow-lg shadow-indigo-200'
                                }`}
                            >
                                {isVerifyingWallet ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Confirm Order
                                    </>
                                )}
                            </button>

                            <div className="text-center">
                                <button 
                                    className="text-indigo-600 text-sm font-black hover:underline"
                                    onClick={async () => {
                                        try {
                                            await orderAPI.sendWalletOTP();
                                            toast.success("Verification code resent successfully");
                                            setWalletOtp('');
                                        } catch (error) {
                                            toast.error("Failed to resend code");
                                        }
                                    }}
                                >
                                    Didn't receive code? Resend
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-50/80 px-8 py-4 border-t border-slate-100 flex justify-center items-center">
                        <p className="text-[11px] font-bold text-slate-500">
                            Order Amount: <span className="text-slate-900 font-black">₹{total.toLocaleString('en-IN')}</span>
                        </p>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default CheckoutPage;
