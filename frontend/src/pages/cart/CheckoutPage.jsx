import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  Plus, 
  ShieldCheck, 
  ArrowLeft,
  ChevronRight,
  Package
} from 'lucide-react';
import { authAPI } from '../../features/auth/authAPI';
import { orderAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { clearCart } from '../../features/cart/cartSlice';
import Loader from '../../components/common/Loader';

import useCartCalculations from '../../hooks/useCartCalculations';

const CheckoutPage = () => {
    const { items, appliedCoupon } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // 'Razorpay' or 'COD'
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await authAPI.getProfile();
                const addressList = response.data.address || [];
                setAddresses(addressList);
                const defaultAddr = addressList.find(a => a.isDefault) || addressList[0];
                setSelectedAddress(defaultAddr);
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
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Stepper Header */}
                <div className="flex items-center justify-between mb-16 max-w-2xl mx-auto overflow-x-auto pb-4 px-4 scrollbar-hide">
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-emerald-500/20">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Cart</span>
                    </div>
                    <div className="w-12 h-0.5 bg-slate-200 flex-shrink-0"></div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-indigo-600/20 ring-4 ring-indigo-50">2</div>
                        <span className="text-xs font-black text-indigo-900 uppercase tracking-widest">Details</span>
                    </div>
                    <div className="w-12 h-0.5 bg-slate-200 flex-shrink-0"></div>
                    <div className="flex items-center gap-3 flex-shrink-0 opacity-40">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-black">3</div>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Success</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Left: Main Details */}
                    <div className="flex-grow space-y-10">
                        
                        {/* Address Selection */}
                        <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-slate-100">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                                        <MapPin className="w-8 h-8 text-indigo-600" />
                                        Shipping Address
                                    </h2>
                                    <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-widest">Where should we send your items?</p>
                                </div>
                                <button 
                                    onClick={() => navigate('/profile')}
                                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 active:scale-95"
                                >
                                    <Plus className="w-4 h-4" /> Add New
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {addresses.map((addr) => (
                                    <div 
                                        key={addr._id}
                                        onClick={() => setSelectedAddress(addr)}
                                        className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all relative group h-full flex flex-col ${selectedAddress?._id === addr._id ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-100 bg-white hover:border-indigo-200'}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <p className="font-black text-slate-900 text-lg pr-8 leading-tight">{addr.fullName}</p>
                                            {selectedAddress?._id === addr._id && (
                                                <div className="bg-indigo-600 text-white p-1 rounded-full">
                                                    <CheckCircle className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-sm text-slate-500 font-bold leading-relaxed flex-grow">
                                            {addr.street}, {addr.city}<br />
                                            {addr.state}, {addr.district}<br />
                                            <span className="text-slate-900 font-black">{addr.pincode}</span>
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact:</span>
                                            <span className="text-xs font-black text-slate-700 tracking-widest">{addr.phone}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {addresses.length === 0 && (
                                <div className="text-center py-16 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                    <MapPin className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No addresses found in your profile</p>
                                    <button onClick={() => navigate('/profile')} className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mt-4 hover:underline underline-offset-8">Go to Profile to Add</button>
                                </div>
                            )}
                        </div>

                        {/* Payment Selection */}
                        <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-slate-100">
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4 mb-10">
                                <CreditCard className="w-8 h-8 text-indigo-600" />
                                Payment Method
                            </h2>

                            <div className="space-y-6">
                                {/* Razorpay Option */}
                                <div 
                                    onClick={() => setPaymentMethod('Razorpay')}
                                    className={`p-8 rounded-[2.5rem] relative overflow-hidden group cursor-pointer transition-all border-2 ${paymentMethod === 'Razorpay' ? 'bg-slate-900 text-white border-slate-900 shadow-2xl' : 'bg-white text-slate-900 border-slate-100 hover:border-indigo-200'}`}
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-colors"></div>
                                    <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10 text-center sm:text-left">
                                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center backdrop-blur-xl border shadow-inner ${paymentMethod === 'Razorpay' ? 'bg-white/10 border-white/5' : 'bg-indigo-50 border-indigo-100'}`}>
                                            <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="w-10 h-10 rounded-full" />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center justify-center sm:justify-start gap-3">
                                                <p className="text-2xl font-black tracking-tight">Razorpay Secure</p>
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${paymentMethod === 'Razorpay' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>Recommended</span>
                                            </div>
                                            <p className={`text-xs font-bold uppercase tracking-widest mt-2 ${paymentMethod === 'Razorpay' ? 'text-slate-400' : 'text-slate-500'}`}>Support for Cards, UPI, Netbanking, & Wallets</p>
                                        </div>
                                        {paymentMethod === 'Razorpay' && (
                                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                                <CheckCircle className="w-6 h-6 text-indigo-400" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Selected</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* COD Option */}
                                <div 
                                    onClick={() => setPaymentMethod('COD')}
                                    className={`p-8 rounded-[2.5rem] relative overflow-hidden group cursor-pointer transition-all border-2 ${paymentMethod === 'COD' ? 'bg-slate-900 text-white border-slate-900 shadow-2xl' : 'bg-white text-slate-900 border-slate-100 hover:border-indigo-200'}`}
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-colors"></div>
                                    <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10 text-center sm:text-left">
                                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center backdrop-blur-xl border shadow-inner ${paymentMethod === 'COD' ? 'bg-white/10 border-white/5' : 'bg-emerald-50 border-emerald-100'}`}>
                                            <Package className={`w-10 h-10 ${paymentMethod === 'COD' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center justify-center sm:justify-start gap-3">
                                                <p className="text-2xl font-black tracking-tight">Cash on Delivery</p>
                                            </div>
                                            <p className={`text-xs font-bold uppercase tracking-widest mt-2 ${paymentMethod === 'COD' ? 'text-slate-400' : 'text-slate-500'}`}>Pay when you receive your package</p>
                                        </div>
                                        {paymentMethod === 'COD' && (
                                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                                <CheckCircle className="w-6 h-6 text-emerald-400" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Selected</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Preview */}
                        <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4 mb-10">
                                <Package className="w-8 h-8 text-indigo-600" />
                                Package Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {selectedItems.map((item) => (
                                    <div key={item.product?._id} className="flex items-center gap-5 p-4 rounded-3xl bg-slate-50 group hover:bg-indigo-50/30 transition-colors">
                                        <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 p-2 shadow-sm">
                                            <img src={item.product?.images?.[0]} alt={item.product?.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-slate-900 text-sm truncate">{item.product?.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity} • ₹{item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary & Action */}
                    <div className="lg:w-[420px] shrink-0">
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl sticky top-28 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>
                            
                            <h3 className="text-2xl font-black mb-10 tracking-tight flex items-center gap-3">
                                Total Summary
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
                                {discount > 0 && (
                                    <div className="flex justify-between text-emerald-400 font-bold text-sm">
                                        <span className="uppercase tracking-widest text-[10px]">Discount</span>
                                        <span>-₹{discount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="pt-6 mt-4 border-t border-white/5 flex justify-between items-center group">
                                    <span className="text-base font-black text-slate-300 uppercase tracking-tighter">Amount Payable</span>
                                    <span className="text-4xl font-black text-indigo-400 tracking-tighter group-hover:scale-105 transition-transform duration-300">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isProcessing || !selectedAddress}
                                className={`w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-[2rem] shadow-xl shadow-indigo-600/20 transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-[0.25em] text-xs flex items-center justify-center gap-3 group relative overflow-hidden ${isProcessing || !selectedAddress ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                {isProcessing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Securing Payment...</span>
                                    </div>
                                ) : (
                                    <>
                                        Confirm & Pay Now
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="mt-10 pt-10 border-t border-white/5 space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white/5 rounded-xl">
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Buyer Protection</p>
                                        <p className="text-[9px] text-slate-500 font-medium mt-1 leading-relaxed">Your payment is encrypted and secured by Razorpay's enterprise-grade infrastructure.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
