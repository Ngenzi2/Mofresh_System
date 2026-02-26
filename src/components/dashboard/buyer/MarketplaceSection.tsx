import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, ShoppingCart, Plus, Minus,
    Leaf, Beef, Apple, Package, RefreshCw, X,
    LockKeyhole, AlertCircle, Sparkles, Eye,
    ChevronRight, Scale, Thermometer, Tag, BarChart3,
    CheckCircle,
} from 'lucide-react';
import { productsService, ordersService } from '@/api';
import { handleApiError, getApiErrorStatus } from '@/api/client';
import type { ProductEntity } from '@/types/api.types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/cartSlice';
import { toast } from 'sonner';

// ── Lookup tables ─────────────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, React.ElementType> = {
    Vegetables: Leaf,
    Meat: Beef,
    Fruits: Apple,
    Other: Package,
};

const CATEGORY_GRADIENTS: Record<string, string> = {
    Vegetables: 'from-emerald-400 to-teal-600',
    Meat: 'from-red-400   to-rose-600',
    Fruits: 'from-orange-400 to-amber-600',
    Other: 'from-gray-400  to-gray-600',
};

const FALLBACK_GRADIENT = 'from-slate-400 to-slate-600';

// ── Empty / Error State ───────────────────────────────────────────────────────
const EmptyState: React.FC<{
    icon: React.ElementType;
    title: string;
    message: string;
    action?: React.ReactNode;
}> = ({ icon: Icon, title, message, action }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-gray-100 p-16 text-center shadow-sm"
    >
        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Icon className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-black text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4 max-w-xs mx-auto">{message}</p>
        {action}
    </motion.div>
);

