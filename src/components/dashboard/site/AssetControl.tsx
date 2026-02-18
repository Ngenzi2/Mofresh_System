import React, { useState } from 'react';
import {
  Wrench,
  Thermometer,
  ShieldCheck,
  Box,
  Truck,
  Plus,
  Trash2,
  Edit3,
  X,
  MapPin,
  RefreshCw,
  ImageIcon
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateAsset, addAsset, deleteAsset, type MockAsset, type MockSite, type MockUser } from '@/store/mockDataSlice';
import { updateUser } from '@/store/mockDataSlice'; // For site switching demo
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export const AssetControl: React.FC = () => {
  const dispatch = useAppDispatch();
  const { assets, sites } = useAppSelector((state) => state.mockData);
  const { user } = useAppSelector((state) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<MockAsset | null>(null);
  const [formData, setFormData] = useState<Partial<MockAsset>>({
    name: '',
    type: 'COLD_ROOM',
    status: 'OPERATIONAL',
    health: 100,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Find the site this manager is responsible for
  const managerSite = sites.find(s => s.id === user?.siteId || s.name === user?.location);

  // Filter assets to only show those belonging to THIS hub
  const hubAssets = assets.filter(a => a.siteId === managerSite?.id);

  const handleSwitchSite = (site: MockSite) => {
    if (!user) return;
    dispatch(updateUser({
      ...user,
      siteId: site.id,
      location: site.name,
      status: (user as any).status || 'ACTIVE',
      joinedDate: (user as any).joinedDate || new Date().toISOString().split('T')[0]
    } as MockUser));
    toast.info(`Switched context to ${site.name}`, {
      description: "Demo mode: Manager's assigned site updated."
    });
  };

  const handleOpenModal = (asset?: MockAsset) => {
    if (asset) {
      setEditingAsset(asset);
      setFormData(asset);
      setImagePreview(asset.imageUrl || null);
    } else {
      setEditingAsset(null);
      setFormData({
        name: '',
        type: 'COLD_ROOM',
        status: 'OPERATIONAL',
        health: 100,
        temperature: -18,
        lastService: new Date().toISOString().split('T')[0],
        imageUrl: ''
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managerSite) return;

    if (editingAsset) {
      dispatch(updateAsset({ ...editingAsset, ...formData } as MockAsset));
      toast.success("Asset updated successfully");
    } else {
      const newAsset: MockAsset = {
        ...(formData as any),
        id: `a-${Date.now()}`,
        siteId: managerSite.id,
      };
      dispatch(addAsset(newAsset));
      toast.success("New asset added to hub");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to decommission this asset?")) {
      dispatch(deleteAsset(id));
      toast.error("Asset decommissioned");
    }
  };

  const toggleStatus = (asset: MockAsset) => {
    const newStatus = asset.status === 'MAINTENANCE' ? 'OPERATIONAL' : 'MAINTENANCE';
    dispatch(updateAsset({ ...asset, status: newStatus }));
    toast.success(`${asset.name} is now ${newStatus}`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Site Switching Demo */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-gray-100 pb-8">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-[#38a169]/10 text-[#38a169] rounded-2xl flex items-center justify-center shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 leading-tight">Asset Control Center</h2>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm font-bold text-gray-500">{managerSite?.name || 'Loading Site...'}</span>
              <div className="ml-4 flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 group">
                <RefreshCw className="w-3 h-3 text-gray-400 group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Switch Site (Demo):</span>
                {sites.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleSwitchSite(s)}
                    className={`text-[9px] font-black uppercase tracking-tighter hover:text-[#38a169] transition-colors ${managerSite?.id === s.id ? 'text-[#38a169] underline underline-offset-4' : 'text-gray-400'}`}
                  >
                    {s.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-[#38a169] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#2f855a] transition-all shadow-lg shadow-green-900/20"
        >
          <Plus className="w-4 h-4" /> Register New Asset
        </button>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {hubAssets.map(asset => {
            const Icon = asset.type === 'TRICYCLE' ? Truck : Box;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={asset.id}
                className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-[#38a169]/30 transition-all hover:shadow-xl hover:shadow-gray-200/50 relative overflow-hidden"
              >
                {/* Status Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${asset.status === 'OPERATIONAL' ? 'bg-[#38a169]' : 'bg-orange-500'}`} />

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 overflow-hidden ${asset.status === 'OPERATIONAL' ? 'bg-green-50 text-[#38a169]' : 'bg-orange-50 text-orange-600'
                      }`}>
                      {asset.imageUrl ? (
                        <img src={asset.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Icon className="w-7 h-7" />
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(asset)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(asset.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight">{asset.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{asset.type}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {asset.id}</span>
                    </div>
                  </div>

                  {asset.temperature !== undefined && (
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Thermometer className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Environment</span>
                        </div>
                        <span className={`text-lg font-black ${asset.temperature < -15 ? 'text-blue-600' : 'text-orange-600'}`}>{asset.temperature}°C</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${asset.temperature < -15 ? 'bg-blue-500' : 'bg-orange-500'}`}
                          style={{ width: `${Math.min(100, (Math.abs(asset.temperature) / 30) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Health</span>
                      <span className="text-sm font-black text-gray-900">{asset.health}%</span>
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                      SV: {asset.lastService}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleStatus(asset)}
                  className={`w-full mt-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${asset.status === 'MAINTENANCE'
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-900/20'
                    : 'bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-orange-600 border border-gray-100'
                    }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  {asset.status === 'MAINTENANCE' ? 'Restore to Operation' : 'Request Maintenance'}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">
                    {editingAsset ? 'Modify Asset' : 'Register Asset'}
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Assigning to {managerSite?.name}
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                    placeholder="e.g. Cold Room Gamma"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800 appearance-none"
                    >
                      <option value="COLD_ROOM">Cold Room</option>
                      <option value="COLD_BOX">Cold Box</option>
                      <option value="TRICYCLE">Tricycle</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Temperature (°C)</label>
                    <input
                      type="number"
                      value={formData.temperature || ''}
                      onChange={e => setFormData({ ...formData, temperature: parseInt(e.target.value) })}
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Initial Health (%)</label>
                    <input
                      type="number"
                      max="100"
                      value={formData.health}
                      onChange={e => setFormData({ ...formData, health: parseInt(e.target.value) })}
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Date</label>
                    <input
                      type="date"
                      value={formData.lastService}
                      onChange={e => setFormData({ ...formData, lastService: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Image</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all overflow-hidden relative group"
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Plus className="w-8 h-8 text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Asset Photo</span>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 border border-gray-100 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-[#38a169] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#2f855a] transition-all shadow-lg shadow-green-900/20"
                  >
                    {editingAsset ? 'Update Registry' : 'Confirm Registry'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
