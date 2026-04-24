import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = React.memo(() => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 font-['Inter',sans-serif]">
            {/* Soft Ambient Background */}
            <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full"></div>

            <div className="relative z-10 max-w-2xl w-full text-center">
                {/* Visual Element */}
                <div className="mb-8 relative inline-block">
                    <div className="text-[12rem] md:text-[20rem] font-black text-slate-100 leading-none select-none tracking-tighter">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center border border-slate-100 transform -rotate-6 animate-bounce duration-[3000ms]">
                            <i className="bi bi-compass-fill text-blue-600 text-4xl md:text-5xl"></i>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="relative -mt-16 md:-mt-24">
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Lost in Space?
                    </h1>
                    
                    <p className="text-slate-500 text-lg md:text-xl font-medium mb-12 max-w-md mx-auto leading-relaxed">
                        The page you're searching for has either vanished into thin air or never existed.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Link 
                            to="/" 
                            className="group w-full sm:w-auto bg-slate-900 text-white font-black px-10 py-5 rounded-3xl transition-all hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/10 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                        >
                            <i className="bi bi-house-door-fill text-lg transition-transform group-hover:-translate-y-0.5"></i>
                            Back to Safety
                        </Link>
                        <button 
                            onClick={() => navigate(-1)}
                            className="group w-full sm:w-auto bg-white text-slate-600 font-black px-10 py-5 rounded-3xl border-2 border-slate-100 transition-all hover:border-blue-400 hover:text-blue-600 hover:scale-105 active:scale-95 shadow-lg uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                        >
                            <i className="bi bi-arrow-left text-lg transition-transform group-hover:-translate-x-1"></i>
                            Go Back
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Brand */}
            <div className="fixed bottom-10 left-0 w-full text-center">
                <span className="text-slate-300 font-black uppercase tracking-[0.4em] text-[10px]">SmartShop AI</span>
            </div>
        </div>
    );
});

NotFoundPage.displayName = 'NotFoundPage';

export default NotFoundPage;
