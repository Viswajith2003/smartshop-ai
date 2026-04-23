import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../utils/api';

const SearchBar = ({ 
    placeholder = "Search for products...", 
    className = "", 
    onSearch, 
    initialValue = "",
    autoFocus = false,
    variant = "default" // 'default' for navbar, 'admin' for dashboard
}) => {
    const [query, setQuery] = useState(initialValue);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const suggestionsRef = useRef(null);

    // Debounce search for suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim().length < 2) {
                setSuggestions([]);
                return;
            }

            setIsLoading(true);
            try {
                // We use the existing getProducts API but with a smaller limit
                // and just enough data for suggestions
                const res = await productAPI.getProducts({ 
                    search: query.trim(), 
                    limit: 5 
                });
                if (res?.success) {
                    setSuggestions(res.data);
                }
            } catch (error) {
                console.error("Suggestion fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            if (showSuggestions) fetchSuggestions();
        }, 300);

        return () => clearTimeout(timer);
    }, [query, showSuggestions]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = (searchWord) => {
        const finalWord = searchWord || query;
        if (!finalWord.trim()) return;

        setShowSuggestions(false);
        if (onSearch) {
            onSearch(finalWord.trim());
        } else {
            navigate(`/products?search=${encodeURIComponent(finalWord.trim())}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    return (
        <div className={`relative w-full ${className}`} ref={suggestionsRef}>
            <div className="relative group">
                <i className={`bi bi-search absolute left-5 top-1/2 -translate-y-1/2 ${variant === 'admin' ? 'text-indigo-400' : 'text-indigo-400'} font-bold`}></i>
                <input
                    autoFocus={autoFocus}
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    className={`w-full border-2 transition-all font-bold placeholder:text-gray-400 shadow-sm outline-none
                        ${variant === 'admin' 
                            ? 'bg-[#0a0c2e] border-[#1a1c3d] text-white rounded-xl py-2.5 pl-12 pr-4 focus:border-indigo-500' 
                            : 'bg-indigo-50/50 border-indigo-100 text-indigo-900 rounded-2xl py-3 pl-14 pr-12 focus:border-indigo-400 focus:bg-white'
                        }`}
                />
                
                {isLoading && (
                    <div className="absolute right-12 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
                    </div>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className={`absolute left-0 right-0 mt-2 rounded-2xl shadow-2xl border overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200
                    ${variant === 'admin' 
                        ? 'bg-[#0f113a] border-[#1a1c3d] text-gray-200' 
                        : 'bg-white border-indigo-50 text-indigo-900'
                    }`}>
                    <div className="p-2">
                        <p className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 opacity-50`}>Suggestions</p>
                        {suggestions.map((product) => (
                            <div
                                key={product._id}
                                onClick={() => {
                                    setQuery(product.name);
                                    handleSearchSubmit(product.name);
                                }}
                                className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors rounded-xl
                                    ${variant === 'admin' ? 'hover:bg-indigo-500/20' : 'hover:bg-indigo-50'}`}
                            >
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden p-1">
                                    <img src={product.images?.[0]} alt="" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-bold truncate">{product.name}</span>
                                    <span className="text-[10px] opacity-70">₹{product.price?.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
