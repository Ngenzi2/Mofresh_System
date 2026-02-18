import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Truck,
  Wrench,
  User,
  Phone,
  Mail,
  Camera,
  Save,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/authSlice';
import { reportsService, rentalsService } from '@/api';
import { HubInventory } from './site/HubInventory';
import { AssetControl } from './site/AssetControl';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import type { MockSite } from '@/store/mockDataSlice';

interface SiteManagerDashboardProps {
  activeNav: string;
}

export const SiteManagerDashboard: React.FC<SiteManagerDashboardProps> = ({ activeNav }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { sites } = useAppSelector((state) => state.mockData);

  const handleSwitchSite = (site: MockSite) => {
    if (!user) return;
    dispatch(updateUser({
      id: user.id,
      userData: {
        siteId: site.id,
        location: site.name
      }
    }));
    toast.success(`Switched to ${site.name} Control`);
  };

  // Settings Form State
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    location: user?.location || 'Kigali, Rwanda',
    nationalId: null as File | null,
    businessCert: null as File | null,
    profilePicture: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profilePicture || null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'nationalId' | 'businessCert' | 'profilePicture') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [field]: file }));

    if (field === 'profilePicture' && file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpdateProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user?.id) return;

    setIsSaving(true);
    try {
      await dispatch(updateUser({
        id: user.id,
        userData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          nationalIdDocument: formData.nationalId || undefined,
          businessCertificateDocument: formData.businessCert || undefined,
          avatar: formData.profilePicture || undefined,
        }
      })).unwrap();
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const [siteStats, setSiteStats] = useState({
    revenue: '0 Rwf',
    assets: '0',
    rentals: '0',
    maintenance: '0'
  });

  React.useEffect(() => {
    const fetchSiteData = async () => {
      // Logic to determine siteId. 
      // If user.location *is* the siteId (as hinted in previous code), use it.
      // Or if user.siteId exists (it should based on UserEntity).
      const siteId = user?.siteId;

      if (!siteId) return;

      try {
        const [revenueRes, rentalsRes] = await Promise.all([
          reportsService.getRevenueReport({ siteId }),
          rentalsService.getRentals({ siteId }).catch(() => [])
        ]);

        const revenueData = (revenueRes as any)?.data || revenueRes || {};
        const rentalsList = Array.isArray(rentalsRes) ? rentalsRes : (rentalsRes as any)?.data || [];

        const activeRentals = rentalsList.filter((r: any) => r.status === 'ACTIVE').length;

        // For Assets and Maintenance, we might need other endpoints not yet fully clear (e.g. products/assets endpoint)
        // For now we will keep them separate or mock them if API is missing, 
        // but we DID create productsService. Let's assume some products are assets?
        // Let's just update what we can: Revenue and Rentals.

        setSiteStats(prev => ({
          ...prev,
          revenue: `${revenueData.totalRevenue?.toLocaleString() || 0} Rwf`,
          rentals: activeRentals.toString(),
          // assets: '...', // Need asset API
          // maintenance: '...' // Need maintenance API
        }));
      } catch (error) {
        console.error('Error fetching site manager data:', error);
      }
    };

    fetchSiteData();
  }, [user?.siteId, user?.location]);

  const stats = [
    { label: 'Total Assets', value: siteStats.assets, icon: Box, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Rentals', value: siteStats.rentals, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Maintenance', value: siteStats.maintenance, icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const renderContent = () => {
    switch (activeNav) {
      case 'Hub Inventory':
        return <HubInventory />;
      case 'Asset Control':
        return <AssetControl />;
      case 'Maintenance':
        return <div className="p-12 text-center text-gray-400">Maintenance scheduling coming soon...</div>;
      case 'Reports':
        return <div className="p-12 text-center text-gray-400">Site Performance Reports coming soon...</div>;
      case 'Settings':
        return (
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">Hub Manager Settings</h2>
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
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[#38a169]/10 flex items-center justify-center bg-gray-50">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-gray-400">
                        <User className="w-12 h-12" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">No Photo</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'profilePicture')}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 bg-[#1a4d2e] p-2.5 rounded-full text-white shadow-lg transform transition-transform group-hover:scale-110"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-sm font-bold text-[#38a169] uppercase tracking-widest">{user?.location} Hub Manager</p>
                </div>
                <div className="w-full pt-6 border-t border-gray-50 flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <Mail className="w-4 h-4 text-[#ffb703]" /> {user?.email}
                  </div>
                </div>
              </div>

              {/* Right Column: Fields */}
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleUpdateProfile}>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-[#38a169]/30 focus:bg-white rounded-2xl text-sm font-bold text-gray-800 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-[#38a169]/30 focus:bg-white rounded-2xl text-sm font-bold text-gray-800 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Contact Phone</label>
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
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">National ID Document</label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => setFormData({ ...formData, nationalId: e.target.files?.[0] || null })}
                        className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#38a169]/30 focus:bg-white rounded-2xl text-xs font-bold text-gray-800 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Business Certificate</label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => setFormData({ ...formData, businessCert: e.target.files?.[0] || null })}
                        className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-[#38a169]/30 focus:bg-white rounded-2xl text-xs font-bold text-gray-800 transition-all outline-none"
                      />
                    </div>
                  </div>
                </form>

                <div className="pt-6 border-t border-gray-50">
                  <h4 className="text-sm font-black text-gray-900 mb-4">Operational Controls</h4>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 py-3 px-6 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm transition-colors border border-gray-100">
                      Report Issue to HQ
                    </button>
                    <button className="flex-1 py-3 px-6 bg-[#38a169]/10 hover:bg-[#38a169]/20 text-[#1a4d2e] rounded-xl font-bold text-sm transition-colors border border-[#38a169]/20">
                      Request Hub Sync
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
            {/* Demo Site Selector */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                    <RefreshCw className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-blue-900 dark:text-blue-300 uppercase tracking-widest">Demo: Site Selector</h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">Pick any hub to view its real-time dashboard</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sites.map(site => (
                    <button
                      key={site.id}
                      onClick={() => handleSwitchSite(site)}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${user?.siteId === site.id
                        ? 'bg-[#1a4d2e] text-white shadow-lg'
                        : 'bg-white/80 dark:bg-gray-800/80 text-gray-500 hover:bg-white hover:text-blue-600 border border-blue-100 dark:border-blue-900/50'
                        }`}
                    >
                      {site.name.split(' ')[0]} Hub
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black text-gray-900 leading-tight">
                  {user?.location || 'Local'} <span className="text-[#38a169]">Hub Control</span>
                </h1>
                <p className="text-gray-500 mt-1">Real-time overview of local operations and assets</p>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Local Hub Online</span>
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
                      <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                    </div>
                    <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Hub Monitoring Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Asset Health */}
              <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <h3 className="text-xl font-black text-gray-900">Asset Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Operational
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> Maintenance
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Cold Rooms', status: 'Optimal', count: '12/12', health: 98 },
                    { label: 'Smart Boxes', status: 'Warning', count: '148/156', health: 85 },
                    { label: 'Tricycles', status: 'Optimal', count: '24/25', health: 92 },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-sm">
                        <span className="font-bold text-gray-700">{item.label}</span>
                        <span className="text-xs text-gray-400 font-medium">{item.count} assets • {item.health}% health</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.health}%` }}
                          transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                          className={`h-full rounded-full ${item.health > 90 ? 'bg-[#38a169]' : 'bg-[#ffb703]'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="bg-[#1a4d2e] rounded-[2rem] p-8 text-white shadow-xl shadow-[#1a4d2e]/20">
                <h3 className="text-xl font-black mb-6">Critical Alerts</h3>
                <div className="space-y-4">
                  {[
                    { type: 'Maintenance', msg: 'Room 04 cooling unit service due', time: '2h ago' },
                    { type: 'Security', msg: 'Box #482 sensor offline', time: '5h ago' },
                    { type: 'Low Stock', msg: 'Packaging materials low in Nyagatare', time: '1d ago' },
                  ].map((alert, idx) => (
                    <div key={idx} className="bg-white/10 p-4 rounded-2xl border border-white/5 space-y-1 transition-colors hover:bg-white/20 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#ffb703]">{alert.type}</span>
                        <span className="text-[10px] text-white/40">{alert.time}</span>
                      </div>
                      <p className="text-sm font-medium text-white/90">{alert.msg}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-3 bg-white text-[#1a4d2e] rounded-xl font-bold text-sm hover:bg-[#ffb703] transition-colors">
                  View All Alerts
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return renderContent();
};
