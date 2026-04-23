import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../../store/slices/authSlice';
import { API_CONFIG } from '../../config/app';
import { SearchBar } from './';

const Navbar = ({ onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const searchInputRef = useRef(null);
    
    // Get user and counts from Redux store
    const { user } = useSelector((state) => state.auth);
    const cartItems = useSelector((state) => state.cart.items);
    const wishlistItems = useSelector((state) => state.wishlist.items);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            dispatch(logoutAction());
            navigate('/login');
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Offers', path: '/offers' },
        { name: 'Orders', path: '/orders' }
    ];

    const isActive = (path) => location.pathname === path;

    // Construct avatar URL
    const avatarUrl = user?.avatar 
        ? `${API_CONFIG.baseURL.replace('/api', '')}${user.avatar}`
        : null;

    return (
        <nav className="bg-white/95 backdrop-blur-md shadow-sm fixed top-0 w-full z-50 transition-all duration-300 border-b border-gray-100">
            <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-20 xl:px-24">
                <div className="flex justify-between items-center h-20 relative">
                    
                    {/* Logo Section */}
                    <Link to="/" className={`flex items-center space-x-2 group transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none md:opacity-100' : 'opacity-100'}`}>
                        <div className="relative">
                            <i className="bi bi-cart-fill text-3xl text-indigo-600 transition-transform group-hover:scale-110"></i>
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex flex-col -space-y-1 hidden lg:flex">
                            <span className="text-xl font-black text-indigo-900 tracking-tight">
                                Smart<span className="text-indigo-600">Shop</span>
                            </span>
                            <span className="text-[9px] text-indigo-400/80 uppercase tracking-widest font-bold">
                                AI-Powered Mall
                            </span>
                        </div>
                    </Link>

                    {/* Dynamic Search Overlay (Desktop/Center) */}
                    {isSearchOpen ? (
                        <div className="absolute inset-0 flex items-center justify-center px-4 md:px-0 z-50 bg-white md:bg-transparent">
                            <div className="w-full max-w-xl relative animate-in fade-in slide-in-from-top-2 duration-300">
                                <SearchBar 
                                    autoFocus={true}
                                    placeholder="Search for anything..."
                                    onSearch={(val) => {
                                        setIsSearchOpen(false);
                                        navigate(`/products?search=${encodeURIComponent(val)}`);
                                    }}
                                />
                                <button 
                                    onClick={() => setIsSearchOpen(false)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <i className="bi bi-x-lg text-lg"></i>
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Desktop Nav Links */
                        <div className="hidden md:flex items-center space-x-8 animate-in fade-in duration-500">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative py-2 text-sm font-extrabold tracking-wide transition-all duration-200 hover:text-indigo-600 ${
                                        isActive(link.path) 
                                        ? 'text-indigo-900' 
                                        : 'text-indigo-400 hover:text-indigo-900'
                                    }`}
                                >
                                    {link.name}
                                    {isActive(link.path) && (
                                        <div className="absolute -bottom-1 left-0 w-full h-1 bg-indigo-600 rounded-full animate-in zoom-in duration-300"></div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Action Icons */}
                    <div className={`flex items-center space-x-4 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none md:opacity-100' : 'opacity-100'}`}>
                        
                        {/* Search Icon (Newly Added) */}
                        <button 
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                            title="Search"
                        >
                            <i className="bi bi-search text-xl"></i>
                        </button>

                        <div className="hidden sm:flex items-center space-x-4">
                             {/* Wishlist */}
                            <Link to="/wishlist" className="relative group cursor-pointer transition-transform hover:scale-105 active:scale-95">
                                <i className="bi bi-heart text-2xl text-indigo-900/80 group-hover:text-indigo-600 transition-colors"></i>
                                {wishlistItems.length > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm ring-1 ring-red-100">
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </Link>

                            {/* Cart */}
                            <Link to="/cart" className="relative group cursor-pointer transition-transform hover:scale-105 active:scale-95">
                                <i className="bi bi-cart3 text-2xl text-indigo-900/80 group-hover:text-indigo-600 transition-colors"></i>
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[9px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm ring-1 ring-indigo-100">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>
                        </div>

                        {/* Profile Image */}
                        {user && (
                            <Link to="/profile" className="flex items-center pr-4 border-r border-gray-100 mr-1 transition-all">
                                <div className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-full border-2 border-indigo-100 group-hover:border-indigo-400 transition-all overflow-hidden p-0.5">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <i className="bi bi-person text-xl text-indigo-900"></i>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm ring-1 ring-green-100"></div>
                                </div>
                            </Link>
                        )}

                        {/* Logout Button */}
                        <button 
                            onClick={handleLogout}
                            className="flex items-center justify-center h-10 w-10 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Logout"
                        >
                            <i className="bi bi-box-arrow-right text-xl"></i>
                        </button>

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden text-indigo-900 focus:outline-none p-1"
                        >
                            <i className={`bi ${isMenuOpen ? 'bi-x-lg' : 'bi-list'} text-3xl`}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Selection Menu */}
            <div className={`md:hidden transition-all duration-400 ease-in-out border-b border-indigo-50 ${isMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="px-6 pt-4 pb-8 space-y-2 bg-white flex flex-col">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`px-4 py-3 rounded-2xl text-base font-black transition-all ${
                                isActive(link.path) 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                                : 'text-indigo-400 hover:bg-indigo-50'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                        <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 text-indigo-900 font-black hover:bg-indigo-50 rounded-2xl">
                             <i className="bi bi-person-circle text-2xl mr-3"></i> Profile
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-red-600 font-black hover:bg-red-50 rounded-2xl">
                             <i className="bi bi-box-arrow-right text-2xl mr-3"></i> Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
