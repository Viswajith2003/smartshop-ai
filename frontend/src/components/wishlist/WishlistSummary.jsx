import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { clearWishlistState } from '../../features/wishlist/wishlistSlice';

const WishlistSummary = ({ items, totalValue }) => {
    const dispatch = useDispatch();

    const handleAddAllToCart = () => {
        items.forEach(item => {
            if (item.product?.stock > 0) {
                dispatch(addToCart({ 
                    productId: item.product._id, 
                    quantity: 1, 
                    price: item.product.price 
                }));
            }
        });
        // Optional: clear wishlist after moving items? 
        // Let's leave it for the user to decide or just keep them in both.
    };

    return (
        <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 sticky top-24">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    <i className="bi bi-heart-pulse-fill text-rose-500"></i>
                    Wishlist Insights
                </h3>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-bold uppercase tracking-wider">Total Items</span>
                        <span className="text-slate-900 font-black">{items.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-bold uppercase tracking-wider">Potential Value</span>
                        <span className="text-slate-900 font-black">₹{totalValue.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-50">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
                            Save these items for later or move them to your bag to complete your purchase.
                        </p>
                    </div>
                </div>

                <button 
                    onClick={handleAddAllToCart}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3"
                >
                    <i className="bi bi-bag-plus-fill text-lg"></i>
                    Add All to Bag
                </button>

                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-6 opacity-30 grayscale cursor-not-allowed">
                    <i className="bi bi-shield-check text-2xl"></i>
                    <i className="bi bi-truck text-2xl"></i>
                    <i className="bi bi-arrow-repeat text-2xl"></i>
                </div>
            </div>
        </div>
    );
};

export default WishlistSummary;
