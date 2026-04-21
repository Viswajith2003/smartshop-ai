import React, { useState, useEffect } from 'react';
import { categoryAPI, productAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import usePagination from '../../hooks/usePagination';
import { Pagination } from '../ui';

const ProductManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    images: null,
    existingImage: '',
    description: '',
    isActive: true,
    rating: 0
  });

  const { pagination, handlePageChange, updatePagination } = usePagination(5); // Admin limit, e.g., 5
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getCategories();
        if (res.success) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
      images: null,
      existingImage: '',
      description: '',
      isActive: true,
      rating: 0
    });
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      category: product.category?._id || product.category || '',
      price: product.price,
      stock: product.stock,
      images: null,
      existingImage: product.images && product.images.length > 0 ? product.images[0] : '',
      description: product.description || '',
      isActive: product.isActive,
      rating: product.rating || 0
    });
    handleOpenModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await productAPI.deleteProduct(id);
      if (res.success) {
        toast.success('Product deleted successfully');
        setProducts(prev => prev.filter(p => p._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('category', formData.category);
      payload.append('price', formData.price);
      payload.append('stock', formData.stock);
      payload.append('description', formData.description);
      payload.append('isActive', formData.isActive);
      payload.append('rating', formData.rating);

      if (formData.images && formData.images.length > 0) {
        Array.from(formData.images).forEach(file => {
          payload.append('images', file);
        });
      } else if (formData.existingImage) {
        payload.append('images', formData.existingImage);
      }
      
      if (editingId) {
        const res = await productAPI.updateProduct(editingId, payload);
        if (res.success) {
          toast.success('Product updated successfully');
          setProducts(prev => prev.map(p => p._id === editingId ? res.data : p));
        }
      } else {
        const res = await productAPI.addProduct(payload);
        if (res.success) {
          toast.success('Product added successfully');
          setProducts(prev => [...prev, res.data]);
        }
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed!');
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const res = await productAPI.getProducts({ page: pagination.page, limit: pagination.limit });
        if (res.success) {
          setProducts(res.data);
          updatePagination(res.meta);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductsData();
  }, [pagination.page, pagination.limit]);

  return (
    <div className="space-y-8 p-1">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Products</h3>
          <p className="text-gray-500 text-sm font-bold tracking-widest mt-2 uppercase">Manage Your Inventory</p>
        </div>
        <button 
          onClick={handleOpenModal}
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
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Description</th>
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Rating</th>
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Price</th>
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Stock</th>
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1c3d]/30">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500 font-bold">No products found. Create one.</td>
                </tr>
              ) : products.map(product => (
                <tr key={product._id} className="hover:bg-[#1a1c3d]/20 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#1a1c3d] border border-[#1a1c3d]/50 shrink-0 shadow-lg relative group/image">
                        <img 
                          src={product.images && product.images.length > 0 ? product.images[0] : ''} 
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
                      {product.category?.name || 'Unknown'}
                    </span>
                  </td>
                  <td className="p-6">
                    <p className="text-gray-400 text-sm max-w-md whitespace-pre-wrap break-words leading-relaxed">
                      {product.description || 'N/A'}
                    </p>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400 font-black text-lg">{product.rating}</span>
                      <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
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
                      <button onClick={() => handleEdit(product)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all hover:scale-110">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all hover:scale-110">
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
        
        {products.length > 0 && (
          <div className="p-6 border-t border-[#1a1c3d]/50 bg-[#02001c]">
            <Pagination pagination={pagination} onPageChange={handlePageChange} theme="dark" />
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#02001c] w-full max-w-2xl rounded-[2rem] border border-[#1a1c3d] shadow-[0_0_50px_rgba(147,51,234,0.15)] relative overflow-hidden transform transition-all scale-100 my-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            
            <div className="p-8">
              <h2 className="text-2xl font-black text-white tracking-tight mb-6">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Product Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder-gray-600"
                      placeholder="e.g. iPhone 15 Pro"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Category</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Price</label>
                    <input 
                      type="number" 
                      required 
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder-gray-600"
                      placeholder="e.g. 999"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Stock</label>
                    <input 
                      type="number" 
                      required 
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder-gray-600"
                      placeholder="e.g. 50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Rating (0-5)</label>
                    <input 
                      type="number" 
                      required 
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: e.target.value})}
                      className="w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder-gray-600"
                      placeholder="e.g. 4.5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Product Images</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={(e) => setFormData({...formData, images: e.target.files})}
                    className="w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-black file:tracking-wider file:uppercase file:bg-purple-600 file:text-white hover:file:bg-purple-500 file:cursor-pointer"
                  />
                  {formData.existingImage && (!formData.images || formData.images.length === 0) && (
                    <div className="mt-3 flex items-center gap-3 bg-[#1a1c3d]/40 p-2 rounded-xl border border-[#1a1c3d]">
                       <img src={formData.existingImage} alt="Current" className="h-12 w-12 rounded-lg object-cover border border-purple-500/30" />
                       <span className="text-xs font-bold text-gray-400">Current Image</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium min-h-[150px] resize-y placeholder-gray-600"
                    placeholder="Short description of the product..."
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 bg-[#1a1c3d]/30 p-4 rounded-xl border border-[#1a1c3d]/50">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? 'bg-purple-500' : 'bg-gray-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm font-bold text-gray-300">Product is Active</span>
                </div>

                <div className="flex gap-4 pt-4 mt-2">
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    className="flex-1 bg-transparent hover:bg-gray-800 text-gray-400 font-bold py-3 rounded-xl transition-colors border border-gray-700"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black py-3 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-all transform hover:-translate-y-0.5"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
