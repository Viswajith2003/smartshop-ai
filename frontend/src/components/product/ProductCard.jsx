import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, isWishlisted, isInCart, handleWishlist, handleAddToCart }) => {
  return (
    <Link 
      to={product.isActive === false ? '#' : `/products/${product._id}`} 
      onClick={(e) => { if(product.isActive === false) e.preventDefault() }}
      className={`bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] flex flex-col group ${product.isActive === false ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] transition-all duration-500 cursor-pointer'}`}
    >
      <div className="bg-slate-50/50 p-8 relative aspect-square flex items-center justify-center overflow-hidden">
        {product.isActive === false && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-sm">
            <span className="bg-slate-900 text-white font-black tracking-widest px-6 py-2 text-xs rounded-xl shadow-2xl transform -rotate-12 border-2 border-slate-800">UNAVAILABLE</span>
          </div>
        )}
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full shadow-sm border border-slate-200 uppercase">
          {product.stock} Left
        </div>
        <div 
          onClick={(e) => {
            if(product.isActive === false) { e.preventDefault(); return; }
            handleWishlist(e, product);
          }}
          className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform ${isWishlisted ? 'text-pink-500' : 'text-slate-300 hover:text-pink-500'} ${product.isActive === false ? 'hidden' : ''}`}
        >
          <i className={`bi bi-heart${isWishlisted ? '-fill' : ''} text-sm mt-0.5`}></i>
        </div>
        <img 
          src={product.images && product.images[0]} 
          alt={product.name} 
          className={`max-h-full max-w-full object-contain filter drop-shadow-xl transition-transform duration-700 ${product.isActive !== false && 'group-hover:scale-110 group-hover:-rotate-2'}`}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow relative bg-white">
        <div className="flex gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <i key={i} className={`bi bi-star${i < Math.floor(product.rating || 0) ? '-fill' : ''} text-yellow-400 text-sm`}></i>
          ))}
        </div>
        <h3 className="text-slate-800 font-extrabold text-lg leading-tight mb-4 line-clamp-2">{product.name}</h3>
        <div className="flex justify-between items-end mt-auto pt-4 border-t border-slate-100">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Price</span>
            <div className={`font-black text-2xl tracking-tighter ${product.isActive === false ? 'text-slate-400' : 'text-slate-900'}`}>
              ₹{product.price?.toLocaleString()}
            </div>
          </div>
          {product.isActive !== false && (
            <button 
              onClick={(e) => handleAddToCart(e, product)}
              className={`${isInCart ? 'bg-indigo-600' : 'bg-black hover:bg-indigo-600'} text-white transition-all duration-300 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transform`}
              title={isInCart ? "View in Cart" : "Add to Cart"}
            >
              <i className={`bi ${isInCart ? 'bi-bag-check-fill' : 'bi-cart-plus-fill'} text-xl`}></i>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
