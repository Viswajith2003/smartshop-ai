import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toggleWishlist } from '../../features/auth/wishlistSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { toast } from 'react-toastify';

const WishlistPage = () => {
    const { items } = useSelector((state) => state.wishlist);
    const { items: cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isInCart = (productId) => cartItems.some(item => (item.product?._id || item.product) === productId);

    const handleAddToCart = (product) => {
        if (isInCart(product._id)) {
            navigate('/cart');
            return;
        }
        dispatch(addToCart({ productId: product._id, quantity: 1, price: product.price }));
    };

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map((product) => (
                    <div key={product._id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-slate-100 group">
                        {/* Image Section */}
                        <div className="bg-slate-50 p-6 relative aspect-square flex items-center justify-center rounded-t-[2rem]">
                            {/* Remove Icon */}
                            <button 
                                onClick={() => dispatch(toggleWishlist(product))}
                                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-rose-500 w-10 h-10 flex items-center justify-center rounded-xl shadow-sm hover:bg-rose-500 hover:text-white transition-all z-10"
                            >
                                <i className="bi bi-heart-fill text-lg"></i>
                            </button>
                            
                            {/* Product Image */}
                            <img 
                                src={product.images && product.images[0]} 
                                alt={product.name} 
                                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Details Section */}
                        <div className="p-6 flex flex-col flex-grow">
                             <div className="mb-4">
                                <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase block mb-1">
                                    {product.category?.name || 'Category'}
                                </span>
                                <h3 className="text-slate-800 font-extrabold text-lg truncate group-hover:text-indigo-600 transition-colors">
                                    {product.name}
                                </h3>
                             </div>

                             <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                <span className="text-xl font-black text-slate-900">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </span>
                                <button 
                                    onClick={() => handleAddToCart(product)}
                                    className={`p-3 rounded-xl shadow-lg transition-all active:scale-95 ${isInCart(product._id) ? 'bg-indigo-50 text-indigo-600 shadow-indigo-50' : 'bg-indigo-600 text-white shadow-indigo-100 hover:shadow-indigo-200 hover:-translate-y-1'}`}
                                    title={isInCart(product._id) ? 'View in Cart' : 'Add to Cart'}
                                >
                                    <i className={`bi ${isInCart(product._id) ? 'bi-bag-check-fill' : 'bi-cart-plus-fill'}`}></i>
                                </button>
                             </div>
                        </div>

                        <Link to={`/products/${product._id}`} className="absolute inset-0 z-0"></Link>
                        <div className="pointer-events-none absolute -inset-px rounded-[2rem] border-2 border-transparent group-hover:border-indigo-400/20 transition-colors"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;
