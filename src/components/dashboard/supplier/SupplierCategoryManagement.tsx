import React, { useState } from 'react';
import { Plus, LayoutGrid, X, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addCategory, updateCategory,
  type MockCategory
} from '@/store/mockDataSlice';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export const SupplierCategoryManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, products } = useAppSelector((state) => state.mockData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MockCategory | null>(null);
  const [formData, setFormData] = useState<Partial<MockCategory>>({
    name: '',
    description: '',
    imageUrl: ''
  });

  const handleOpenModal = (cat?: MockCategory) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData(cat);
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', imageUrl: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }

    if (editingCategory) {
      dispatch(updateCategory({ ...editingCategory, ...formData } as MockCategory));
      toast.success('Category updated');
    } else {
      dispatch(addCategory({ id: `c-${Date.now()}`, ...formData } as MockCategory));
      toast.success('New category proposed and added');
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 leading-tight">Product <span className="text-blue-600">Categories</span></h2>
          <p className="text-gray-500 text-sm">Organize your products by category</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#1a4d2e] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#143d24] transition-all"
        >
          <Plus className="w-5 h-5" /> Request New Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all"
          >
            <div className="h-32 bg-gray-50 relative overflow-hidden">
              {cat.imageUrl ? (
                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-100 bg-blue-50/50">
                  <LayoutGrid className="w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-white font-black text-lg uppercase tracking-tight">{cat.name}</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500 line-clamp-2">{cat.description || 'No description provided.'}</p>

              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>{products.filter(p => p.categoryId === cat.id).length} Active Listings</span>
                <button onClick={() => handleOpenModal(cat)} className="text-[#38a169] hover:underline">Edit Hub View</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900">{editingCategory ? 'Edit Category' : 'New Category Request'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                    placeholder="e.g., Organic Legumes"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-xs text-gray-500"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium h-24 resize-none"
                    placeholder="Brief description of products in this category"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4 bg-[#1a4d2e] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> {editingCategory ? 'Update Category' : 'Send Request'}
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
