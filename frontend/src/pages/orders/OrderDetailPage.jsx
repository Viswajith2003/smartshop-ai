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
import Breadcrumbs from '../../components/common/Breadcrumbs';
import { API_CONFIG } from '../../config/app';

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
            case 'shipped': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
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
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-all mb-8 group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Back to Orders</span>
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">
                                #{order.paymentDetails?.razorpayOrderId?.split('_')[1] || order._id.toUpperCase().substring(0, 10)}
                            </h2>
                            <p className="text-sm font-bold text-slate-400">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}
                            </p>
                        </div>
                        <span className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${getStatusStyles(order.orderStatus)}`}>
                            {order.orderStatus}
                        </span>
                    </div>

                    {/* Order Stepper */}
                    <div className="max-w-4xl mx-auto py-10">
                        <div className="relative">
                            {/* Connector Line */}
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2"></div>
                            <div 
                                className="absolute top-1/2 left-0 h-[2px] bg-emerald-500 -translate-y-1/2 transition-all duration-1000"
                                style={{ width: `${(Math.max(0, ['Processing', 'Confirmed', 'Shipped', 'Delivered'].indexOf(order.orderStatus)) / 3) * 100}%` }}
                            ></div>

                            <div className="relative flex justify-between">
                                {['Processing', 'Confirmed', 'Shipped', 'Delivered'].map((step, idx) => {
                                    const statuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];
                                    const currentIndex = statuses.indexOf(order.orderStatus);
                                    const isCompleted = idx <= currentIndex;
                                    
                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 z-10 transition-all duration-500 ${isCompleted ? 'bg-emerald-500 border-emerald-100 text-white shadow-lg shadow-emerald-100' : 'bg-white border-slate-50 text-slate-200'}`}>
                                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-slate-200"></div>}
                                            </div>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                {step}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {order.orderStatus === 'Delivered' && (
                            <p className="text-center text-xs font-bold text-emerald-500 mt-10">
                                Order delivered on {new Date(order.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} at {new Date(order.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Items Section */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-10 border-b border-slate-50 flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <Package className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Items ({order.items?.length})</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="p-10 flex items-center gap-8 hover:bg-slate-50/50 transition-all group">
                                    <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-2 flex-shrink-0 group-hover:scale-105 transition-transform">
                                        <img 
                                            src={`${API_CONFIG.baseURL.replace('/api', '')}${item.product?.images?.[0]}`}
                                            alt={item.product?.name} 
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-grow space-y-2">
                                        <h4 className="text-sm font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">{item.product?.name}</h4>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                            {item.variant || 'Standard'} <span className="mx-2 text-slate-200">|</span> x {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-lg font-black text-slate-900 tracking-tight">₹{item.price?.toLocaleString('en-IN')}</p>
                                        {item.product?.originalPrice > item.price && (
                                            <p className="text-[11px] font-bold text-slate-300 line-through">₹{item.product.originalPrice?.toLocaleString('en-IN')}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping & Payment Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-10 flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                Shipping Address
                            </h3>
                            <div className="space-y-4">
                                <p className="text-base font-black text-slate-900">{order.shippingAddress?.fullName}</p>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-400 leading-relaxed">
                                        {order.shippingAddress?.street || order.shippingAddress?.addressLine}
                                    </p>
                                    <p className="text-sm font-bold text-slate-400 leading-relaxed">
                                        {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode || order.shippingAddress?.postalCode}
                                    </p>
                                </div>
                                <div className="pt-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-black text-slate-600">{order.shippingAddress?.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-10 flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                Payment
                            </h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-400">Method</span>
                                    <span className="text-sm font-black text-slate-900 uppercase">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-slate-400">Status</span>
                                    <span className={`text-sm font-black uppercase ${order.paymentStatus === 'Completed' || order.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Card */}
                    {(order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Returned') && (
                        <div className="bg-white rounded-[2rem] p-10 border border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Need help with this order?</h3>
                                <p className="text-xs font-bold text-slate-400">You can cancel or return your order within the eligible period.</p>
                            </div>
                            <div className="flex gap-4">
                                {(order.orderStatus === 'Processing' || order.orderStatus === 'Confirmed') && (
                                    <button 
                                        onClick={() => handleOpenModal('cancel')}
                                        className="bg-white border border-rose-100 text-rose-500 font-black px-8 py-4 rounded-2xl hover:bg-rose-50 transition-all uppercase tracking-widest text-[10px] flex items-center gap-3"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Cancel Order
                                    </button>
                                )}
                                {order.orderStatus === 'Delivered' && (
                                    <button 
                                        onClick={() => handleOpenModal('return')}
                                        className="bg-slate-900 text-white font-black px-10 py-4 rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl shadow-slate-200"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Return Order
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reusable Action Modal */}
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={handleCloseModal}
                title={modalConfig.type === 'cancel' ? 'Cancel Order' : 'Return Order'}
                maxWidth="max-w-md"
            >
                <div className="space-y-6">
                    <div className={`p-5 rounded-2xl border ${modalConfig.type === 'cancel' ? 'bg-rose-50 border-rose-100' : 'bg-indigo-50 border-indigo-100'}`}>
                        <p className={`text-[11px] font-bold leading-relaxed ${modalConfig.type === 'cancel' ? 'text-rose-600' : 'text-indigo-600'}`}>
                            {modalConfig.type === 'cancel' 
                                ? "Are you sure you want to cancel? The amount will be refunded to your wallet instantly upon approval."
                                : "Please provide a reason for return. Our team will review and update your wallet after pick-up."
                            }
                        </p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reason for {modalConfig.type}</label>
                        <textarea
                            value={modalConfig.reason}
                            onChange={(e) => setModalConfig(prev => ({ ...prev, reason: e.target.value }))}
                            placeholder={`Write your reason here...`}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all min-h-[140px] resize-none"
                        />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={handleCloseModal}
                            className="flex-1 bg-slate-100 text-slate-500 font-black py-5 rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleActionSubmit}
                            disabled={actionLoading || !modalConfig.reason.trim()}
                            className={`flex-1 font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-[10px] shadow-xl ${
                                modalConfig.type === 'cancel' 
                                    ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-100' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                            } disabled:opacity-50`}
                        >
                            {actionLoading ? 'Processing...' : `Confirm ${modalConfig.type}`}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OrderDetailPage;