// ── Product Detail Modal ──────────────────────────────────────────────────────
const ProductDetailModal: React.FC<{
    productId: string;
    onClose: () => void;
    onAddToCart: (p: ProductEntity) => void;
    onOrder: (p: ProductEntity) => void;
    ordering: boolean;
}> = ({ productId, onClose, onAddToCart, onOrder, ordering }) => {
    const [product, setProduct] = useState<ProductEntity | null>(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // Try /products/{id} first, falls back to /products/discovery/{id}
                const data = await productsService.getProductById(productId);
                setProduct(data);
            } catch {
                // Last resort: find it from discovery list
                try {
                    const data = await productsService.getDiscoveryProductById(productId);
                    setProduct(data);
                } catch (err: any) {
                    toast.error('Could not load product details');
                    onClose();
                }
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [productId, onClose]);

    const gradient = product
        ? (CATEGORY_GRADIENTS[product.category] || FALLBACK_GRADIENT)
        : FALLBACK_GRADIENT;
    const isAvailable = product?.isActive !== false && (product?.quantityKg ?? 0) > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Sheet / Modal */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="relative bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto z-10"
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-20 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 shadow border border-gray-100"
                >
                    <X className="w-4 h-4" />
                </button>

                {loading ? (
                    /* Skeleton */
                    <div className="animate-pulse">
                        <div className="h-64 bg-gray-100 rounded-t-[2.5rem]" />
                        <div className="p-8 space-y-4">
                            <div className="h-6 bg-gray-100 rounded-xl w-3/4" />
                            <div className="h-4 bg-gray-100 rounded-xl w-1/2" />
                            <div className="h-20 bg-gray-100 rounded-2xl" />
                            <div className="h-12 bg-gray-100 rounded-2xl" />
                        </div>
                    </div>
                ) : product ? (
                    <>
                        {/* Hero Image */}
                        <div className="relative h-64 overflow-hidden rounded-t-[2.5rem]">
                            {product.imageUrl || product.image ? (
                                <img
                                    src={product.imageUrl ?? product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                                    {React.createElement(CATEGORY_ICONS[product.category] || Package, {
                                        className: 'w-24 h-24 text-white/50',
                                    })}
                                </div>
                            )}
                            {/* Category badge */}
                            <div className="absolute bottom-4 left-4">
                                <span className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full text-white bg-gradient-to-r ${gradient} shadow-lg`}>
                                    {product.category || 'General'}
                                </span>
                            </div>
                            {!isAvailable && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white text-sm font-black bg-black/60 px-5 py-2 rounded-full">
                                        Out of Stock
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="p-6 sm:p-8 space-y-6">
                            {/* Title + Price */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 leading-tight">{product.name}</h2>
                                    {product.description && (
                                        <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{product.description}</p>
                                    )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-2xl font-black text-[#1a4d2e]">
                                        {((product.sellingPricePerUnit ?? product.price ?? 0)).toLocaleString()}
                                    </p>
                                    <p className="text-xs font-bold text-gray-400">Rwf / {product.unit || 'kg'}</p>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    {
                                        icon: Scale,
                                        label: 'Stock',
                                        value: `${(product.quantityKg ?? 0).toLocaleString()} kg`,
                                        color: 'text-emerald-600',
                                        bg: 'bg-emerald-50',
                                    },
                                    {
                                        icon: Tag,
                                        label: 'Price / Unit',
                                        value: `${(product.sellingPricePerUnit ?? 0).toLocaleString()} Rwf`,
                                        color: 'text-blue-600',
                                        bg: 'bg-blue-50',
                                    },
                                    {
                                        icon: Thermometer,
                                        label: 'Storage Temp',
                                        value: 'Cold Storage',
                                        color: 'text-purple-600',
                                        bg: 'bg-purple-50',
                                    },
                                    {
                                        icon: BarChart3,
                                        label: 'Unit',
                                        value: product.unit || 'kg',
                                        color: 'text-orange-600',
                                        bg: 'bg-orange-50',
                                    },
                                ].map(({ icon: Icon, label, value, color, bg }) => (
                                    <div key={label} className={`${bg} rounded-2xl p-3 text-center`}>
                                        <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                                        <p className={`text-sm font-black mt-0.5 ${color}`}>{value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Availability indicator */}
                            <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl ${isAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
                                <CheckCircle className={`w-4 h-4 ${isAvailable ? 'text-green-600' : 'text-red-500'}`} />
                                <span className={`text-sm font-bold ${isAvailable ? 'text-green-700' : 'text-red-600'}`}>
                                    {isAvailable
                                        ? `In stock — ${(product.quantityKg ?? 0).toLocaleString()} kg available`
                                        : 'Currently out of stock'}
                                </span>
                            </div>

                            {/* Qty Stepper + Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-50">
                                {/* Stepper */}
                                <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-1.5 border border-gray-100 self-start">
                                    <button
                                        onClick={() => setQty(q => Math.max(1, q - 1))}
                                        disabled={qty <= 1}
                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 disabled:opacity-30 transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="text-base font-black text-gray-900 w-8 text-center">{qty}</span>
                                    <button
                                        onClick={() => setQty(q => q + 1)}
                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                    <span className="text-xs text-gray-400 font-bold pr-2">{product.unit || 'kg'}</span>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-2 flex-1">
                                    <button
                                        onClick={() => { onAddToCart(product); onClose(); }}
                                        disabled={!isAvailable}
                                        className="flex-1 flex items-center justify-center gap-2 border-2 border-[#1a4d2e] text-[#1a4d2e] font-black py-3 rounded-2xl hover:bg-[#1a4d2e] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                                    >
                                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                                    </button>
                                    <button
                                        onClick={() => { onOrder(product); onClose(); }}
                                        disabled={!isAvailable || ordering}
                                        className="flex-1 bg-[#1a4d2e] text-white font-black py-3 rounded-2xl hover:bg-[#38a169] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                    >
                                        {ordering
                                            ? <RefreshCw className="w-4 h-4 animate-spin" />
                                            : <><Sparkles className="w-4 h-4" /> Order Now</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </motion.div>
        </div>
    );
};

// ── Product Card ──────────────────────────────────────────────────────────────
const ProductCard: React.FC<{
    product: ProductEntity;
    qty: number;
    onQtyChange: (id: string, delta: number) => void;
    onAddToCart: (p: ProductEntity) => void;
    onQuickOrder: (p: ProductEntity) => void;
    onViewDetail: (id: string) => void;
    ordering: boolean;
}> = ({ product, qty, onQtyChange, onAddToCart, onQuickOrder, onViewDetail, ordering }) => {
    const gradient = CATEGORY_GRADIENTS[product.category] || FALLBACK_GRADIENT;
    const CatIcon = CATEGORY_ICONS[product.category] || Package;
    const isAvailable = product.isActive !== false && (product.quantityKg ?? 0) > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col"
        >
            {/* Image / Placeholder */}
            <div className="relative h-44 overflow-hidden flex-shrink-0">
                {product.imageUrl || product.image ? (
                    <img
                        src={product.imageUrl ?? product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                        <CatIcon className="w-16 h-16 text-white/60" />
                    </div>
                )}

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${gradient} shadow`}>
                        {product.category || 'General'}
                    </span>
                </div>

                {/* View detail button (appears on hover) */}
                <button
                    onClick={() => onViewDetail(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-white transition-all shadow"
                >
                    <Eye className="w-3.5 h-3.5" />
                </button>

                {/* Out of stock overlay */}
                {!isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="text-white text-xs font-black bg-black/60 px-4 py-1.5 rounded-full">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex-1">
                    <h3 className="font-black text-gray-900 text-sm leading-tight line-clamp-1">{product.name}</h3>
                    {product.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{product.description}</p>
                    )}
                </div>

                {/* Price + Qty Stepper */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-lg font-black text-[#1a4d2e] leading-none">
                            {((product.sellingPricePerUnit ?? product.price ?? 0)).toLocaleString()}
                            <span className="text-[10px] font-bold text-gray-400 ml-1">Rwf/{product.unit || 'kg'}</span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                            {(product.quantityKg ?? 0).toLocaleString()} kg available
                        </p>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-0.5 border border-gray-100">
                        <button
                            onClick={() => onQtyChange(product.id, -1)}
                            disabled={qty <= 1}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 disabled:opacity-30 transition-colors"
                        >
                            <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-gray-900 w-5 text-center">{qty}</span>
                        <button
                            onClick={() => onQtyChange(product.id, +1)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Action row */}
                <div className="flex gap-2 pt-1">
                    <button
                        onClick={() => onAddToCart(product)}
                        disabled={!isAvailable}
                        className="flex-1 flex items-center justify-center gap-1.5 border-2 border-[#1a4d2e] text-[#1a4d2e] text-xs font-black py-2.5 rounded-xl hover:bg-[#1a4d2e] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart className="w-3.5 h-3.5" /> Cart
                    </button>
                    <button
                        onClick={() => onQuickOrder(product)}
                        disabled={!isAvailable || ordering}
                        className="flex-1 bg-[#1a4d2e] text-white text-xs font-black py-2.5 rounded-xl hover:bg-[#38a169] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                    >
                        {ordering
                            ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            : <><Sparkles className="w-3 h-3" /> Order</>
                        }
                    </button>
                    <button
                        onClick={() => onViewDetail(product.id)}
                        className="w-9 border-2 border-gray-200 text-gray-400 rounded-xl hover:border-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors"
                        title="View Details"
                    >
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const MarketplaceSection: React.FC = () => {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(state => state.cart.items);

    const [allProducts, setAllProducts] = useState<ProductEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<{ status: number; message: string } | null>(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [qty, setQty] = useState<Record<string, number>>({});
    const [orderingId, setOrderingId] = useState<string | null>(null);
    const [detailId, setDetailId] = useState<string | null>(null);
    const [sourceLabel, setSourceLabel] = useState('');

    // ── Fetch: try discovery → fallback to public ─────────────────────────────
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            // 1. Try the authenticated discovery endpoint first (site-specific)
            const data = await productsService.getDiscoveryProducts();
            setAllProducts(data);
            setSourceLabel('site');
        } catch (discoveryErr: any) {
            const status = getApiErrorStatus(discoveryErr);
            if (status === 403 || status === 401 || status === 0) {
                // 2. Fall back to the public endpoint
                try {
                    const pub = await productsService.getPublicProducts();
                    setAllProducts(pub);
                    setSourceLabel('public');
                } catch (pubErr: any) {
                    const s = getApiErrorStatus(pubErr);
                    const m = handleApiError(pubErr);
                    setFetchError({ status: s, message: m });
                    toast.error(`Could not load products: ${m}`);
                }
            } else {
                const m = handleApiError(discoveryErr);
                setFetchError({ status, message: m });
                toast.error(`Could not load products: ${m}`);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    // ── Client-side filtering ─────────────────────────────────────────────────
    const filtered = allProducts.filter(p => {
        const matchCat = category === 'All' || p.category?.toLowerCase() === category.toLowerCase();
        const matchSearch = !search || [p.name, p.description, p.category].some(
            s => s?.toLowerCase().includes(search.toLowerCase())
        );
        return matchCat && matchSearch;
    });

    // Dynamic category list from actual data
    const dynamicCategories = [
        'All',
        ...Array.from(new Set(allProducts.map(p => p.category).filter(Boolean) as string[])).sort(),
    ];

    const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleQtyChange = (id: string, delta: number) =>
        setQty(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));

    const handleAddToCart = (product: ProductEntity) => {
        const numericId = Math.abs(
            product.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
        );
        dispatch(addToCart({
            id: numericId,
            name: product.name,
            price: product.sellingPricePerUnit ?? product.price ?? 0,
            image: product.imageUrl ?? product.image ?? '',
            unit: product.unit || 'kg',
        }));
        toast.success(`${product.name} added to cart ✓`);
    };

    const handleQuickOrder = async (product: ProductEntity) => {
        setOrderingId(product.id);
        try {
            await ordersService.createOrder({
                deliveryAddress: 'Delivery to my registered address',
                items: [{ productId: product.id, quantityKg: qty[product.id] || 1 }],
            });
            toast.success(`Order placed for ${product.name}!`);
        } catch (err: any) {
            toast.error(handleApiError(err));
        } finally {
            setOrderingId(null);
        }
    };

    // ── Body renderer ─────────────────────────────────────────────────────────
    const renderBody = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-[2rem] h-80 animate-pulse border border-gray-100" />
                    ))}
                </div>
            );
        }

        if (fetchError?.status === 403 || fetchError?.status === 401) {
            return (
                <EmptyState
                    icon={LockKeyhole}
                    title="Access Restricted"
                    message="Could not load the marketplace. Please log in again or contact support."
                    action={
                        <button onClick={fetchProducts} className="text-[#38a169] font-bold text-sm hover:underline flex items-center gap-1 mx-auto">
                            <RefreshCw className="w-4 h-4" /> Retry
                        </button>
                    }
                />
            );
        }

        if (fetchError) {
            return (
                <EmptyState
                    icon={AlertCircle}
                    title="Failed to load products"
                    message={fetchError.message}
                    action={
                        <button onClick={fetchProducts} className="text-[#38a169] font-bold text-sm hover:underline flex items-center gap-1 mx-auto">
                            <RefreshCw className="w-4 h-4" /> Try Again
                        </button>
                    }
                />
            );
        }

        if (filtered.length === 0) {
            return (
                <EmptyState
                    icon={Package}
                    title={search ? 'No matching products' : 'No products available'}
                    message={
                        search
                            ? `No products match "${search}". Try a different term.`
                            : 'No products are available in this category right now.'
                    }
                    action={
                        search ? (
                            <button onClick={() => setSearch('')} className="text-[#38a169] font-bold text-sm hover:underline">
                                Clear Search
                            </button>
                        ) : undefined
                    }
                />
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                    >
                        <ProductCard
                            product={product}
                            qty={qty[product.id] || 1}
                            onQtyChange={handleQtyChange}
                            onAddToCart={handleAddToCart}
                            onQuickOrder={handleQuickOrder}
                            onViewDetail={setDetailId}
                            ordering={orderingId === product.id}
                        />
                    </motion.div>
                ))}
            </div>
        );
    };

    return (
        <>
            {/* Product detail modal */}
            <AnimatePresence>
                {detailId && (
                    <ProductDetailModal
                        productId={detailId}
                        onClose={() => setDetailId(null)}
                        onAddToCart={handleAddToCart}
                        onOrder={handleQuickOrder}
                        ordering={orderingId === detailId}
                    />
                )}
            </AnimatePresence>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Marketplace</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-sm text-gray-500">
                                {isLoading ? 'Loading…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} available`}
                            </p>
                            {sourceLabel && !isLoading && (
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${sourceLabel === 'site' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-500'
                                    }`}>
                                    {sourceLabel === 'site' ? '📍 Site-specific' : '🌐 Public catalog'}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchProducts}
                            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                        {cartCount > 0 && (
                            <div className="flex items-center gap-2 bg-[#1a4d2e] text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-[#1a4d2e]/20">
                                <ShoppingCart className="w-4 h-4" />
                                <span>{cartCount} in cart</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search + Category */}
                <div className="flex flex-col lg:flex-row gap-3">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search fresh products…"
                            className="w-full border border-gray-200 rounded-2xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#38a169]/30 focus:border-[#38a169] bg-white"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                        {dynamicCategories.map(c => {
                            const CatIcon = CATEGORY_ICONS[c] || Package;
                            const isActive = category === c;
                            return (
                                <button
                                    key={c}
                                    onClick={() => setCategory(c)}
                                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${isActive
                                        ? 'bg-[#1a4d2e] text-white shadow-md'
                                        : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    {c !== 'All' && <CatIcon className="w-3.5 h-3.5" />}
                                    {c}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Stats bar */}
                {!isLoading && !fetchError && allProducts.length > 0 && (
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-bold flex-wrap">
                        <span>{allProducts.length} total</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="text-emerald-500">{allProducts.filter(p => p.isActive !== false && (p.quantityKg ?? 0) > 0).length} in stock</span>
                        {search && (
                            <>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span className="text-[#38a169]">{filtered.length} matching &ldquo;{search}&rdquo;</span>
                            </>
                        )}
                    </div>
                )}

                {renderBody()}
            </div>
        </>
    );
};

export default MarketplaceSection;
