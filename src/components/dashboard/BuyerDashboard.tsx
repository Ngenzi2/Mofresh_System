import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Box, CreditCard, ShoppingBag, Package,
  Wallet, Receipt,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { rentalsService, invoicesService, ordersService } from '@/api';
import { useNavigate } from 'react-router-dom';

// ── Section imports ───────────────────────────────────────────────────────────
import RentalsSection from './buyer/RentalsSection';
import OrdersSection from './buyer/OrdersSection';
import InvoiceSection from './buyer/InvoiceSection';
import MarketplaceSection from './buyer/MarketplaceSection';
import ProfileSection from './buyer/ProfileSection';

interface BuyerDashboardProps {
  activeNav: string;
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard: React.FC = () => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 animate-pulse h-28" />
);

// ── Overview (Home) ───────────────────────────────────────────────────────────
const OverviewContent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const [stats, setStats] = useState({
    activeRentals: 0,
    unpaidBalance: 0,
    totalOrders: 0,
    activeInvoices: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      setIsLoading(true);
      try {
        // Each call is independent — a 403 on one won't crash the others
        const [rentalsRes, invoicesRes, ordersRes] = await Promise.all([
          rentalsService.getRentals({ clientId: user.id }).catch(() => []),
          invoicesService.getAllInvoices({ clientId: user.id }).catch(() => []),
          ordersService.getAllOrders().catch(() => []),
        ]);

        const rentals = Array.isArray(rentalsRes) ? rentalsRes : (rentalsRes as any)?.data || [];
        const invoices = Array.isArray(invoicesRes) ? invoicesRes : (invoicesRes as any)?.data || [];
        const orders = Array.isArray(ordersRes) ? ordersRes : (ordersRes as any)?.data || [];

        setStats({
          activeRentals: rentals.filter((r: any) => r.status === 'ACTIVE').length,
          unpaidBalance: invoices.filter((i: any) => i.status === 'UNPAID').reduce((s: number, i: any) => s + (i.totalAmount - i.paidAmount), 0),
          totalOrders: orders.length,
          activeInvoices: invoices.filter((i: any) => i.status === 'UNPAID').length,
        });
        setRecentInvoices(invoices.slice(0, 5));
      } catch {
        // silently fail — individual `.catch` above handles per-service errors
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const statCards = [
    {
      label: 'Active Rentals',
      value: stats.activeRentals.toString(),
      icon: Box,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      trend: null,
    },
    {
      label: 'Invoice Balance',
      value: `${stats.unpaidBalance.toLocaleString()} Rwf`,
      sub: `${stats.activeInvoices} unpaid`,
      icon: Wallet,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      trend: null,
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      trend: null,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 leading-tight">
            Welcome Back,{' '}
            <span className="text-[#38a169]">{user?.firstName || 'there'}</span> 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your MoFresh snapshot for today</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Live</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {isLoading
          ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
          : statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#38a169]/30 hover:shadow-md transition-all"
              >
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-2xl font-black text-gray-900 leading-tight">{stat.value}</h3>
                  {(stat as any).sub && (
                    <p className="text-[10px] text-orange-500 font-bold">{(stat as any).sub}</p>
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
        <div
          onClick={() => navigate('/buyer/rentals')}
          className="relative overflow-hidden rounded-[2.5rem] h-52 group cursor-pointer shadow-lg shadow-[#1a4d2e]/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a4d2e] via-[#1a4d2e]/90 to-transparent p-6 sm:p-10 flex flex-col justify-center text-white z-10">
            <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 leading-tight max-w-[200px]">Need more capacity?</h3>
            <button className="flex items-center gap-2 sm:gap-3 bg-[#ffb703] hover:bg-[#fb8500] text-[#1a4d2e] px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold w-fit transition-all hover:scale-105 shadow-xl shadow-black/20 text-sm sm:text-base">
              Rent Assets <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            alt="Logistics"
          />
        </div>

        <div
          onClick={() => navigate('/buyer/marketplace')}
          className="relative overflow-hidden rounded-[2.5rem] h-52 group cursor-pointer shadow-lg shadow-[#38a169]/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#52796f] via-[#52796f]/90 to-transparent p-6 sm:p-10 flex flex-col justify-center text-white z-10">
            <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 leading-tight max-w-[200px]">Source fresh produce</h3>
            <button className="flex items-center gap-2 sm:gap-3 border-2 border-white hover:bg-white hover:text-[#354f52] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold w-fit transition-all hover:scale-105 shadow-xl shadow-black/20 backdrop-blur-sm text-sm sm:text-base">
              Visit Marketplace
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            alt="Marketplace"
          />
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-8 flex items-center justify-between border-b border-gray-50">
          <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#38a169]" /> Recent Invoices
          </h3>
          <button
            onClick={() => navigate('/buyer/invoice')}
            className="text-xs sm:text-sm font-bold text-gray-400 hover:text-[#38a169] transition-colors flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentInvoices.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-2 text-gray-200" />
            <p className="font-bold text-sm">No invoices yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="px-6 sm:px-10 py-4 sm:py-5 whitespace-nowrap">Invoice #</th>
                  <th className="px-6 sm:px-10 py-4 sm:py-5 whitespace-nowrap">Status</th>
                  <th className="px-6 sm:px-10 py-4 sm:py-5 whitespace-nowrap">Date</th>
                  <th className="px-6 sm:px-10 py-4 sm:py-5 text-right whitespace-nowrap">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentInvoices.map((invoice, idx) => (
                  <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 sm:px-10 py-4 sm:py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                          <CreditCard className="w-4 h-4 text-[#38a169]" />
                        </div>
                        <span className="text-sm font-bold text-gray-800">INV #{invoice.invoiceNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 sm:px-10 py-4 sm:py-5">
                      <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${invoice.status === 'PAID' ? 'bg-green-100 text-[#38a169]' :
                        invoice.status === 'UNPAID' ? 'bg-orange-100 text-orange-600' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 sm:px-10 py-4 sm:py-5 text-sm font-bold text-gray-400">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 sm:px-10 py-4 sm:py-5 text-sm font-black text-gray-900 text-right">
                      {(invoice.totalAmount ?? 0).toLocaleString()} Rwf
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Root component ────────────────────────────────────────────────────────────
export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ activeNav }) => {
  const renderContent = () => {
    switch (activeNav) {
      case 'Dashboard': return <OverviewContent />;
      case 'Rentals': return <RentalsSection />;
      case 'Marketplace': return <MarketplaceSection />;
      case 'Orders': return <OrdersSection />;
      case 'Invoice': return <InvoiceSection />;
      case 'Profile': return <ProfileSection />;
      case 'Settings': return <ProfileSection />; // reuse profile for now
      default: return <OverviewContent />;
    }
  };

  return <>{renderContent()}</>;
};
