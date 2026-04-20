import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductDetail = ({ product }) => {
  const navigate = useNavigate();
  
  if (!product) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      {/* Product Image Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 w-full lg:w-1/2 flex items-center justify-center relative min-h-[400px]">
         {/* Back button */}
         <button onClick={() => navigate('/products')} className="absolute top-4 left-4 text-slate-400 hover:text-slate-800 transition-colors flex items-center text-sm font-medium">
            <i className="bi bi-arrow-left mr-1"></i> Back
         </button>
         <img src={product.image} alt={product.name} className="max-w-full max-h-[400px] object-contain" />
      </div>

      {/* Product Info Section */}
      <div className="w-full lg:w-1/2 pt-4">
         <h1 className="text-4xl font-extrabold text-black mb-1">{product.name}</h1>
         <p className="text-sm text-slate-500 font-medium mb-8 uppercase tracking-wide">
           {product.subtitle}
         </p>

         <div className="flex items-baseline gap-4 mb-4">
            <span className="text-4xl font-bold text-black border-r border-slate-300 pr-4">₹ {product.price}</span>
            <span className="text-2xl font-medium text-blue-500">({product.discountLabel})</span>
         </div>

         <div className="flex items-center gap-2 mb-8">
            <span className="text-blue-600 font-bold text-lg">{product.rating}</span>
            <span className="text-sm text-slate-500 font-medium">{product.ratingCount} ratings</span>
         </div>

         <div className="text-sm text-slate-600 font-medium leading-relaxed mb-10 whitespace-pre-line">
            {product.description}
         </div>

         <div className="flex items-center gap-6">
            <button className="bg-[#1877F2] hover:bg-blue-600 text-white font-medium text-lg px-8 py-3 rounded-lg shadow-md transition-colors">
              Buy Now
            </button>
            <button className="text-slate-700 hover:text-red-500 transition-colors">
              <i className="bi bi-heart text-3xl font-bold hover:scale-110 block transition-transform"></i>
            </button>
            <button className="text-slate-700 hover:text-blue-500 transition-colors">
              <i className="bi bi-cart3 text-3xl font-bold hover:scale-110 block transition-transform"></i>
            </button>
         </div>
      </div>
    </div>
  );
};

export default ProductDetail;
