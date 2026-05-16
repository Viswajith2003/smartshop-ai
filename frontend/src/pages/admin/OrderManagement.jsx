import React from 'react';
import { ShoppingBag, ArrowLeft, Filter, Download, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrderManager from '../../components/admin/OrderManager';

const OrderManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#02001c] text-slate-200 font-sans selection:bg-indigo-500/30 pb-12">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 pt-10">
        {/* Breadcrumbs & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="group flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors text-xs font-black uppercase tracking-[0.2em]"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600/20 p-3 rounded-2xl border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
                <ShoppingBag className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">Order Management</h1>
                <p className="text-slate-500 font-bold text-sm mt-2 uppercase tracking-widest">Processing & Fulfillment Hub</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-[#0c062c] hover:bg-[#150d42] text-slate-400 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-[#1a1c3d] transition-all flex items-center gap-2 group">
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" /> Export Report
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-95">
              Sync Orders
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
             { label: 'Pending', value: '12', color: 'text-amber-400', bg: 'bg-amber-400/5', border: 'border-amber-400/20' },
             { label: 'Processing', value: '08', color: 'text-indigo-400', bg: 'bg-indigo-400/5', border: 'border-indigo-400/20' },
             { label: 'Shipped Today', value: '24', color: 'text-indigo-400', bg: 'bg-indigo-400/5', border: 'border-indigo-400/20' },
             { label: 'Completed', value: '156', color: 'text-emerald-400', bg: 'bg-emerald-400/5', border: 'border-emerald-400/20' },
           ].map((stat, i) => (
             <div key={i} className={`${stat.bg} ${stat.border} border rounded-[2rem] p-6 flex items-center justify-between group hover:scale-[1.02] transition-transform cursor-pointer`}>
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                   <h3 className={`text-3xl font-black ${stat.color} tracking-tighter`}>{stat.value}</h3>
                </div>
                <div className={`${stat.bg.replace('/5', '/10')} p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`}>
                   <RefreshCcw className={`w-5 h-5 ${stat.color}`} />
                </div>
             </div>
           ))}
        </div>

        {/* Main Table Container */}
        <div className="bg-[#0c062c] border border-[#1a1c3d] rounded-[2.5rem] p-8 lg:p-10 shadow-2xl shadow-black/50 backdrop-blur-xl">
           <OrderManager />
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
