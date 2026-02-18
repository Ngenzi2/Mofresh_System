import React, { useState } from 'react';
import {
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Package,
  ArrowRightLeft,
  Plus,
  MoreVertical,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateProduct, addMovement, type MockProduct, type MockMovement } from '@/store/mockDataSlice';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export const HubInventory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, sites } = useAppSelector((state) => state.mockData);
  const { user } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'MOVEMENTS'>('PRODUCTS');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [roomFilter, setRoomFilter] = useState('All Rooms');

  // Find the site this manager is responsible for
  const managerSite = sites.find(s => s.id === user?.siteId || s.name === user?.location);

  const hubProducts = products.filter(p => {
    const matchesSite = p.siteId === managerSite?.id;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSite && matchesSearch;
  });

  const handleStockUpdate = (product: MockProduct, adjustment: number) => {
    const newStock = Math.max(0, product.stock + adjustment);
    dispatch(updateProduct({ ...product, stock: newStock }));

    // Log movement
    const movement: MockMovement = {
      id: `m-${Date.now()}`,
      productId: product.id,
      type: adjustment > 0 ? 'IN' : 'OUT',
      quantity: Math.abs(adjustment),
      siteId: managerSite?.id || 'unknown',
      room: product.room || 'General Storage',
      performedBy: user?.firstName || 'Manager',
      timestamp: new Date().toISOString()
    };
    dispatch(addMovement(movement));

    toast.success(`${adjustment > 0 ? 'Stock In' : 'Stock Out'} processed`, {
      description: `${product.name} now at ${newStock} units.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-lg font-black uppercase tracking-tighter border border-gray-200">
              {managerSite?.name || 'Kigali Central Hub'}
            </span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 leading-tight">Inventory</h2>
          <p className="text-gray-500 text-sm font-medium">Manage products and track stock movements</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
            <ArrowRightLeft className="w-4 h-4" /> Stock Movement
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#38a169] text-white rounded-xl font-bold text-sm hover:bg-[#2f855a] transition-all shadow-lg shadow-green-900/20">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('PRODUCTS')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'PRODUCTS' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('MOVEMENTS')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'MOVEMENTS' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Stock Movements
            </button>
          </div>

          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#38a169]/20 outline-none transition-all"
              />
            </div>
            <select
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none cursor-pointer hover:border-gray-300"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>
            <select
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none cursor-pointer hover:border-gray-300"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
            >
              <option>All Rooms</option>
              <option>Room A1</option>
              <option>Room B2</option>
              <option>Room C3</option>
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <AnimatePresence mode="wait">
          {activeTab === 'PRODUCTS' ? (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 bg-gray-50/50">
                      <th className="px-8 py-5">Product</th>
                      <th className="px-8 py-5">Category</th>
                      <th className="px-8 py-5">Quantity</th>
                      <th className="px-8 py-5">Price</th>
                      <th className="px-8 py-5">Cold Room</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-medium">
                    {hubProducts.map((p) => (
                      <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center overflow-hidden shrink-0">
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm">{p.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {p.id.toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm text-gray-600">Inventory</span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleStockUpdate(p, -5)}
                              className="p-1 hover:bg-red-50 text-red-500 rounded transition-colors"
                            >
                              <ArrowDownLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-bold text-gray-900 w-12 text-center">{p.stock} kg</span>
                            <button
                              onClick={() => handleStockUpdate(p, 5)}
                              className="p-1 hover:bg-green-50 text-green-600 rounded transition-colors"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm text-gray-600">RF {p.price.toLocaleString()}/kg</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm text-gray-700 font-bold">{p.room || 'Room A1'}</span>
                        </td>
                        <td className="px-8 py-5">
                          {p.stock < 50 ? (
                            <span className="px-3 py-1 bg-orange-50 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest">Low Stock</span>
                          ) : (
                            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">In Stock</span>
                          )}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {hubProducts.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-8 py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                          No active product inventory at this hub location
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="movements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-3xl p-12 text-center border border-gray-100"
            >
              <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ArrowRightLeft className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Stock Movements History</h3>
              <p className="text-gray-500 max-w-sm mx-auto text-sm">Real-time log of all incoming and outgoing stock at this hub will appear here.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
