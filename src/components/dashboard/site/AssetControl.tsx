import React, { useEffect, useState } from 'react';
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
import { useAppSelector } from '@/store/hooks';
import logisticsService from '@/api/services/logistics.service';
import infrastructureService from '@/api/services/infrastructure.service';
import sitesService from '@/api/services/sites.service';
import type { AssetStatus, AssetType, ColdBoxEntity, ColdPlateEntity, ColdRoomEntity, SiteEntity, TricycleEntity } from '@/types/api.types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

type AssetViewType = 'COLD_ROOM' | 'COLD_BOX' | 'COLD_PLATE' | 'TRICYCLE';

interface AssetView {
  id: string;
  name: string;
  type: AssetViewType;
  status: AssetStatus | string;
  siteId?: string;
  temperature?: number;
  health: number;
  imageUrl?: string;
  lastService?: string;
}

export const AssetControl: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [sites, setSites] = useState<SiteEntity[]>([]);
  const [assets, setAssets] = useState<AssetView[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedSiteId, setSelectedSiteId] = useState<string | undefined>(user?.siteId ?? undefined);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetView | null>(null);
  const [formData, setFormData] = useState<Partial<AssetView>>({
    name: '',
    type: 'COLD_ROOM',
    status: 'AVAILABLE',
    health: 100,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const mapColdRoomToAsset = (room: ColdRoomEntity): AssetView => ({
    id: room.id,
    name: room.name,
    type: 'COLD_ROOM',
    status: 'IN_USE',
    siteId: room.siteId,
    temperature: room.temperatureMax ?? room.temperatureMin,
    health: 100,
  });

  const mapColdBoxToAsset = (box: ColdBoxEntity): AssetView => ({
    id: box.id,
    name: box.identificationNumber,
    type: 'COLD_BOX',
    status: box.status,
    siteId: box.siteId,
    health: 100,
    imageUrl: box.imageUrl,
  });

  const mapColdPlateToAsset = (plate: ColdPlateEntity): AssetView => ({
    id: plate.id,
    name: plate.identificationNumber,
    type: 'COLD_PLATE',
    status: plate.status,
    siteId: plate.siteId,
    health: 100,
    imageUrl: plate.imageUrl,
  });

  const mapTricycleToAsset = (tricycle: TricycleEntity): AssetView => ({
    id: tricycle.id,
    name: tricycle.plateNumber,
    type: 'TRICYCLE',
    status: tricycle.status,
    siteId: tricycle.siteId,
    health: 100,
    imageUrl: tricycle.imageUrl,
  });

  const managerSite = sites.find(s => s.id === (selectedSiteId ?? user?.siteId));

  // Filter assets to only show those belonging to THIS hub
  const hubAssets = assets;

  const loadData = async (siteId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const [allSites, coldRooms, coldBoxes, coldPlates, tricycles] = await Promise.all([
        sitesService.getAllSites(),
        infrastructureService.getColdRooms(siteId),
        logisticsService.getColdBoxes(siteId),
        logisticsService.getColdPlates(siteId),
        logisticsService.getTricycles(siteId),
      ]);

      setSites(allSites);

      const mappedAssets: AssetView[] = [
        ...coldRooms.map(mapColdRoomToAsset),
        ...coldBoxes.map(mapColdBoxToAsset),
        ...coldPlates.map(mapColdPlateToAsset),
        ...tricycles.map(mapTricycleToAsset),
      ].filter(a => !siteId || a.siteId === siteId);

      setAssets(mappedAssets);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load assets';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData(user?.siteId ?? undefined);
  }, [user?.siteId]);

  const handleSwitchSite = (site: SiteEntity) => {
    setSelectedSiteId(site.id);
    void loadData(site.id);
    toast.info(`Switched context to ${site.name}`, {
      description: 'Showing assets for selected site from API.',
    });
  };

  const handleOpenModal = (asset?: AssetView) => {
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managerSite) return;

    try {
      const type = formData.type as AssetType | undefined;
      if (!type) {
        toast.error('Please choose an asset type');
        return;
      }

      let updated: AssetView | null = null;

      if (editingAsset) {
        if (type === 'COLD_ROOM') {
          const dto = {
            name: formData.name || editingAsset.name,
            siteId: managerSite.id,
            totalCapacityKg: 0,
            temperatureMin: 0,
            temperatureMax: formData.temperature ?? undefined,
          };
          const room = await infrastructureService.updateColdRoom(editingAsset.id, dto);
          updated = mapColdRoomToAsset(room);
        }
      } else {
        if (type === 'COLD_ROOM') {
          const dto = {
            name: formData.name || '',
            siteId: managerSite.id,
            totalCapacityKg: 0,
            temperatureMin: 0,
            temperatureMax: formData.temperature ?? 0,
            powerType: 'GRID',
          };
          const room = await infrastructureService.createColdRoom(dto as any);
          updated = mapColdRoomToAsset(room);
        } else if (type === 'COLD_BOX') {
          const box = await logisticsService.createColdBox({
            identificationNumber: formData.name || '',
            siteId: managerSite.id,
            sizeOrCapacity: '',
            location: managerSite.location,
            imageUrl: formData.imageUrl,
          });
          updated = mapColdBoxToAsset(box);
        } else if (type === 'COLD_PLATE') {
          const plate = await logisticsService.createColdPlate({
            identificationNumber: formData.name || '',
            siteId: managerSite.id,
            coolingSpecification: '',
            imageUrl: formData.imageUrl,
          });
          updated = mapColdPlateToAsset(plate);
        } else if (type === 'TRICYCLE') {
          const tricycle = await logisticsService.createTricycle({
            plateNumber: formData.name || '',
            siteId: managerSite.id,
            capacity: '',
            category: 'FRUITS_VEGETABLES',
            imageUrl: formData.imageUrl,
          });
          updated = mapTricycleToAsset(tricycle);
        }
      }

      if (updated) {
        setAssets(prev =>
          editingAsset ? prev.map(a => (a.id === editingAsset.id ? updated! : a)) : [updated!, ...prev],
        );
      }

      toast.success(editingAsset ? 'Asset updated successfully' : 'New asset added to hub');
      setIsModalOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save asset';
      toast.error(message);
    }
  };

  const handleDelete = async (asset: AssetView) => {
    if (window.confirm("Are you sure you want to decommission this asset?")) {
      try {
        if (asset.type === 'COLD_ROOM') {
          await infrastructureService.deleteColdRoom(asset.id);
        } else if (asset.type === 'COLD_BOX') {
          await logisticsService.deleteAsset('boxes', asset.id);
        } else if (asset.type === 'COLD_PLATE') {
          await logisticsService.deleteAsset('plates', asset.id);
        } else if (asset.type === 'TRICYCLE') {
          await logisticsService.deleteAsset('tricycles', asset.id);
        }
        setAssets(prev => prev.filter(a => a.id !== asset.id));
        toast.error('Asset decommissioned');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete asset';
        toast.error(message);
      }
    }
  };

  const toggleStatus = async (asset: AssetView) => {
    const newStatus = asset.status === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE' as any;
    try {
      if (asset.type === 'TRICYCLE') {
        await logisticsService.updateAssetStatus('tricycles', asset.id, newStatus);
      } else if (asset.type === 'COLD_BOX') {
        await logisticsService.updateAssetStatus('boxes', asset.id, newStatus);
      } else if (asset.type === 'COLD_PLATE') {
        await logisticsService.updateAssetStatus('plates', asset.id, newStatus);
      }
      setAssets(prev => prev.map(a => (a.id === asset.id ? { ...a, status: newStatus } : a)));
      toast.success(`${asset.name} is now ${newStatus}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      toast.error(message);
    }
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
          {loading && (
            <p className="text-sm text-gray-500">Loading assets from MoFresh API...</p>
          )}
          {error && !loading && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {!loading && !error && hubAssets.map(asset => {
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
                      <button onClick={() => handleDelete(asset)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors">
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
