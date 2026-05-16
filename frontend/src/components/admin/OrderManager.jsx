import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api/adminApi';
import { toast } from 'react-toastify';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Eye,
  RefreshCcw,
  Search,
  Filter,
  User,
  CreditCard,
  Package,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import usePagination from '../../hooks/usePagination';
import { Pagination, Loader } from '../common';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const { pagination, handlePageChange, updatePagination } = usePagination(10);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        status: statusFilter
      };
      const res = await adminApi.getOrders(params);
      if (res.success) {
        setOrders(res.data);
        updatePagination(res.meta);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, pagination.limit, searchTerm, statusFilter]);

  useEffect(() => {
    handlePageChange(1);
  }, [searchTerm, statusFilter]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await adminApi.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order marked as ${newStatus}`);
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        ));
      }
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Pending': 
        return { 
          style: 'bg-amber-500/10 text-amber-500 border-amber-500/20', 
          icon: Clock 
        };
      case 'Processing': 
        return { 
          style: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20', 
          icon: RefreshCcw 
        };
      case 'Shipped': 
        return { 
          style: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20', 
          icon: Truck 
        };
      case 'Delivered': 
        return { 
          style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', 
          icon: CheckCircle2 
        };
      case 'Cancelled': 
        return { 
          style: 'bg-rose-500/10 text-rose-500 border-rose-500/20', 
          icon: XCircle 
        };
      case 'Returned': 
        return { 
          style: 'bg-slate-500/10 text-slate-400 border-slate-500/20', 
          icon: AlertCircle 
        };
      default: 
        return { 
          style: 'bg-slate-700/30 text-slate-500 border-slate-700', 
          icon: AlertCircle 
        };
    }
  };

  if (loading && pagination.page === 1) return <div className="h-96 flex items-center justify-center"><Loader /></div>;

  return (
    <div className="space-y-8">
      {/* Table Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by ID or Customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-900 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-400 font-bold"
            />
          </div>
          
          <div className="relative min-w-[200px]">
             <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-slate-900 focus:border-indigo-500/50 outline-none appearance-none cursor-pointer font-black uppercase tracking-widest text-[10px]"
             >
               <option value="All">All Orders</option>
               <option value="Pending">Pending</option>
               <option value="Processing">Processing</option>
               <option value="Shipped">Shipped</option>
               <option value="Delivered">Delivered</option>
               <option value="Cancelled">Cancelled</option>
               <option value="Returned">Returned</option>
             </select>
             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-3 self-end xl:self-auto">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            {pagination.totalItems || 0} Orders Found
          </span>
          <button 
            onClick={fetchOrders}
            className="p-3 bg-white hover:bg-slate-50 text-indigo-600 rounded-2xl transition-all border border-slate-200 shadow-sm"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Modern Table */}
      <div className="relative group">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr className="text-slate-500">
                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Order Detail</th>
                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Customer</th>
                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Inventory</th>
                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Payment</th>
                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="bg-white rounded-[2.5rem] p-20 flex flex-col items-center justify-center border border-dashed border-slate-200 shadow-sm">
                       <ShoppingCart className="w-16 h-16 text-slate-800 mb-4" />
                       <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No orders matching criteria</p>
                    </div>
                  </td>
                </tr>
              ) : orders.map(order => {
                const status = getStatusConfig(order.orderStatus);
                const StatusIcon = status.icon;
                return (
                  <tr key={order._id} className="group/row transition-all duration-300">
                    <td className="px-6 py-5 bg-white border-y border-l border-slate-100 rounded-l-[2rem] first:pl-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 group-hover/row:scale-110 transition-transform">
                           <ShoppingCart size={24} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg tracking-tighter">#{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.1em] mt-1">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 bg-white border-y border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                          <User size={14} />
                        </div>
                        <div>
                          <p className="text-slate-900 font-black text-sm">{order.user?.name || 'Guest User'}</p>
                          <p className="text-[10px] text-slate-500 font-bold tracking-tight">{order.user?.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 bg-white border-y border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-indigo-600 font-black text-xl tracking-tighter">₹{order.pricing?.totalPrice?.toLocaleString()}</span>
                        <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-1 flex items-center gap-1.5">
                          <Package size={12} className="text-indigo-500/50" /> {order.items?.length || 0} Items
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 bg-white border-y border-slate-100">
                       <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                             <CreditCard size={12} className="text-slate-500" />
                             <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">{order.paymentMethod}</span>
                          </div>
                          <span className={`inline-flex px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${order.paymentStatus === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                            {order.paymentStatus}
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-5 bg-white border-y border-slate-100">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase rounded-2xl border transition-all ${status.style}`}>
                        <StatusIcon size={12} className="animate-pulse" />
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5 bg-white border-y border-r border-slate-100 rounded-r-[2rem] text-right last:pr-8">
                      <div className="flex items-center justify-end gap-3">
                        <div className="relative group/select">
                          <select 
                            disabled={updatingId === order._id || ['Cancelled', 'Returned'].includes(order.orderStatus)}
                            value={order.orderStatus}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            className={`bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-[9px] font-black uppercase tracking-widest outline-none focus:border-indigo-500 appearance-none disabled:opacity-20 cursor-pointer transition-all hover:bg-slate-100 ${updatingId === order._id ? 'animate-pulse' : ''}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                        </div>
                        
                        <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group/btn" title="View Details">
                          <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Loading Overlay for pagination */}
        {loading && pagination.page > 1 && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] rounded-[2.5rem] flex items-center justify-center z-10">
            <Loader />
          </div>
        )}
      </div>

      {orders.length > 0 && (
        <div className="flex items-center justify-center pt-8">
          <Pagination pagination={pagination} onPageChange={handlePageChange} theme="light" />
        </div>
      )}
    </div>
  );
};

export default OrderManager;
