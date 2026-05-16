import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { 
  Users, 
  Mail, 
  Calendar, 
  Shield, 
  Search, 
  RefreshCcw,
  UserCheck,
  UserX,
  MoreVertical,
  ExternalLink,
  Wallet
} from 'lucide-react';
import usePagination from '../../hooks/usePagination';
import { Pagination, Loader } from '../common';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { pagination, handlePageChange, updatePagination } = usePagination(10);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm
      };
      const res = await adminAPI.getUsers(params);
      if (res.success) {
        setUsers(res.data);
        updatePagination(res.meta);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit, searchTerm]);

  useEffect(() => {
    handlePageChange(1);
  }, [searchTerm]);

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Registered Users</h3>
            <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-lg text-xs font-bold">
              {pagination.totalItems || users.length} Total
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage and view your customer base</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:border-indigo-500 outline-none font-bold"
            />
          </div>
          <button 
            onClick={fetchUsers}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-400 border border-slate-200 rounded-xl transition-all shadow-sm"
          >
            <RefreshCcw className="w-5 h-5 text-indigo-600" />
          </button>
        </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">User Profile</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Contact Info</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Wallet Balance</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Joined On</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-500 font-medium italic">No users found.</td>
                </tr>
              ) : users.map(user => (
                <tr key={user._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg border border-white/10">
                         {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                           <Shield size={10} className="text-indigo-400" />
                           <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user.role}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                         <Mail size={12} className="text-slate-400" />
                         {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                         <Wallet size={14} />
                      </div>
                      <span className="text-slate-900 font-black text-sm tracking-tight">₹{user.wallet?.balance?.toLocaleString() || 0}</span>
                    </div>
                  </td>
                  <td className="p-5">
                     <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                        <Calendar size={12} className="text-slate-500" />
                        {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                     </div>
                  </td>
                  <td className="p-5">
                     <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-black uppercase rounded border ${user.isVerified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      {user.isVerified ? <UserCheck size={10} /> : <UserX size={10} />}
                      {user.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View Profile">
                          <ExternalLink size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="More Options">
                          <MoreVertical size={16} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length > 0 && (
          <div className="p-5 border-t border-slate-50 bg-slate-50/20">
            <Pagination pagination={pagination} onPageChange={handlePageChange} theme="light" />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;
