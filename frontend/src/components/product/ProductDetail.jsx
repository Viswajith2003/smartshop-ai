import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { toggleWishlist } from '../../features/auth/wishlistSlice';
import { toast } from 'react-toastify';

const ProductDetail = ({ products }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartItems = useSelector((state) => state.cart.items);
  
  if (!products) return null;

  const isWishlisted = wishlistItems.some(item => item._id === products._id);
  const isInCart = cartItems.some(item => (item.product?._id || item.product) === products._id);

  const handleAddToCart = () => {
    if (isInCart) {
      navigate('/cart');
      return;
    }
    dispatch(addToCart({ productId: products._id, quantity: 1, price: products.price }));
  };

  const handleBuyNow = () => {
    if (isInCart) {
      navigate('/cart');
      return;
    }
    dispatch(addToCart({ productId: products._id, quantity: 1, price: products.price }));
    navigate('/cart');
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(products));
    if (isWishlisted) {
      toast.info(`Removed ${products.name} from wishlist`);
    } else {
      toast.success(`Added ${products.name} to wishlist`);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Back button - Outside the card */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/products')} 
          className="text-slate-500 hover:text-blue-600 transition-colors flex items-center text-sm font-bold bg-white/50 px-4 py-2 rounded-full border border-slate-200 hover:border-blue-300 shadow-sm"
        >
          <i className="bi bi-arrow-left mr-2"></i> Back to Products
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Product Image Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full lg:w-1/2 flex items-center justify-center relative min-h-[450px] border border-slate-100">
           <img 
            src={products.images && products.images.length > 0 ? products.images[0] : products.image} 
            alt={products.name} 
            className="max-w-full max-h-[400px] object-contain hover:scale-105 transition-transform duration-500" 
           />
           {!products.isActive && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-3xl">
               <span className="bg-red-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest shadow-lg">Inactive</span>
             </div>
           )}
        </div>

        {/* Product Info Section */}
        <div className="w-full lg:w-1/2">
           <div className="flex items-center gap-3 mb-4">
             <span className="px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
               {products.category?.name || 'Category'}
             </span>
             <span className={`px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-full border ${products.stock > 0 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
               {products.stock > 0 ? `In Stock (${products.stock})` : 'Out of Stock'}
             </span>
           </div>

           <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">
             {products.name}
           </h1>

           <div className="flex items-center gap-6 mb-8">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Price</span>
                <span className="text-4xl font-black text-slate-900">₹{products.price?.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-12 w-px bg-slate-200 hidden sm:block"></div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Rating</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-amber-500">{products.rating || 0}</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`bi bi-star${i < Math.floor(products.rating || 0) ? '-fill' : ''} text-sm`}></i>
                    ))}
                  </div>
                </div>
              </div>
           </div>

           <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-slate-100">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Description</h3>
             <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-line">
               {products.description}
             </p>
           </div>

           <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={handleBuyNow}
                className="flex-grow sm:flex-grow-0 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm px-10 py-4 rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest"
              >
                {isInCart ? 'Checkout Now' : 'Buy Now'}
              </button>
              <button 
                onClick={handleWishlist}
                className={`p-4 border-2 rounded-2xl transition-all hover:scale-110 shadow-sm ${isWishlisted ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-white text-slate-400 border-slate-100 hover:border-rose-100 hover:bg-rose-50'}`}
              >
                <i className={`bi bi-heart${isWishlisted ? '-fill' : ''} text-xl`}></i>
              </button>
              <button 
                onClick={handleAddToCart}
                className={`p-4 border-2 rounded-2xl transition-all hover:scale-110 shadow-sm ${isInCart ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-white text-blue-600 border-slate-100 hover:border-blue-100 hover:bg-blue-50'}`}
                title={isInCart ? 'View in Cart' : 'Add to Cart'}
              >
                <i className={`bi ${isInCart ? 'bi-bag-check-fill' : 'bi-cart-plus-fill'} text-xl`}></i>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
