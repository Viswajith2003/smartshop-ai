import React, { useEffect, useState } from 'react';
import {categoryAPI} from '../../utils/api';
import { toast } from 'react-toastify';

const CategoryManager = () => {
  const [categories,setCategories]=useState([])
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true });


  useEffect(()=>{
    const fetchCategories=async()=>{
      try {
        const res=await  categoryAPI.getCategories()
        if(res.success){
          setCategories(res.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchCategories()
  },[])

  const handleEditCategory = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description, isActive: category.isActive });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const id = editingCategory._id || editingCategory.id;
        const res = await categoryAPI.updateCategory(id, formData);
        if (res.success) {
          setCategories(categories.map(c => (c._id || c.id) === id ? res.data : c));
          toast.success('Category updated successfully');
        }
      } else {
        const res = await categoryAPI.addCategory(formData);
        if (res.success) {
          setCategories([...categories, res.data]);
          toast.success('Category added successfully');
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this category?')) {
      try {
        const res = await categoryAPI.deleteCategory(id);
        if (res.success) {
          setCategories(categories.filter(c => (c._id || c.id) !== id));
          toast.success('Category deleted successfully');
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    }
  };

  return (
    <div className="space-y-8 p-1">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Categories</h3>
          <p className="text-gray-500 text-sm font-bold tracking-widest mt-2 uppercase">Manage Product Categories</p>
        </div>
        <button 
          onClick={() => handleEditCategory()}
          className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-2xl font-black tracking-widest uppercase text-sm shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Category
        </button>
      </div>

      <div className="bg-[#02001c] rounded-[2rem] border border-[#1a1c3d] shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse relative z-10">
            <thead>
              <tr className="border-b border-[#1a1c3d]/50 bg-[#1e1470]/10">
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Category Name</th>
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Description</th>
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Status</th>
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1c3d]/30">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-500 font-bold">No categories found. Create one.</td>
                </tr>
              ) : categories.map(category => (
                <tr key={category._id || category.id} className="hover:bg-[#1a1c3d]/20 transition-colors group">
                  <td className="p-6">
                    <span className="font-bold text-white text-lg group-hover:text-purple-400 transition-colors">{category.name}</span>
                  </td>
                  <td className="p-6 text-gray-400 font-medium">{category.description}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 text-xs font-black tracking-wider uppercase rounded-full border ${category.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditCategory(category)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all hover:scale-110">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(category._id || category.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all hover:scale-110">
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#02001c] w-full max-w-md rounded-[2rem] border border-[#1a1c3d] shadow-[0_0_50px_rgba(147,51,234,0.15)] relative overflow-hidden transform transition-all scale-100">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            
            <div className="p-8">
              <h2 className="text-2xl font-black text-white tracking-tight mb-6">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Category Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder-gray-600"
                    placeholder="e.g. Smart Watches"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium min-h-[100px] resize-none placeholder-gray-600"
                    placeholder="Short description of the category..."
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
                  <span className="text-sm font-bold text-gray-300">Category is Active</span>
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
                    {editingCategory ? 'Save Changes' : 'Create'}
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

export default CategoryManager;
