import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, Check, Thermometer, Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addAsset, updateAsset, deleteAsset, type MockAsset } from '@/store/mockDataSlice';
import { toast } from 'sonner';

export const AssetManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { assets, sites } = useAppSelector((state) => state.mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'COLD_ROOM' | 'COLD_BOX' | 'COLD_PLATE' | 'TRICYCLE'>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<MockAsset | null>(null);
  const [formData, setFormData] = useState<Partial<MockAsset>>({
    type: 'COLD_ROOM',
    status: 'OPERATIONAL',
    health: 100,
  });

  const handleOpenModal = (asset?: MockAsset) => {
    if (asset) {
      setEditingAsset(asset);
      setFormData(asset);
    } else {
      setEditingAsset(null);
      setFormData({
        name: '',
        type: 'COLD_ROOM',
        status: 'OPERATIONAL',
        health: 100,
        temperature: -18,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please name the asset');
      return;
    }

    if (editingAsset) {
      dispatch(updateAsset({ ...editingAsset, ...formData } as MockAsset));
      toast.success(`Asset updated: ${formData.name}`);
    } else {
      const newAsset: MockAsset = {
        id: `a-${Date.now()}`,
        lastService: new Date().toISOString().split('T')[0],
        ...formData as any
      };
      dispatch(addAsset(newAsset));
      toast.success(`Asset created: ${formData.name}`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteAsset = (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      dispatch(deleteAsset(id));
      toast.success('Asset deleted');
    }
  };

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || a.type === filterType;
    return matchesSearch && matchesType;
  });

  const getSiteName = (siteId?: string) => {
    return sites.find(s => s.id === siteId)?.name || 'Unassigned';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Asset Management</h2>
          <p className="text-gray-500 text-sm">Monitor and manage cold chain infrastructure</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#1a4d2e] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#143d24] transition-colors shadow-lg shadow-[#1a4d2e]/20"
        >
          <Plus className="w-4 h-4" /> Add Asset
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#38a169]/20 transition-all shadow-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="pl-10 pr-8 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#38a169]/20 shadow-sm appearance-none"
          >
            <option value="ALL">All Asset Types</option>
            <option value="COLD_ROOM">Cold Rooms</option>
            <option value="COLD_BOX">Cold Boxes</option>
            <option value="COLD_PLATE">Cold Plates</option>
            <option value="TRICYCLE">Tricycles</option>
          </select>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:border-[#38a169]/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${asset.type === 'COLD_ROOM' ? 'bg-blue-50 text-blue-600' :
                  asset.type === 'TRICYCLE' ? 'bg-orange-50 text-orange-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                  <Thermometer className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900">{asset.name}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{asset.type.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="relative group/actions">
                <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                  <Edit2 className="w-4 h-4" onClick={() => handleOpenModal(asset)} />
                </button>
                <button
                  className="absolute -right-8 top-0 p-2 text-red-400 hover:text-red-600 opacity-0 group-hover/actions:opacity-100 transition-opacity"
                  onClick={() => handleDeleteAsset(asset.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                <span className="text-gray-500">Status</span>
                <span className={`font-bold text-xs px-2 py-0.5 rounded-full ${asset.status === 'OPERATIONAL' ? 'bg-green-100 text-green-700' :
                  asset.status === 'MAINTENANCE' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>{asset.status}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                <span className="text-gray-500">Location</span>
                <span className="font-bold text-gray-800 text-right truncate max-w-[150px]">{getSiteName(asset.siteId)}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                <span className="text-gray-500">Health</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${asset.health > 80 ? 'bg-[#38a169]' : 'bg-red-500'}`}
                      style={{ width: `${asset.health}%` }}
                    />
                  </div>
                  <span className="font-bold text-gray-800">{asset.health}%</span>
                </div>
              </div>
              {asset.temperature !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Temp</span>
                  <span className="font-bold text-blue-600">{asset.temperature}°C</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">{editingAsset ? 'Edit Asset' : 'Add New Asset'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSaveAsset} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Asset Name / ID</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all"
                  >
                    <option value="COLD_ROOM">Cold Room</option>
                    <option value="COLD_BOX">Cold Box</option>
                    <option value="COLD_PLATE">Cold Plate</option>
                    <option value="TRICYCLE">Tricycle</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all"
                  >
                    <option value="OPERATIONAL">Operational</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="DECOMMISSIONED">Decommissioned</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Site / Hub</label>
                <select
                  value={formData.siteId || ''}
                  onChange={e => setFormData({ ...formData, siteId: e.target.value || undefined })}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all"
                >
                  <option value="">-- Unassigned --</option>
                  {sites.map(site => (
                    <option key={site.id} value={site.id}>{site.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Health (%)</label>
                  <input
                    type="number"
                    min="0" max="100"
                    value={formData.health}
                    onChange={e => setFormData({ ...formData, health: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Temperature (°C)</label>
                  <input
                    type="number"
                    value={formData.temperature}
                    onChange={e => setFormData({ ...formData, temperature: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#1a4d2e] hover:bg-[#143d24] text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-[#1a4d2e]/20 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Save Asset
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
