import React, { useState, useEffect } from 'react';
import { categoryAPI, productAPI } from '../../services/api';
import { toast } from 'react-toastify';
import usePagination from '../../hooks/usePagination';
import { toastBackendError } from '../../utils/errorUtils';
import { Pagination, SearchBar, ConfirmModal } from '../common';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  EyeOff, 
  Star, 
  Package, 
  Layers, 
  IndianRupee, 
  Database,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .required('Product Name is required'),
  category: Yup.string().required('Category is required'),
  price: Yup.number()
    .min(0, 'Price must be positive')
    .required('Price is required'),
  stock: Yup.number()
    .min(0, 'Stock cannot be negative')
    .integer('Stock must be an integer')
    .required('Stock is required'),
  rating: Yup.number()
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating cannot exceed 5')
    .required('Rating is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  isActive: Yup.boolean().default(true),
});

const ProductManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  const { pagination, handlePageChange, updatePagination } = usePagination(5); 
  const [products, setProducts] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    handleOpenModal();
  };

  const handleDelete = (id) => {
    setProductToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await productAPI.deleteProduct(productToDelete);
      if (res.success) {
        toast.success('Product deleted successfully');
        setProducts(prev => prev.filter(p => p._id !== productToDelete));
        setIsConfirmOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
      console.error(error);
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit
        };

        if (adminSearchQuery && typeof adminSearchQuery === 'string') {
          params.search = adminSearchQuery.trim();
        }

        const res = await productAPI.getProducts(params);
        if (res.success) {
          setProducts(res.data);
          updatePagination(res.meta);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductsData();
  }, [pagination.page, pagination.limit, adminSearchQuery]);

  useEffect(() => {
    handlePageChange(1);
  }, [adminSearchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-800/20 p-6 rounded-3xl border border-slate-700/50 gap-6">
        <div className="shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-white">Inventory</h3>
            <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-lg text-xs font-bold">
              {pagination.totalProducts || products.length} Items
            </span>
          </div>
          <p className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-widest">Product Catalog</p>
        </div>

        <div className="flex-grow max-w-xl w-full">
          <SearchBar 
            variant="admin" 
            placeholder="Search catalog..." 
            onSearch={(val) => setAdminSearchQuery(val || '')}
          />
        </div>

        <button 
          onClick={handleOpenModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 group h-fit"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Add Product
        </button>
      </div>

      <div className="bg-[#1e293b] rounded-3xl border border-slate-700/50 shadow-xl overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/30">
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Product Details</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Price & Rating</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Inventory</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-slate-500 font-medium italic">No products found.</td>
                </tr>
              ) : products.map(product => (
                <tr key={product._id} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 shadow-inner relative group/image">
                        <img 
                          src={product.images && product.images.length > 0 ? product.images[0] : ''} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML += '<div class="absolute inset-0 flex items-center justify-center text-slate-700"><ImageIcon size={18} /></div>';
                          }}
                        />
                        {!product.isActive && (
                          <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center backdrop-blur-[1px]">
                             <EyeOff className="w-4 h-4 text-red-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors block leading-tight">{product.name}</span>
                        <div className="flex items-center gap-2 mt-1.5">
                           <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-slate-800 border ${product.isActive ? 'text-emerald-400 border-emerald-500/20' : 'text-slate-500 border-slate-700'}`}>
                             {product.isActive ? 'Live' : 'Hidden'}
                           </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase rounded-lg bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 w-fit">
                      <Layers size={10} />
                      {product.category?.name || 'Unsorted'}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="space-y-1.5">
                       <p className="text-white font-bold text-base flex items-center">
                          <IndianRupee size={14} className="text-slate-400 mr-0.5" />
                          {product.price.toLocaleString('en-IN')}
                       </p>
                       <div className="flex items-center gap-1.5">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="text-[11px] font-bold text-slate-400">{product.rating}</span>
                       </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-black tracking-tight ${product.stock > 10 ? 'text-slate-200' : product.stock > 0 ? 'text-amber-400' : 'text-red-500'}`}>
                          {product.stock}
                        </span>
                        <Database size={12} className="text-slate-600" />
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${product.stock > 10 ? 'text-slate-500' : product.stock > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                        {product.stock > 10 ? 'Available' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(product)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {products.length > 0 && (
          <div className="p-5 border-t border-slate-700 bg-slate-800/10">
            <Pagination pagination={pagination} onPageChange={handlePageChange} theme="dark" />
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm overflow-y-auto custom-scrollbar">
          <div className="bg-[#1e293b] w-full max-w-2xl rounded-[2rem] border border-slate-700 shadow-2xl relative overflow-hidden transform transition-all scale-100 my-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-slate-500 text-sm font-medium mb-8">Update your inventory with precise details.</p>
              
              <Formik
                initialValues={{
                  name: editingProduct ? editingProduct.name : '',
                  category: editingProduct ? (editingProduct.category?._id || editingProduct.category || '') : '',
                  price: editingProduct ? editingProduct.price : '',
                  stock: editingProduct ? editingProduct.stock : '',
                  description: editingProduct ? (editingProduct.description || '') : '',
                  isActive: editingProduct ? editingProduct.isActive : true,
                  rating: editingProduct ? (editingProduct.rating || 0) : 0,
                  images: null,
                  existingImage: editingProduct ? (editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images[0] : '') : ''
                }}
                validationSchema={ProductSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                  try {
                    const payload = new FormData();
                    payload.append('name', values.name);
                    payload.append('category', values.category);
                    payload.append('price', values.price);
                    payload.append('stock', values.stock);
                    payload.append('description', values.description);
                    payload.append('isActive', values.isActive);
                    payload.append('rating', values.rating);

                    if (values.images && values.images.length > 0) {
                      Array.from(values.images).forEach(file => {
                        payload.append('images', file);
                      });
                    } else if (values.existingImage) {
                      payload.append('images', values.existingImage);
                    }
                    
                    if (editingProduct) {
                      const id = editingProduct._id;
                      const res = await productAPI.updateProduct(id, payload);
                      if (res.success) {
                        toast.success('Product updated successfully');
                        setProducts(prev => prev.map(p => p._id === id ? res.data : p));
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
                    toastBackendError(error, (errors) => setErrors(errors));
                    console.error(error);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Product Name</label>
                        <Field 
                          name="name"
                          type="text" 
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder-slate-600 text-sm"
                          placeholder="e.g. MacBook Pro"
                        />
                        <ErrorMessage name="name" component="div" className="text-red-400 text-[10px] font-bold mt-1 uppercase" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Category</label>
                        <Field
                          name="category"
                          as="select"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-sm"
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="category" component="div" className="text-red-400 text-[10px] font-bold mt-1 uppercase" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Price</label>
                        <div className="relative">
                          <IndianRupee size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <Field 
                            name="price"
                            type="number" 
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder-slate-600 text-sm"
                            placeholder="Amount"
                          />
                        </div>
                        <ErrorMessage name="price" component="div" className="text-red-400 text-[10px] font-bold mt-1 uppercase" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">In Stock</label>
                        <Field 
                          name="stock"
                          type="number" 
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder-slate-600 text-sm"
                          placeholder="Quantity"
                        />
                        <ErrorMessage name="stock" component="div" className="text-red-400 text-[10px] font-bold mt-1 uppercase" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Rating (0-5)</label>
                        <div className="relative">
                           <Star size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <Field 
                            name="rating"
                            type="number" 
                            step="0.1"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder-slate-600 text-sm"
                            placeholder="4.5"
                          />
                        </div>
                        <ErrorMessage name="rating" component="div" className="text-red-400 text-[10px] font-bold mt-1 uppercase" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Media Assets</label>
                      <div className="flex gap-4 items-center bg-slate-900 border border-slate-700 rounded-2xl p-4">
                        <input 
                          type="file" 
                          accept="image/*"
                          multiple
                          name="images"
                          id="file-upload"
                          onChange={(e) => setFieldValue('images', e.currentTarget.files)}
                          className="hidden"
                        />
                        <label htmlFor="file-upload" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border border-slate-600">
                           <Plus size={14} /> Upload Images
                        </label>
                        <div className="text-[10px] text-slate-500 font-medium">
                           {values.images ? `${values.images.length} files selected` : (values.existingImage ? 'One image current' : 'No files chosen')}
                        </div>
                      </div>
                      
                      {values.existingImage && (!values.images || values.images.length === 0) && (
                        <div className="mt-2 flex items-center gap-3 bg-slate-900/40 p-2 rounded-xl border border-slate-800/50 w-fit">
                          <img src={values.existingImage} alt="Current" className="h-10 w-10 rounded-lg object-cover border border-slate-700" />
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Preview</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Detailed Description</label>
                      <Field 
                        name="description"
                        as="textarea"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium min-h-[100px] resize-none placeholder-slate-600 text-sm"
                        placeholder="Write something professional about this product..."
                      />
                      <ErrorMessage name="description" component="div" className="text-red-400 text-[10px] font-bold mt-1 uppercase" />
                    </div>

                    <div onClick={() => setFieldValue('isActive', !values.isActive)} className="flex items-center justify-between bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 cursor-pointer group hover:bg-emerald-500/10 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${values.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
                             {values.isActive ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                          </div>
                          <span className="text-xs font-bold text-slate-300">Marketplace Availability (Live)</span>
                       </div>
                       <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${values.isActive ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${values.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                       </div>
                    </div>

                    <div className="flex gap-4 pt-4 mt-2">
                      <button 
                        type="button" 
                        onClick={handleCloseModal}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl transition-colors text-xs uppercase tracking-widest border border-slate-700"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 text-xs uppercase tracking-widest"
                      >
                         {isSubmitting ? 'Syncing...' : (editingProduct ? 'Update Inventory' : 'Add to Catalog')}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Remove Product"
        message="Are you sure you want to permanently remove this product from your inventory?"
        loading={isDeleting}
      />
    </div>
  );
};

export default ProductManager;
