import React, { useState, useEffect } from 'react';
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
  Loader2,
  ImageIcon,
  Snowflake,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { infrastructureService, logisticsService, sitesService } from '@/api';
import type { 
  ColdRoomEntity, 
  ColdBoxEntity, 
  ColdPlateEntity, 
  TricycleEntity,
  SiteEntity,
  PowerType,
} from '@/types/api.types';
import { AssetStatus } from '@/types/api.types';

type AssetType = 'COLD_ROOM' | 'COLD_BOX' | 'COLD_PLATE' | 'TRICYCLE';

interface UnifiedAsset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  siteId?: string;
  imageUrl?: string;
  // Cold Room specific
  totalCapacityKg?: number;
  usedCapacityKg?: number;
  temperatureMin?: number;
  temperatureMax?: number;
  powerType?: PowerType;
  // Cold Box specific
  identificationNumber?: string;
  sizeOrCapacity?: string;
  location?: string;
  // Cold Plate specific
  coolingSpecification?: string;
  // Tricycle specific
  plateNumber?: string;
  capacity?: string;
  category?: string;
}

export const AssetControl: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  // State for assets from backend
  const [coldRooms, setColdRooms] = useState<ColdRoomEntity[]>([]);
  const [coldBoxes, setColdBoxes] = useState<ColdBoxEntity[]>([]);
  const [coldPlates, setColdPlates] = useState<ColdPlateEntity[]>([]);
  const [tricycles, setTricycles] = useState<TricycleEntity[]>([]);
  const [sites, setSites] = useState<SiteEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [assetFilter, setAssetFilter] = useState<AssetType | 'ALL'>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<UnifiedAsset | null>(null);
  const [formData, setFormData] = useState<Partial<UnifiedAsset>>({
    name: '',
    type: 'COLD_ROOM',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Find the site this manager is responsible for
  const managerSite = sites.find(s => s.id === user?.siteId);

  // Fetch all assets from backend
  const fetchAssets = async () => {
    try {
      setLoading(true);
      const [rooms, boxes, plates, bikes, sitesList] = await Promise.all([
        infrastructureService.getColdRooms(user?.siteId || undefined),
        logisticsService.getColdBoxes(),
        logisticsService.getColdPlates(),
        logisticsService.getTricycles(),
        sitesService.getAllSites(),
      ]);

      setColdRooms(rooms);
      setColdBoxes(boxes.filter(b => !user?.siteId || b.siteId === user.siteId));
      setColdPlates(plates.filter(p => !user?.siteId || p.siteId === user.siteId));
      setTricycles(bikes.filter(t => !user?.siteId || t.siteId === user.siteId));
      setSites(sitesList);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [user?.siteId]);

  // Convert backend entities to unified format for display
  const unifiedAssets: UnifiedAsset[] = [
    ...coldRooms.map(r => ({
      id: r.id,
      name: r.name,
      type: 'COLD_ROOM' as AssetType,
      status: AssetStatus.AVAILABLE,
      siteId: r.siteId,
      totalCapacityKg: r.totalCapacityKg,
      usedCapacityKg: r.usedCapacityKg,
      temperatureMin: r.temperatureMin,
      temperatureMax: r.temperatureMax,
      powerType: r.powerType,
    })),
    ...coldBoxes.map(b => ({
      id: b.id,
      name: `Cold Box ${b.identificationNumber}`,
      type: 'COLD_BOX' as AssetType,
      status: b.status,
      siteId: b.siteId,
      imageUrl: b.imageUrl,
      identificationNumber: b.identificationNumber,
      sizeOrCapacity: b.sizeOrCapacity,
      location: b.location,
    })),
    ...coldPlates.map(p => ({
      id: p.id,
      name: `Cold Plate ${p.identificationNumber}`,
      type: 'COLD_PLATE' as AssetType,
      status: p.status,
      siteId: p.siteId,
      imageUrl: p.imageUrl,
      identificationNumber: p.identificationNumber,
      coolingSpecification: p.coolingSpecification,
    })),
    ...tricycles.map(t => ({
      id: t.id,
      name: `Tricycle ${t.plateNumber}`,
      type: 'TRICYCLE' as AssetType,
      status: t.status,
      siteId: t.siteId,
      imageUrl: t.imageUrl,
      plateNumber: t.plateNumber,
      capacity: t.capacity,
      category: t.category,
    })),
  ];

  // Filter assets by type
  const filteredAssets = assetFilter === 'ALL' 
    ? unifiedAssets 
    : unifiedAssets.filter(a => a.type === assetFilter);

  const handleOpenModal = (asset?: UnifiedAsset) => {
    if (asset) {
      setEditingAsset(asset);
      setFormData(asset);
      setImagePreview(asset.imageUrl || null);
    } else {
      setEditingAsset(null);
      setFormData({
        name: '',
        type: 'COLD_ROOM',
        siteId: user?.siteId || undefined,
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
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.siteId) {
      toast.error('Site ID not found');
      return;
    }

    try {
      // TODO: Handle image upload to Cloudinary first if imageFile exists
      // For now, we'll proceed without image upload
      
      if (editingAsset) {
        // Update existing asset
        switch (editingAsset.type) {
          case 'COLD_ROOM':
            if (formData.name && formData.totalCapacityKg && formData.temperatureMin && formData.powerType) {
              await infrastructureService.updateColdRoom(editingAsset.id, {
                name: formData.name,
                siteId: user.siteId,
                totalCapacityKg: formData.totalCapacityKg,
                temperatureMin: formData.temperatureMin,
                temperatureMax: formData.temperatureMax,
                powerType: formData.powerType,
              });
              toast.success('Cold room updated successfully');
            }
            break;
          case 'COLD_BOX':
            // Note: Backend may not have update endpoint for cold assets, only status
            toast.info('Cold box update functionality pending backend support');
            break;
          case 'COLD_PLATE':
            toast.info('Cold plate update functionality pending backend support');
            break;
          case 'TRICYCLE':
            toast.info('Tricycle update functionality pending backend support');
            break;
        }
      } else {
        // Create new asset
        switch (formData.type) {
          case 'COLD_ROOM':
            if (formData.name && formData.totalCapacityKg && formData.temperatureMin && formData.powerType) {
              await infrastructureService.createColdRoom({
                name: formData.name,
                siteId: user.siteId,
                totalCapacityKg: formData.totalCapacityKg,
                temperatureMin: formData.temperatureMin,
                temperatureMax: formData.temperatureMax || formData.temperatureMin + 10,
                powerType: formData.powerType,
              });
              toast.success('Cold room created successfully');
            } else {
              toast.error('Please fill all required fields for cold room');
              return;
            }
            break;
          case 'COLD_BOX':
            if (formData.identificationNumber && formData.sizeOrCapacity && formData.location) {
              await logisticsService.createColdBox({
                identificationNumber: formData.identificationNumber,
                sizeOrCapacity: formData.sizeOrCapacity,
                siteId: user.siteId,
                location: formData.location,
                imageUrl: formData.imageUrl,
              });
              toast.success('Cold box registered successfully');
            } else {
              toast.error('Please fill all required fields for cold box');
              return;
            }
            break;
          case 'COLD_PLATE':
            if (formData.identificationNumber && formData.coolingSpecification) {
              await logisticsService.createColdPlate({
                identificationNumber: formData.identificationNumber,
                coolingSpecification: formData.coolingSpecification,
                siteId: user.siteId,
                imageUrl: formData.imageUrl,
              });
              toast.success('Cold plate registered successfully');
            } else {
              toast.error('Please fill all required fields for cold plate');
              return;
            }
            break;
          case 'TRICYCLE':
            if (formData.plateNumber && formData.capacity && formData.category) {
              await logisticsService.createTricycle({
                plateNumber: formData.plateNumber,
                siteId: user.siteId,
                capacity: formData.capacity,
                category: formData.category,
                imageUrl: formData.imageUrl,
              });
              toast.success('Tricycle registered successfully');
            } else {
              toast.error('Please fill all required fields for tricycle');
              return;
            }
            break;
        }
      }
      
      await fetchAssets();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save asset');
    }
  };

  const handleDelete = async (asset: UnifiedAsset) => {
    if (!window.confirm(`Are you sure you want to delete ${asset.name}?`)) {
      return;
    }

    try {
      switch (asset.type) {
        case 'COLD_ROOM':
          await infrastructureService.deleteColdRoom(asset.id);
          break;
        case 'COLD_BOX':
          await logisticsService.deleteAsset('boxes', asset.id);
          break;
        case 'COLD_PLATE':
          await logisticsService.deleteAsset('plates', asset.id);
          break;
        case 'TRICYCLE':
          await logisticsService.deleteAsset('tricycles', asset.id);
          break;
      }
      toast.success('Asset deleted successfully');
      await fetchAssets();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete asset');
    }
  };

  const toggleStatus = async (asset: UnifiedAsset) => {
    if (asset.type === 'COLD_ROOM') {
      toast.info('Status toggle not available for cold rooms');
      return;
    }

    try {
      const newStatus = asset.status === AssetStatus.MAINTENANCE ? AssetStatus.AVAILABLE : AssetStatus.MAINTENANCE;
      const assetTypeMap: Record<string, 'boxes' | 'plates' | 'tricycles'> = {
        COLD_BOX: 'boxes',
        COLD_PLATE: 'plates',
        TRICYCLE: 'tricycles',
      };
      
      const mappedType = assetTypeMap[asset.type];
      if (mappedType) {
        await logisticsService.updateAssetStatus(mappedType, asset.id, newStatus);
        toast.success(`${asset.name} status updated to ${newStatus}`);
        await fetchAssets();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-gray-100 pb-8">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-[#38a169]/10 text-[#38a169] rounded-2xl flex items-center justify-center shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 leading-tight">Asset Control Center</h2>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm font-bold text-gray-500">{managerSite?.name || 'Loading...'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <select
            value={assetFilter}
            onChange={(e) => setAssetFilter(e.target.value as AssetType | 'ALL')}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none hover:border-gray-300 transition-all"
          >
            <option value="ALL">All Assets</option>
            <option value="COLD_ROOM">Cold Rooms</option>
            <option value="COLD_BOX">Cold Boxes</option>
            <option value="COLD_PLATE">Cold Plates</option>
            <option value="TRICYCLE">Tricycles</option>
          </select>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-[#38a169] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#2f855a] transition-all shadow-lg shadow-green-900/20"
          >
            <Plus className="w-4 h-4" /> Register New Asset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-[#38a169] animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Assets...</p>
        </div>
      ) : (
        <>
          {/* Asset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredAssets.map(asset => {
                const Icon = asset.type === 'TRICYCLE' ? Truck : asset.type === 'COLD_ROOM' ? Snowflake : Box;
                const statusColor = asset.status === 'AVAILABLE' ? 'bg-[#38a169]' : 
                                   asset.status === 'MAINTENANCE' ? 'bg-orange-500' : 
                                   asset.status === 'RENTED' ? 'bg-blue-500' : 'bg-gray-400';
                
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
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${statusColor}`} />

                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 overflow-hidden ${
                          asset.status === 'AVAILABLE' ? 'bg-green-50 text-[#38a169]' : 
                          asset.status === 'MAINTENANCE' ? 'bg-orange-50 text-orange-600' : 
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {asset.imageUrl ? (
                            <img src={asset.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Icon className="w-7 h-7" />
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenModal(asset)} 
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(asset)} 
                            className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-black text-gray-900 leading-tight">{asset.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{asset.type.replace('_', ' ')}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {asset.identificationNumber || asset.plateNumber || asset.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Asset-specific details */}
                      {asset.type === 'COLD_ROOM' && (
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50 space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-gray-400">
                              <Thermometer className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Temperature</span>
                            </div>
                            <span className="text-lg font-black text-blue-600">
                              {asset.temperatureMin}°C - {asset.temperatureMax}°C
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 font-medium">Capacity</span>
                            <span className="font-bold text-gray-900">
                              {asset.usedCapacityKg?.toFixed(0) || 0} / {asset.totalCapacityKg?.toFixed(0) || 0} kg
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all duration-1000 bg-[#38a169]"
                              style={{ width: `${Math.min(100, ((asset.usedCapacityKg || 0) / (asset.totalCapacityKg || 1)) * 100)}%` }}
                            />
                          </div>
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Power: {asset.powerType}
                          </div>
                        </div>
                      )}

                      {asset.type === 'COLD_BOX' && (
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50 space-y-1">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Size:</span> {asset.sizeOrCapacity}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Location:</span> {asset.location}
                          </div>
                        </div>
                      )}

                      {asset.type === 'COLD_PLATE' && (
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Cooling Spec:</span> {asset.coolingSpecification}
                          </div>
                        </div>
                      )}

                      {asset.type === 'TRICYCLE' && (
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50 space-y-1">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Capacity:</span> {asset.capacity}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Category:</span> {asset.category}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            asset.status === 'AVAILABLE' ? 'bg-green-500' : 
                            asset.status === 'MAINTENANCE' ? 'bg-orange-500' : 'bg-blue-500'
                          }`} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            {asset.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {asset.type !== 'COLD_ROOM' && (
                      <button
                        onClick={() => toggleStatus(asset)}
                        className={`w-full mt-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                          asset.status === 'MAINTENANCE'
                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-900/20'
                            : 'bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-orange-600 border border-gray-100'
                        }`}
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        {asset.status === 'MAINTENANCE' ? 'Restore to Operation' : 'Request Maintenance'}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredAssets.length === 0 && !loading && (
            <div className="text-center py-20">
              <Box className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Assets Found</h3>
              <p className="text-gray-500">Register new assets to manage your hub inventory</p>
            </div>
          )}
        </>
      )}

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
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">
                    {editingAsset ? 'Edit Asset' : 'Register Asset'}
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {managerSite?.name || 'Your Hub'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                {/* Asset Type Selection (only for new assets) */}
                {!editingAsset && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Type</label>
                    <select
                      required
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value as AssetType })}
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                    >
                      <option value="COLD_ROOM">Cold Room</option>
                      <option value="COLD_BOX">Cold Box</option>
                      <option value="COLD_PLATE">Cold Plate</option>
                      <option value="TRICYCLE">Tricycle</option>
                    </select>
                  </div>
                )}

                {/* Cold Room Fields */}
                {formData.type === 'COLD_ROOM' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Room Name *</label>
                      <input
                        required
                        type="text"
                        value={formData.name || ''}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                        placeholder="e.g. Cold Room Alpha"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Capacity (kg) *</label>
                        <input
                          required
                          type="number"
                          step="0.01"
                          value={formData.totalCapacityKg || ''}
                          onChange={e => setFormData({ ...formData, totalCapacityKg: parseFloat(e.target.value) })}
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                          placeholder="5000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Power Type *</label>
                        <select
                          required
                          value={formData.powerType || 'GRID'}
                          onChange={e => setFormData({ ...formData, powerType: e.target.value as PowerType })}
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                        >
                          <option value="GRID">Grid</option>
                          <option value="SOLAR">Solar</option>
                          <option value="HYBRID">Hybrid</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Min Temperature (°C) *</label>
                        <input
                          required
                          type="number"
                          step="0.1"
                          value={formData.temperatureMin || ''}
                          onChange={e => setFormData({ ...formData, temperatureMin: parseFloat(e.target.value) })}
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                          placeholder="-20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Max Temperature (°C)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.temperatureMax || ''}
                          onChange={e => setFormData({ ...formData, temperatureMax: parseFloat(e.target.value) })}
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                          placeholder="-10"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Cold Box Fields */}
                {formData.type === 'COLD_BOX' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identification Number *</label>
                      <input
                        required
                        type="text"
                        value={formData.identificationNumber || ''}
                        onChange={e => setFormData({ ...formData, identificationNumber: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                        placeholder="CB-001"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Size/Capacity *</label>
                        <input
                          required
                          type="text"
                          value={formData.sizeOrCapacity || ''}
                          onChange={e => setFormData({ ...formData, sizeOrCapacity: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                          placeholder="50L"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location *</label>
                        <input
                          required
                          type="text"
                          value={formData.location || ''}
                          onChange={e => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                          placeholder="Storage Area A"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Cold Plate Fields */}
                {formData.type === 'COLD_PLATE' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identification Number *</label>
                      <input
                        required
                        type="text"
                        value={formData.identificationNumber || ''}
                        onChange={e => setFormData({ ...formData, identificationNumber: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                        placeholder="CP-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cooling Specification *</label>
                      <input
                        required
                        type="text"
                        value={formData.coolingSpecification || ''}
                        onChange={e => setFormData({ ...formData, coolingSpecification: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                        placeholder="PCM -5°C"
                      />
                    </div>
                  </>
                )}

                {/* Tricycle Fields */}
                {formData.type === 'TRICYCLE' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Plate Number *</label>
                      <input
                        required
                        type="text"
                        value={formData.plateNumber || ''}
                        onChange={e => setFormData({ ...formData, plateNumber: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                        placeholder="RAD-123"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Capacity *</label>
                        <input
                          required
                          type="text"
                          value={formData.capacity || ''}
                          onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                          placeholder="200kg"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category *</label>
                        <select
                          required
                          value={formData.category || ''}
                          onChange={e => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                        >
                          <option value="">Select...</option>
                          <option value="DAIRY">Dairy</option>
                          <option value="MEAT">Meat</option>
                          <option value="FRUITS_VEGETABLES">Fruits & Vegetables</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Image Upload (for all types) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Image (Optional)</label>
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
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Photo</span>
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
                    {editingAsset ? 'Update Asset' : 'Register Asset'}
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
