import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  ArrowRight,
  Star,
  Smartphone,
  CreditCard
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <ShoppingBag className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">SmartShop<span className="text-indigo-600">AI</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
          <a href="#contact" className="hover:text-indigo-600 transition-colors">Support</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 px-6 py-2 transition-all">Login</Link>
          <Link to="/register" className="bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] px-8 py-3.5 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>
        
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-indigo-100 shadow-sm">
            <Sparkles className="w-4 h-4" /> The Future of E-Commerce is Here
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none mb-8">
            Shop Smarter with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-300% animate-gradient">SmartShop AI.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-12">
            Experience a curated shopping journey powered by intelligence. Seamless payments, secure deliveries, and premium products tailored just for you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="group bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all active:scale-95 flex items-center gap-3">
              Start Shopping Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/products" className="bg-white text-slate-900 px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all active:scale-95">
              Browse Collections
            </Link>
          </div>
        </div>

        {/* Feature Tags */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { icon: ShieldCheck, label: 'Secure Payments', desc: 'PCI DSS Compliant' },
            { icon: Truck, label: 'Express Delivery', desc: 'Worldwide Shipping' },
            { icon: Star, label: 'Premium Quality', desc: 'Curated Selections' },
            { icon: CreditCard, label: 'Digital Wallet', desc: 'Instant Refunds' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all text-left group">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <item.icon size={24} />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">{item.label}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Image Section */}
      <section className="py-20 bg-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
          <div className="relative">
            <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000&h=1200" 
              alt="Platform" 
              className="relative rounded-[3rem] shadow-2xl border border-white/10"
            />
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2rem] shadow-2xl animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Smartphone />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile App</p>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Available Soon</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
              Modern Shopping <br />
              <span className="text-indigo-400">Perfectly Engineered.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              We've redesigned the online store from the ground up. Fast, intuitive, and beautiful. Whether you're buying tech or fashion, SmartShop AI provides the ultimate experience.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-black text-white tracking-tighter">99.9%</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">Satisfaction Rate</p>
              </div>
              <div>
                <p className="text-4xl font-black text-white tracking-tighter">24/7</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">Expert Support</p>
              </div>
            </div>

            <Link to="/register" className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
               Join the Community <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">SmartShop<span className="text-indigo-600">AI</span></span>
          </div>
          
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Cookies</a>
          </div>

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            &copy; 2026 SmartShop AI. All Rights Reserved.
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
          50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
        }
      `}} />
    </div>
  );
};

export default LandingPage;
