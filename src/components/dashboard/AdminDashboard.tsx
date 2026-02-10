import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Box,
  Users,
  Globe,
  MapPin,
  User,
  Phone,
  Mail,
  Camera,
  Save,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/authSlice';

interface AdminDashboardProps {
  activeNav: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeNav }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Settings Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '+250 788 000 000', // Mock initial phone
    location: user?.location || 'Kigali, Rwanda (HQ)',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      dispatch(updateUser({ name: formData.name, location: formData.location }));
      setIsSaving(false);
    }, 1000);
  };

  const globalStats = [
    { label: 'Global Revenue', value: '42.8M Rwf', badge: '+12%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Assets', value: '1,248', icon: Box, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Users', value: '8,420', badge: '+128', icon: Users, color: 'text-[#ff9500]', bg: 'bg-orange-50' },
    { label: 'System Reach', value: '18 Hubs', icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const renderContent = () => {
    switch (activeNav) {
      case 'Site Management':
        return <div className="p-12 text-center text-gray-400">Global Site Management coming soon...</div>;
      case 'Financials':
        return <div className="p-12 text-center text-gray-400">Financial auditing & billing coming soon...</div>;
      case 'User Management':
        return <div className="p-12 text-center text-gray-400">User accounts & permissions coming soon...</div>;
      case 'Reports':
        return <div className="p-12 text-center text-gray-400">Global system reports coming soon...</div>;
      case 'Settings':
        return (
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">Admin Profile Settings</h2>
              <button
                onClick={handleUpdateProfile}
                disabled={isSaving}
                className="flex items-center gap-2 bg-[#ffb703] hover:bg-[#fb8500] text-[#1a4d2e] px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Avatar */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#38a169]/10">
                    <img
                      src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-1 right-1 bg-[#1a4d2e] p-2.5 rounded-full text-white shadow-lg transform transition-transform group-hover:scale-110">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">{user?.name}</h3>
                  <p className="text-sm font-bold text-[#38a169] uppercase tracking-widest">Administrator</p>
                </div>
                <div className="w-full pt-6 border-t border-gray-50 flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <Mail className="w-4 h-4 text-[#ffb703]" /> {user?.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-[#ffb703]" /> {formData.location}
                  </div>
                </div>
              </div>

              {/* Right Column: Fields */}
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-[#38a169]/30 focus:bg-white rounded-2xl text-sm font-bold text-gray-800 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Admin Hot-line</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-[#38a169]/30 focus:bg-white rounded-2xl text-sm font-bold text-gray-800 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Office Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-[#38a169]/30 focus:bg-white rounded-2xl text-sm font-bold text-gray-800 transition-all outline-none"
                      />
                    </div>
                  </div>
                </form>

                <div className="pt-6 border-t border-gray-50">
                  <h4 className="text-sm font-black text-gray-900 mb-4">Security Thresholds</h4>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 py-3 px-6 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm transition-colors border border-gray-100">
                      Update Security Keys
                    </button>
                    <button className="flex-1 py-3 px-6 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-colors border border-red-100/50">
                      Emergency Lockdown
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Dashboard':
      default:
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black text-gray-900 leading-tight">
                  System <span className="text-[#38a169]">Overview</span>
                </h1>
                <p className="text-gray-500 mt-1">Global performance metrics and multi-site monitoring</p>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Admin Console Active</span>
              </div>
            </div>

            {/* Global Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {globalStats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#38a169]/30 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-xl font-black text-gray-900">{stat.value}</h3>
                        {stat.badge && <span className="text-[10px] text-green-600 font-bold">{stat.badge}</span>}
                      </div>
                    </div>
                    <div className={`w-10 h-10 ${stat.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Hub Performance Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50">
                <h3 className="text-xl font-black text-gray-900">Hub Performance</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-10 py-6">Hub Location</th>
                      <th className="px-10 py-6">Utilization</th>
                      <th className="px-10 py-6">Revenue</th>
                      <th className="px-10 py-6">Status</th>
                      <th className="px-10 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { location: 'Kigali Hub', utilization: '94%', revenue: '12.4M', status: 'Healthy' },
                      { location: 'Nyagatare Hub', utilization: '78%', revenue: '8.2M', status: 'Healthy' },
                      { location: 'Rwamagana Hub', utilization: '45%', revenue: '4.1M', status: 'Warning' },
                    ].map((hub, idx) => (
                      <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-[#1a4d2e]" />
                            </div>
                            <span className="text-sm font-bold text-gray-800">{hub.location}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <div className="w-full max-w-[100px] space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span className="text-gray-400">{hub.utilization}</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${parseInt(hub.utilization) > 80 ? 'bg-[#38a169]' : 'bg-[#ffb703]'}`}
                                style={{ width: hub.utilization }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-sm font-bold text-gray-900">{hub.revenue} Rwf</td>
                        <td className="px-10 py-6">
                          <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${hub.status === 'Healthy' ? 'bg-green-100 text-[#38a169]' : 'bg-orange-100 text-[#ffb703]'
                            }`}>
                            {hub.status}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button className="text-xs font-bold text-[#1a4d2e] hover:underline">Manage Site</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderContent();
};
