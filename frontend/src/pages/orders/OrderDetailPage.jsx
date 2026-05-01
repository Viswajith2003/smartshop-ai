import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { 
    Package, 
    Truck, 
    CheckCircle2, 
    Clock, 
    ChevronLeft, 
    ShoppingBag, 
    XCircle, 
    RotateCcw, 
    MapPin, 
    CreditCard, 
    Calendar,
    Phone,
    Mail,
    User,
    ArrowRight,
    AlertCircle
} from 'lucide-react';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../../features/auth/authSlice';
import { authAPI } from '../../features/auth/authAPI';
import Modal from '../../components/common/Modal';

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Modal State for Cancel/Return
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: 'cancel', // 'cancel' or 'return'
        reason: ''
    });

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await orderAPI.getOrderById(id);
            if (response.success) {
                setOrder(response.data);
            } else {
                toast.error(response.message || "Failed to fetch order details");
                navigate('/my-orders');
            }
        } catch (err) {
            console.error("Fetch Order Detail Error:", err);
            toast.error("An error occurred while fetching order details");
            navigate('/my-orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchOrderDetails();
    }, [id]);

    const refreshUserWallet = async () => {
        try {
            const response = await authAPI.getProfile();
            if (response.success) {
                dispatch(updateUserInfo(response.data));
            }
        } catch (err) {
            console.error("Profile Refresh Error:", err);
        }
    };

    const handleOpenModal = (type) => {
        setModalConfig({
            isOpen: true,
            type,
            reason: ''
        });
    };

    const handleCloseModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const handleActionSubmit = async () => {
        const { type, reason } = modalConfig;
        
        if (!reason.trim()) {
            toast.warning(`Please provide a reason for ${type === 'cancel' ? 'cancellation' : 'return'}`);
            return;
        }

        try {
            setActionLoading(true);
            const response = type === 'cancel' 
                ? await orderAPI.cancelOrder(id, reason)
                : await orderAPI.returnOrder(id, reason);

            if (response.success) {
                toast.success(type === 'cancel' 
                    ? "Order cancelled successfully!" 
                    : "Return processed successfully!"
                );
                await fetchOrderDetails();
                await refreshUserWallet();
                handleCloseModal();
            } else {
                toast.error(response.message || `Failed to ${type} order`);
            }
        } catch (err) {
            toast.error(`Error processing ${type} request`);
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'processing': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'returned': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const getTimelineStepStatus = (step, currentStatus) => {
        const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
        const currentIndex = statuses.indexOf(currentStatus);
        const stepIndex = statuses.indexOf(step);

        if (currentStatus === 'Cancelled') return 'cancelled';
        if (currentStatus === 'Returned') return 'returned';
        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'active';
        return 'upcoming';
    };

    if (loading) return <Loader fullScreen text="Loading order details..." />;
    if (!order) return null;

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Back Button & Header */}
                <div className="mb-10">
                    <button 
                        onClick={() => navigate('/my-orders')}
                        className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-all mb-6"
                    >
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest">Back to Orders</span>
                    </button>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Order Detail</h1>
                            <div className="flex items-center gap-3 mt-3">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order ID:</span>
                                <span className="bg-white border border-slate-200 px-3 py-1 rounded-lg text-xs font-black text-slate-900 shadow-sm">
                                    #{order.paymentDetails?.razorpayOrderId || order._id.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(order.orderStatus)}`}>
                                {order.orderStatus}
                            </span>
                            <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${order.paymentStatus === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Order Items & Timeline */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Timeline Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-10 flex items-center gap-3">
                                <Clock className="w-5 h-5 text-indigo-600" />
                                Order Timeline
                            </h3>
                            
                            <div className="relative flex justify-between items-start max-w-2xl mx-auto">
                                {/* Connecting Line */}
                                <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-100 -z-0"></div>
                                
                                {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                                    const status = getTimelineStepStatus(step, order.orderStatus);
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-4 relative z-10 w-1/4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-4 ${
                                                status === 'completed' ? 'bg-indigo-600 border-indigo-100 text-white' :
                                                status === 'active' ? 'bg-white border-indigo-600 text-indigo-600 scale-110 shadow-lg shadow-indigo-100' :
                                                'bg-white border-slate-100 text-slate-200'
                                            }`}>
                                                {status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
                                                 idx === 0 ? <ShoppingBag className="w-4 h-4" /> :
                                                 idx === 1 ? <Clock className="w-4 h-4" /> :
                                                 idx === 2 ? <Truck className="w-4 h-4" /> :
                                                 <Package className="w-4 h-4" />}
                                            </div>
                                            <div className="text-center">
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${status === 'active' ? 'text-indigo-600' : 'text-slate-400'}`}>
                                                    {step}
                                                </p>
                                                {status === 'active' && <p className="text-[9px] font-bold text-slate-400 mt-0.5">In Progress</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Items Card */}
                        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                    <Package className="w-5 h-5 text-indigo-600" />
                                    Order Items ({order.items.length})
                                </h3>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="p-8 flex items-center gap-6 hover:bg-slate-50/50 transition-colors group">
                                        <div className="w-24 h-24 bg-white rounded-3xl overflow-hidden border border-slate-100 p-3 flex-shrink-0 group-hover:border-indigo-100 transition-all shadow-sm">
                                            <img 
                                                src={item.product?.images?.[0] || 'https://via.placeholder.com/150'} 
                                                alt={item.product?.name} 
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <Link to={`/products/${item.product?._id}`} className="text-base font-black text-slate-900 hover:text-indigo-600 transition-colors leading-tight">
                                                {item.product?.name || 'Product Details'}
                                            </Link>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                                                Quantity: {item.quantity} × ₹{item.price?.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-slate-900 tracking-tighter">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary & Customer Info */}
                    <div className="space-y-8">
                        {/* Pricing Card */}
                        <div className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-xl shadow-indigo-100 text-white relative overflow-hidden">
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2 opacity-80">
                                <CreditCard className="w-4 h-4" />
                                Payment Summary
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center opacity-80">
                                    <span className="text-[11px] font-bold uppercase tracking-widest">Subtotal</span>
                                    <span className="font-bold">₹{order.pricing?.totalPrice?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center opacity-80">
                                    <span className="text-[11px] font-bold uppercase tracking-widest">Shipping</span>
                                    <span className="font-bold">FREE</span>
                                </div>
                                <div className="pt-6 mt-2 border-t border-white/20 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">Total Amount</p>
                                        <p className="text-3xl font-black tracking-tighter">₹{order.pricing?.totalPrice?.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Via {order.paymentMethod}</p>
                                        <span className="bg-white/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer & Shipping Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-indigo-600" />
                                Shipping Details
                            </h3>
                            
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                                        <p className="text-sm font-bold text-slate-900">{order.shippingAddress?.fullName}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                                        <p className="text-sm font-bold text-slate-900">{order.shippingAddress?.phone}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</p>
                                        <p className="text-sm font-bold text-slate-900 leading-snug">
                                            {order.shippingAddress?.addressLine},<br />
                                            {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                                            {order.shippingAddress?.postalCode}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions Card */}
                        {(order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Returned') && (
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-indigo-600" />
                                    Order Actions
                                </h3>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    {(order.orderStatus === 'Pending' || order.orderStatus === 'Processing') && (
                                        <button 
                                            onClick={() => handleOpenModal('cancel')}
                                            className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Cancel Order
                                        </button>
                                    )}
                                    {order.orderStatus === 'Delivered' && (
                                        <button 
                                            onClick={() => handleOpenModal('return')}
                                            className="w-full bg-slate-900 text-white hover:bg-slate-800 font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Return Order
                                        </button>
                                    )}
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold text-center mt-6 leading-relaxed">
                                    Refunds are processed automatically to your wallet after approval.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cancellation/Return Reason Modal */}
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={handleCloseModal}
                title={modalConfig.type === 'cancel' ? 'Cancel Order' : 'Return Order'}
                maxWidth="max-w-md"
            >
                <div className="space-y-6">
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <p className="text-xs text-amber-700 font-bold leading-relaxed">
                            {modalConfig.type === 'cancel' 
                                ? "Are you sure you want to cancel this order? The total amount will be refunded to your SmartShop Wallet immediately."
                                : "Please provide a reason for returning this order. Once processed, the refund will be added to your wallet."
                            }
                        </p>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                            Reason for {modalConfig.type === 'cancel' ? 'Cancellation' : 'Return'}
                        </label>
                        <textarea
                            value={modalConfig.reason}
                            onChange={(e) => setModalConfig(prev => ({ ...prev, reason: e.target.value }))}
                            placeholder={`Tell us why you want to ${modalConfig.type} this order...`}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all min-h-[120px] resize-none"
                        />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={handleCloseModal}
                            className="flex-1 bg-slate-100 text-slate-600 font-black py-4 rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[11px]"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleActionSubmit}
                            disabled={actionLoading || !modalConfig.reason.trim()}
                            className={`flex-1 font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-[11px] shadow-lg ${
                                modalConfig.type === 'cancel' 
                                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/20' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'
                            } disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed`}
                        >
                            {actionLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                `Confirm ${modalConfig.type === 'cancel' ? 'Cancel' : 'Return'}`
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OrderDetailPage;
