import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, Package, LayoutGrid } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addProduct, updateProduct, deleteProduct,
  addCategory, updateCategory, deleteCategory,
  type MockProduct, type MockCategory
} from '@/store/mockDataSlice';
import { toast } from 'sonner';

export const ProductManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, categories, users } = useAppSelector((state) => state.mockData);

  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'CATEGORIES'>('PRODUCTS');
  const [searchTerm, setSearchTerm] = useState('');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MockProduct | null>(null);
  const [productForm, setProductForm] = useState<Partial<MockProduct>>({
    status: 'ACTIVE',
    price: 0,
    stock: 0,
  });
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const productImageInputRef = React.useRef<HTMLInputElement>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MockCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState<Partial<MockCategory>>({});

  // Handlers for Products
  const handleOpenProductModal = (product?: MockProduct) => {
    if (product) {
      setEditingProduct(product);
      setProductForm(product);
      setProductImagePreview(product.imageUrl || null);
    } else {
      setEditingProduct(null);
      setProductForm({ name: '', categoryId: categories[0]?.id || '', price: 0, stock: 0, supplierId: users.find(u => u.role === 'SUPPLIER')?.id || '', status: 'ACTIVE' });
      setProductImagePreview(null);
    }
    setIsProductModalOpen(true);
  };

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProductImagePreview(base64String);
        setProductForm(prev => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.categoryId || !productForm.supplierId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingProduct) {
      dispatch(updateProduct({ ...editingProduct, ...productForm } as MockProduct));
      toast.success('Product updated');
    } else {
      dispatch(addProduct({ id: `p-${Date.now()}`, ...productForm } as MockProduct));
      toast.success('Product added');
    }
    setIsProductModalOpen(false);
  };

  // Handlers for Categories
  const handleOpenCategoryModal = (category?: MockCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm(category);
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '' });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      toast.error('Name is required');
      return;
    }

    if (editingCategory) {
      dispatch(updateCategory({ ...editingCategory, ...categoryForm } as MockCategory));
      toast.success('Category updated');
    } else {
      dispatch(addCategory({ id: `c-${Date.now()}`, ...categoryForm } as MockCategory));
      toast.success('Category added');
    }
    setIsCategoryModalOpen(false);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';
  const getSupplierName = (id: string) => {
    const s = users.find(u => u.id === id);
    return s ? `${s.firstName} ${s.lastName}` : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Inventory & Products</h2>
          <p className="text-gray-500 text-sm">Manage the marketplace catalog and categories</p>
        </div>
        <button
          onClick={() => activeTab === 'PRODUCTS' ? handleOpenProductModal() : handleOpenCategoryModal()}
          className="flex items-center gap-2 bg-[#1a4d2e] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#143d24] transition-colors shadow-lg shadow-[#1a4d2e]/20"
        >
          <Plus className="w-4 h-4" /> {activeTab === 'PRODUCTS' ? 'Add Product' : 'Add Category'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('PRODUCTS')}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'PRODUCTS' ? 'bg-white text-[#1a4d2e] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('CATEGORIES')}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'CATEGORIES' ? 'bg-white text-[#1a4d2e] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Categories
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={`Search ${activeTab.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#38a169]/20 shadow-sm"
        />
      </div>

      {activeTab === 'PRODUCTS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:border-[#38a169]/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-[#38a169] overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900">{product.name}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{getCategoryName(product.categoryId)}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenProductModal(product)} className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => dispatch(deleteProduct(product.id))} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Price</span>
                  <span className="font-black text-[#1a4d2e]">{product.price.toLocaleString()} Rwf</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Stock</span>
                  <span className={`font-black ${product.stock < 50 ? 'text-red-500' : 'text-gray-900'}`}>{product.stock} units</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-50">
                  <span className="text-gray-500 font-medium text-xs uppercase tracking-tighter">Supplier</span>
                  <span className="font-bold text-gray-700 text-xs truncate max-w-[120px]">{getSupplierName(product.supplierId)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map(cat => (
            <div key={cat.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 group hover:border-[#38a169]/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <LayoutGrid className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-gray-900">{cat.name}</h3>
                </div>
                <button onClick={() => handleOpenCategoryModal(cat)} className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{cat.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {products.filter(p => p.categoryId === cat.id).length} Products
                </span>
                <button onClick={() => dispatch(deleteCategory(cat.id))} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Product Name</label>
                <input
                  type="text"
                  value={productForm.name || ''}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                  <select
                    value={productForm.categoryId}
                    onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-bold"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Supplier</label>
                  <select
                    value={productForm.supplierId}
                    onChange={e => setProductForm({ ...productForm, supplierId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-bold"
                  >
                    {users.filter(u => u.role === 'SUPPLIER').map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price (Rwf)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Stock</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-bold"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Product Image</label>
                <div
                  onClick={() => productImageInputRef.current?.click()}
                  className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all overflow-hidden relative group"
                >
                  {productImagePreview ? (
                    <>
                      <img src={productImagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Plus className="w-8 h-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Package className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload from Device</span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  ref={productImageInputRef}
                  onChange={handleProductImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  value={productForm.description || ''}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium h-20 resize-none"
                />
              </div>
              <button type="submit" className="w-full mt-4 py-3 bg-[#1a4d2e] text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-[#1a4d2e]/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category Name</label>
                <input
                  type="text"
                  value={categoryForm.name || ''}
                  onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  value={categoryForm.description || ''}
                  onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium transition-all h-24 resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Image URL</label>
                <input
                  type="text"
                  value={categoryForm.imageUrl || ''}
                  onChange={e => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-[#38a169] rounded-xl outline-none font-medium"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <button type="submit" className="w-full mt-4 py-3 bg-[#1a4d2e] text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-[#1a4d2e]/20 transition-all">
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
