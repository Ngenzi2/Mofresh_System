import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, TrendingUp, AlertCircle } from 'lucide-react';

interface AdminDashboardProps {
  activeNav: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeNav }) => {
  const dashboardContent = (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 leading-tight">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Manage the entire MoFresh system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[
          { label: 'Total Users', value: '156', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Revenue', value: '45.2M Rwf', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Sites', value: '8', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-purple-300/30 transition-colors"
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-4">Pending Approvals</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-bold text-yellow-900">5 vendor registrations</span>
              </div>
              <button className="text-xs font-bold text-yellow-700 hover:underline">Review</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-blue-900">2 site requests</span>
              </div>
              <button className="text-xs font-bold text-blue-700 hover:underline">Review</button>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-gray-700">Server Load</span>
                <span className="text-sm font-bold text-green-600">45%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-gray-700">Database</span>
                <span className="text-sm font-bold text-green-600">62%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '62%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h3 className="text-lg font-black text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {['User registration', 'New vendor approved', 'Payment processed', 'System backup completed'].map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
              <span className="font-medium text-gray-700">{activity}</span>
              <span className="text-xs text-gray-400">{Math.floor(Math.random() * 24)}h ago</span>
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
      case 'User Management':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">User management module coming soon...</div>;
      case 'Site Management':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Site management module coming soon...</div>;
      case 'Assets':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Asset management module coming soon...</div>;
      case 'Products':
      case 'Inventory':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Product management module coming soon...</div>;
      case 'Vendor Requests':
      case 'Supplier Requests':
      case 'Vendors':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Vendor requests module coming soon...</div>;
      case 'Financials':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Financials module coming soon...</div>;
      case 'Reports':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Global system reports coming soon...</div>;
      case 'Settings':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Admin system settings coming soon...</div>;
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
