import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const OrderConfirmationPage = () => {
    const location = useLocation();
    const orderData = location.state?.order;
    
    // Fallback ID if orderData is missing (for direct navigation/testing)
    const orderId = orderData?._id || orderData?.id || "ORD-" + Math.floor(100000 + Math.random() * 900000);

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-white px-4">
            <div className="max-w-md w-full text-center">
                {/* Success Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 bg-[#E6F9F1] rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                        <Check className="w-12 h-12 text-[#00D27B]" strokeWidth={3} />
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-4xl font-black text-[#1A1A2E] mb-4 tracking-tight">
                    Order Placed Successfully!
                </h1>
                <p className="text-slate-500 text-lg font-medium mb-10 leading-relaxed">
                    Thank you for your purchase. Your order is being processed.
                </p>

                {/* Order ID Card */}
                <div className="mb-12">
                    <h2 className="text-2xl font-black text-[#1A1A2E]">
                        Order ID: <span className="text-[#1A1A2E]">#{orderId}</span>
                    </h2>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Link 
                        to={`/orders/#${orderId}`}
                        className="block w-full py-4 bg-[#1A0066] text-white rounded-xl font-bold text-lg hover:bg-[#2A0088] transition-all active:scale-[0.98] shadow-lg shadow-indigo-100"
                    >
                        Track Order
                    </Link>
                    
                    <Link 
                        to="/products"
                        className="block w-full py-4 bg-white text-[#1A1A2E] border-2 border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all active:scale-[0.98]"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
