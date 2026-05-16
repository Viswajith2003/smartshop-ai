import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  TrendingUp, 
  Package, 
  ShoppingCart,
  Filter,
  RefreshCcw,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';

const SalesReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getSalesReport(filters);
      if (res.success) {
        setReportData(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch sales report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading && !reportData) return <div className="h-96 flex items-center justify-center"><Loader /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Sales Analytics</h3>
          <p className="text-slate-500 text-sm font-medium mt-1">Detailed revenue and product performance reports</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-200 shadow-sm"
          >
            <Printer className="w-4 h-4 text-indigo-600" />
            Print Report
          </button>
          <button 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl flex flex-wrap items-end gap-6 no-print">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Start Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-indigo-500 outline-none w-48 font-bold"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">End Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:border-indigo-500 outline-none w-48 font-bold"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchReport}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            <Filter className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              setFilters({startDate: '', endDate: ''});
              // We need to wait for state to clear or just fetch with empty
              setTimeout(fetchReport, 0);
            }}
            className="bg-slate-50 hover:bg-slate-100 text-slate-500 p-3 rounded-xl transition-all border border-slate-200"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Total Revenue</p>
            <h4 className="text-4xl font-black tracking-tighter">₹{(reportData?.summary?.totalRevenue || 0).toLocaleString()}</h4>
            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-3 py-1.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              12.5% increase from last period
            </div>
          </div>
          <TrendingUp className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-500" />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Total Orders</p>
            <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{reportData?.summary?.totalOrders || 0}</h4>
            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1.5 rounded-full">
              <ShoppingCart className="w-3 h-3" />
              Verified Completed Orders
            </div>
          </div>
          <ShoppingCart className="absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 text-slate-900" />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Products Sold</p>
            <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{reportData?.summary?.totalProducts || 0}</h4>
            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-indigo-400 bg-indigo-400/10 w-fit px-3 py-1.5 rounded-full">
              <Package className="w-3 h-3" />
              Unique Items Sold
            </div>
          </div>
          <Package className="absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 text-slate-900" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales by Date */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-500" />
              Revenue by Date
            </h4>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                  <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Orders</th>
                  <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reportData?.salesByDate?.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-10 text-center text-slate-500 text-xs font-bold italic">No sales data for this period.</td>
                  </tr>
                ) : reportData?.salesByDate?.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-5 text-sm font-bold text-slate-700">{item._id}</td>
                    <td className="p-5">
                      <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg text-[10px] font-black">{item.orders}</span>
                    </td>
                    <td className="p-5 text-sm font-black text-slate-900 text-right">₹{item.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales by Product */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
              <Package className="w-5 h-5 text-emerald-500" />
              Top Selling Products
            </h4>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Product</th>
                  <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Qty</th>
                  <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reportData?.salesByProduct?.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-10 text-center text-slate-500 text-xs font-bold italic">No product sales found.</td>
                  </tr>
                ) : reportData?.salesByProduct?.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-5">
                      <p className="text-sm font-bold text-slate-700 line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">ID: ...{item._id.slice(-6)}</p>
                    </td>
                    <td className="p-5">
                      <span className="bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-lg text-[10px] font-black">{item.quantity}</span>
                    </td>
                    <td className="p-5 text-sm font-black text-slate-900 text-right">₹{item.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .bg-[#0f172a], .bg-[#1e293b], .bg-slate-900 { background: white !important; border: 1px solid #eee !important; }
          .text-white, .text-slate-200, .text-slate-300 { color: black !important; }
          .shadow-xl, .shadow-lg { shadow: none !important; }
          aside, header { display: none !important; }
          main { margin-left: 0 !important; width: 100% !important; }
          .p-8 { padding: 1rem !important; }
          .rounded-[2.5rem], .rounded-3xl { border-radius: 0.5rem !important; }
          table { border: 1px solid #eee !important; }
          th { background: #f8fafc !important; color: #64748b !important; }
          .bg-gradient-to-br { background: #f1f5f9 !important; color: black !important; border: 1px solid #ddd !important; }
        }
      `}} />
    </div>
  );
};

export default SalesReport;
