import React, { useEffect, useState } from 'react';
import { couponAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

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

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await couponAPI.getCoupons();
        if (res.success) {
          setCoupons(res.data);
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const res = await couponAPI.deleteCoupon(id);
        if (res.success) {
          setCoupons(coupons.filter(c => (c._id || c.id) !== id));
          toast.success('Coupon deleted successfully');
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
          <h3 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Coupons</h3>
          <p className="text-gray-500 text-sm font-bold tracking-widest mt-2 uppercase">Manage Discount Codes</p>
        </div>
        <button 
          onClick={() => handleEditCoupon()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3 rounded-2xl font-black tracking-widest uppercase text-sm shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Coupon
        </button>
      </div>

      <div className="bg-[#02001c] rounded-[2rem] border border-[#1a1c3d] shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse relative z-10">
            <thead>
              <tr className="border-b border-[#1a1c3d]/50 bg-[#1e1470]/10">
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Code</th>
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Discount</th>
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Valid Dates</th>
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Limits</th>
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase">Status</th>
                <th className="p-6 text-xs font-black tracking-[0.2em] text-gray-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1c3d]/30">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500 font-bold">No coupons found. Create one.</td>
                </tr>
              ) : coupons.map(coupon => (
                <tr key={coupon._id || coupon.id} className="hover:bg-[#1a1c3d]/20 transition-colors group">
                  <td className="p-6">
                    <span className="font-black text-white text-lg tracking-wider group-hover:text-purple-400 transition-colors bg-[#1a1c3d]/50 px-3 py-1 rounded-xl border border-purple-500/20">{coupon.code}</span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-lg">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `$${coupon.discountValue} OFF`}
                      </span>
                      {coupon.minOrderAmount > 0 && <span className="text-gray-500 text-xs font-bold">Min: ${coupon.minOrderAmount}</span>}
                      {coupon.maxDiscount > 0 && <span className="text-gray-500 text-xs font-bold">Max: ${coupon.maxDiscount}</span>}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-1 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-gray-300">{new Date(coupon.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="text-gray-300">{new Date(coupon.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-gray-300 font-medium text-sm">Uses: {coupon.usageCount || 0} / {coupon.usageLimit || '∞'}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase rounded-full border ${coupon.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditCoupon(coupon)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all hover:scale-110">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(coupon._id || coupon.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all hover:scale-110">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-[#02001c] w-full max-w-2xl rounded-[2rem] border border-[#1a1c3d] shadow-[0_0_50px_rgba(147,51,234,0.15)] relative overflow-hidden transform transition-all scale-100 max-h-[90vh] flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              <h2 className="text-2xl font-black text-white tracking-tight mb-6 flex items-center gap-3">
                <span className="bg-purple-500/20 text-purple-400 p-2 rounded-xl">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <path d="M2 9V5.25A1.25 1.25 0 0 1 3.25 4h17.5A1.25 1.25 0 0 1 22 5.25V9a2 2 0 0 0 0 4v3.75a1.25 1.25 0 0 1-1.25 1.25H3.25A1.25 1.25 0 0 1 2 16.25V13a2 2 0 0 0 0-4Z" />
                  </svg>
                </span>
                {editingCoupon ? 'Edit Coupon' : 'New Coupon'}
              </h2>
              
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
                onSubmit={async (values, { setSubmitting }) => {
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
                    console.error(error);
                    toast.error(error.response?.data?.message || 'Something went wrong');
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Code */}
                      <div className="space-y-2">
                        <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Coupon Code *</label>
                        <Field 
                          name="code"
                          type="text" 
                          className="w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-black tracking-wider placeholder-gray-600 uppercase"
                          placeholder="e.g. SUMMER24"
                          onChange={(e) => setFieldValue('code', e.target.value.toUpperCase())}
                        />
                        <ErrorMessage name="code" component="div" className="text-red-500 text-xs font-bold mt-1" />
                      </div>

                      {/* Discount Type */}
                      <div className="space-y-2">
                        <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Discount Type *</label>
                        <Field
                          name="discountType"
                          as="select"
                          className="w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount ($)</option>
                        </Field>
                        <ErrorMessage name="discountType" component="div" className="text-red-500 text-xs font-bold mt-1" />
                      </div>

                      {/* Discount Value & Min Order */}
                      <div className="space-y-2">
                        <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Discount Config *</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                              {values.discountType === 'percentage' ? '%' : '$'}
                            </span>
                            <Field 
                              name="discountValue"
                              type="number" 
                              min="1"
                              max={values.discountType === 'percentage' ? "100" : undefined}
                              className="w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl pl-9 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder-gray-600 appearance-none"
                              placeholder="Value"
                            />
                            <ErrorMessage name="discountValue" component="div" className="text-red-500 text-xs font-bold mt-1" />
                          </div>
                          <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                            <Field 
                              name="minOrderAmount"
                              type="number" 
                              className="w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder-gray-600 appearance-none"
                              placeholder="Min Order"
                            />
                            <ErrorMessage name="minOrderAmount" component="div" className="text-red-500 text-xs font-bold mt-1 max-w-[120px] truncate" title="Cannot be negative" />
                          </div>
                        </div>
                      </div>

                      {/* Max Discount & Usage Limit */}
                      <div className="space-y-2">
                        <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Limits</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                            <Field 
                              name="maxDiscount"
                              type="number" 
                              disabled={values.discountType === 'fixed'}
                              className={`w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder-gray-600 appearance-none ${values.discountType === 'fixed' ? 'opacity-30 cursor-not-allowed' : ''}`}
                              placeholder="Max Disc"
                            />
                            <ErrorMessage name="maxDiscount" component="div" className="text-red-500 text-xs font-bold mt-1" />
                          </div>
                          <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">#</span>
                            <Field 
                              name="usageLimit"
                              type="number" 
                              className="w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder-gray-600 appearance-none"
                              placeholder="Total Uses"
                            />
                            <ErrorMessage name="usageLimit" component="div" className="text-red-500 text-xs font-bold mt-1" />
                          </div>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="space-y-2">
                        <label className="text-xs font-black tracking-widest text-gray-400 uppercase">Start Date *</label>
                        <Field 
                          name="startDate"
                          type="date" 
                          className="w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder-gray-600 [color-scheme:dark]"
                        />
                        <ErrorMessage name="startDate" component="div" className="text-red-500 text-xs font-bold mt-1" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-black tracking-widest text-gray-400 uppercase">End Date *</label>
                        <Field 
                          name="endDate"
                          type="date" 
                          className="w-full bg-[#1a1c3d]/50 border border-[#1a1c3d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder-gray-600 [color-scheme:dark]"
                        />
                        <ErrorMessage name="endDate" component="div" className="text-red-500 text-xs font-bold mt-1" />
                      </div>

                    </div>

                    <div className="flex items-center gap-3 bg-[#1a1c3d]/30 p-4 rounded-xl border border-[#1a1c3d]/50 mt-6">
                      <button
                        type="button"
                        onClick={() => setFieldValue('isActive', !values.isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${values.isActive ? 'bg-purple-500' : 'bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${values.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <span className="text-sm font-bold text-gray-300">Coupon is Active</span>
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
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black py-3 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        {editingCoupon ? 'Save Changes' : 'Create Coupon'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManager;
