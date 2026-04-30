import React, { useState, useEffect, memo } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Layers, 
  ShoppingCart, 
  Ticket, 
  Image as ImageIcon, 
  FileText, 
  LogOut, 
  Bell, 
  Search,
  TrendingUp,
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';
import { CategoryManager, ProductManager, CouponManager, OrderManager, UserManager } from '../../components/admin';
import { adminAPI } from '../../services/api';

const DashboardPage = memo(() => {
  const [activeItem, setActiveItem] = useState(() => {
    return localStorage.getItem('adminActiveItem') || 'Dashboard';
  });
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    localStorage.setItem('adminActiveItem', activeItem);

    if (activeItem === 'Dashboard') {
      const fetchStats = async () => {
        try {
          const res = await adminAPI.getDashboard();
          if (res.success) {
            setStatsData(res.data);
          }
        } catch (err) {
          console.error("Stats error:", err);
        }
      };
      fetchStats();
    }
  }, [activeItem]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Users', icon: Users },
    { name: 'Products', icon: Package },
    { name: 'Categories', icon: Layers },
    { name: 'Orders', icon: ShoppingCart },
    { name: 'Coupons', icon: Ticket },
    { name: 'Banners', icon: ImageIcon },
    { name: 'Sales Report', icon: FileText },
  ];

  const stats = [
    { 
      label: 'Total Users', 
      value: statsData?.totalUsers || 0, 
      trend: '+12%',
      icon: Users,
      color: 'bg-blue-500/10 text-blue-500'
    },
    { 
      label: 'Products', 
      value: statsData?.totalProducts || 0, 
      trend: '+5%',
      icon: Package,
      color: 'bg-indigo-500/10 text-indigo-500'
    },
    { 
      label: 'Revenue', 
      value: `₹${(statsData?.totalSales || 0).toLocaleString()}`, 
      trend: '+18%',
      icon: TrendingUp,
      color: 'bg-emerald-500/10 text-emerald-500'
    },
    { 
      label: 'Total Orders', 
      value: statsData?.totalOrders || 0, 
      trend: '+22%',
      icon: ShoppingBag,
      color: 'bg-amber-500/10 text-amber-500'
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] flex flex-col border-r border-slate-800 fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
             <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white leading-tight">SmartShop</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight">Admin Console</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveItem(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-semibold text-sm">{item.name}</span>
                {isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-400 font-semibold hover:text-red-400 transition-colors py-3 px-4 w-full rounded-xl hover:bg-red-500/10 group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-10 w-full">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold tracking-tight text-white">{activeItem}</h2>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="relative group hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search metrics..." 
                className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 w-64 focus:ring-2 focus:ring-indigo-500 focus:bg-slate-950 transition-all outline-none"
              />
            </div>

            <button className="relative p-2 text-slate-400 hover:text-white transition-colors bg-slate-900 rounded-xl border border-slate-800">
                <Bell className="w-5 h-5" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1e293b]"></div>
            </button>
            
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800 text-white">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold">Admin User</p>
                <p className="text-[10px] text-slate-500 font-medium">Platform Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-lg border border-white/10 group-hover:scale-105 transition-transform cursor-pointer"></div>
            </div>
          </div>
        </header>

        {/* Content Scrollable */}
        <div className="p-8 space-y-10 flex-1">
          
          {activeItem === 'Dashboard' && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-black tracking-tight text-white leading-none">Dashboard Overview</h3>
                  <p className="text-slate-500 text-sm font-medium mt-2">Activity and business metrics overview.</p>
                </div>
                <div className="flex gap-3">
                   <button className="bg-slate-900 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 border border-slate-800 transition-all flex items-center gap-2">
                     <FileText className="w-4 h-4" /> Download CSV
                   </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={idx} 
                      className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 shadow-lg group relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className={`p-3 rounded-xl ${stat.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                          <ArrowUpRight className="w-3 h-3" />
                          {stat.trend}
                        </div>
                      </div>
                      
                      <div className="relative z-10">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h4 className="text-3xl font-black text-white tracking-tight">{stat.value}</h4>
                      </div>

                      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                         <Icon className="w-24 h-24" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart Mockup */}
                <div className="lg:col-span-2 bg-[#1e293b] p-8 rounded-3xl border border-slate-700/50 shadow-xl">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 leading-none">
                       <TrendingUp className="w-5 h-5 text-indigo-500" /> Performance Analysis
                    </h4>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-black bg-indigo-600/20 text-indigo-400 px-2.5 py-1 rounded-lg">WEEKLY</span>
                      <span className="text-[10px] font-black hover:bg-slate-800 text-slate-500 px-2.5 py-1 rounded-lg cursor-pointer transition-colors">MONTHLY</span>
                    </div>
                  </div>
                  
                  <div className="h-72 relative mt-4">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M 0 80 Q 10 70 20 75 T 40 45 T 60 55 T 80 25 T 100 35" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M 0 80 Q 10 70 20 75 T 40 45 T 60 55 T 80 25 T 100 35 L 100 100 L 0 100 Z" fill="url(#indigo-grad)" />
                      <defs>
                        <linearGradient id="indigo-grad" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <div className="absolute bottom-0 left-0 w-full flex justify-between px-2 pt-4 border-t border-slate-800/50">
                       {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                         <span key={day} className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{day}</span>
                       ))}
                    </div>
                  </div>
                </div>

                {/* Top Actions */}
                <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-700/50 shadow-xl flex flex-col">
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                     <Bell className="w-4 h-4 text-amber-500" /> Notifications
                  </h4>
                  <div className="space-y-6 flex-1">
                     {[
                       { name: 'Admin login detected', time: 'Just now', alert: true },
                       { name: 'Product "iPhone 15" stock low', time: '14 mins ago', alert: true },
                       { name: 'Category "Laptops" updated', time: '2 hours ago', alert: false },
                       { name: 'Sales report generated', time: '5 hours ago', alert: false }
                     ].map((item, i) => (
                       <div key={i} className="flex gap-4 items-start">
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${item.alert ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-600'}`}></div>
                          <div>
                             <p className="text-xs font-bold text-slate-200">{item.name}</p>
                             <p className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-wider">{item.time}</p>
                          </div>
                       </div>
                     ))}
                  </div>
                  <button className="w-full mt-6 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all uppercase">Check All Alerts</button>
                </div>
              </div>
            </>
          )}

          {activeItem === 'Users' && <UserManager />}
          {activeItem === 'Categories' && <CategoryManager />}
          {activeItem === 'Products' && <ProductManager />}
          {activeItem === 'Coupons' && <CouponManager />}
          {activeItem === 'Orders' && <OrderManager />}

        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}} />
    </div>
  );
});

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
