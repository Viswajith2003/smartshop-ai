import React, { useState, useEffect } from 'react';
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
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../../features/auth/authSlice';
import { authAPI } from '../../features/auth/authAPI';
import Modal from '../common/Modal';
import { API_CONFIG } from '../../config/app';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OrderDetailView = ({ orderId, onBack, onStatusUpdate }) => {
    const dispatch = useDispatch();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: 'cancel',
        reason: '',
        itemId: null
    });

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await orderAPI.getOrderById(orderId);
            if (response.success) {
                setOrder(response.data);
            } else {
                toast.error(response.message || "Failed to fetch order details");
                onBack();
            }
        } catch (err) {
            console.error("Fetch Order Detail Error:", err);
            toast.error("An error occurred while fetching order details");
            onBack();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orderId) fetchOrderDetails();
    }, [orderId]);

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

    const handleOpenModal = (type, itemId = null) => {
        setModalConfig({
            isOpen: true,
            type,
            reason: '',
            itemId
        });
    };

    const handleCloseModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const handleActionSubmit = async () => {
        const { type, reason, itemId } = modalConfig;
        
        if (!reason.trim()) {
            toast.warning(`Please provide a reason for ${type === 'cancel' || type === 'cancelItem' ? 'cancellation' : 'return'}`);
            return;
        }

        try {
            setActionLoading(true);
            let response;
            if (type === 'cancel') {
                response = await orderAPI.cancelOrder(orderId, reason);
            } else if (type === 'return') {
                response = await orderAPI.returnOrder(orderId, reason);
            } else if (type === 'cancelItem') {
                response = await orderAPI.cancelOrderItem(orderId, itemId, reason);
            } else if (type === 'returnItem') {
                response = await orderAPI.returnOrderItem(orderId, itemId, reason);
            }

            if (response.success) {
                toast.success(type.includes('cancel')
                    ? "Cancelled successfully!" 
                    : "Return processed successfully!"
                );
                await fetchOrderDetails();
                await refreshUserWallet();
                if (onStatusUpdate) onStatusUpdate();
                handleCloseModal();
            } else {
                toast.error(response.message || `Failed to ${type}`);
            }
        } finally {
            setActionLoading(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/150';
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        return `${API_CONFIG.baseURL.replace('/api', '')}${imagePath}`;
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

    const downloadInvoice = () => {
        if (!order) return;
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text('INVOICE', 14, 22);
        
        doc.setFontSize(12);
        doc.text(`Order ID: ${order._id}`, 14, 32);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 40);
        doc.text(`Payment Status: ${order.paymentStatus}`, 14, 48);

        if (order.shippingAddress) {
            doc.text('Billed To:', 14, 60);
            doc.setFontSize(10);
            doc.text(`${order.shippingAddress.fullName}`, 14, 68);
            doc.text(`${order.shippingAddress.street}, ${order.shippingAddress.city}`, 14, 74);
            doc.text(`${order.shippingAddress.state} - ${order.shippingAddress.pincode}`, 14, 80);
            doc.text(`Phone: ${order.shippingAddress.phone}`, 14, 86);
        }

        const tableColumn = ["Item", "Quantity", "Price", "Total"];
        const tableRows = [];

        order.items?.forEach(item => {
            const itemData = [
                item.product?.name || 'Unknown Item',
                item.quantity,
                `Rs. ${item.price}`,
                `Rs. ${item.price * item.quantity}`
            ];
            tableRows.push(itemData);
        });

        doc.autoTable({
            startY: 100,
            head: [tableColumn],
            body: tableRows,
        });

        const finalY = doc.lastAutoTable.finalY || 100;
        doc.setFontSize(12);
        doc.text(`Subtotal: Rs. ${order.pricing?.totalPrice || order.totalAmount}`, 14, finalY + 10);
        if (order.pricing?.discount > 0) {
            doc.text(`Discount: Rs. ${order.pricing.discount}`, 14, finalY + 18);
        }
        doc.setFontSize(14);
        doc.text(`Total Amount: Rs. ${order.totalAmount}`, 14, finalY + 28);

        doc.save(`invoice_${order._id}.pdf`);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Details...</p>
        </div>
    );
    
    if (!order) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500 pb-20">
            {/* Header Section */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 mb-8">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-all mb-8 group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs uppercase tracking-widest font-black">Back to Orders</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">
                            #{order.paymentDetails?.razorpayOrderId?.split('_')[1] || order._id.toUpperCase().slice(-8)}
                        </h2>
                        <p className="text-sm font-bold text-slate-400">
                            Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={downloadInvoice}
                            className="bg-indigo-50 text-indigo-600 font-black px-6 py-2 rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                        >
                            Download Invoice
                        </button>
                        <span className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(order.orderStatus)}`}>
                            {order.orderStatus}
                        </span>
                    </div>
                </div>

                {/* Order Stepper */}
                <div className="max-w-3xl mx-auto py-10">
                    <div className="relative">
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
                </div>
            </div>

            <div className="space-y-8">
                {/* Items Section */}
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-10 border-b border-slate-50 flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <Package className="w-5 h-5" />
                        </div>
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Ordered Items ({order.items?.length})</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {order.items?.map((item, idx) => (
                            <div key={idx} className="p-10 flex flex-col sm:flex-row items-center gap-8 hover:bg-slate-50/50 transition-all group">
                                <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-2 flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <img 
                                        src={getImageUrl(item.product?.images?.[0])}
                                        alt={item.product?.name} 
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="flex-grow space-y-2">
                                    <h4 className="text-sm font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">{item.product?.name}</h4>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                        Qty: {item.quantity} <span className="mx-2 text-slate-200">|</span> ₹{item.price?.toLocaleString('en-IN')} / unit
                                    </p>
                                    {item.status && (
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'Cancelled' ? 'text-rose-500' : 'text-slate-500'}`}>{item.status}</p>
                                    )}
                                </div>
                                <div className="text-right flex-shrink-0 flex flex-col items-end gap-3">
                                    <p className="text-lg font-black text-slate-900 tracking-tight">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                    {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Returned' && item.status !== 'Cancelled' && item.status !== 'Returned' && (
                                        <div className="flex gap-2">
                                            {(order.orderStatus === 'Processing' || order.orderStatus === 'Confirmed' || order.orderStatus === 'Pending') && (
                                                <button 
                                                    onClick={() => handleOpenModal('cancelItem', item.product?._id)}
                                                    className="text-[9px] font-black uppercase tracking-widest text-rose-500 border border-rose-200 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors"
                                                >
                                                    Cancel Item
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-slate-50 p-10 flex justify-between items-center">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Total Amount Paid</span>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Shipping */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <MapPin className="w-5 h-5" />
                            </div>
                            Delivery Address
                        </h3>
                        <div className="space-y-4">
                            <p className="text-sm font-black text-slate-900">{order.shippingAddress?.fullName}</p>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 leading-relaxed">
                                    {order.shippingAddress?.street}, {order.shippingAddress?.city}
                                </p>
                                <p className="text-xs font-bold text-slate-400 leading-relaxed">
                                    {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                                </p>
                            </div>
                            <div className="pt-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Phone className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs font-black text-slate-600">{order.shippingAddress?.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            Payment Details
                        </h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</span>
                                <span className="text-xs font-black text-slate-900 uppercase">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                                <span className={`text-xs font-black uppercase ${order.paymentStatus?.toLowerCase() === 'completed' || order.paymentStatus?.toLowerCase() === 'paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</span>
                                <span className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">{order.paymentDetails?.razorpayPaymentId || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Card */}
                {(order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Returned') && (
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">Need help with this order?</h3>
                            <p className="text-[10px] font-bold text-slate-400">Manage your order status below.</p>
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

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={handleCloseModal}
                title={modalConfig.type.includes('cancel') ? 'Cancel Order' : 'Return Order'}
                maxWidth="max-w-md"
            >
                <div className="space-y-6">
                    <div className={`p-5 rounded-2xl border ${modalConfig.type.includes('cancel') ? 'bg-rose-50 border-rose-100' : 'bg-indigo-50 border-indigo-100'}`}>
                        <p className={`text-[10px] font-bold leading-relaxed ${modalConfig.type.includes('cancel') ? 'text-rose-600' : 'text-indigo-600'}`}>
                            {modalConfig.type.includes('cancel')
                                ? "Are you sure you want to cancel? Refund will be processed instantly."
                                : "Please provide a reason for return. Pick-up will be scheduled shortly."
                            }
                        </p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reason</label>
                        <textarea
                            value={modalConfig.reason}
                            onChange={(e) => setModalConfig(prev => ({ ...prev, reason: e.target.value }))}
                            placeholder="Write your reason here..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all min-h-[140px] resize-none"
                        />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            onClick={handleCloseModal}
                            className="flex-1 bg-slate-100 text-slate-500 font-black py-5 rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]"
                        >
                            Back
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
                            {actionLoading ? 'Processing...' : 'Confirm'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OrderDetailView;
