import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
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
  Package
} from 'lucide-react';
import Loader from '../common/Loader';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getOrders();
      if (res.success) {
        setOrders(res.data);
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
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await adminAPI.updateOrderStatus(orderId, newStatus);
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

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Shipped': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'Returned': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-700/30 text-slate-500 border-slate-700';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Order Management</h3>
          <p className="text-slate-500 text-sm font-medium mt-1">Monitor and process customer orders</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by ID or User..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="relative group">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-8 py-2 text-sm text-white focus:border-indigo-500 outline-none appearance-none"
             >
               <option value="All">All Status</option>
               <option value="Pending">Pending</option>
               <option value="Processing">Processing</option>
               <option value="Shipped">Shipped</option>
               <option value="Delivered">Delivered</option>
               <option value="Cancelled">Cancelled</option>
               <option value="Returned">Returned</option>
             </select>
          </div>
          <button 
            onClick={fetchOrders}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl transition-all"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-3xl border border-slate-700/50 shadow-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/30">
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Order Info</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount & Items</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Payment</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-10 text-center text-slate-500 font-medium italic">No orders found matching your filters.</td>
              </tr>
            ) : filteredOrders.map(order => (
              <tr key={order._id} className="hover:bg-slate-800/20 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                       <ShoppingCart size={20} />
                    </div>
                    <div>
                      <p className="font-black text-slate-200 text-sm tracking-tighter">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-500" />
                    <div>
                      <p className="text-slate-300 font-bold text-sm">{order.user?.name || 'Unknown'}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{order.user?.email || 'N/A'}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="text-indigo-400 font-black text-base tracking-tighter">₹{order.pricing?.totalPrice?.toLocaleString()}</span>
                    <span className="text-slate-500 text-[10px] uppercase font-black tracking-tight mt-0.5 flex items-center gap-1">
                      <Package size={10} /> {order.items?.length || 0} Products
                    </span>
                  </div>
                </td>
                <td className="p-5">
                   <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                         <CreditCard size={12} className="text-slate-500" />
                         <span className="text-[10px] font-black uppercase text-slate-300">{order.paymentMethod}</span>
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${order.paymentStatus === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-500'}`}>
                        {order.paymentStatus}
                      </span>
                   </div>
                </td>
                <td className="p-5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase rounded-full border ${getStatusStyles(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <select 
                      disabled={updatingId === order._id || ['Cancelled', 'Returned'].includes(order.orderStatus)}
                      value={order.orderStatus}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className={`bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-indigo-500 disabled:opacity-30 ${updatingId === order._id ? 'animate-pulse' : ''}`}
                    >
                      <option value="Pending">Set Pending</option>
                      <option value="Processing">Set Processing</option>
                      <option value="Shipped">Set Shipped</option>
                      <option value="Delivered">Set Delivered</option>
                    </select>
                    
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all" title="View Details">
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManager;
