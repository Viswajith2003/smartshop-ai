import React from 'react';
import { ShieldCheck, Zap, Heart, Users, Award, Globe } from 'lucide-react';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const AboutPage = () => {
    const stats = [
        { label: 'Happy Customers', value: '50K+', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Global Brands', value: '200+', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Years Experience', value: '10+', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Secure Delivery', value: '99.9%', icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-50' }
    ];

    const values = [
        {
            title: 'Customer First',
            description: 'We believe in putting our customers at the heart of everything we do, ensuring a seamless shopping experience.',
            icon: Heart
        },
        {
            title: 'Innovative Technology',
            description: 'Leveraging AI and modern tech to provide personalized recommendations and smart shopping solutions.',
            icon: Zap
        },
        {
            title: 'Trusted Quality',
            description: 'Every product on our platform undergoes rigorous quality checks to ensure you get nothing but the best.',
            icon: ShieldCheck
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs 
                    items={[
                        { label: 'Home', link: '/home' },
                        { label: 'About Us' }
                    ]} 
                    className="mb-12"
                />

                {/* Hero Section */}
                <div className="bg-white rounded-[3rem] p-12 lg:p-20 shadow-sm border border-slate-100 relative overflow-hidden mb-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 text-center lg:text-left">
                            <span className="px-6 py-2 bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-[0.2em] rounded-full">Our Story</span>
                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight tracking-tighter">
                                Redefining the <span className="text-indigo-600">Digital Mall</span> Experience.
                            </h1>
                            <p className="text-lg text-slate-500 font-bold leading-relaxed max-w-xl mx-auto lg:mx-0">
                                SmartShop AI is more than just an e-commerce platform. We are building the future of retail, combining artificial intelligence with a human-centric design to create a shopping journey that feels personal, intuitive, and delightful.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-slate-50 rounded-[4rem] border border-slate-100 flex items-center justify-center p-12 overflow-hidden">
                                <img 
                                    src="https://img.freepik.com/free-vector/shopping-center-concept-illustration_114360-1496.jpg" 
                                    alt="About SmartShop" 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 hidden md:block">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 tracking-tight">AI Integrated</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Smart Shopping</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center group hover:border-indigo-100 transition-all hover:-translate-y-2">
                            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-3xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">{stat.value}</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Values Section */}
                <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden">
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-4xl font-black tracking-tighter">The Values That Drive Us</h2>
                            <p className="text-slate-400 font-bold max-w-2xl mx-auto">We are committed to excellence, integrity, and innovation in everything we do.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {values.map((value, idx) => (
                                <div key={idx} className="space-y-6 text-center md:text-left">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                        <value.icon className="w-7 h-7 text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight">{value.title}</h3>
                                    <p className="text-slate-400 font-bold text-sm leading-relaxed">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
