import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { BuyerDashboard } from '@/components/dashboard/BuyerDashboard';
import { SiteManagerDashboard } from '@/components/dashboard/SiteManagerDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const [activeNav, setActiveNav] = useState('Dashboard');

  const renderDashboard = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <AdminDashboard activeNav={activeNav} />;
      case 'SITE_MANAGER':
        return <SiteManagerDashboard activeNav={activeNav} />;
      case 'BUYER':
      default:
        return <BuyerDashboard activeNav={activeNav} />;
    }
  };

  return (
    <DashboardLayout activeNav={activeNav} setActiveNav={setActiveNav}>
      {renderDashboard()}
    </DashboardLayout>
  );
}
