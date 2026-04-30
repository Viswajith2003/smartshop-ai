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
import Loader from '../common/Loader';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getUsers();
      if (res.success) {
        setUsers(res.data);
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
  }, []);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Registered Users</h3>
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
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
          <button 
            onClick={fetchUsers}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl transition-all"
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-[#1e293b] rounded-3xl border border-slate-700/50 shadow-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/30">
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">User Profile</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Contact Info</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Wallet Balance</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Joined On</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-10 text-center text-slate-500 font-medium italic">No users found.</td>
              </tr>
            ) : filteredUsers.map(user => (
              <tr key={user._id} className="hover:bg-slate-800/20 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg border border-white/10">
                       {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-200 text-sm">{user.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                         <Shield size={10} className="text-indigo-400" />
                         <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user.role}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                       <Mail size={12} className="text-slate-500" />
                       {user.email}
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                       <Wallet size={14} />
                    </div>
                    <span className="text-slate-200 font-black text-sm tracking-tight">₹{user.wallet?.balance?.toLocaleString() || 0}</span>
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
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all" title="View Profile">
                        <ExternalLink size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all" title="More Options">
                        <MoreVertical size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;
