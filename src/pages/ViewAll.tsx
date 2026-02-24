import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/cartSlice';
import { useNavigate, Link } from 'react-router';
import { Plus, Star, ChevronRight } from 'lucide-react';

// Category images
import cat1 from '@/assets/vegetables.png';
import cat2 from '@/assets/meat.png';
import cat3 from '@/assets/fruits.png';
import cat4 from '@/assets/freezer.png';

// Product images
import pro1 from '@/assets/brocoli.png';
import pro2 from '@/assets/orange.png';
import pro3 from '@/assets/freshmeat.png';
import pro4 from '@/assets/banana.png';
import pro5 from '@/assets/fish.png';
import pro6 from '@/assets/pepper.png';

interface Category {
  id: number;
  name: string;
  image: string;
}

interface Location {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  discount: number;
  rating: number;
  badge: string | null;
  badgeColor?: string;
  image: string;
  categoryId: number;
  locationId: number;
}

function ViewAll() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const categories: Category[] = [
    { id: 1, name: t('vegetables'), image: cat1 },
    { id: 2, name: t('meat'), image: cat2 },
    { id: 3, name: t('fruits'), image: cat3 },
    { id: 4, name: t('freezingBoxes'), image: cat4 },
  ];

  const locations: Location[] = [
    { id: 1, name: 'Kigali' },
    { id: 2, name: 'Musanze' },
    { id: 3, name: 'Rubavu' },
    { id: 4, name: 'Bugesera' },
  ];

  const products: Product[] = [
    {
      id: 1,
      name: t('broccoli'),
      price: 1000,
      unit: 'Rwf/kg',
      discount: 15,
      rating: 4,
      badge: t('popular'),
      badgeColor: 'bg-yellow-400',
      image: pro1,
      categoryId: 1,
      locationId: 1,
    },
    {
      id: 2,
      name: t('orange'),
      price: 1500,
      unit: 'Rwf/kg',
      discount: 10,
      rating: 5,
      badge: null,
      image: pro2,
      categoryId: 3,
      locationId: 1,
    },
    {
      id: 3,
      name: t('banana'),
      price: 1500,
      unit: 'Rwf/kg',
      discount: 10,
      rating: 4,
      badge: null,
      image: pro4,
      categoryId: 3,
      locationId: 2,
    },
    {
      id: 4,
      name: t('meatProduct'),
      price: 1000,
      unit: 'Rwf/kg',
      discount: 15,
      rating: 4,
      badge: t('popular'),
      badgeColor: 'bg-yellow-400',
      image: pro3,
      categoryId: 2,
      locationId: 2,
    },
    {
      id: 5,
      name: t('fishProduct'),
      price: 1300,
      unit: 'Rwf/kg',
      discount: 20,
      rating: 5,
      badge: null,
      image: pro5,
      categoryId: 2,
      locationId: 3,
    },
    {
      id: 6,
      name: t('pepperProduct'),
      price: 1000,
      unit: 'Rwf/kg',
      discount: 25,
      rating: 4,
      badge: t('popular'),
      badgeColor: 'bg-yellow-400',
      image: pro6,
      categoryId: 1,
      locationId: 4,
    },
  ];

  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === null || product.categoryId === selectedCategory;
    const locationMatch = selectedLocation === null || product.locationId === selectedLocation;
    return categoryMatch && locationMatch;
  });

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    navigate('/cart');
  };

  return (
    <>
      <Header />
      <main className="w-full bg-white dark:bg-gray-900">
        {/* Breadcrumb */}
        <div className="w-full max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link to="/" className="hover:text-[#2d6a4f] dark:hover:text-[#9be15d]">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/view-all" className="hover:text-[#2d6a4f] dark:hover:text-[#9be15d]">Marketplace</Link>
            {selectedCategory && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#2d6a4f] dark:text-[#9be15d] font-semibold">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </span>
              </>
            )}
            {selectedLocation && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#2d6a4f] dark:text-[#9be15d] font-semibold">
                  {locations.find(l => l.id === selectedLocation)?.name}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 space-y-8">
                {/* Categories */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Categories</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === null}
                        onChange={() => setSelectedCategory(null)}
                        className="w-4 h-4 border-gray-300 text-[#2E8B2E] focus:ring-[#2E8B2E]"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#2E8B2E]">All Products</span>
                    </label>
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category.id}
                          onChange={() => setSelectedCategory(category.id)}
                          className="w-4 h-4 border-gray-300 text-[#2E8B2E] focus:ring-[#2E8B2E]"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#2E8B2E]">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Locations */}
                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Locations</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="location"
                        checked={selectedLocation === null}
                        onChange={() => setSelectedLocation(null)}
                        className="w-4 h-4 border-gray-300 text-[#2E8B2E] focus:ring-[#2E8B2E]"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#2E8B2E]">All Locations</span>
                    </label>
                    {locations.map((location) => (
                      <label key={location.id} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="location"
                          checked={selectedLocation === location.id}
                          onChange={() => setSelectedLocation(location.id)}
                          className="w-4 h-4 border-gray-300 text-[#2E8B2E] focus:ring-[#2E8B2E]"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#2E8B2E]">{location.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Mobile Filter Grid */}
              <div className="lg:hidden grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Category</label>
                  <select
                    value={selectedCategory === null ? 'all' : selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value === 'all' ? null : Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-[#2E8B2E]/20 outline-none transition-all"
                  >
                    <option value="all">All Products</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Location</label>
                  <select
                    value={selectedLocation === null ? 'all' : selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value === 'all' ? null : Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-xl text-gray-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-[#2E8B2E]/20 outline-none transition-all"
                  >
                    <option value="all">All Locations</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Showing <span className="text-[#2E8B2E]">{filteredProducts.length}</span> Results
                </p>
                {(selectedCategory || selectedLocation) && (
                  <button
                    onClick={() => { setSelectedCategory(null); setSelectedLocation(null); }}
                    className="text-xs font-black text-[#2E8B2E] uppercase tracking-widest hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-gray-50/50 dark:bg-white/[0.02] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                  <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-sm">
                    No products found matching your criteria.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-[#2E8B2E] flex flex-col"
                    >
                      {/* Product Image */}
                      <div className="relative overflow-hidden aspect-square bg-gray-50 dark:bg-gray-900/50 p-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                        {product.badge && (
                          <div
                            className={`absolute top-4 right-4 ${product.badgeColor} text-[10px] font-black uppercase tracking-widest text-gray-900 px-3 py-1.5 rounded-full shadow-sm`}
                          >
                            {product.badge}
                          </div>
                        )}
                        {product.discount > 0 && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg shadow-sm">
                            -{product.discount}%
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col p-4 sm:p-5">
                        <div className="mb-2">
                          <span className="text-[10px] font-black text-[#2E8B2E] uppercase tracking-widest">
                            {locations.find(l => l.id === product.locationId)?.name}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mt-1 line-clamp-1">
                            {product.name}
                          </h3>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < product.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-200 dark:text-gray-700'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 ml-1">
                            ({product.rating}.0)
                          </span>
                        </div>

                        {/* Price & Action */}
                        <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-700/50 flex items-center justify-between gap-4">
                          <div>
                            <span className="text-lg font-black text-gray-900 dark:text-white">
                              {product.price}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                              {product.unit}
                            </span>
                          </div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl flex items-center justify-center hover:bg-[#2E8B2E] dark:hover:bg-[#2E8B2E] hover:text-white transition-all shadow-sm active:scale-95"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ViewAll;
