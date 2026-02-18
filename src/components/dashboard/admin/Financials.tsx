import React from 'react';
import { motion } from 'framer-motion';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { DollarSign, TrendingUp, Users, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { verifyTransaction } from '@/store/mockDataSlice';
import { toast } from 'sonner';

export const Financials: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, users, sites } = useAppSelector((state) => state.mockData);

  // Stats calculation
  const totalRevenue = transactions.filter(t => t.status === 'PAID').reduce((sum, t) => sum + t.amount, 0);
  const pendingRevenue = transactions.filter(t => t.status === 'PENDING').reduce((sum, t) => sum + t.amount, 0);
  const totalUsersPaid = new Set(transactions.filter(t => t.status === 'PAID').map(t => t.userId)).size;

  // Chart Data (Mocking a timeline)
  const revenueData = [
    { name: 'Mon', amount: 120000 },
    { name: 'Tue', amount: 80000 },
    { name: 'Wed', amount: 200000 },
    { name: 'Thu', amount: 150000 },
    { name: 'Fri', amount: 250000 },
    { name: 'Sat', amount: 300000 },
    { name: 'Sun', amount: 180000 },
  ];

  const handleVerify = (id: string) => {
    dispatch(verifyTransaction(id));
    toast.success('Payment verified by system');
  };

  const getUserName = (id: string) => {
    const u = users.find(user => user.id === id);
    return u ? `${u.firstName} ${u.lastName}` : 'Unknown';
  };

  const getSiteName = (id?: string) => {
    if (!id) return 'Online';
    return sites.find(s => s.id === id)?.name || 'Central';
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 leading-tight">System <span className="text-[#38a169]">Financials</span></h2>
          <p className="text-gray-500 text-sm">Monitor revenue, payments, and site manager reconciliation</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-xs font-black text-green-700 uppercase tracking-widest">Growth +24%</span>
        </div>
      </div>

      {/* Financial Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `${totalRevenue.toLocaleString()} Rwf`, icon: DollarSign, color: 'bg-green-500', trend: 'up' },
          { label: 'Pending Payments', value: `${pendingRevenue.toLocaleString()} Rwf`, icon: Clock, color: 'bg-orange-500', trend: 'neutral' },
          { label: 'Verified Buyers', value: totalUsersPaid.toString(), icon: Users, color: 'bg-blue-500', trend: 'up' },
          { label: 'Completion Rate', value: '94%', icon: CheckCircle, color: 'bg-purple-500', trend: 'up' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-150`} />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-gray-900 transition-colors`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                {stat.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-500" />}
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</h4>
                <p className="text-xl font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-black text-gray-900">Revenue Analysis</h3>
            <select className="bg-gray-50 border-none text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38a169" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#38a169" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#999' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#999' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#38a169" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1a4d2e] p-8 rounded-[3rem] shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-lg font-black mb-1">Financial Health</h3>
            <p className="text-green-300 text-xs font-bold mb-8">System reliability is at optimal levels</p>

            <div className="space-y-6 flex-1">
              {[
                { label: 'Site Transfers', value: 88, color: 'bg-green-400' },
                { label: 'Vendor Payouts', value: 65, color: 'bg-yellow-400' },
                { label: 'System Fees', value: 92, color: 'bg-blue-400' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-300" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-green-300">Quick Action</p>
                <p className="text-sm font-bold">Generate Monthly Report</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-black text-gray-900">Recent Transactions</h3>
          <button className="text-xs font-black text-[#38a169] uppercase tracking-widest hover:underline">Full Statement</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="px-10 py-6">Reference & User</th>
                <th className="px-10 py-6">Items</th>
                <th className="px-10 py-6">Location</th>
                <th className="px-10 py-6">Amount</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-10 py-6">
                    <p className="text-xs font-black text-[#1a4d2e] mb-1">#{tx.id.toUpperCase()}</p>
                    <p className="text-sm font-bold text-gray-800">{getUserName(tx.userId)}</p>
                  </td>
                  <td className="px-10 py-6 text-sm font-medium text-gray-500">
                    {tx.items.join(', ')}
                  </td>
                  <td className="px-10 py-6 text-xs font-bold text-gray-400 uppercase">
                    {getSiteName(tx.siteId)}
                  </td>
                  <td className="px-10 py-6 text-sm font-black text-gray-900">
                    {tx.amount.toLocaleString()} Rwf
                  </td>
                  <td className="px-10 py-6">
                    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${tx.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    {tx.isVerifiedByManager ? (
                      <div className="flex items-center justify-end gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleVerify(tx.id)}
                        className="text-[10px] font-black uppercase tracking-widest text-[#1a4d2e] hover:text-[#38a169] transition-colors"
                      >
                        Verify Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
