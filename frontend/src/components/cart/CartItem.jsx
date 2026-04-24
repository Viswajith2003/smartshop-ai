import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeFromCartDB, updateQuantityDB } from '../../features/cart/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <div key={item.product?._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-6 group transition-all hover:shadow-md">
      {/* Product Image */}
      <div className="w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center p-2">
        <img
          src={item.product?.images?.[0]}
          alt={item.product?.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Item Details */}
      <div className="flex-grow">
        <Link to={`/products/${item.product?._id}`} className="text-lg font-black text-slate-800 hover:text-indigo-600 transition-colors mb-1 block">
          {item.product?.name}
        </Link>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">
          {item.product?.category?.name || 'Category'}
        </span>

        <div className="flex items-center gap-6">
          {/* Quantity Selector */}
          <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
            <button
              onClick={() => item.quantity > 1 && dispatch(updateQuantityDB({ productId: item.product?._id, quantity: item.quantity - 1 }))}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
            >
              <i className="bi bi-dash-lg"></i>
            </button>
            <span className="w-10 text-center font-black text-slate-800">{item.quantity}</span>
            <button
              onClick={() => dispatch(updateQuantityDB({ productId: item.product?._id, quantity: item.quantity + 1 }))}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
            >
              <i className="bi bi-plus-lg"></i>
            </button>
          </div>

          <button
            onClick={() => dispatch(removeFromCartDB(item.product?._id))}
            className="text-red-400 hover:text-red-500 text-sm font-bold flex items-center gap-1 transition-colors"
          >
            <i className="bi bi-trash3 text-lg"></i>
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <span className="text-xl font-black text-slate-900 block">
          ₹{(item.price).toLocaleString('en-IN')}
        </span>
        <span className="text-xs font-bold text-slate-400">
          ₹{item.product?.price.toLocaleString('en-IN')} each
        </span>
      </div>
    </div>
  );
};

export default CartItem;
