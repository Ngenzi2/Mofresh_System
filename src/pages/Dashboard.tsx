import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import {
  LayoutDashboard,
  Package,
  Truck,
  Wrench,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Box,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import logo from '@/assets/login.png';
// import dashboardImage from 'figma:asset/aff8fa06fbd407c5321da7cc590f4a1fec964181.png';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const { user } = useAppSelector((state) => state.auth);
  const [activeNav, setActiveNav] = useState('Dashboard');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Asset Inventory', icon: Package },
    { name: 'Rentals', icon: Truck },
    { name: 'Maintenance', icon: Wrench },
    { name: 'Reports', icon: FileText },
    { name: 'Settings', icon: Settings },
  ];

  const stats = [
    { label: 'TOTAL FLEET', value: '842', icon: Box, color: 'text-blue-500' },
    { label: 'CURRENTLY RENTED', value: '624', icon: Truck, color: 'text-orange-500' },
    { label: 'AVAILABLE STOCK', value: '218', icon: Package, color: 'text-green-500' },
    { label: "TODAY'S REVENUE", value: '$3,250.00', icon: Box, color: 'text-yellow-500' },
  ];

  const assetStatus = [
    {
      name: 'Cold Boxes (50L & 100L)',
      active: 350,
      inUse: 60,
      available: 30,
      damaged: 10,
    },
    {
      name: 'E-Tricycles (Urban)',
      active: 290,
      inUse: 55,
      available: 35,
      damaged: 10,
    },
  ];

  const needsAttention = [
    { id: 'TR-402', issue: 'Battery Issue', severity: 'CRITICAL' },
    { id: 'CB-119', issue: 'Cooling Failure', severity: 'MEDIUM' },
    { id: 'CB-088', issue: 'Hinge Broken', severity: 'LOW' },
  ];

  const recentTransactions = [
    {
      id: '#RET-9921',
      client: 'Fresh Farms Ltd',
      assetType: '10x Cold Box 50L',
      action: 'Return',
      time: '10:42 AM',
      status: 'Completed',
    },
    {
      id: '#RNT-9920',
      client: 'City Grocers',
      assetType: '2x Urban E-Trike',
      action: 'Rental',
      time: '09:15 AM',
      status: 'Active',
    },
    {
      id: '#RET-9919',
      client: 'Green Valley',
      assetType: '5x Cold Box 50L',
      action: 'Return',
      time: '08:30 AM',
      status: 'Inspection Needed',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-[#1a5d3f] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <img src={logo} alt="MoFresh" className="h-8" />
          <span className="text-xl">MoFresh</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveNav(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#ff9500] text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 space-y-1 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm">Help Center</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search asset ID, client, or date..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5d3f] focus:border-transparent"
              />
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white">
                  MR
                </div>
                <span className="text-sm">Marcus Ray</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl mb-1">Site Operations</h1>
            <p className="text-gray-600 text-sm">
              Overview of facility assets, daily rentals, and return requests.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-3xl">{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Asset Status Monitoring */}
            <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg">Asset Status Monitoring</h2>
                <button className="text-sm text-gray-600 hover:text-[#1a5d3f]">
                  View Full Inventory
                </button>
              </div>
              <div className="space-y-6">
                {assetStatus.map((asset, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Box className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm">{asset.name}</p>
                          <p className="text-xs text-gray-500">{asset.active} Active</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
                      <div
                        className="bg-blue-500"
                        style={{ width: `${asset.inUse}%` }}
                      ></div>
                      <div
                        className="bg-green-500"
                        style={{ width: `${asset.available}%` }}
                      ></div>
                      <div
                        className="bg-red-500"
                        style={{ width: `${asset.damaged}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">In Use</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-gray-600">Damaged</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs Attention */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg">Needs Attention</h2>
                <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs">
                  3
                </span>
              </div>
              <div className="space-y-4">
                {needsAttention.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm">Trike #{item.id}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          item.severity === 'CRITICAL'
                            ? 'bg-red-100 text-red-700'
                            : item.severity === 'MEDIUM'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{item.issue}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-[#1a5d3f] hover:underline flex items-center justify-center gap-1">
                View Maintenance Log
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Recent Check-ins & Returns */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg">Recent Check-ins & Returns</h2>
              <button className="px-4 py-2 bg-[#ff9500] text-white rounded-lg text-sm hover:bg-[#e68600] transition-colors">
                Scan New Return
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wide">
                      Transaction ID
                    </th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wide">
                      Client Name
                    </th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wide">
                      Asset Type
                    </th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wide">
                      Action Type
                    </th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wide">
                      Time
                    </th>
                    <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm">{transaction.id}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs">
                            {transaction.client.charAt(0)}
                          </div>
                          <span className="text-sm">{transaction.client}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm">{transaction.assetType}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            transaction.action === 'Return'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {transaction.action}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{transaction.time}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            transaction.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : transaction.status === 'Active'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
