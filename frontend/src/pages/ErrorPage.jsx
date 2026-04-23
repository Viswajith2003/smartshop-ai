import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-['Inter',sans-serif]">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

            <div className="relative z-10 max-w-2xl w-full text-center">
                {/* Visual Element */}
                <div className="mb-12 relative inline-block">
                    <div className="text-[12rem] md:text-[18rem] font-black text-white/5 leading-none select-none tracking-tighter">
                        500
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-blue-500/20 animate-pulse">
                            <i className="bi bi-cpu-fill text-white text-5xl md:text-6xl"></i>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                    Internal Server Error
                </h1>
                
                <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-lg mx-auto leading-relaxed">
                    Our servers are having a bit of a moment. We're already working on fixing the glitch to get you back to shopping.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link 
                        to="/" 
                        className="w-full sm:w-auto bg-white text-black font-black px-10 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5 uppercase tracking-widest text-sm"
                    >
                        Return Home
                    </Link>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-black px-10 py-4 rounded-2xl border border-white/10 transition-all hover:scale-105 active:scale-95 backdrop-blur-md shadow-xl uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                    >
                        <i className="bi bi-arrow-clockwise text-lg"></i>
                        Retry Page
                    </button>
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-slate-500 hover:text-white font-bold transition-colors text-sm uppercase tracking-widest"
                    >
                        Go Back
                    </button>
                </div>

                {/* Support Info */}
                <div className="mt-20 pt-8 border-t border-white/5">
                    <p className="text-slate-600 text-sm font-medium">
                        Reference Code: <span className="text-slate-400 font-mono">ERR_500_SRV_FAIL</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
