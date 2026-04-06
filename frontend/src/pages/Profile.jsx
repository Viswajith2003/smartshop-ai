import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { authAPI } from '../utils/api';
import { loginSuccess } from '../store/slices/authSlice';
import { Loading } from '../components/ui';
import { API_CONFIG } from '../config/app';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    
    // Form States
    const [profileForm, setProfileForm] = useState({ name: '', email: '' });
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({
        fullName: '', phone: '', street: '', city: '', district: '', state: '', pincode: '', isDefault: false
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

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const response = await authAPI.updateProfile({ name: profileForm.name });
            toast.success('Name updated successfully!');
            dispatch(loginSuccess(response.data));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
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

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            let response;
            if (editingAddressId) {
                response = await authAPI.updateAddress(editingAddressId, addressForm);
            } else {
                response = await authAPI.addAddress(addressForm);
            }
            setAddresses(response.data);
            resetAddressForm();
            toast.success(editingAddressId ? 'Address updated!' : 'Address added!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally {
            setUpdating(false);
        }
    };

    const resetAddressForm = () => {
        setShowAddressForm(false);
        setEditingAddressId(null);
        setAddressForm({ fullName: user?.name || '', phone: '', street: '', city: '', district: '', state: '', pincode: '', isDefault: false });
    };

    const toggleAddressForm = () => {
        if (!showAddressForm) {
            setAddressForm(prev => ({ ...prev, fullName: user?.name || '' }));
        } else {
            setEditingAddressId(null);
        }
        setShowAddressForm(!showAddressForm);
    };

    const handleEditAddress = (addr) => {
        setAddressForm({
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

    const handleDeleteAddress = async (id) => {
        if (!window.confirm('Delete this address?')) return;
        try {
            const response = await authAPI.deleteAddress(id);
            setAddresses(response.data);
            toast.info('Address removed');
        } catch (err) {
            toast.error('Delete failed');
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

    if (loading) return <Loading fullScreen text="Loading your profile..." />;

    // Construct full avatar URL
    const avatarUrl = user?.avatar 
        ? `${API_CONFIG.baseURL.replace('/api', '')}${user.avatar}`
        : null;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-12">
            <h1 className="text-4xl font-black text-indigo-900 tracking-tight">My Profile</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                
                {/* Left: General Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-indigo-50 text-center relative group">
                        
                        {/* Avatar Image Wrap */}
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <div className="w-full h-full bg-indigo-600 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3 overflow-hidden border-4 border-white">
                                {avatarUrl ? (
                                    <img 
                                        src={avatarUrl} 
                                        alt={user?.name} 
                                        className="w-full h-full object-cover transform -rotate-3 scale-110"
                                    />
                                ) : (
                                    <span className="text-4xl font-black text-white">{user?.name?.charAt(0)}</span>
                                )}
                                
                                {/* Loading Overlay */}
                                {uploading && (
                                    <div className="absolute inset-0 bg-indigo-900/60 flex items-center justify-center backdrop-blur-sm">
                                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Upload Trigger Button */}
                            <button 
                                onClick={() => fileInputRef.current.click()}
                                disabled={uploading}
                                className="absolute -bottom-2 -right-2 bg-white text-indigo-600 p-2.5 rounded-2xl shadow-xl border border-indigo-50 hover:bg-indigo-600 hover:text-white transition-all active:scale-90 disabled:opacity-50"
                            >
                                <i className="bi bi-camera-fill text-lg"></i>
                            </button>
                            
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        <h2 className="text-xl font-black text-indigo-900 truncate px-2">{profileForm.name}</h2>
                        <p className="text-indigo-400 text-xs font-bold truncate mt-1 px-4">{profileForm.email}</p>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="bg-indigo-900 text-white p-8 rounded-[2rem] shadow-xl space-y-4">
                        <h3 className="font-black uppercase tracking-widest text-xs text-indigo-300 mb-4">Edit Details</h3>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                            <input 
                                type="text"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 placeholder-white/30 focus:outline-none focus:border-white/40 font-bold"
                                placeholder="Full Name"
                                required
                            />
                        </div>
                        <button 
                            disabled={updating}
                            className="w-full bg-white text-indigo-900 font-black py-4 rounded-2xl hover:bg-indigo-50 transition-all uppercase tracking-widest text-xs disabled:opacity-50 shadow-lg active:scale-95"
                        >
                            {updating ? 'Saving Changes...' : 'Update Name'}
                        </button>
                    </form>
                </div>

                {/* Right: Address Management */}
                <div className="md:col-span-2 space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-black text-indigo-900 tracking-tight">Addresses</h3>
                        <button 
                            onClick={toggleAddressForm}
                            className="bg-indigo-100 text-indigo-600 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:bg-indigo-200 transition-all"
                        >
                            {showAddressForm ? 'Cancel' : '+ Add New'}
                        </button>
                    </div>

                    {showAddressForm && (
                        <form onSubmit={handleSaveAddress} className="bg-white p-8 rounded-[2rem] shadow-2xl border-2 border-indigo-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in duration-300">
                             <h4 className="md:col-span-2 font-black uppercase tracking-widest text-xs text-indigo-400 mb-2">
                                {editingAddressId ? 'Update Address' : 'New Delivery Address'}
                             </h4>
                             <div className="md:col-span-1">
                                <input 
                                    className="w-full bg-indigo-50 border-none rounded-xl px-5 py-3 focus:ring-2 focus:ring-indigo-500" 
                                    placeholder="Full Name (Recipient)" 
                                    value={addressForm.fullName}
                                    onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                                    required
                                />
                             </div>
                             <div className="md:col-span-1">
                                <input 
                                    className="w-full bg-indigo-50 border-none rounded-xl px-5 py-3 focus:ring-2 focus:ring-indigo-500" 
                                    placeholder="10-digit Phone" 
                                    value={addressForm.phone}
                                    onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                                    required
                                    maxLength="10"
                                />
                             </div>
                             <div className="md:col-span-2">
                                <input 
                                    className="w-full bg-indigo-50 border-none rounded-xl px-5 py-3 focus:ring-2 focus:ring-indigo-500" 
                                    placeholder="Street Address" 
                                    value={addressForm.street}
                                    onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                                    required
                                />
                             </div>
                             <input 
                                className="w-full bg-indigo-50 border-none rounded-xl px-5 py-3 focus:ring-2 focus:ring-indigo-500" 
                                placeholder="City" 
                                value={addressForm.city}
                                onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                required
                             />
                             <input 
                                className="w-full bg-indigo-50 border-none rounded-xl px-5 py-3 focus:ring-2 focus:ring-indigo-500" 
                                placeholder="District" 
                                value={addressForm.district}
                                onChange={(e) => setAddressForm({...addressForm, district: e.target.value})}
                                required
                             />
                             <input 
                                className="w-full bg-indigo-50 border-none rounded-xl px-5 py-3 focus:ring-2 focus:ring-indigo-500" 
                                placeholder="State" 
                                value={addressForm.state}
                                onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                                required
                             />
                             <input 
                                className="w-full bg-indigo-50 border-none rounded-xl px-5 py-3 focus:ring-2 focus:ring-indigo-500" 
                                placeholder="6-digit Pincode" 
                                maxLength="6"
                                value={addressForm.pincode}
                                onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                                required
                             />
                             <div className="flex items-center gap-3 px-2">
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5 text-indigo-600 rounded" 
                                    checked={addressForm.isDefault}
                                    onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                                />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Default Address</span>
                             </div>
                             <div className="md:col-span-2 pt-4">
                                <button className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 shadow-lg active:scale-95 transition-all">
                                    {editingAddressId ? 'SAVE CHANGES' : 'ADD ADDRESS'}
                                </button>
                             </div>
                        </form>
                    )}

                    <div className="grid grid-cols-1 gap-4 pb-12">
                        {addresses.length === 0 ? (
                            <div className="bg-white p-12 rounded-[2rem] border border-dashed border-indigo-200 text-center opacity-50">
                                <p className="font-bold text-indigo-400">No addresses added yet.</p>
                            </div>
                        ) : (
                            addresses.map((addr, idx) => (
                                <div key={idx} className={`bg-white p-8 rounded-[2rem] shadow-lg border-2 transition-all relative group ${addr.isDefault ? 'border-indigo-500' : 'border-transparent hover:border-indigo-100'}`}>
                                    
                                    {/* Action Buttons */}
                                    <div className="absolute top-8 right-8 flex gap-2">
                                        {!addr.isDefault && (
                                            <button 
                                                onClick={() => handleSetDefault(addr._id)}
                                                className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm group/btn"
                                                title="Set as Default"
                                            >
                                                <i className="bi bi-check2-circle text-xl"></i>
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleEditAddress(addr)}
                                            className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                            title="Edit"
                                        >
                                            <i className="bi bi-pencil-square text-xl"></i>
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteAddress(addr._id)}
                                            className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                            title="Delete"
                                        >
                                            <i className="bi bi-trash3 text-xl"></i>
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-indigo-900 text-sm font-black uppercase tracking-widest">{addr.fullName}</span>
                                            {addr.isDefault && (
                                                <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Default</span>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <p className="text-xl font-black text-indigo-900 leading-tight pr-32">{addr.street}</p>
                                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] mt-1">
                                                {addr.city}, {addr.district}, {addr.state} - {addr.pincode}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <i className="bi bi-telephone-fill text-xs"></i>
                                            <span className="text-xs font-black tracking-widest">{addr.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
