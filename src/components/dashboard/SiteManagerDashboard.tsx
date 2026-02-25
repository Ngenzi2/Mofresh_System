import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, DollarSign, TrendingUp } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface SiteManagerDashboardProps {
  activeNav: string;
}

export const SiteManagerDashboard: React.FC<SiteManagerDashboardProps> = ({ activeNav }) => {
  const { user } = useAppSelector((state) => state.auth);

  const dashboardContent = (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 leading-tight">
          Site Manager Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Manage operations at {user?.location || 'your hub'}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Hub Revenue', value: '12.5M Rwf', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Assets', value: '28', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Orders', value: '7', icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, idx) => {
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

      {/* Hub Status & Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-4">Hub Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-100">
              <span className="font-bold text-green-900">Storage Capacity</span>
              <span className="text-sm font-bold text-green-700">78%</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <span className="font-bold text-blue-900">Operational Efficiency</span>
              <span className="text-sm font-bold text-blue-700">92%</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl border border-orange-100">
              <span className="font-bold text-orange-900">Maintenance Alerts</span>
              <span className="text-sm font-bold text-orange-700">3 pending</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-4">Top Rentals</h3>
          <div className="space-y-3">
            {['Refrigeration Units', 'Transport Vehicles', 'Storage Bins', 'Packing Equipment'].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
                <span className="font-medium text-gray-700">{item}</span>
                <span className="px-3 py-1 bg-[#38a169]/10 text-[#38a169] rounded-full text-xs font-bold">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h3 className="text-lg font-black text-gray-900 mb-6">Daily Tasks</h3>
        <div className="space-y-3">
          {[
            { task: 'Verify inventory levels', time: '09:00 AM' },
            { task: 'Process rental returns', time: '02:00 PM' },
            { task: 'Maintenance check', time: '04:00 PM' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span className="font-medium text-gray-700">{item.task}</span>
              </div>
              <span className="text-xs font-bold text-gray-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeNav) {
      case 'Dashboard':
        return dashboardContent;
      case 'Hub Inventory':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Hub inventory management module coming soon...</div>;
      case 'Asset Control':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Asset control module coming soon...</div>;
      case 'Vendor Requests':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Vendor requests module coming soon...</div>;
      case 'Maintenance':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Maintenance scheduling module coming soon...</div>;
      case 'Reports':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Site Performance Reports coming soon...</div>;
      case 'Settings':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Hub manager settings module coming soon...</div>;
      default:
        return dashboardContent;
    }
  };

  return (
    <div className="mt-4">
      {renderContent()}
    </div>
  );
};
