import React, { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import { Package, Truck, CheckCircle, Clock, ChevronRight, ShoppingBag, Eye, XCircle, RotateCcw, LayoutGrid, List } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../../features/auth/authSlice';
import { authAPI } from '../../features/auth/authAPI';

import Modal from '../../components/common/Modal';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    
    // Modal State
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        orderId: null,
        type: 'cancel', // 'cancel' or 'return'
        reason: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const fetchOrders = async () => {
        try {
            const response = await orderAPI.getMyOrders();
            if (response.success) {
                setOrders(response.data);
            } else {
                toast.error(response.message || "Failed to fetch orders");
            }
        } catch (err) {
            console.error("Fetch Orders Error:", err);
            toast.error("An error occurred while fetching your orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleOpenModal = (orderId, type) => {
        setModalConfig({
            isOpen: true,
            orderId,
            type,
            reason: ''
        });
    };

    const handleCloseModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const handleActionSubmit = async () => {
        const { orderId, type, reason } = modalConfig;
        
        if (!reason.trim()) {
            toast.warning(`Please provide a reason for ${type === 'cancel' ? 'cancellation' : 'return'}`);
            return;
        }

        try {
            setActionLoading(true);
            const response = type === 'cancel' 
                ? await orderAPI.cancelOrder(orderId, reason)
                : await orderAPI.returnOrder(orderId, reason);

            if (response.success) {
                toast.success(type === 'cancel' 
                    ? "Order cancelled and refund issued to wallet!" 
                    : "Return processed and refund issued to wallet!"
                );
                await fetchOrders();
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
            case 'delivered':
                return 'bg-emerald-100 text-emerald-700';
            case 'shipped':
                return 'bg-blue-100 text-blue-700';
            case 'processing':
                return 'bg-amber-100 text-amber-700';
            case 'cancelled':
                return 'bg-rose-100 text-rose-700';
            case 'returned':
                return 'bg-amber-100 text-amber-700';
            case 'pending':
                return 'bg-slate-100 text-slate-700';
            default:
                return 'bg-indigo-100 text-indigo-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return <CheckCircle className="w-4 h-4" />;
            case 'shipped':
                return <Truck className="w-4 h-4" />;
            case 'processing':
                return <Clock className="w-4 h-4" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            case 'returned':
                return <RotateCcw className="w-4 h-4" />;
            default:
                return <Package className="w-4 h-4" />;
        }
    };

    if (loading) return <Loader fullScreen text="Retreiving your order history..." />;

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                            <ShoppingBag className="w-10 h-10 text-indigo-600" />
                            My Orders
                        </h1>
                        <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">Track and manage your recent purchases</p>
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 items-center gap-1">
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
                            title="List View"
                        >
                            <List className="w-5 h-5" />
                            <span className={`text-[10px] font-black uppercase tracking-widest pr-1 ${viewMode === 'list' ? 'block' : 'hidden md:block'}`}>List</span>
                        </button>
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'}`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-5 h-5" />
                            <span className={`text-[10px] font-black uppercase tracking-widest pr-1 ${viewMode === 'grid' ? 'block' : 'hidden md:block'}`}>Grid</span>
                        </button>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-slate-100">
                        <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Package className="w-16 h-16 text-indigo-200" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-4">No orders found yet</h2>
                        <p className="text-slate-500 font-bold mb-8 max-w-md mx-auto">Looks like you haven't placed any orders yet. Start shopping to see them here!</p>
                        <Link 
                            to="/products" 
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className={viewMode === 'list' ? "space-y-8" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"}>
                        {orders.map((order) => (
                            <div 
                                key={order._id}
                                className={`bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:border-indigo-100 transition-all group flex flex-col ${viewMode === 'grid' ? 'h-full hover:shadow-xl hover:-translate-y-1' : ''}`}
                            >
                                {/* Order Header */}
                                <div className={`p-8 sm:px-10 border-b border-slate-50 flex flex-wrap items-center justify-between gap-6 bg-slate-50/30 ${viewMode === 'grid' ? 'flex-col items-start !p-6' : ''}`}>
                                    <div className={`flex flex-wrap items-center gap-10 ${viewMode === 'grid' ? 'flex-col items-start gap-4' : ''}`}>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Order ID</p>
                                            <p className="text-sm font-black text-slate-900 tracking-tighter">#{order.paymentDetails?.razorpayOrderId || order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <div className={viewMode === 'grid' ? 'flex justify-between w-full gap-4' : ''}>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Date</p>
                                                <p className="text-sm font-bold text-slate-700">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total</p>
                                                <p className="text-sm font-black text-indigo-600">₹{order.pricing?.totalPrice?.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-3 ${viewMode === 'grid' ? 'w-full justify-between mt-2 pt-4 border-t border-slate-100' : ''}`}>
                                        <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${getStatusStyles(order.orderStatus)}`}>
                                            {getStatusIcon(order.orderStatus)}
                                            {viewMode === 'grid' ? '' : order.orderStatus}
                                        </span>
                                        {/* Status Badge for Payment */}
                                        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${order.paymentStatus === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {order.paymentStatus === 'Completed' ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className={`p-8 sm:px-10 flex-grow ${viewMode === 'grid' ? '!p-6' : ''}`}>
                                    <div className={viewMode === 'list' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
                                        {order.items.slice(0, viewMode === 'grid' ? 2 : 3).map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 p-2">
                                                    <img 
                                                        src={item.product?.images?.[0] || 'https://via.placeholder.com/100'} 
                                                        alt={item.product?.name} 
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-bold text-slate-900 text-xs truncate">{item.product?.name || 'Product Details'}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > (viewMode === 'grid' ? 2 : 3) && (
                                            <div className="flex items-center justify-center p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">+{order.items.length - (viewMode === 'grid' ? 2 : 3)} more</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className={`mt-10 pt-8 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4 ${viewMode === 'grid' ? 'mt-6 pt-6 flex-col !items-stretch' : ''}`}>
                                        <div className={`flex flex-wrap items-center gap-4 ${viewMode === 'grid' ? 'flex-col' : ''}`}>
                                            <button 
                                                onClick={() => navigate(`/orders/${order._id}`)}
                                                className={`inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 ${viewMode === 'grid' ? 'w-full' : ''}`}
                                            >
                                                <Eye className="w-4 h-4" />
                                                Details
                                            </button>

                                            <div className={`flex gap-3 ${viewMode === 'grid' ? 'w-full' : ''}`}>
                                                {order.orderStatus === 'Delivered' && (
                                                    <button 
                                                        onClick={() => handleOpenModal(order._id, 'return')}
                                                        disabled={actionLoading}
                                                        className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all hover:bg-slate-50 text-[10px] uppercase tracking-widest"
                                                    >
                                                        Return
                                                    </button>
                                                )}
                                                {(order.orderStatus === 'Pending' || order.orderStatus === 'Processing') && (
                                                    <button 
                                                        onClick={() => handleOpenModal(order._id, 'cancel')}
                                                        disabled={actionLoading}
                                                        className="flex-1 bg-red-50 text-red-600 px-4 font-bold py-3 rounded-xl transition-all hover:bg-red-100 text-[10px] uppercase tracking-widest"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {viewMode === 'list' && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    Status: {order.orderStatus}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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

export default MyOrdersPage;
