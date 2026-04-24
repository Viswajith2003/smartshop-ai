import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, isWishlisted, isInCart, handleWishlist, handleAddToCart }) => {
  if (!products || products.length === 0) {
    return (
      <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-400 font-bold">
        <i className="bi bi-search text-4xl mb-4 opacity-20"></i>
        No products found matching your filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 flex-grow">
      {products.map((product) => (
        <ProductCard 
          key={product._id} 
          product={product} 
          isWishlisted={isWishlisted(product._id)}
          isInCart={isInCart(product._id)}
          handleWishlist={handleWishlist}
          handleAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductList;
