import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag, RefreshCw, ChevronDown, ChevronUp,
    MapPin, Clock, CheckCircle, XCircle, FileText,
    LockKeyhole, AlertCircle, Plus, X, ChevronLeft, ChevronRight,
    StickyNote, Package2, Tags,
} from 'lucide-react';
import { ordersService } from '@/api';
import { handleApiError, getApiErrorStatus } from '@/api/client';
import type { OrderEntity, OrderStatus, CreateOrderDto } from '@/types/api.types';
import { toast } from 'sonner';

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { bg: string; text: string; bar: string; icon: React.ElementType; label: string }> = {
    REQUESTED: { bg: 'bg-yellow-50', text: 'text-yellow-700', bar: 'bg-yellow-300', icon: Clock, label: 'Requested' },
    APPROVED: { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-400', icon: CheckCircle, label: 'Approved' },
    INVOICED: { bg: 'bg-purple-50', text: 'text-purple-700', bar: 'bg-purple-400', icon: FileText, label: 'Invoiced' },
    COMPLETED: { bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-400', icon: CheckCircle, label: 'Completed' },
    REJECTED: { bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-400', icon: XCircle, label: 'Rejected' },
};

const ORDER_STATUSES: (OrderStatus | 'ALL')[] = [
    'ALL', 'REQUESTED', 'APPROVED', 'INVOICED', 'COMPLETED', 'REJECTED',
];

// ── Reusable EmptyState ───────────────────────────────────────────────────────
const EmptyState: React.FC<{
    icon: React.ElementType; title: string; message: string; action?: React.ReactNode;
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

// ── Order Detail Drawer ───────────────────────────────────────────────────────
const OrderDetailDrawer: React.FC<{
    orderId: string;
    onClose: () => void;
    onDelete: (id: string) => void;
}> = ({ orderId, onClose, onDelete }) => {
    const [order, setOrder] = useState<OrderEntity | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await ordersService.getOrderById(orderId);
                setOrder(data);
            } catch (err: any) {
                toast.error('Could not load order details');
                onClose();
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [orderId, onClose]);

    const cfg = order ? (STATUS_CFG[order.status] || STATUS_CFG.REQUESTED) : STATUS_CFG.REQUESTED;
    const Icon = cfg.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="relative bg-white h-full w-full sm:max-w-md shadow-2xl overflow-y-auto z-10 flex flex-col"
            >
                {/* Header */}
                <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex items-center gap-3 z-10">
                    <button onClick={onClose} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                    <h2 className="text-base font-black text-gray-900">Order Details</h2>
                </div>

                {loading ? (
                    <div className="p-6 space-y-4 animate-pulse">
                        {[80, 60, 100, 48, 48].map((h, i) => (
                            <div key={i} className="bg-gray-100 rounded-2xl" style={{ height: h }} />
                        ))}
                    </div>
                ) : order ? (
                    <div className="p-6 space-y-5 flex-1">
                        {/* Status badge */}
                        <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl ${cfg.bg}`}>
                            <Icon className={`w-4 h-4 ${cfg.text}`} />
                            <span className={`font-black text-sm ${cfg.text}`}>{cfg.label}</span>
                        </div>

                        {/* ID + Dates */}
                        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 font-bold">Order ID</span>
                                <span className="font-black text-gray-700 font-mono text-xs bg-white px-2 py-1 rounded-lg border border-gray-200">
                                    #{order.id.slice(0, 16)}…
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 font-bold">Placed</span>
                                <span className="font-bold text-gray-700">{new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 font-bold">Updated</span>
                                <span className="font-bold text-gray-700">{new Date(order.updatedAt).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Delivery */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-wider">
                                <MapPin className="w-3.5 h-3.5" /> Delivery Address
                            </div>
                            <p className="text-gray-800 font-medium text-sm leading-relaxed bg-gray-50 rounded-2xl px-4 py-3">
                                {order.deliveryAddress}
                            </p>
                        </div>

                        {/* Notes */}
                        {order.notes && (
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-xs font-black text-gray-400 uppercase tracking-wider">
                                    <StickyNote className="w-3.5 h-3.5" /> Notes
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed bg-amber-50 rounded-2xl px-4 py-3 border border-amber-100">
                                    {order.notes}
                                </p>
                            </div>
                        )}

                        {/* Total */}
                        <div className="bg-[#1a4d2e]/5 border border-[#1a4d2e]/10 rounded-2xl p-4 flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-600">Order Total</span>
                            <span className="text-2xl font-black text-[#1a4d2e]">
                                {(order.totalAmount ?? 0).toLocaleString()}
                                <span className="text-sm font-bold text-gray-400 ml-1">Rwf</span>
                            </span>
                        </div>

                        {/* Cancel action */}
                        {order.status === 'REQUESTED' && (
                            <button
                                onClick={() => { onDelete(order.id); onClose(); }}
                                className="w-full border-2 border-red-200 text-red-600 font-bold py-3.5 rounded-2xl hover:bg-red-50 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                                <X className="w-4 h-4" /> Cancel This Order
                            </button>
                        )}
                    </div>
                ) : null}
            </motion.div>
        </div>
    );
};

// ── New Order Modal ───────────────────────────────────────────────────────────
const NewOrderModal: React.FC<{
    onClose: () => void;
    onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [items, setItems] = useState([{ productId: '', quantityKg: 1 }]);
    const [loading, setLoading] = useState(false);

    const addItem = () => setItems(p => [...p, { productId: '', quantityKg: 1 }]);
    const removeItem = (i: number) => setItems(p => p.filter((_, idx) => idx !== i));
    const updateItem = (i: number, field: 'productId' | 'quantityKg', val: string | number) =>
        setItems(p => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!deliveryAddress.trim()) { toast.error('Delivery address is required'); return; }
        if (items.some(it => !it.productId.trim())) { toast.error('All items need a product ID'); return; }

        setLoading(true);
        try {
            const payload: CreateOrderDto = {
                deliveryAddress: deliveryAddress.trim(),
                notes: notes.trim() || undefined,
                items: items.map(it => ({ productId: it.productId.trim(), quantityKg: Number(it.quantityKg) })),
            };
            await ordersService.createOrder(payload);
            toast.success('Order placed successfully!');
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10"
            >
                {/* Header */}
                <div className="sticky top-0 bg-white rounded-t-[2rem] px-8 pt-8 pb-5 border-b border-gray-50">
                    <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-black text-gray-900">New Order</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Create a product order request</p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
                    {/* Delivery Address */}
                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                            Delivery Address *
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                            <textarea
                                value={deliveryAddress}
                                onChange={e => setDeliveryAddress(e.target.value)}
                                placeholder="e.g. 123 Main Street, Kigali"
                                required
                                rows={2}
                                className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#38a169]/30 focus:border-[#38a169] resize-none"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                            Notes <span className="text-gray-300 font-normal normal-case">(optional)</span>
                        </label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="e.g. Please deliver before 10 AM"
                            rows={2}
                            className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#38a169]/30 focus:border-[#38a169] resize-none"
                        />
                    </div>

                    {/* Items */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-wider">
                                Order Items *
                            </label>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-1 text-xs font-bold text-[#38a169] hover:underline"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Item
                            </button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="flex gap-2 items-start"
                                >
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            value={item.productId}
                                            onChange={e => updateItem(i, 'productId', e.target.value)}
                                            placeholder="Product ID (UUID)"
                                            required
                                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#38a169]/30 focus:border-[#38a169]"
                                        />
                                        <div className="flex items-center gap-2">
                                            <Package2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                            <input
                                                type="number"
                                                value={item.quantityKg}
                                                onChange={e => updateItem(i, 'quantityKg', parseFloat(e.target.value) || 1)}
                                                placeholder="Quantity (kg)"
                                                min={0.1}
                                                step={0.1}
                                                required
                                                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#38a169]/30 focus:border-[#38a169]"
                                            />
                                            <span className="text-xs text-gray-400 font-bold">kg</span>
                                        </div>
                                    </div>
                                    {items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(i)}
                                            className="mt-1 w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1a4d2e] text-white font-black py-3.5 rounded-2xl hover:bg-[#38a169] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-[#1a4d2e]/20"
                    >
                        {loading ? (
                            <><RefreshCw className="w-4 h-4 animate-spin" /> Placing Order…</>
                        ) : (
                            <><ShoppingBag className="w-4 h-4" /> Place Order</>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

// ── Order Card ────────────────────────────────────────────────────────────────
const OrderCard: React.FC<{
    order: OrderEntity;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
    deleting: boolean;
}> = ({ order, onDelete, onView, deleting }) => {
    const cfg = STATUS_CFG[order.status] || STATUS_CFG.REQUESTED;
    const Icon = cfg.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group"
            onClick={() => onView(order.id)}
        >
            <div className={`h-1.5 w-full ${cfg.bar}`} />
            <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-[#1a4d2e]/5 transition-colors">
                            <ShoppingBag className="w-4 h-4 text-[#38a169]" />
                        </div>
                        <div>
                            <p className="font-black text-gray-900 text-sm">Order</p>
                            <p className="text-[10px] text-gray-400 font-mono">#{order.id.slice(0, 10)}…</p>
                        </div>
                    </div>
                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                        <Icon className="w-3 h-3" />{cfg.label}
                    </span>
                </div>

                <div className="flex items-start gap-2 text-xs text-gray-500 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="font-medium line-clamp-2 leading-snug">{order.deliveryAddress}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</p>
                        <p className="font-black text-gray-900">
                            {(order.totalAmount ?? 0).toLocaleString()}{' '}
                            <span className="text-xs font-bold text-gray-400">Rwf</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                        {order.status === 'REQUESTED' && (
                            <button
                                onClick={() => onDelete(order.id)}
                                disabled={deleting}
                                className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline disabled:opacity-50 transition-colors"
                            >
                                {deleting ? 'Cancelling…' : 'Cancel'}
                            </button>
                        )}
                        <button
                            onClick={() => onView(order.id)}
                            className="flex items-center gap-0.5 text-[10px] font-bold text-[#38a169] hover:underline"
                        >
                            View <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const OrdersSection: React.FC = () => {
    const [orders, setOrders] = useState<OrderEntity[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<{ status: number; message: string } | null>(null);
    const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [detailId, setDetailId] = useState<string | null>(null);
    const [showNewModal, setShowNewModal] = useState(false);

    const LIMIT = 9;

    const fetchOrders = useCallback(async (newPage = 1, status: OrderStatus | 'ALL' = filter) => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const result = await ordersService.getAllOrders({
                // Only pass status if not ALL — Swagger shows status filter by value
                status: status !== 'ALL' ? status as OrderStatus : undefined,
                page: newPage,
                limit: LIMIT,
            });
            setOrders(result.orders);
            setTotal(result.total);
            setPage(newPage);
        } catch (err: any) {
            const s = getApiErrorStatus(err);
            const m = handleApiError(err);
            setFetchError({ status: s, message: m });
            setOrders([]);
            if (s !== 403 && s !== 401) {
                toast.error(`Failed to load orders: ${m}`);
            }
        } finally {
            setIsLoading(false);
        }
    }, [filter]);

    // Re-fetch when filter changes (reset to page 1)
    useEffect(() => { fetchOrders(1, filter); }, [filter]); // eslint-disable-line

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await ordersService.deleteOrder(id);
            toast.success('Order cancelled');
            fetchOrders(page, filter);
        } catch (err: any) {
            toast.error(handleApiError(err));
        } finally {
            setDeletingId(null);
        }
    };

    const totalPages = Math.ceil(total / LIMIT);

    // Status summary counts (from current page; real totals need separate calls)
    const statusCounts = {
        active: orders.filter(o => ['APPROVED', 'REQUESTED'].includes(o.status)).length,
        completed: orders.filter(o => o.status === 'COMPLETED').length,
    };

    const renderBody = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-[2rem] h-52 animate-pulse border border-gray-100" />
                    ))}
                </div>
            );
        }

        if (fetchError?.status === 403 || fetchError?.status === 401) {
            return (
                <EmptyState
                    icon={LockKeyhole}
                    title="Access Restricted"
                    message="Your account cannot view orders. Place an order from the Marketplace to get started."
                />
            );
        }

        if (fetchError) {
            return (
                <EmptyState
                    icon={AlertCircle}
                    title="Something went wrong"
                    message={fetchError.message}
                    action={
                        <button onClick={() => fetchOrders(1)} className="text-[#38a169] font-bold text-sm hover:underline flex items-center gap-1 mx-auto">
                            <RefreshCw className="w-4 h-4" /> Try Again
                        </button>
                    }
                />
            );
        }

        if (orders.length === 0) {
            return (
                <EmptyState
                    icon={ShoppingBag}
                    title="No orders found"
                    message={filter !== 'ALL' ? `No ${filter.toLowerCase()} orders.` : 'You haven\'t placed any orders yet.'}
                    action={
                        filter === 'ALL' ? (
                            <button
                                onClick={() => setShowNewModal(true)}
                                className="bg-[#1a4d2e] text-white font-bold px-6 py-3 rounded-2xl hover:bg-[#38a169] transition-colors text-sm"
                            >
                                Place Your First Order
                            </button>
                        ) : undefined
                    }
                />
            );
        }

        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders.map(order => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onDelete={handleDelete}
                            onView={setDetailId}
                            deleting={deletingId === order.id}
                        />
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 pt-4">
                        <button
                            onClick={() => fetchOrders(page - 1, filter)}
                            disabled={page <= 1 || isLoading}
                            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold text-gray-600">
                            Page {page} of {totalPages}
                            <span className="text-gray-400 font-normal ml-2">({total} total)</span>
                        </span>
                        <button
                            onClick={() => fetchOrders(page + 1, filter)}
                            disabled={page >= totalPages || isLoading}
                            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </>
        );
    };

    return (
        <>
            {/* Modals */}
            <AnimatePresence>
                {detailId && (
                    <OrderDetailDrawer
                        key="detail"
                        orderId={detailId}
                        onClose={() => setDetailId(null)}
                        onDelete={handleDelete}
                    />
                )}
                {showNewModal && (
                    <NewOrderModal
                        key="new"
                        onClose={() => setShowNewModal(false)}
                        onSuccess={() => fetchOrders(1, filter)}
                    />
                )}
            </AnimatePresence>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">My Orders</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {total} order{total !== 1 ? 's' : ''} total
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fetchOrders(page, filter)}
                            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => setShowNewModal(true)}
                            className="flex items-center gap-2 bg-[#1a4d2e] text-white font-bold px-5 py-2.5 rounded-2xl hover:bg-[#38a169] transition-colors text-sm shadow-lg shadow-[#1a4d2e]/20"
                        >
                            <Plus className="w-4 h-4" /> New Order
                        </button>
                    </div>
                </div>

                {/* Mini stats */}
                {!fetchError && !isLoading && (
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'This Page', value: orders.length, color: 'text-gray-900' },
                            { label: 'Active', value: statusCounts.active, color: 'text-blue-600' },
                            { label: 'Completed', value: statusCounts.completed, color: 'text-green-600' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
                                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Status filter tabs — server-side */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {ORDER_STATUSES.map(s => (
                        <button
                            key={s}
                            onClick={() => { setFilter(s); }}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === s ? 'bg-[#1a4d2e] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {renderBody()}
            </div>
        </>
    );
};

export default OrdersSection;
