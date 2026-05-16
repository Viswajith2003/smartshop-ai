import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const ContactPage = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            toast.success("Thank you! Your message has been sent.");
            setFormData({ name: '', email: '', subject: '', message: '' });
            setLoading(false);
        }, 1500);
    };

    const contactDetails = [
        { icon: Mail, label: 'Email Us', value: 'support@smartshop.ai', sub: '24/7 Support Response', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { icon: Phone, label: 'Call Us', value: '+1 (555) 000-0000', sub: 'Mon-Fri from 9am to 6pm', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { icon: MapPin, label: 'Visit Us', value: '123 Smart Street', sub: 'Silicon Valley, CA 94043', color: 'text-amber-600', bg: 'bg-amber-50' }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumbs 
                    items={[
                        { label: 'Home', link: '/home' },
                        { label: 'Contact Us' }
                    ]} 
                    className="mb-12"
                />

                <div className="text-center mb-16 space-y-4">
                    <span className="px-6 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.25em] rounded-full">Get In Touch</span>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter">We'd love to hear from you.</h1>
                    <p className="text-slate-500 font-bold max-w-2xl mx-auto">Have a question or just want to say hi? We're here to help you with anything you need.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {contactDetails.map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-start gap-6 group hover:border-indigo-100 transition-all">
                                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-base font-black text-slate-900">{item.value}</p>
                                    <p className="text-xs font-bold text-slate-400">{item.sub}</p>
                                </div>
                            </div>
                        ))}

                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="relative z-10 flex items-center gap-6">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                    <Clock className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-black tracking-tight">Business Hours</p>
                                    <p className="text-xs font-bold text-slate-400">Response within 2 hours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-sm border border-slate-100 relative">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Your Name</label>
                                        <input 
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-bold transition-all"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                                        <input 
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-bold transition-all"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Subject</label>
                                    <input 
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-bold transition-all"
                                        placeholder="How can we help?"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Message</label>
                                    <textarea 
                                        rows="6"
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-bold transition-all resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                        required
                                    ></textarea>
                                </div>
                                <div>
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex items-center gap-3 bg-indigo-600 text-white font-black px-12 py-5 rounded-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs disabled:opacity-50 shadow-2xl shadow-indigo-100 active:scale-95"
                                    >
                                        {loading ? 'Sending...' : 'Send Message'}
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
