import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { WishlistItem, WishlistSummary } from '../../components/wishlist';

const WishlistPage = () => {
    const { items, loading } = useSelector((state) => state.wishlist);
    const { items: cartItems } = useSelector((state) => state.cart);

    const isInCart = (productId) => cartItems.some(item => (item.product?._id || item.product) === productId);
    const totalValue = items.reduce((total, item) => total + (item.product?.price || 0), 0);

    if (loading && items.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <div className="w-64 h-64 bg-rose-50 rounded-full flex items-center justify-center mb-8 animate-pulse">
                    <i className="bi bi-heart text-8xl text-rose-200"></i>
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-2">Your wishlist is empty</h2>
                <p className="text-slate-500 font-medium mb-8 text-center max-w-md">
                    Start saving your favorite items to your wishlist and they will show up here.
                </p>
                <Link to="/products" className="bg-rose-500 hover:bg-rose-400 text-white font-black px-10 py-4 rounded-2xl shadow-xl transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm">
                    Explore Trends
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full py-8">
            <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight flex items-center">
                My Wishlist
                <span className="ml-4 text-sm font-bold bg-rose-100 text-rose-600 px-3 py-1 rounded-full uppercase tracking-widest">
                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                </span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Wishlist Items List */}
                <div className="flex-grow space-y-6">
                    {items.map((item) => (
                        <WishlistItem 
                            key={item.product?._id} 
                            item={item} 
                            isInCart={isInCart(item.product?._id)} 
                        />
                    ))}
                </div>

                {/* Wishlist Summary Sidebar */}
                <WishlistSummary 
                    items={items} 
                    totalValue={totalValue} 
                />
            </div>
        </div>
    );
};

export default WishlistPage;
