import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Categories', path: '/categories' },
        { name: 'Offers', path: '/offers' },
        { name: 'Orders', path: '/orders' }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-[#f0f4f8] shadow-md sticky top-0 z-50 transition-all duration-300">
            {/* Top Section: Logo, Links, and Actions */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="relative">
                            <i className="bi bi-cart-fill text-3xl text-indigo-600 transition-transform group-hover:scale-110"></i>
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-[#f0f4f8]"></div>
                        </div>
                        <div className="flex flex-col -space-y-1">
                            <span className="text-2xl font-black text-indigo-900 tracking-tight">
                                Smart<span className="text-indigo-600">Shop</span>
                            </span>
                            <span className="text-[10px] text-indigo-400/80 uppercase tracking-widest font-semibold">
                                AI-Powered E-Commerce Platform
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative py-2 text-sm font-extrabold tracking-wide transition-all duration-200 hover:text-indigo-600 ${
                                    isActive(link.path) 
                                    ? 'text-indigo-900 after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-blue-500 after:rounded-full' 
                                    : 'text-indigo-400 hover:text-indigo-900'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center space-x-5">
                        {/* Wishlist */}
                        <div className="relative group cursor-pointer transition-transform hover:scale-105 hidden sm:block">
                            <i className="bi bi-heart text-2xl text-indigo-900/80 group-hover:text-indigo-600 transition-colors"></i>
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#f0f4f8] shadow-sm">
                                2
                            </span>
                        </div>

                        {/* Cart */}
                        <div className="relative group cursor-pointer transition-transform hover:scale-105">
                            <i className="bi bi-cart text-2xl text-indigo-900/80 group-hover:text-indigo-600 transition-colors"></i>
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#f0f4f8] shadow-sm">
                                5
                            </span>
                        </div>

                        {/* Profile */}
                        <div className="relative group cursor-pointer transition-transform hover:scale-105">
                            <div className="bg-indigo-100 p-1.5 rounded-full border border-indigo-200 group-hover:bg-indigo-200 transition-colors">
                                <i className="bi bi-person text-xl text-indigo-900"></i>
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-indigo-500 rounded-full border-2 border-[#f0f4f8]"></div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden text-indigo-900 focus:outline-none transition-colors hover:text-indigo-600"
                        >
                            <i className={`bi ${isMenuOpen ? 'bi-x-lg' : 'bi-list'} text-3xl`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Search Bar (Dark Blue Background) */}
            <div className="bg-[#041124] py-3 shadow-inner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white text-gray-800 text-sm py-2.5 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium placeholder:text-gray-400 pr-12"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer group">
                            <i className="bi bi-search text-gray-400 group-hover:text-indigo-600 transition-colors font-bold"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Selection Menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 border-t border-indigo-100' : 'max-h-0 overflow-hidden'}`}>
                <div className="px-4 pt-2 pb-6 space-y-1 bg-white shadow-inner">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`block px-3 py-3 rounded-xl text-base font-bold transition-all duration-200 ${
                                isActive(link.path) 
                                ? 'bg-indigo-50 text-indigo-900 border-l-4 border-indigo-500 pl-4' 
                                : 'text-indigo-700/70 hover:bg-indigo-50 hover:text-indigo-900 hover:pl-5'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
