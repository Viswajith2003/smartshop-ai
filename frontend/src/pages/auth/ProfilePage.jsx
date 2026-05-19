import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, 
    MapPin, 
    Wallet, 
    Package, 
    RefreshCcw, 
    XCircle, 
    ChevronRight,
    ChevronLeft,
    Camera, 
    LogOut,
    CreditCard,
    ShieldCheck,
    Phone,
    Star,
    Search,
    Calendar,
    Edit3,
    Trash2,
    ShoppingBag,
    Eye,
    EyeOff,
    LayoutList,
    LayoutGrid
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authAPI } from '../../features/auth/authAPI';
import { orderAPI, productApi } from '../../services/api';
import { loginSuccess } from '../../features/auth/authSlice';
import { Loader, ConfirmModal } from '../../components/common';
import OrderDetailView from '../../components/profile/OrderDetailView';
import { API_CONFIG } from '../../config/app';
import { toastBackendError } from '../../utils/errorUtils';
import Breadcrumbs from '../../components/common/Breadcrumbs';

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewSearch, setReviewSearch] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [orderSearch, setOrderSearch] = useState('');
    const [orderPage, setOrderPage] = useState(1);
    const [orderViewMode, setOrderViewMode] = useState('list'); // 'list' or 'grid'
    const ordersPerPage = 8;
    
    // Form States
    const [profileForm, setProfileForm] = useState({ name: '', email: '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'address', 'wallet', 'orders', 'returns', 'cancellations', 'reviews'

    // Calculate dynamic totals from orders list
    const allOrdersAmount = orders.reduce((sum, o) => sum + (o.pricing?.totalPrice || o.totalAmount || 0), 0);
    
    const returnedOrders = orders.filter(o => o.orderStatus?.toUpperCase() === 'RETURNED');
    const returnedAmount = returnedOrders.reduce((sum, o) => sum + (o.pricing?.totalPrice || o.totalAmount || 0), 0);
    
    const cancelledOrders = orders.filter(o => o.orderStatus?.toUpperCase() === 'CANCELLED');
    const cancelledAmount = cancelledOrders.reduce((sum, o) => sum + (o.pricing?.totalPrice || o.totalAmount || 0), 0);

    const addressValidationSchema = Yup.object({
        fullName: Yup.string().required('Full name is required'),
        phone: Yup.string().matches(/^\d{10}$/, 'Phone must be 10 digits').required('Phone is required'),
        street: Yup.string().required('Street is required'),
        city: Yup.string().required('City is required'),
        district: Yup.string().required('District is required'),
        state: Yup.string().required('State is required'),
        pincode: Yup.string().matches(/^\d{6}$/, 'Pincode must be 6 digits').required('Pincode is required'),
        isDefault: Yup.boolean()
    });

    const formik = useFormik({
        initialValues: {
            fullName: user?.name || '',
            phone: '',
            street: '',
            city: '',
            district: '',
            state: '',
            pincode: '',
            isDefault: false
        },
        enableReinitialize: true,
        validationSchema: addressValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            setUpdating(true);
            try {
                let response;
                if (editingAddressId) {
                    response = await authAPI.updateAddress(editingAddressId, values);
                } else {
                    response = await authAPI.addAddress(values);
                }
                setAddresses(response.data);
                resetAddressForm();
                toast.success(editingAddressId ? 'Address updated!' : 'Address added!');
            } catch (err) {
                toastBackendError(err, (errors) => formik.setErrors(errors));
            } finally {
                setUpdating(false);
            }
        }
    });

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const response = await authAPI.getProfile();
            const userData = response.data;
            setProfileForm({ name: userData.name, email: userData.email });
            setAddresses(userData.address || []);
            // Sync Redux
            dispatch(loginSuccess(userData));
        } catch (err) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    const fetchOrders = useCallback(async () => {
        try {
            setOrdersLoading(true);
            const response = await orderAPI.getMyOrders();
            setOrders(response.data || []);
        } catch (err) {
            toast.error('Failed to load orders');
        } finally {
            setOrdersLoading(false);
        }
    }, []);
    const fetchReviews = useCallback(async () => {
        try {
            setReviewsLoading(true);
            const response = await productApi.getMyReviews();
            setReviews(response.data || []);
        } catch (err) {
            toast.error('Failed to load reviews');
        } finally {
            setReviewsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
        fetchOrders();
        fetchReviews();
    }, [fetchProfile, fetchOrders, fetchReviews]);

    useEffect(() => {
        if (['orders', 'returns', 'cancellations'].includes(activeTab)) {
            fetchOrders();
            setSelectedOrderId(null);
            setOrderPage(1);
        } else if (activeTab === 'reviews') {
            fetchReviews();
        }
    }, [activeTab, fetchOrders, fetchReviews]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            // Update Name
            if (profileForm.name !== user.name) {
                const response = await authAPI.updateProfile({ name: profileForm.name });
                dispatch(loginSuccess(response.data));
                toast.success('Name updated successfully!');
            }

            // Update Password if fields are filled
            if (passwordForm.currentPassword && passwordForm.newPassword) {
                if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                    toast.error('New passwords do not match');
                    setUpdating(false);
                    return;
                }
                await authAPI.changePassword({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                });
                toast.success('Password changed successfully!');
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (err) {
            toastBackendError(err);
        } finally {
            setUpdating(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic client-side validation
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size must be less than 2MB");
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            const response = await authAPI.updateAvatar(formData);
            dispatch(loginSuccess(response.data));
            toast.success('Profile photo updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const resetAddressForm = () => {
        setShowAddressForm(false);
        setEditingAddressId(null);
        formik.resetForm();
    };

    const toggleAddressForm = () => {
        if (!showAddressForm) {
            formik.resetForm();
        } else {
            setEditingAddressId(null);
        }
        setShowAddressForm(!showAddressForm);
    };

    const handleEditAddress = (addr) => {
        formik.setValues({
            fullName: addr.fullName,
            phone: addr.phone,
            street: addr.street,
            city: addr.city,
            district: addr.district,
            state: addr.state,
            pincode: addr.pincode,
            isDefault: addr.isDefault
        });
        setEditingAddressId(addr._id);
        setShowAddressForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteAddress = (id) => {
        setAddressToDelete(id);
        setIsConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!addressToDelete) return;
        setUpdating(true);
        try {
            const response = await authAPI.deleteAddress(addressToDelete);
            setAddresses(response.data);
            toast.info('Address removed');
            setIsConfirmOpen(false);
        } catch (err) {
            toast.error('Delete failed');
        } finally {
            setUpdating(false);
            setAddressToDelete(null);
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const response = await authAPI.setDefaultAddress(id);
            setAddresses(response.data);
            toast.success('Default address updated');
        } catch (err) {
            toast.error('Failed to set default');
        }
    };

    if (loading) return <Loader fullScreen text="Loading your profile..." />;

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/150';
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        return `${API_CONFIG.baseURL.replace('/api', '')}${imagePath}`;
    };

    // Construct full avatar URL
    const avatarUrl = user?.avatar 
        ? getImageUrl(user.avatar)
        : null;

    return (
        <div className="w-full py-12 min-h-screen bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-4">
                <Breadcrumbs 
                    items={[
                        { label: 'Home', link: '/home' },
                        { label: 'My Profile' }
                    ]} 
                    className="mb-12"
                />
                
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* ── LEFT SIDEBAR ── */}
                    <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
                        
                        {/* User Summary Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
                            
                            <div className="relative w-28 h-28 mx-auto mb-6">
                                <div className="w-full h-full bg-indigo-50 rounded-[2.5rem] flex items-center justify-center shadow-inner overflow-hidden border-4 border-white shadow-xl relative z-10">
                                    {avatarUrl ? (
                                        <img 
                                            src={avatarUrl} 
                                            alt={user?.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-3xl font-black">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    
                                    {uploading && (
                                        <div className="absolute inset-0 bg-indigo-900/60 flex items-center justify-center backdrop-blur-sm z-20">
                                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={() => fileInputRef.current.click()}
                                    disabled={uploading}
                                    className="absolute -bottom-2 -right-2 bg-white text-indigo-600 p-3 rounded-2xl shadow-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-90 disabled:opacity-50 border border-slate-50 z-30"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                                
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            <h2 className="text-xl font-black text-slate-900 truncate mb-1">{user?.name}</h2>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest truncate">{user?.email}</p>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
                            <div className="space-y-1">
                                <button 
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-indigo-600 shadow-sm'}`}>
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">My Profile</span>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'profile' ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                                </button>

                                <button 
                                    onClick={() => setActiveTab('address')}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'address' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-all ${activeTab === 'address' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-indigo-600 shadow-sm'}`}>
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">Addresses</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {addresses.length > 0 && (
                                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">{addresses.length}</span>
                                        )}
                                        <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'address' ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                                    </div>
                                </button>

                                <button 
                                    onClick={() => setActiveTab('wallet')}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'wallet' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-all ${activeTab === 'wallet' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-indigo-600 shadow-sm'}`}>
                                            <Wallet className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">My Wallet</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {user?.wallet?.balance > 0 && (
                                            <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg">₹{user.wallet.balance}</span>
                                        )}
                                        <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'wallet' ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                                    </div>
                                </button>

                                <div className="h-px bg-slate-50 my-2 mx-4"></div>

                                <button 
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-indigo-600 shadow-sm'}`}>
                                            <Package className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">All Orders</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {orders.length > 0 && (
                                            <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg">₹{allOrdersAmount.toLocaleString('en-IN')}</span>
                                        )}
                                        {orders.length > 0 && (
                                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">{orders.length}</span>
                                        )}
                                        <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'orders' ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                                    </div>
                                </button>

                                <button 
                                    onClick={() => setActiveTab('returns')}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'returns' ? 'bg-amber-50 text-amber-600' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-all ${activeTab === 'returns' ? 'bg-amber-600 text-white shadow-lg shadow-amber-200' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-amber-600 shadow-sm'}`}>
                                            <RefreshCcw className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">Returns</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {returnedOrders.length > 0 && (
                                            <span className="text-[9px] font-black bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg">₹{returnedAmount.toLocaleString('en-IN')}</span>
                                        )}
                                        {returnedOrders.length > 0 && (
                                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">{returnedOrders.length}</span>
                                        )}
                                        <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'returns' ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                                    </div>
                                </button>

                                <button 
                                    onClick={() => setActiveTab('cancellations')}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'cancellations' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-all ${activeTab === 'cancellations' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-rose-600 shadow-sm'}`}>
                                            <XCircle className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">Cancellations</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {cancelledOrders.length > 0 && (
                                            <span className="text-[9px] font-black bg-rose-50 text-rose-600 px-2 py-0.5 rounded-lg">₹{cancelledAmount.toLocaleString('en-IN')}</span>
                                        )}
                                        {cancelledOrders.length > 0 && (
                                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">{cancelledOrders.length}</span>
                                        )}
                                        <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'cancellations' ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                                    </div>
                                </button>
                                <button 
                                    onClick={() => setActiveTab('reviews')}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${activeTab === 'reviews' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-all ${activeTab === 'reviews' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-indigo-600 shadow-sm'}`}>
                                            <Star className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">My Reviews</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {reviews.length > 0 && (
                                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">{reviews.length}</span>
                                        )}
                                        <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'reviews' ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                                    </div>
                                </button>
                            </div>
                        </nav>
                    </aside>

                    {/* ── MAIN CONTENT AREA ── */}
                    <main className="flex-grow">
                        {/* Dashboard Overview - Real-time Stats */}
                        {activeTab === 'profile' && !selectedOrderId && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div 
                                    onClick={() => setActiveTab('orders')}
                                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all group cursor-pointer animate-in fade-in duration-300"
                                >
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Orders</p>
                                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{orders.length}</h4>
                                        <p className="text-xs font-bold text-indigo-600 mt-2">₹{allOrdersAmount.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => setActiveTab('wallet')}
                                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all group cursor-pointer animate-in fade-in duration-300"
                                >
                                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                        <Wallet className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Wallet Balance</p>
                                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">₹{user?.wallet?.balance?.toLocaleString('en-IN') || 0}</h4>
                                        <p className="text-xs font-bold text-emerald-600 mt-2">Available</p>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => setActiveTab('returns')}
                                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all group cursor-pointer animate-in fade-in duration-300"
                                >
                                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                        <RefreshCcw className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Returns Amount</p>
                                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{returnedOrders.length}</h4>
                                        <p className="text-xs font-bold text-amber-600 mt-2">₹{returnedAmount.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => setActiveTab('cancellations')}
                                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all group cursor-pointer animate-in fade-in duration-300"
                                >
                                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-4 group-hover:bg-rose-600 group-hover:text-white transition-all">
                                        <XCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cancelled Amount</p>
                                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{cancelledOrders.length}</h4>
                                        <p className="text-xs font-bold text-rose-600 mt-2">₹{cancelledAmount.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Tab: Orders / Returns / Cancellations */}
                        {(activeTab === 'orders' || activeTab === 'returns' || activeTab === 'cancellations') && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                                            <div className={`w-1.5 h-8 rounded-full ${
                                                activeTab === 'returns' ? 'bg-amber-500' : 
                                                activeTab === 'cancellations' ? 'bg-rose-500' : 
                                                'bg-indigo-600'
                                            }`}></div>
                                            {activeTab === 'returns' ? 'Returns' : 
                                             activeTab === 'cancellations' ? 'Cancellations' : 
                                             'All Orders'}
                                        </h3>
                                        <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-sm">
                                            {orders.filter(o => {
                                                if (activeTab === 'returns') return o.orderStatus?.toUpperCase() === 'RETURNED';
                                                if (activeTab === 'cancellations') return o.orderStatus?.toUpperCase() === 'CANCELLED';
                                                return true;
                                            }).length} Items
                                        </span>
                                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-sm ${
                                            activeTab === 'returns' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                            activeTab === 'cancellations' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                            'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                        }`}>
                                            Total: ₹{
                                                (activeTab === 'returns' ? returnedAmount :
                                                 activeTab === 'cancellations' ? cancelledAmount :
                                                 allOrdersAmount).toLocaleString('en-IN')
                                            }
                                        </span>
                                    </div>

                                    <div className="flex-grow max-w-md relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input 
                                            type="text"
                                            placeholder="Search by product name or order ID..."
                                            value={orderSearch}
                                            onChange={(e) => {
                                                setOrderSearch(e.target.value);
                                                setOrderPage(1);
                                            }}
                                            className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-xs font-black placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all shadow-sm"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                        <button 
                                            onClick={() => setOrderViewMode('list')}
                                            className={`p-2.5 rounded-xl transition-all ${orderViewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            <LayoutList className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => setOrderViewMode('grid')}
                                            className={`p-2.5 rounded-xl transition-all ${orderViewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            <LayoutGrid className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {ordersLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Fetching Orders...</p>
                                    </div>
                                ) : selectedOrderId ? (
                                    <OrderDetailView 
                                        orderId={selectedOrderId} 
                                        onBack={() => setSelectedOrderId(null)} 
                                        onStatusUpdate={fetchOrders}
                                    />
                                ) : (() => {
                                    const filteredOrders = orders.filter(o => {
                                        // Status Filter
                                        const statusMatch = activeTab === 'returns' ? o.orderStatus?.toUpperCase() === 'RETURNED' :
                                                          activeTab === 'cancellations' ? o.orderStatus?.toUpperCase() === 'CANCELLED' : true;
                                        if (!statusMatch) return false;

                                        // Search Filter
                                        const searchLower = orderSearch.toLowerCase();
                                        const idMatch = (o.paymentDetails?.razorpayOrderId || o._id).toLowerCase().includes(searchLower);
                                        const productMatch = o.items?.some(item => item.product?.name && item.product.name.toLowerCase().includes(searchLower));
                                        return idMatch || productMatch;
                                    });

                                    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
                                    const paginatedOrders = filteredOrders.slice((orderPage - 1) * ordersPerPage, orderPage * ordersPerPage);

                                    if (filteredOrders.length === 0) {
                                        return (
                                            <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                                                <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                                <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">No orders matching your criteria.</p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="space-y-8">
                                            {orderViewMode === 'list' ? (
                                                <div className="space-y-6">
                                                    {paginatedOrders.map((order) => (
                                                        <div 
                                                            key={order._id}
                                                            onClick={() => setSelectedOrderId(order._id)}
                                                            className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center gap-8">
                                                                <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 p-2">
                                                                    {order.items?.[0]?.product?.images?.[0] ? (
                                                                        <img 
                                                                            src={getImageUrl(order.items[0].product.images[0])}
                                                                            alt="order-item" 
                                                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center">
                                                                            <Package className="w-8 h-8 text-slate-200" />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-4">
                                                                        <span className="text-base font-black text-slate-900 tracking-tight">
                                                                            #{order.paymentDetails?.razorpayOrderId?.split('_')[1] || order._id.toUpperCase().substring(0, 10)}
                                                                        </span>
                                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border ${getStatusBadgeStyles(order.orderStatus)}`}>
                                                                            {order.orderStatus}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-slate-400">
                                                                        <span className="text-[11px] font-black uppercase tracking-widest">
                                                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                        </span>
                                                                        {(activeTab === 'returns' || activeTab === 'cancellations') && order.statusReason && (
                                                                            <>
                                                                                <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                                                                                <span className="text-[11px] font-bold text-slate-400 lowercase italic">
                                                                                    {order.statusReason}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-10">
                                                                <span className="text-xl font-black text-slate-900 tracking-tighter">
                                                                    ₹{(order.pricing?.totalPrice || order.totalAmount || 0).toLocaleString('en-IN')}
                                                                </span>
                                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                                    <ChevronRight className="w-5 h-5" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                                    {paginatedOrders.map((order) => (
                                                        <div 
                                                            key={order._id}
                                                            onClick={() => setSelectedOrderId(order._id)}
                                                            className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group space-y-6"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border ${getStatusBadgeStyles(order.orderStatus)}`}>
                                                                    {order.orderStatus}
                                                                </span>
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                                </span>
                                                            </div>
                                                            
                                                            <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-4 relative">
                                                                {order.items?.[0]?.product?.images?.[0] ? (
                                                                    <img 
                                                                        src={getImageUrl(order.items[0].product.images[0])}
                                                                        alt="order-item" 
                                                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <Package className="w-12 h-12 text-slate-200" />
                                                                    </div>
                                                                )}
                                                                {order.items?.length > 1 && (
                                                                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur shadow-sm border border-slate-100 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                                                        +{order.items.length - 1} more
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="space-y-1">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                                                                <p className="text-sm font-black text-slate-900 truncate tracking-tight">
                                                                    #{order.paymentDetails?.razorpayOrderId?.split('_')[1] || order._id.toUpperCase().substring(0, 8)}
                                                                </p>
                                                            </div>

                                                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                                                <span className="text-lg font-black text-slate-900 tracking-tighter">₹{(order.pricing?.totalPrice || order.totalAmount || 0).toLocaleString('en-IN')}</span>
                                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                                    <ChevronRight className="w-4 h-4" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Pagination Controls */}
                                            {totalPages > 1 && (
                                                <div className="flex items-center justify-center gap-3 pt-8">
                                                    <button 
                                                        disabled={orderPage === 1}
                                                        onClick={() => setOrderPage(p => p - 1)}
                                                        className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 disabled:opacity-50 disabled:hover:text-slate-400 transition-all shadow-sm active:scale-95"
                                                    >
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>
                                                    <div className="flex items-center gap-2">
                                                        {[...Array(totalPages)].map((_, i) => (
                                                            <button 
                                                                key={i}
                                                                onClick={() => setOrderPage(i + 1)}
                                                                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${orderPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
                                                            >
                                                                {i + 1}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <button 
                                                        disabled={orderPage === totalPages}
                                                        onClick={() => setOrderPage(p => p + 1)}
                                                        className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 disabled:opacity-50 disabled:hover:text-slate-400 transition-all shadow-sm active:scale-95"
                                                    >
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* Tab: Profile */}
                        {activeTab === 'profile' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                                    <div className="relative">
                                        <h3 className="text-2xl font-black text-indigo-900 mb-8">Edit Your Profile</h3>
                                        
                                        <form onSubmit={handleProfileUpdate} className="space-y-10">
                                            {/* Basic Info Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                                    <input 
                                                        type="text"
                                                        value={profileForm.name}
                                                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-bold transition-all text-slate-700"
                                                        placeholder="Enter your name"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Email</label>
                                                    <input 
                                                        type="email"
                                                        value={profileForm.email}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-400 font-bold cursor-not-allowed opacity-80"
                                                        disabled
                                                    />
                                                </div>
                                            </div>

                                            {/* Default Address Field */}
                                            <div className="space-y-3">
                                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Default Address</label>
                                                <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-500 font-bold truncate">
                                                    {addresses.find(a => a.isDefault) 
                                                        ? `${addresses.find(a => a.isDefault).fullName}, ${addresses.find(a => a.isDefault).street}, ${addresses.find(a => a.isDefault).city}, ${addresses.find(a => a.isDefault).state} - ${addresses.find(a => a.isDefault).pincode}`
                                                        : "No default address set"}
                                                </div>
                                            </div>

                                            <div className="h-px bg-slate-100 w-full"></div>

                                            {/* Password Section */}
                                            <div className="space-y-8">
                                                <h4 className="text-xl font-black text-slate-800">Change Password (Optional)</h4>
                                                
                                                <div className="space-y-3">
                                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Current Password</label>
                                                    <div className="relative">
                                                        <input 
                                                            type={showCurrentPassword ? "text" : "password"}
                                                            value={passwordForm.currentPassword}
                                                            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                                            className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-bold transition-all text-slate-700 pr-14"
                                                            placeholder="Enter current password to change"
                                                        />
                                                        <button 
                                                            type="button"
                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                                                        >
                                                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">New Password</label>
                                                        <div className="relative">
                                                            <input 
                                                                type={showNewPassword ? "text" : "password"}
                                                                value={passwordForm.newPassword}
                                                                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                                                className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-bold transition-all text-slate-700 pr-14"
                                                                placeholder="Enter new password"
                                                            />
                                                            <button 
                                                                type="button"
                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                                                            >
                                                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Confirm New Password</label>
                                                        <div className="relative">
                                                            <input 
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                value={passwordForm.confirmPassword}
                                                                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                                                className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 font-bold transition-all text-slate-700 pr-14"
                                                                placeholder="Confirm new password"
                                                            />
                                                            <button 
                                                                type="button"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                                                            >
                                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-[11px] font-bold text-slate-400 italic">
                                                    Note: Leave password fields blank if you don't want to change your password.
                                                </p>
                                            </div>

                                            <div className="pt-6">
                                                <button 
                                                    type="submit"
                                                    disabled={updating}
                                                    className="bg-indigo-600 text-white font-black px-12 py-5 rounded-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs disabled:opacity-50 shadow-2xl shadow-indigo-100 active:scale-95"
                                                >
                                                    {updating ? 'Updating...' : 'Update Profile'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Address */}
                        {activeTab === 'address' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                                <div className="flex justify-between items-center px-4">
                                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-4">
                                        <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
                                        Saved Addresses
                                    </h3>
                                    <button 
                                        onClick={toggleAddressForm}
                                        className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                    >
                                        {showAddressForm ? 'Cancel' : '+ Add New Address'}
                                    </button>
                                </div>
                                {showAddressForm && (
                                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 animate-in zoom-in duration-300">
                                        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-1 space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Recipient Name</label>
                                                <input 
                                                    name="fullName"
                                                    className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ${
                                                        formik.touched.fullName && formik.errors.fullName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-100'
                                                    }`} 
                                                    placeholder="Full Name" 
                                                    value={formik.values.fullName}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.touched.fullName && formik.errors.fullName && (
                                                    <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{formik.errors.fullName}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-1 space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                                <input 
                                                    name="phone"
                                                    className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ${
                                                        formik.touched.phone && formik.errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-100'
                                                    }`} 
                                                    placeholder="10-digit Phone" 
                                                    value={formik.values.phone}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    maxLength="10"
                                                />
                                                {formik.touched.phone && formik.errors.phone && (
                                                    <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{formik.errors.phone}</p>
                                                )}
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Street Address</label>
                                                <input 
                                                    name="street"
                                                    className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ${
                                                        formik.touched.street && formik.errors.street ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-100'
                                                    }`} 
                                                    placeholder="Flat / House No. / Building / Street" 
                                                    value={formik.values.street}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.touched.street && formik.errors.street && (
                                                    <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{formik.errors.street}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">City</label>
                                                <input 
                                                    name="city"
                                                    className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ${
                                                        formik.touched.city && formik.errors.city ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-100'
                                                    }`} 
                                                    placeholder="City" 
                                                    value={formik.values.city}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.touched.city && formik.errors.city && (
                                                    <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{formik.errors.city}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">District</label>
                                                <input 
                                                    name="district"
                                                    className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ${
                                                        formik.touched.district && formik.errors.district ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-100'
                                                    }`} 
                                                    placeholder="District" 
                                                    value={formik.values.district}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.touched.district && formik.errors.district && (
                                                    <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{formik.errors.district}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">State</label>
                                                <input 
                                                    name="state"
                                                    className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ${
                                                        formik.touched.state && formik.errors.state ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-100'
                                                    }`} 
                                                    placeholder="State" 
                                                    value={formik.values.state}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                />
                                                {formik.touched.state && formik.errors.state && (
                                                    <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{formik.errors.state}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pincode</label>
                                                <input 
                                                    name="pincode"
                                                    className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ${
                                                        formik.touched.pincode && formik.errors.pincode ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-100'
                                                    }`} 
                                                    placeholder="6-digit Pincode" 
                                                    value={formik.values.pincode}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    maxLength="6"
                                                />
                                                {formik.touched.pincode && formik.errors.pincode && (
                                                    <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1">{formik.errors.pincode}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 px-2 md:col-span-2 py-2">
                                                <input 
                                                    type="checkbox" 
                                                    name="isDefault"
                                                    className="w-5 h-5 text-indigo-600 rounded-lg" 
                                                    checked={formik.values.isDefault}
                                                    onChange={formik.handleChange}
                                                />
                                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Set as default address</span>
                                            </div>
                                            <div className="md:col-span-2 pt-4">
                                                <button type="submit" disabled={updating || !formik.isValid} className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all disabled:opacity-50 active:scale-[0.99]">
                                                    {updating ? 'SAVING...' : (editingAddressId ? 'UPDATE ADDRESS' : 'ADD NEW ADDRESS')}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                                    {addresses.length === 0 ? (
                                        <div className="md:col-span-2 bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                                            <MapPin className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                            <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">No addresses added yet.</p>
                                        </div>
                                    ) : (
                                        addresses.map((addr, idx) => (
                                            <div key={idx} className={`bg-white p-8 rounded-[2rem] shadow-sm border-2 transition-all relative group ${addr.isDefault ? 'border-indigo-600' : 'border-slate-50 hover:border-indigo-100'}`}>
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <span className="text-slate-900 text-xs font-black uppercase tracking-widest">{addr.fullName}</span>
                                                        {addr.isDefault && (
                                                            <span className="ml-3 bg-indigo-600 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-indigo-100">Default</span>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                        <button onClick={() => handleEditAddress(addr)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><i className="bi bi-pencil-square"></i></button>
                                                        <button onClick={() => handleDeleteAddress(addr._id)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><i className="bi bi-trash3"></i></button>
                                                    </div>
                                                </div>
                                                <p className="font-black text-slate-900 leading-tight mb-2">{addr.street}</p>
                                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-6">{addr.city}, {addr.district && `${addr.district}, `}{addr.state} - {addr.pincode}</p>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Phone className="w-3 h-3" />
                                                    <span className="text-[10px] font-black tracking-widest">{addr.phone}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab: Wallet */}
                        {activeTab === 'wallet' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                                <div className="bg-indigo-700 rounded-2xl p-10 shadow-lg text-white">
                                    <div className="flex items-center gap-3 mb-6">
                                        <CreditCard className="w-6 h-6" />
                                        <h3 className="text-xl font-bold">My Wallet</h3>
                                    </div>
                                    <p className="text-sm font-medium opacity-80 mb-2">Available Balance</p>
                                    <h4 className="text-5xl font-black tracking-tight">₹{user?.wallet?.balance?.toLocaleString('en-IN') || 0}</h4>
                                </div>
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10">
                                    <h4 className="text-lg font-black text-slate-800 mb-10">Transaction History</h4>
                                    {!user?.wallet?.transactions || user?.wallet?.transactions.length === 0 ? (
                                        <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
                                            <CreditCard className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No wallet activity recorded yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {[...user.wallet.transactions].reverse().map((tx, idx) => (
                                                <div key={idx} className="flex items-center justify-between group">
                                                    <div className="flex items-center gap-5">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                                                            {tx.type === 'credit' ? (
                                                                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center"><i className="bi bi-arrow-down text-lg"></i></div>
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full border-2 border-rose-500 flex items-center justify-center"><i className="bi bi-arrow-up text-lg"></i></div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-800">{tx.type === 'credit' ? 'Refund for ' : 'Payment for '}{tx.description || `order ${tx.orderId?.toUpperCase() || 'ORD-N/A'}`}</p>
                                                            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}, {new Date(tx.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-lg font-black tracking-tight ${tx.type === 'credit' ? 'text-emerald-500' : 'text-rose-500'}`}>{tx.type === 'credit' ? '+' : '-'}₹{tx.amount?.toLocaleString('en-IN')}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab: Reviews */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500 pb-20">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                                            <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
                                            My Reviews & Ratings
                                        </h3>
                                        <p className="text-sm font-bold text-slate-400 mt-1">Manage your feedback on products you've purchased</p>
                                    </div>
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                        <input 
                                            type="text"
                                            placeholder="Search by product name..."
                                            value={reviewSearch}
                                            onChange={(e) => setReviewSearch(e.target.value)}
                                            className="bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-xs font-black placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all w-full md:w-64 shadow-sm"
                                        />
                                    </div>
                                </div>

                                {reviewsLoading ? (
                                    <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center">
                                        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Fetching your reviews...</p>
                                    </div>
                                ) : reviews.filter(r => r.productName?.toLowerCase().includes(reviewSearch.toLowerCase())).length === 0 ? (
                                    <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                                        <Star className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                        <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">No reviews found.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {reviews.filter(r => r.productName?.toLowerCase().includes(reviewSearch.toLowerCase())).map((review) => (
                                            <div key={review._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative group hover:border-indigo-100 transition-all">
                                                <div className="flex flex-col sm:flex-row gap-8">
                                                    <div className="w-full sm:w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 p-2">
                                                        <img 
                                                            src={getImageUrl(review.productImage)} 
                                                            alt={review.productName} 
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex-grow space-y-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="text-sm font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors cursor-pointer mb-2" onClick={() => navigate(`/product/${review.productId}`)}>
                                                                    {review.productName}
                                                                </h4>
                                                                <div className="flex items-center gap-1 mb-3">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star 
                                                                            key={i} 
                                                                            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} 
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-slate-400">
                                                                    <Calendar className="w-3.5 h-3.5" />
                                                                    <span className="text-[11px] font-black uppercase tracking-widest">
                                                                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                                                    <Edit3 className="w-4 h-4" />
                                                                </button>
                                                                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className="text-base font-bold text-slate-600 leading-relaxed italic">
                                                            "{review.comment}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Address"
                message="Are you sure you want to permanently remove this address?"
                loading={updating}
            />
        </div>
    );
};

const getStatusBadgeStyles = (status) => {
    switch (status?.toUpperCase()) {
        case 'PROCESSING': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
        case 'CONFIRMED': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
        case 'SHIPPED': return 'bg-blue-50 text-blue-600 border-blue-100';
        case 'DELIVERED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
        case 'RETURNED': return 'bg-amber-50 text-amber-600 border-amber-100';
        default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
};

export default ProfilePage;
