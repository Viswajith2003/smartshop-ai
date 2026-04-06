import React, { useState, memo } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const AdminDash = memo(() => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const sidebarItems = [
    { 
      name: 'Dashboard', 
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
          <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
        </svg>
      )
    },
    { 
      name: 'Users', 
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    { 
      name: 'Products', 
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
          <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
        </svg>
      )
    },
    { 
      name: 'Orders', 
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
          <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
      )
    },
    { 
      name: 'Coupons', 
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
          <path d="M2 9V5.25A1.25 1.25 0 0 1 3.25 4h17.5A1.25 1.25 0 0 1 22 5.25V9a2 2 0 0 0 0 4v3.75a1.25 1.25 0 0 1-1.25 1.25H3.25A1.25 1.25 0 0 1 2 16.25V13a2 2 0 0 0 0-4Z" />
        </svg>
      )
    },
    { 
      name: 'Banners', 
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      )
    },
    { 
      name: 'Sales Report', 
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" />
        </svg>
      )
    },
  ];

  const stats = [
    { 
      label: 'TOTAL USERS', 
      value: '300', 
      color: 'text-[#00ff00]', 
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    { 
      label: 'TOTAL PRODUCTS', 
      value: '150', 
      color: 'text-[#00ff00]', 
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path d="M21 8v13H3V8" /><path d="M1 3h22v5H1z" /><path d="M10 12h4" />
        </svg>
      )
    },
    { 
      label: 'TOTAL SALES', 
      value: '200', 
      color: 'text-[#00ff00]', 
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
      )
    },
    { 
      label: 'REFUNDS', 
      value: '50', 
      color: 'text-[#00ff00]', 
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
          <path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#07011d] text-white font-sans">
      
      {/* Sidebar */}
      <aside className="w-72 bg-[#02001c] flex flex-col border-r border-[#1a1c3d]">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-[#1e1470]/40 p-3 rounded-2xl border border-purple-500/20 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-[#9333ea]">
                <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
             </svg>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-white transition-all hover:text-purple-400 cursor-default">Smart Shop</h1>
            <p className="text-[10px] text-gray-500 font-extrabold uppercase mt-1 tracking-widest">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveItem(item.name)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-[#1e1470]/40 text-white border-l-4 border-purple-500 shadow-[inset_0_0_20px_rgba(147,51,234,0.1)]' 
                    : 'text-gray-400 hover:bg-[#1a1c3d] hover:text-white'
                }`}
              >
                <Icon className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-purple-400' : ''}`} />
                <span className="font-bold tracking-tight">{item.name}</span>
                {isActive && <div className="absolute right-4 w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(147,51,234,1)]"></div>}
              </button>
            );
          })}
        </nav>

        <div className="p-8 border-t border-[#1a1c3d]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 text-red-500 font-black hover:text-red-400 transition-colors tracking-tight w-full text-left group"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 transition-transform group-hover:-translate-x-1">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-gradient-to-br from-[#0c062c] to-[#040114]">
        
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-10 border-b border-[#1a1c3d] backdrop-blur-xl bg-[#02001c]/60 sticky top-0 z-10">
          <h2 className="text-xl font-black tracking-tight text-gray-300">{activeItem}</h2>
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer p-2 bg-[#1a1c3d] rounded-full transition-all hover:bg-[#2a2c4d]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-yellow-400">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff2d55] text-[10px] flex items-center justify-center rounded-full border-2 border-[#02001c] font-black shadow-lg">
                    5
                </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 border-2 border-white/10 ring-4 ring-purple-500/10"></div>
          </div>
        </header>

        {/* Content Scrollable */}
        <div className="p-10 space-y-12 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar">
          
          <div className="flex justify-between items-end">
            <h3 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Overview</h3>
            <span className="text-gray-500 text-sm font-bold tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-[#02001c] p-8 rounded-3xl border border-[#1a1c3d] hover:border-purple-500/50 transition-all duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.5)] group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>
                  
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">{stat.label}</span>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <div className={`text-5xl font-black ${stat.color} mb-1 tracking-tighter shadow-sm`}>{stat.value}</div>
                    </div>
                    <div className="opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 text-purple-400">
                      <Icon className="w-14 h-14" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-[#02001c] p-10 rounded-[3rem] border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.05)] flex flex-col group">
                <div className="flex justify-between items-center mb-10">
                    <h4 className="text-lg font-black uppercase tracking-widest text-cyan-400">Daily Sales</h4>
                    <span className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full font-black">LIVE</span>
                </div>
                <div className="flex-1 h-64 relative">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M 0 80 Q 15 50 25 70 T 40 40 T 60 60 T 80 30 T 100 50" fill="none" stroke="#a855f7" strokeWidth="3" />
                        <path d="M 0 80 Q 15 50 25 70 T 40 40 T 60 60 T 80 30 T 100 50 L 100 100 L 0 100 Z" fill="url(#sales-gradient)" />
                        <defs>
                            <linearGradient id="sales-gradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            <div className="bg-[#02001c] p-10 rounded-[3rem] border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.05)] flex flex-col items-center">
                <div className="flex justify-between items-center w-full mb-10">
                    <h4 className="text-lg font-black uppercase tracking-widest text-emerald-400">Monthly Revenue</h4>
                </div>
                <div className="relative w-72 h-72">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="15" strokeDasharray="180 251.2" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="15" strokeDasharray="71.2 251.2" strokeDashoffset="-180" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Total</span>
                        <span className="text-4xl font-black">$24.5k</span>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #02001c;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e1470;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9333ea;
        }
      `}} />
    </div>
  );
});

AdminDash.displayName = 'AdminDash';

export default AdminDash;
