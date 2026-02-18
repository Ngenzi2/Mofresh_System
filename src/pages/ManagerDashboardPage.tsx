import { useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/ui/DashboardLayout';
import { SiteManagerDashboard } from '@/components/dashboard/SiteManagerDashboard';

export default function ManagerDashboardPage() {
  const location = useLocation();

  // Extract the slug from the URL: /manager/hub-inventory -> hub-inventory
  const pathParts = location.pathname.split('/manager/')[1] || location.pathname.split('/manager')[1] || 'dashboard';
  const cleanPath = pathParts.replace(/^\//, '').split('/')[0] || 'dashboard';
  const slug = cleanPath === '' ? 'dashboard' : cleanPath;

  // Map slug back to label
  const activeNav = slug === 'dashboard' ? 'Dashboard' :
    slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <DashboardLayout activeNav={activeNav} setActiveNav={() => { }}>
      <SiteManagerDashboard activeNav={activeNav} />
    </DashboardLayout>
  );
}