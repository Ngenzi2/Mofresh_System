import React from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';

interface SupplierDashboardProps {
  activeNav: string;
}

export const SupplierDashboard: React.FC<SupplierDashboardProps> = ({ activeNav }) => {
  const dashboardContent = (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 leading-tight">
          Supplier Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Manage your products and sales</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total Revenue', value: '8.3M Rwf', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Products Listed', value: '34', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Orders This Month', value: '156', icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Customer Rating', value: '4.8★', icon: Users, color: 'text-yellow-600', bg: 'bg-yellow-50' },
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

      {/* Performance & Sales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-gray-700">Delivery Rate</span>
                <span className="text-sm font-bold text-green-600">98%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '98%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-gray-700">Quality Score</span>
                <span className="text-sm font-bold text-green-600">96%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '96%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-gray-700">Customer Satisfaction</span>
                <span className="text-sm font-bold text-green-600">94%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '94%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-4">Product Categories</h3>
          <div className="space-y-3">
            {['Fresh Vegetables', 'Fruits', 'Dairy Products', 'Grains'].map((category, i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
                <span className="font-medium text-gray-700">{category}</span>
                <span className="px-3 py-1 bg-[#38a169]/10 text-[#38a169] rounded-full text-xs font-bold">{Math.floor(Math.random() * 20) + 5} items</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h3 className="text-lg font-black text-gray-900 mb-6">Recent Orders</h3>
        <div className="space-y-3">
          {[
            { id: '#ORD-2026-001', buyer: 'City Market Kigali', amount: '250,000 Rwf', status: 'Delivered' },
            { id: '#ORD-2026-002', buyer: 'Fresh Store Ltd', amount: '180,000 Rwf', status: 'Pending' },
            { id: '#ORD-2026-003', buyer: 'Restaurant Hub', amount: '420,000 Rwf', status: 'Processing' },
          ].map((order, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-bold text-gray-900">{order.id}</p>
                <p className="text-sm text-gray-500">{order.buyer}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{order.amount}</p>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>{order.status}</span>
              </div>
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
      case 'Manage Products':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Product management module coming soon...</div>;
      case 'Categories':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Category management module coming soon...</div>;
      case 'Orders':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Order tracking module coming soon...</div>;
      case 'Settings':
        return <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest">Account settings module coming soon...</div>;
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
