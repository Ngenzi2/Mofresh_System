import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Box, Globe, Package, ArrowUpRight, Activity, Clock } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export const Overview: React.FC = () => {
  const { sites, assets, products, transactions } = useAppSelector((state) => state.mockData);

  // Stats calculation
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const activeRentals = assets.filter(a => a.status === 'RENTED').length;
  const healthScore = Math.floor(assets.reduce((sum, a) => sum + a.health, 0) / assets.length);
  const utilizationRate = Math.floor((activeRentals / assets.length) * 100);

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12.5%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Global Assets', value: assets.length.toString(), change: '+3', icon: Box, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Site Locations', value: sites.length.toString(), change: 'Stable', icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Market Products', value: products.length.toString(), change: '+24', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const chartData = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 5000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">System Intelligence</h2>
        <p className="text-gray-500 font-medium mt-1">Real-time performance across all cold chain nodes</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-[#38a169] bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-900">Revenue Flow</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Last 7 Days (System-wide)</p>
            </div>
            <select className="bg-gray-50 border-none rounded-xl text-xs font-bold py-2 px-4 outline-none ring-1 ring-gray-100">
              <option>Last Week</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38a169" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#38a169" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  dy={10}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                  labelStyle={{ fontWeight: 800, color: '#1a202c' }}
                />
                <Area type="monotone" dataKey="value" stroke="#38a169" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Insights */}
        <div className="space-y-6">
          {/* Health Score */}
          <div className="bg-[#1a4d2e] p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <Activity className="w-8 h-8 text-[#ffb703]" />
                <ArrowUpRight className="w-5 h-5 text-white/40" />
              </div>
              <h4 className="text-sm font-bold text-white/60 uppercase tracking-widest">Global Health</h4>
              <h3 className="text-4xl font-black mt-1">{healthScore}%</h3>
              <p className="text-xs font-medium text-white/40 mt-4 leading-relaxed">System infrastructure integrity is currently optimal across all monitored sites.</p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </div>

          {/* Utilization */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-900">Asset Utilization</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-time load</p>
              </div>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="absolute inset-y-0 left-0 bg-orange-500 rounded-full transition-all duration-1000"
                style={{ width: `${utilizationRate}%` }}
              />
            </div>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black text-gray-900">{utilizationRate}%</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Critical: 85%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Mini-table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-xl font-black text-gray-900">Recent System Events</h3>
          <button className="text-xs font-black text-[#38a169] uppercase tracking-widest hover:underline">View All Logs</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="px-8 py-4">Event</th>
                <th className="px-8 py-4">Site</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { event: 'New Site Registry', site: 'Kigali Central', status: 'Completed', time: '2m ago' },
                { event: 'Asset Maintenance', site: 'Rubavu Hub', status: 'Pending', time: '15m ago' },
                { event: 'Bulk Load Arrival', site: 'Musanze Depot', status: 'Processing', time: '1h ago' },
              ].map((row, i) => (
                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5 text-sm font-bold text-gray-800">{row.event}</td>
                  <td className="px-8 py-5 text-xs font-medium text-gray-500">{row.site}</td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs text-right text-gray-400 font-medium">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
