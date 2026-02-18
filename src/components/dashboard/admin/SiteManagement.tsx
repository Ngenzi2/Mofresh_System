import React, { useState } from 'react';
import { Search, Plus, MapPin, Check, ExternalLink, X, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addSite, updateSite, deleteSite, type MockSite } from '@/store/mockDataSlice';
import { toast } from 'sonner';

export const SiteManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sites, users } = useAppSelector((state) => state.mockData);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<MockSite | null>(null);
  const [formData, setFormData] = useState<Partial<MockSite>>({
    name: '',
    location: '',
    status: 'OPERATIONAL',
    capacity: 0,
    managerId: '',
  });

  const handleOpenModal = (site?: MockSite) => {
    if (site) {
      setEditingSite(site);
      setFormData(site);
    } else {
      setEditingSite(null);
      setFormData({ name: '', location: '', status: 'OPERATIONAL', capacity: 0, managerId: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingSite) {
      dispatch(updateSite({ ...editingSite, ...formData } as MockSite));
      toast.success(`Site updated: ${formData.name}`);
    } else {
      const newSite: MockSite = {
        id: `s-${Date.now()}`,
        ...formData as any
      };
      dispatch(addSite(newSite));
      toast.success(`Site created: ${formData.name}`);
    }
    setIsModalOpen(false);
  };

  const handleDeleteSite = (id: string) => {
    if (confirm('Are you sure you want to delete this site?')) {
      dispatch(deleteSite(id));
      toast.success('Site deleted');
    }
  };

  const filteredSites = sites.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Site Management</h2>
          <p className="text-gray-500 text-sm">Monitor and manage distribution hubs and sites</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#1a4d2e] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#143d24] transition-colors shadow-lg shadow-[#1a4d2e]/20"
        >
          <Plus className="w-4 h-4" /> Add New Site
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search sites by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#38a169]/20 transition-all shadow-sm"
        />
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSites.map((site) => (
          <div key={site.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:border-[#38a169]/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-50 text-[#38a169] rounded-2xl flex items-center justify-center">
                  <MapPin className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">{site.name}</h3>
                  <p className="text-sm font-bold text-gray-400">{site.location}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(site)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <ExternalLink className="w-5 h-5 text-gray-400 hover:text-[#1a4d2e]" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-[#ffb703]" />
                  {users.find(u => u.id === site.managerId)?.firstName || 'Unassigned'}
                </span>
                <span className="font-black text-gray-900">{site.capacity}% Full</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${site.status === 'OPERATIONAL' ? 'bg-[#38a169]' : 'bg-orange-500'}`}
                  style={{ width: `${site.capacity}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${site.status === 'OPERATIONAL' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                {site.status}
              </span>
              <button
                onClick={() => handleDeleteSite(site.id)}
                className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
              >
                Decommission
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Site Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">{editingSite ? 'Edit Site' : 'Add New Site'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSaveSite} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Site Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all"
                  placeholder="e.g., Central Distribution Hub"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location / City</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all"
                  placeholder="e.g., Kigali"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Capacity (%)</label>
                  <input
                    type="number"
                    value={formData.capacity || 0}
                    onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Manager</label>
                  <select
                    value={formData.managerId || ''}
                    onChange={e => setFormData({ ...formData, managerId: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-[#38a169] transition-all font-bold text-gray-800"
                  >
                    <option value="">Unassigned</option>
                    {users.filter(u => u.role === 'SITE_MANAGER').map(u => (
                      <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#1a4d2e] hover:bg-[#143d24] text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-[#1a4d2e]/20 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Save Site
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
