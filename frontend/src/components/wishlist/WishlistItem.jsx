import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleWishlist } from '../../features/wishlist/wishlistSlice';
import { addToCart } from '../../features/cart/cartSlice';

const WishlistItem = ({ item, isInCart }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const product = item.product;

    if (!product) return null;

    const handleMoveToCart = () => {
        if (isInCart) {
            navigate('/cart');
            return;
        }
        dispatch(addToCart({ 
            productId: product._id, 
            quantity: 1, 
            price: product.price 
        }));
        dispatch(toggleWishlist(product._id));
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6 group transition-all hover:shadow-md relative overflow-hidden">
            {/* Product Image */}
            <div className="w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center p-2 relative">
                <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
                {!product.stock || product.stock === 0 && (
                     <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="text-[10px] font-black bg-red-500 text-white px-2 py-1 rounded-lg uppercase tracking-widest">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* Item Details */}
            <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                        <Link to={`/products/${product._id}`} className="text-lg font-black text-slate-800 hover:text-rose-600 transition-colors block">
                            {product.name}
                        </Link>
                        <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block">
                            {product.category?.name || 'Category'}
                        </span>
                    </div>
                    <div className="text-xl font-black text-slate-900">
                        ₹{product.price.toLocaleString('en-IN')}
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-6">
                    {/* Add to Cart Button */}
                    <button
                        onClick={handleMoveToCart}
                        disabled={product.stock === 0}
                        className={`flex-grow sm:flex-grow-0 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${
                            isInCart 
                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                            : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-500'
                        } ${product.stock === 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    >
                        <i className={`bi ${isInCart ? 'bi-bag-check-fill' : 'bi-cart-plus-fill'}`}></i>
                        {isInCart ? 'In Cart' : 'Move to Cart'}
                    </button>

                    {/* Remove Button */}
                    <button
                        onClick={() => dispatch(toggleWishlist(product._id))}
                        className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Remove from wishlist"
                    >
                        <i className="bi bi-trash3 text-xl"></i>
                    </button>
                </div>
            </div>

            {/* Decorative border on hover */}
            <div className="pointer-events-none absolute -inset-px rounded-3xl border-2 border-transparent group-hover:border-rose-400/10 transition-colors"></div>
        </div>
    );
};

export default WishlistItem;
