import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-black text-white py-16">
            <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                
                {/* Logo & Description */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-black tracking-tight">
                        Smart<span className="text-indigo-400">Shop</span>
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                        India’s most intelligent shopping platform. Powered by AI, 
                        driven by us.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="w-10 h-10 bg-gray-900 flex items-center justify-center rounded-full hover:bg-indigo-600 transition-colors">
                            <i className="bi bi-linkedin text-lg"></i>
                        </a>
                        <a href="#" className="w-10 h-10 bg-gray-900 flex items-center justify-center rounded-full hover:bg-indigo-600 transition-colors">
                            <i className="bi bi-instagram text-lg"></i>
                        </a>
                        <a href="#" className="w-10 h-10 bg-gray-900 flex items-center justify-center rounded-full hover:bg-indigo-600 transition-colors">
                            <i className="bi bi-youtube text-lg"></i>
                        </a>
                    </div>
                </div>

                {/* Company Links */}
                <div>
                    <h3 className="text-lg font-bold mb-6 text-indigo-50">Company</h3>
                    <ul className="space-y-4">
                        <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">About us</Link></li>
                        <li><Link to="/careers" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Careers</Link></li>
                        <li><Link to="/blogs" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Blogs</Link></li>
                        <li><Link to="/press-kit" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Press Kit</Link></li>
                    </ul>
                </div>

                {/* Support Links */}
                <div>
                    <h3 className="text-lg font-bold mb-6 text-indigo-50">Support</h3>
                    <ul className="space-y-4">
                        <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Help center</Link></li>
                        <li><Link to="/returns" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Return policy</Link></li>
                        <li><Link to="/track" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Track Order</Link></li>
                        <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Legal Links */}
                <div>
                    <h3 className="text-lg font-bold mb-6 text-indigo-50">Legal</h3>
                    <ul className="space-y-4">
                        <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Privacy policy</Link></li>
                        <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Terms of use</Link></li>
                        <li><Link to="/cookie-policy" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Cookie policy</Link></li>
                        <li><Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Sitemap</Link></li>
                    </ul>
                </div>

            </div>
            
            {/* Bottom Border/Copyright if needed */}
            <div className="mt-16 pt-8 border-t border-gray-900 text-center text-gray-600 text-[10px] uppercase tracking-widest font-bold">
                &copy; 2026 SmartShop AI. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
