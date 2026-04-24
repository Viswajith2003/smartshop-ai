import React from 'react';

const OrderItem = ({ item }) => {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
      <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center p-1">
        <img
          src={item.product?.images?.[0]}
          alt={item.product?.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex-grow">
        <h4 className="text-sm font-bold text-slate-800">{item.product?.name}</h4>
        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-black text-slate-900">₹{item.price.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
};

export default OrderItem;
