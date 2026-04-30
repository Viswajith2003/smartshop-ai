import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle, AlertCircle, RefreshCw, ShoppingCart, ArrowLeft } from 'lucide-react';

const PaymentFailurePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { error } = location.state || { error: "Your payment could not be processed at this time." };

    return (
        <div className="min-h-screen bg-slate-50/50 py-20 px-4 flex items-center justify-center">
            <div className="max-w-xl w-full">
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-rose-200/20 border border-rose-100 overflow-hidden text-center p-12 sm:p-16 relative">
                    
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-50 rounded-full -ml-16 -mb-16 blur-2xl opacity-50"></div>

                    {/* Icon Section */}
                    <div className="relative mb-10">
                        <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto animate-bounce duration-[2000ms]">
                            <XCircle className="w-12 h-12 text-rose-500" />
                        </div>
                        <div className="absolute -top-1 -right-1">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                                <AlertCircle className="w-5 h-5 text-amber-500" />
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Payment Failed</h1>
                    <p className="text-slate-500 font-bold mb-10 leading-relaxed">
                        {error}
                        <br />
                        <span className="text-xs uppercase tracking-widest text-slate-400 block mt-4">No funds were deducted from your account.</span>
                    </p>

                    {/* Common Reasons */}
                    <div className="bg-slate-50 rounded-3xl p-6 mb-10 text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Common reasons for failure:</p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                <div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div>
                                Incorrect payment details or expired card
                            </li>
                            <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                <div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div>
                                Insufficient funds in account
                            </li>
                            <li className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                <div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div>
                                Transaction declined by your bank
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                            onClick={() => navigate('/checkout')}
                            className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry Payment
                        </button>
                        <button 
                            onClick={() => navigate('/cart')}
                            className="flex items-center justify-center gap-3 bg-white text-slate-900 border-2 border-slate-100 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all active:scale-95"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Back to Cart
                        </button>
                    </div>

                    <button 
                        onClick={() => navigate('/products')}
                        className="mt-10 inline-flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline underline-offset-8"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Continue Shopping
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                        Secure Checkout Powered by Razorpay
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailurePage;
