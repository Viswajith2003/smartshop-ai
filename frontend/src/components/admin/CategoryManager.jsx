import React, { useEffect, useState } from 'react';
import { categoryAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ConfirmModal } from '../common';
import { toastBackendError } from '../../utils/errorUtils';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import usePagination from '../../hooks/usePagination';
import { Pagination, SearchBar } from '../common';

const CategorySchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .required('Category Name is required'),
  description: Yup.string()
    .min(2, 'Description must be at least 2 characters')
    .max(200, 'Description cannot exceed 200 characters'),
  isActive: Yup.boolean(),
});

const CategoryManager = () => {
  const [categories,setCategories]=useState([])
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { pagination, handlePageChange, updatePagination } = usePagination(10);

  const fetchCategories=async()=>{
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm
      };
      const res=await categoryAPI.getCategories(params)
      if(res.success){
        setCategories(res.data)
        updatePagination(res.meta);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchCategories()
  },[pagination.page, pagination.limit, searchTerm])

  useEffect(() => {
    handlePageChange(1);
  }, [searchTerm]);

  const handleEditCategory = (category = null) => {
    if (category) {
      setEditingCategory(category);
    } else {
      setEditingCategory(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      const res = await categoryAPI.deleteCategory(categoryToDelete);
      if (res.success) {
        setCategories(categories.filter(c => (c._id || c.id) !== categoryToDelete));
        toast.success('Category deleted successfully');
        setIsConfirmOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Categories</h3>
            <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-lg text-xs font-bold">
              {pagination.totalItems || categories.length} Total
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium mt-1">Organize your products into logical groups</p>
        </div>

        <div className="flex-grow max-w-md w-full">
           <SearchBar 
             variant="admin" 
             placeholder="Search categories..." 
             onSearch={(val) => setSearchTerm(val || '')}
           />
        </div>

        <button 
          onClick={() => handleEditCategory()}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 group h-fit"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Add New Category
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Description</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-500 font-medium italic">No categories found.</td>
                </tr>
              ) : categories.map(category => (
                <tr key={category._id || category.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-5">
                    <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{category.name}</span>
                  </td>
                  <td className="p-5">
                     <p className="text-slate-400 text-xs font-medium max-w-md truncate">{category.description}</p>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase rounded-lg border ${category.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                      {category.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEditCategory(category)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(category._id || category.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {categories.length > 0 && (
          <div className="p-5 border-t border-slate-50 bg-slate-50/20">
            <Pagination pagination={pagination} onPageChange={handlePageChange} theme="light" />
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2rem] border border-slate-100 shadow-2xl relative overflow-hidden transform transition-all scale-100">
            <div className="p-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
              <p className="text-slate-500 text-sm font-medium mb-8">Fill in the details below to save changes.</p>
              
              <Formik
                initialValues={{
                  name: editingCategory ? editingCategory.name : '',
                  description: editingCategory ? (editingCategory.description || '') : '',
                  isActive: editingCategory ? editingCategory.isActive : true
                }}
                validationSchema={CategorySchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                  try {
                    if (editingCategory) {
                      const id = editingCategory._id || editingCategory.id;
                      const res = await categoryAPI.updateCategory(id, values);
                      if (res.success) {
                        setCategories(categories.map(c => (c._id || c.id) === id ? res.data : c));
                        toast.success('Category updated successfully');
                      }
                    } else {
                      const res = await categoryAPI.addCategory(values);
                      if (res.success) {
                        setCategories([...categories, res.data]);
                        toast.success('Category added successfully');
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
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Category Name</label>
                      <Field 
                        name="name"
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder-slate-400"
                        placeholder="e.g. Smart Watches"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-400 text-[10px] font-bold mt-1 uppercase" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Description</label>
                      <Field 
                        name="description"
                        as="textarea"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium min-h-[80px] resize-none placeholder-slate-400 text-sm"
                        placeholder="Define what items go in this category..."
                      />
                      <ErrorMessage name="description" component="div" className="text-red-400 text-[10px] font-bold mt-1 uppercase" />
                    </div>

                    <div onClick={() => setFieldValue('isActive', !values.isActive)} className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 cursor-pointer group hover:bg-slate-100 transition-colors">
                       <span className="text-xs font-bold text-slate-300">Active Status</span>
                       <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${values.isActive ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${values.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                       </div>
                    </div>

                    <div className="flex gap-4 pt-4 mt-2">
                      <button 
                        type="button" 
                        onClick={handleCloseModal}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-colors text-xs uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 text-xs uppercase tracking-widest"
                      >
                        {isSubmitting ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
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
        title="Delete Category"
        message="Are you sure you want to permanently delete this category?"
        loading={isDeleting}
      />
    </div>
  );
};

export default CategoryManager;
