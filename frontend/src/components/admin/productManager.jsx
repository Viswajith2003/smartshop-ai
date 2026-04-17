import React, { useState } from 'react';

const ProductManager = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      category: 'Smartphones',
      price: 134900,
      stock: 45,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80',
      isActive: true
    },
    {
      id: 2,
      name: 'Sony WH-1000XM5',
      category: 'Audio',
      price: 29990,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80',
      isActive: true
    },
    {
      id: 3,
      name: 'MacBook Pro M3 Max',
      category: 'Laptops',
      price: 399900,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
      isActive: false
    },
    {
      id: 4,
      name: 'Apple Watch Ultra 2',
      category: 'Wearables',
      price: 89900,
      stock: 0,
      image: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=500&q=80',
      isActive: true
    }
  ]);

  return (
    <div className="space-y-8 p-1">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Products</h3>
          <p className="text-gray-500 text-sm font-bold tracking-widest mt-2 uppercase">Manage Your Inventory</p>
        </div>
        <button 
          className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-2xl font-black tracking-widest uppercase text-sm shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>

      <div className="bg-[#02001c] rounded-[2rem] border border-[#1a1c3d] shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse relative z-10">
            <thead>
              <tr className="border-b border-[#1a1c3d]/50 bg-[#1e1470]/10">
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Product Details</th>
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Category</th>
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Price</th>
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Stock</th>
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1c3d]/30">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500 font-bold">No products found. Create one.</td>
                </tr>
              ) : products.map(product => (
                <tr key={product.id} className="hover:bg-[#1a1c3d]/20 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#1a1c3d] border border-[#1a1c3d]/50 shrink-0 shadow-lg relative group/image">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML += '<div class="absolute inset-0 flex items-center justify-center text-gray-600 font-bold text-xs">No Img</div>';
                          }}
                        />
                        {!product.isActive && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-white text-lg group-hover:text-purple-400 transition-colors block">{product.name}</span>
                        <span className={`text-xs font-black tracking-wider uppercase mt-1 inline-block ${product.isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 text-xs font-black tracking-wider uppercase rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="text-xl font-black tracking-tighter text-gray-200">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xl font-black tracking-tighter ${product.stock > 10 ? 'text-emerald-400' : product.stock > 0 ? 'text-orange-400' : 'text-red-500'}`}>
                        {product.stock}
                      </span>
                      <span className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">
                        {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all hover:scale-110">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>
                      <button className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all hover:scale-110">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
