import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Box,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { rentalsService, invoicesService } from '@/api';
import type { RentalEntity } from '@/types/api.types';
import { toast } from 'sonner';

interface BuyerDashboardProps {
  activeNav: string;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ activeNav }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [rentals, setRentals] = useState<RentalEntity[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [rentalsRes, invoicesRes] = await Promise.all([
          rentalsService.getRentals().catch(() => []),
          invoicesService.getAllInvoices({ clientId: user?.id }).catch(() => []),
        ]);

        const rentalsData = Array.isArray(rentalsRes) ? rentalsRes : (rentalsRes as any)?.data || [];
        const invoicesData = Array.isArray(invoicesRes) ? invoicesRes : (invoicesRes as any)?.data || [];
        
        setRentals(rentalsData);
        setInvoices(invoicesData);

        const totalUnpaid = invoicesData
          .filter((inv: any) => inv.status === 'UNPAID')
          .reduce((sum: number, inv: any) => sum + (inv.totalAmount - inv.paidAmount), 0);
        setBalance(totalUnpaid);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load some dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const dashboardContent = (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 leading-tight">
            Welcome Back, <span className="text-[#38a169]">{user?.firstName}</span>
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
        {[
          { label: 'Active assets', value: '12', icon: Box, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Invoice Balance', value: `${balance.toLocaleString()} Rwf`, subValue: '+Add funds', icon: CreditCard, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Total Orders', value: (invoices?.length || 0).toString(), badge: '+5% this week', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
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
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                  {(stat as any).badge && (
                    <span className="text-[10px] bg-green-100 text-[#38a169] px-2 py-0.5 rounded-full font-bold">
                      {(stat as any).badge}
                    </span>
                  )}
                </div>
                {(stat as any).subValue && (
                  <button className="text-[10px] font-bold text-[#ff9500] hover:underline">
                    {(stat as any).subValue}
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
              {invoices.slice(0, 5).map((invoice, idx) => (
                <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 p-1">
                        <Box className="w-6 h-6 text-[#38a169]" />
                      </div>
                      <span className="text-sm font-bold text-gray-800 capitalize">Invoice #{invoice.invoiceNumber}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-sm font-medium text-gray-400">{invoice.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${invoice.status === 'PAID' ? 'bg-green-100 text-[#38a169]' :
                      invoice.status === 'UNPAID' ? 'bg-orange-100 text-[#ffb703]' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-sm font-bold text-gray-400">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  <td className="px-10 py-6 text-sm font-black text-gray-900 text-right">{invoice.totalAmount.toLocaleString()} Rwf</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeNav) {
      case 'Dashboard':
        return dashboardContent;
      case 'Rentals':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900">My Rentals</h2>
            {isLoading ? (
              <div className="text-center py-20 text-gray-500">Loading rentals...</div>
            ) : rentals.length === 0 ? (
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 text-center">
                <Box className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">You have no active rentals.</p>
                <button className="mt-4 text-[#38a169] font-bold hover:underline">Rent Asset</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentals.map((rental) => (
                  <div key={rental.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
                    <div className="h-40 bg-gray-100 rounded-2xl overflow-hidden relative">
                      {rental.image ? <img src={rental.image} className="w-full h-full object-cover" /> : <Box className="w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{rental.assetName}</h3>
                      <p className="text-sm text-gray-500">Hub: {rental.hubLocation}</p>
                      <p className="text-xs text-gray-400 mt-1">Due: {new Date(rental.rentalEndDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${rental.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {rental.status}
                      </span>
                      <button className="text-xs font-bold text-[#1a4d2e] hover:underline">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'Marketplace':
        return (
          <div className="p-12 text-center text-gray-400">
            <p className="font-bold uppercase tracking-widest">Marketplace coming soon...</p>
          </div>
        );
      case 'Orders':
        return (
          <div className="p-12 text-center text-gray-400">
            <p className="font-bold uppercase tracking-widest">Order Management coming soon...</p>
          </div>
        );
      case 'Invoice':
        return (
          <div className="p-12 text-center text-gray-400">
            <p className="font-bold uppercase tracking-widest">Billing & Invoices coming soon...</p>
          </div>
        );
      case 'Settings':
        return (
          <div className="p-12 text-center text-gray-400">
            <p className="font-bold uppercase tracking-widest">Settings coming soon...</p>
          </div>
        );
      default:
        return dashboardContent;
    }
  };

  return renderContent();
};
