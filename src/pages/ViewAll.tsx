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
}

function ViewAll() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
 

  const categories: Category[] = [
    { id: 1, name: t('vegetables'), image: cat1 },
    { id: 2, name: t('meat'), image: cat2 },
    { id: 3, name: t('fruits'), image: cat3 },
    { id: 4, name: t('freezingBoxes'), image: cat4 },
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
    },
  ];

  const filteredProducts =
    selectedCategory === null
      ? products
      : products.filter((product) => product.categoryId === selectedCategory);

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
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 h-full">
                {/* Categories */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Categories</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-6 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategory === null}
                      onChange={() => setSelectedCategory(null)}
                      className="w-5 h-5 rounded border-gray-300 text-[#2E8B2E] cursor-pointer"
                    />
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#2E8B2E]">All Products</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                        className="w-5 h-5 rounded border-gray-300 text-[#2E8B2E] cursor-pointer"
                      />
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-[#2E8B2E]">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Category Selector */}
              <div className="lg:hidden mb-6 ">
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">Categories</label>
                <select
                  value={selectedCategory === null ? 'all' : selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value === 'all' ? null : Number(e.target.value))}
                  className="  px-4 pr-4   py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-semibold hover:border-[#2E8B2E] dark:hover:border-[#9be15d] transition-colors "
                >
                  <option value="all">All Products</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

        
             
              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    No products available in this category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-[#2E8B2E] dark:hover:border-[#9be15d] flex flex-col"
                    >
                      {/* Product Image */}
                      <div className="relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-700">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {product.badge && (
                          <div
                            className={`absolute top-3 right-3 ${product.badgeColor} text-xs font-bold px-3 py-1 rounded-full`}
                          >
                            {product.badge}
                          </div>
                        )}
                        {product.discount > 0 && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                            -{product.discount}%
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col p-4">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < product.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {product.rating}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-[#2d6a4f] dark:text-[#9be15d]">
                              {product.price}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {product.unit}
                            </span>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="mt-auto w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-sm">Add to Cart</span>
                        </button>
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
