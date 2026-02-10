import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Box,
  CreditCard,
  ShoppingBag,
  User,
  Phone,
  MapPin,
  Mail,
  Camera,
  Save,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/authSlice';

interface BuyerDashboardProps {
  activeNav: string;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ activeNav }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Settings Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '+250 788 123 456', // Mock initial phone
    location: user?.location || 'Kigali, Rwanda',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      dispatch(updateUser({ name: formData.name, location: formData.location }));
      setIsSaving(false);
      // Optional: Add a toast notification here if available
    }, 1000);
  };

  const stats = [
    { label: 'Active assets', value: '12', icon: Box, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Invoice Balance', value: '376,000 Rwf', subValue: '+Add funds', icon: CreditCard, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Total Orders', value: '148', badge: '+5% this week', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const recentBookings = [
    { id: '#ORD-2489', asset: 'MoFresh smart box 50l', status: 'Active', date: 'Jan, 20, 2026', amount: '12,000 Rwf', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=100' },
    { id: '#ORD-2490', asset: 'Tricycle', status: 'Pending', date: 'Jan, 20, 2026', amount: '8,000 Rwf', img: 'https://images.unsplash.com/photo-1558981403-c5f91dbafc3d?auto=format&fit=crop&q=80&w=100' },
    { id: '#ORD-2491', asset: 'Cold Box', status: 'Completed', date: 'Jan, 20, 2026', amount: '15,000 Rwf', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100' },
    { id: '#ORD-2492', asset: 'MoFresh smart box 50l', status: 'Completed', date: 'Jan, 20, 2026', amount: '12,000 Rwf', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=100' },
  ];

  const renderContent = () => {
    switch (activeNav) {
      case 'My Rentals':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900">My Rentals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
                  <div className="h-40 bg-gray-100 rounded-2xl overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400&sig=${i}`} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Smart Box 50L #{i}</h3>
                    <p className="text-sm text-gray-500">Hub: Kigali Main</p>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase">Active</span>
                    <button className="text-xs font-bold text-[#1a4d2e] hover:underline">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Marketplace':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900">Fresh Produce Marketplace</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 space-y-3 group cursor-pointer transition-transform hover:-translate-y-1">
                  <div className="h-32 bg-gray-100 rounded-2xl overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400&sig=${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Fresh Tomatoes (5kg)</h3>
                    <p className="text-xs text-gray-500">By Gako Farmer Group</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-black text-[#1a4d2e]">4,500 Rwf</span>
                    <button className="bg-[#38a169] text-white p-2 rounded-xl hover:bg-[#1a4d2e] transition-colors">
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Orders':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900">Order Management</h2>
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 text-center text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Your order history and tracking will appear here.</p>
            </div>
          </div>
        );
      case 'Invoice':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900">Billing & Invoices</h2>
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 text-center text-gray-400">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Download and manage your transaction invoices.</p>
            </div>
          </div>
        );
      case 'Settings':
        return (
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">Profile Settings</h2>
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
                  <p className="text-sm font-bold text-[#38a169] uppercase tracking-widest">{user?.role} Profile</p>
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
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
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
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Location / Address</label>
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
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Email Address (Read Only)</label>
                    <div className="relative opacity-60">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={user?.email}
                        readOnly
                        className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-2xl text-sm font-bold text-gray-500 cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>
                </form>

                <div className="pt-6 border-t border-gray-50">
                  <h4 className="text-sm font-black text-gray-900 mb-4">Account Security</h4>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 py-3 px-6 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm transition-colors border border-gray-100">
                      Change Password
                    </button>
                    <button className="flex-1 py-3 px-6 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-colors border border-red-100/50">
                      Deactivate Account
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
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black text-gray-900 leading-tight">
                  Welcome Back, <span className="text-[#38a169]">{user?.name?.split(' ')[0]}</span>
                </h1>
                <p className="text-gray-500 mt-1">Here's what's happening with your logistics today</p>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Live</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {stats.map((stat, idx) => {
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
                        <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                        {stat.badge && (
                          <span className="text-[10px] bg-green-100 text-[#38a169] px-2 py-0.5 rounded-full font-bold">
                            {stat.badge}
                          </span>
                        )}
                      </div>
                      {stat.subValue && (
                        <button className="text-[10px] font-bold text-[#ff9500] hover:underline">
                          {stat.subValue}
                        </button>
                      )}
                    </div>
                    <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Action Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="relative overflow-hidden rounded-[2.5rem] h-52 group cursor-pointer shadow-lg shadow-[#1a4d2e]/10">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a4d2e] via-[#1a4d2e]/90 to-transparent p-6 sm:p-10 flex flex-col justify-center text-white z-10">
                  <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 leading-tight max-w-[200px]">Need more capacity?</h3>
                  <button className="flex items-center gap-2 sm:gap-3 bg-[#ffb703] hover:bg-[#fb8500] text-[#1a4d2e] px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold w-fit transition-all hover:scale-105 shadow-xl shadow-black/20 text-sm sm:text-base">
                    Rent assets <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Logistics" />
              </div>

              <div className="relative overflow-hidden rounded-[2.5rem] h-52 group cursor-pointer shadow-lg shadow-[#38a169]/10">
                <div className="absolute inset-0 bg-gradient-to-r from-[#52796f] via-[#52796f]/90 to-transparent p-6 sm:p-10 flex flex-col justify-center text-white z-10 transition-transform">
                  <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 leading-tight max-w-[200px]">Source fresh produce</h3>
                  <button className="flex items-center gap-2 sm:gap-3 border-2 border-white hover:bg-white hover:text-[#354f52] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold w-fit transition-all hover:scale-105 shadow-xl shadow-black/20 backdrop-blur-sm text-sm sm:text-base">
                    Visit Marketplace
                  </button>
                </div>
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Marketplace" />
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-8 flex items-center justify-between border-b border-gray-50">
                <h3 className="text-lg sm:text-xl font-black text-gray-900">Recent Bookings</h3>
                <button className="text-xs sm:text-sm font-bold text-gray-400 hover:text-[#38a169] transition-colors">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                      <th className="px-6 sm:px-10 py-4 sm:py-6 whitespace-nowrap">Asset</th>
                      <th className="px-6 sm:px-10 py-4 sm:py-6 whitespace-nowrap">Order ID</th>
                      <th className="px-6 sm:px-10 py-4 sm:py-6 whitespace-nowrap">Status</th>
                      <th className="px-6 sm:px-10 py-4 sm:py-6 whitespace-nowrap">Pick up date</th>
                      <th className="px-6 sm:px-10 py-4 sm:py-6 text-right whitespace-nowrap">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentBookings.map((booking, idx) => (
                      <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 p-1">
                              <img src={booking.img} className="w-full h-full object-cover rounded-xl" />
                            </div>
                            <span className="text-sm font-bold text-gray-800 capitalize">{booking.asset}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className="text-sm font-medium text-gray-400">{booking.id}</span>
                        </td>
                        <td className="px-10 py-6">
                          <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${booking.status === 'Active' ? 'bg-green-100 text-[#38a169]' :
                            booking.status === 'Pending' ? 'bg-orange-100 text-[#ffb703]' :
                              'bg-gray-100 text-gray-400'
                            }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-sm font-bold text-gray-400">{booking.date}</td>
                        <td className="px-10 py-6 text-sm font-black text-gray-900 text-right">{booking.amount}</td>
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
