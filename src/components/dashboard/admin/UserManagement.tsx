import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addUser, updateUser, deleteUser, type MockUser } from '@/store/mockDataSlice';
import { toast } from 'sonner';

export const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'ADMIN' | 'SITE_MANAGER' | 'SUPPLIER' | 'BUYER' | 'SUPER_ADMIN'>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);
  const [formData, setFormData] = useState<Partial<MockUser>>({
    role: 'BUYER',
    status: 'ACTIVE',
  });

  const handleOpenModal = (user?: MockUser) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: 'BUYER',
        status: 'ACTIVE',
        location: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingUser) {
      dispatch(updateUser({ ...editingUser, ...formData } as MockUser));
      toast.success(`User updated: ${formData.firstName}`);
    } else {
      const newUser: MockUser = {
        id: `u-${Date.now()}`,
        joinedDate: new Date().toISOString().split('T')[0],
        ...formData as any
      };
      dispatch(addUser(newUser));
      toast.success(`User created: ${formData.firstName}`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
      toast.success('User deleted');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">User Management</h2>
          <p className="text-gray-500 text-sm">Manage access and roles across the platform</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#1a4d2e] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#143d24] transition-colors shadow-lg shadow-[#1a4d2e]/20"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#38a169]/20 transition-all shadow-sm"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as any)}
          className="px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#38a169]/20 shadow-sm"
        >
          <option value="ALL">All Roles</option>
          <option value="SUPER_ADMIN">Super Admins</option>
          <option value="ADMIN">Admins</option>
          <option value="SITE_MANAGER">Site Managers</option>
          <option value="SUPPLIER">Suppliers</option>
          <option value="BUYER">Buyers</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="px-8 py-6">User</th>
                <th className="px-8 py-6">Role</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Location</th>
                <th className="px-8 py-6">Date Joined</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#38a169]/10 rounded-xl flex items-center justify-center text-[#38a169] font-black">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{u.firstName} {u.lastName}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${u.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-600' :
                      u.role === 'SITE_MANAGER' ? 'bg-blue-100 text-blue-600' :
                        u.role === 'SUPPLIER' ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-100 text-gray-600'
                      }`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${u.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                    {u.location || '-'}
                  </td>
                  <td className="px-8 py-6 text-xs text-gray-500 font-medium">
                    {u.joinedDate}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(u)}
                        className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-12 text-center text-gray-400 font-medium">
                    No users found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Role</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all"
                  >
                    <option value="BUYER">Buyer</option>
                    <option value="SUPPLIER">Supplier</option>
                    <option value="SITE_MANAGER">Site Manager</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
              </div>
              {(formData.role === 'SITE_MANAGER' || formData.role === 'SUPPLIER') && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all"
                    placeholder="e.g., Kigali Central"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#1a4d2e] hover:bg-[#143d24] text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-[#1a4d2e]/20 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Save User
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
