import React, { useEffect, useState } from 'react';
import { couponAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ConfirmModal } from '../common';
import { toastBackendError } from '../../utils/errorUtils';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Ticket, 
  Calendar, 
  Users, 
  ChevronRight,
  Info,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const CouponSchema = Yup.object().shape({
  code: Yup.string().required('Code is required').uppercase(),
  discountType: Yup.string().oneOf(['percentage', 'fixed']).required(),
  discountValue: Yup.number()
    .positive('Must be positive')
    .required('Value is required')
    .test('max-percentage', 'Max 100%', function(value) {
      if (this.parent.discountType === 'percentage' && value > 100) return false;
      return true;
    }),
  minOrderAmount: Yup.number().min(0, 'Cannot be negative').nullable().transform((v, o) => o === '' ? null : v),
  maxDiscount: Yup.number().min(0, 'Cannot be negative').nullable().transform((v, o) => o === '' ? null : v),
  usageLimit: Yup.number().integer().min(1).nullable().transform((v, o) => o === '' ? null : v),
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date()
    .min(Yup.ref('startDate'), 'Cannot be earlier than Start Date')
    .required('End Date is required'),
  isActive: Yup.boolean().default(true)
});

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await couponAPI.getCoupons();
        if (res.success) {
          const couponList = Array.isArray(res.data) ? res.data : (res.data.coupons || []);
          setCoupons(couponList);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch coupons');
      }
    };
    fetchCoupons();
  }, []);

  const handleEditCoupon = (coupon = null) => {
    setEditingCoupon(coupon || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleDelete = (id) => {
    setCouponToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!couponToDelete) return;
    setIsDeleting(true);
    try {
      const res = await couponAPI.deleteCoupon(couponToDelete);
      if (res.success) {
        setCoupons(coupons.filter(c => (c._id || c.id) !== couponToDelete));
        toast.success('Coupon deleted successfully');
        setIsConfirmOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsDeleting(false);
      setCouponToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white">Coupons</h3>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage promotional offers and discounts</p>
        </div>
        <button 
          onClick={() => handleEditCoupon()}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Create Coupon
        </button>
      </div>

      <div className="bg-[#1e293b] rounded-3xl border border-slate-700/50 shadow-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/30">
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Code</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Discount</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Validity</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Usage</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-10 text-center text-slate-500 font-medium italic">No active coupons found.</td>
              </tr>
            ) : coupons.map(coupon => (
              <tr key={coupon._id || coupon.id} className="hover:bg-slate-800/20 transition-colors group">
                <td className="p-5">
                  <span className="font-black text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 tracking-widest uppercase text-sm">{coupon.code}</span>
                </td>
                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="text-slate-200 font-bold">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                    </span>
                    {coupon.minOrderAmount > 0 && <span className="text-slate-500 text-[10px] uppercase font-black tracking-tight mt-0.5">Min: ₹{coupon.minOrderAmount}</span>}
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                     <span className="text-emerald-500 flex items-center gap-1"><Calendar size={12} /> {new Date(coupon.startDate).toLocaleDateString()}</span>
                     <ChevronRight size={10} className="text-slate-600" />
                     <span className="text-red-400 flex items-center gap-1"><Calendar size={12} /> {new Date(coupon.endDate).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                       <Users size={14} className="text-slate-500" />
                    </div>
                    <span className="text-slate-300 font-bold text-xs">{coupon.usageCount || 0} / {coupon.usageLimit || '∞'}</span>
                  </div>
                </td>
                <td className="p-5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-black uppercase rounded border ${coupon.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-700/30 text-slate-500 border-slate-700'}`}>
                    {coupon.isActive ? 'Active' : 'Expired'}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEditCoupon(coupon)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(coupon._id || coupon.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#1e293b] w-full max-w-2xl rounded-[2rem] border border-slate-700 shadow-2xl relative overflow-hidden transform transition-all scale-100 my-8">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2 flex items-center gap-2">
                <Ticket className="text-indigo-500" size={24} />
                {editingCoupon ? 'Update Offer' : 'New Promotional Code'}
              </h2>
              <p className="text-slate-500 text-sm font-medium mb-8">Set up discounts and limits for this coupon code.</p>
              
              <Formik
                initialValues={{
                  code: editingCoupon ? editingCoupon.code : '',
                  discountType: editingCoupon ? editingCoupon.discountType : 'percentage',
                  discountValue: editingCoupon ? editingCoupon.discountValue : '',
                  minOrderAmount: editingCoupon && editingCoupon.minOrderAmount ? editingCoupon.minOrderAmount : '',
                  maxDiscount: editingCoupon && editingCoupon.maxDiscount ? editingCoupon.maxDiscount : '',
                  startDate: editingCoupon && editingCoupon.startDate ? new Date(editingCoupon.startDate).toISOString().split('T')[0] : '',
                  endDate: editingCoupon && editingCoupon.endDate ? new Date(editingCoupon.endDate).toISOString().split('T')[0] : '',
                  usageLimit: editingCoupon && editingCoupon.usageLimit ? editingCoupon.usageLimit : '',
                  isActive: editingCoupon ? editingCoupon.isActive : true
                }}
                validationSchema={CouponSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                  try {
                    const payload = {
                      ...values,
                      code: values.code.toUpperCase()
                    };
                    if (editingCoupon) {
                      const id = editingCoupon._id || editingCoupon.id;
                      const res = await couponAPI.updateCoupon(id, payload);
                      if (res.success) {
                        setCoupons(coupons.map(c => (c._id || c.id) === id ? res.data : c));
                        toast.success('Coupon updated successfully');
                      }
                    } else {
                      const res = await couponAPI.addCoupon(payload);
                      if (res.success) {
                        setCoupons([...coupons, res.data]);
                        toast.success('Coupon added successfully');
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
                        <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Coupon Code</label>
                        <Field 
                          name="code"
                          type="text" 
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-black tracking-widest placeholder-slate-600 uppercase text-sm"
                          placeholder="e.g. SAVE20"
                          onChange={(e) => setFieldValue('code', e.target.value.toUpperCase())}
                        />
                        <ErrorMessage name="code" component="div" className="text-red-400 text-[10px] font-bold mt-1 uppercase" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Type</label>
                        <Field
                          name="discountType"
                          as="select"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-sm"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (₹)</option>
                        </Field>
                        <ErrorMessage name="discountType" component="div" className="text-red-400 text-[10px] font-bold mt-1 uppercase" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Value & Min Order</label>
                        <div className="flex gap-2">
                          <Field 
                            name="discountValue"
                            type="number" 
                            className="w-full flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-sm"
                            placeholder={values.discountType === 'percentage' ? 'Percent %' : 'Amount ₹'}
                          />
                          <Field 
                            name="minOrderAmount"
                            type="number" 
                            className="w-full flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-sm"
                            placeholder="Min ₹"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Usage Limit & Max Discount</label>
                        <div className="flex gap-2">
                          <Field 
                            name="usageLimit"
                            type="number" 
                            className="w-full flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-sm"
                            placeholder="Usage Limit"
                          />
                          <Field 
                            name="maxDiscount"
                            type="number" 
                            disabled={values.discountType === 'fixed'}
                            className={`w-full flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-sm ${values.discountType === 'fixed' ? 'opacity-30' : ''}`}
                            placeholder="Max ₹"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Starts On</label>
                        <Field 
                          name="startDate"
                          type="date" 
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-sm [color-scheme:dark]"
                        />
                        <ErrorMessage name="startDate" component="div" className="text-red-400 text-[10px] font-bold mt-1 uppercase" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Expires On</label>
                        <Field 
                          name="endDate"
                          type="date" 
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-sm [color-scheme:dark]"
                        />
                        <ErrorMessage name="endDate" component="div" className="text-red-400 text-[10px] font-bold mt-1 uppercase" />
                      </div>

                    </div>

                    <div onClick={() => setFieldValue('isActive', !values.isActive)} className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-700 cursor-pointer group hover:bg-slate-900 transition-colors">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 className={`w-4 h-4 ${values.isActive ? 'text-emerald-500' : 'text-slate-600'}`} />
                          <span className="text-xs font-bold text-slate-300">Set as Active</span>
                       </div>
                       <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${values.isActive ? 'bg-indigo-600' : 'bg-slate-700'}`}>
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
                        {isSubmitting ? 'Processing...' : (editingCoupon ? 'Update Offer' : 'Issue Coupon')}
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
        title="Revoke Coupon"
        message="Are you sure you want to permanently delete this discount code?"
        loading={isDeleting}
      />
    </div>
  );
};

export default CouponManager;
