import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box, Calendar, Tag, X, Plus, RefreshCw, ChevronRight,
    Truck, Thermometer, Clock, CheckCircle, AlertCircle, Ban, LockKeyhole,
    Snowflake,
} from 'lucide-react';
import { rentalsService } from '@/api';
import { handleApiError, getApiErrorStatus } from '@/api/client';
import { RentalStatus, AssetType } from '@/types/api.types';
import type { RentalEntity } from '@/types/api.types';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/hooks';
import ColdRoomsSection from './ColdRoomsSection';
import TricyclesSection from './TricyclesSection';

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    REQUESTED: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: Clock },
    APPROVED: { bg: 'bg-blue-50', text: 'text-blue-700', icon: CheckCircle },
    ACTIVE: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
    COMPLETED: { bg: 'bg-gray-100', text: 'text-gray-600', icon: CheckCircle },
    CANCELLED: { bg: 'bg-red-50', text: 'text-red-600', icon: Ban },
};

const ASSET_ICONS: Record<string, React.ElementType> = {
    COLD_BOX: Box,
    COLD_PLATE: Thermometer,
    TRICYCLE: Truck,
    COLD_ROOM: Thermometer,
};

const ASSET_COLORS: Record<string, string> = {
    COLD_BOX: 'from-emerald-500 to-teal-600',
    COLD_PLATE: 'from-blue-500 to-cyan-600',
    TRICYCLE: 'from-orange-500 to-amber-600',
    COLD_ROOM: 'from-purple-500 to-indigo-600',
};

// ── New Rental Modal ──────────────────────────────────────────────────────────
const NewRentalModal: React.FC<{
    onClose: () => void;
    onSuccess: () => void;
    initialAsset?: {
        type: AssetType;
        id: string;
        siteId?: string;
        fee?: number;
    }
}> = ({ onClose, onSuccess, initialAsset }) => {
    const { user } = useAppSelector((state) => state.auth);
    const [form, setForm] = useState({
        assetType: initialAsset?.type || AssetType.COLD_BOX,
        rentalStartDate: '',
        rentalEndDate: '',
        estimatedFee: initialAsset?.fee?.toString() || '',
        capacityNeededKg: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.rentalStartDate || !form.rentalEndDate || !form.estimatedFee) {
            toast.error('Please fill all required fields');
            return;
        }
        if (new Date(form.rentalEndDate) <= new Date(form.rentalStartDate)) {
            toast.error('End date must be after start date');
            return;
        }

        // The API requires a specific asset UUID — it cannot look up a COLD_BOX without its ID.
        const assetId = initialAsset?.id;
        if (!assetId) {
            toast.error('Please select a specific asset first. Browse the Cold Rooms or Tricycles tab and click "Rent Now" on the asset you want.', { duration: 5000 });
            return;
        }

        setLoading(true);
        try {
            // Append 'Z' directly to treat the date as UTC, avoiding local timezone shifts
            const startISO = `${form.rentalStartDate}T00:00:00.000Z`;
            const endISO = `${form.rentalEndDate}T23:59:59.000Z`;

            const payload: Record<string, any> = {
                assetType: form.assetType,
                rentalStartDate: startISO,
                rentalEndDate: endISO,
                estimatedFee: parseFloat(form.estimatedFee),
                clientId: user?.id,
            };

            // Map asset ID to the correct field based on type
            if (form.assetType === AssetType.COLD_BOX) payload.coldBoxId = assetId;
            if (form.assetType === AssetType.COLD_PLATE) payload.coldPlateId = assetId;
            if (form.assetType === AssetType.TRICYCLE) payload.tricycleId = assetId;
            if (form.assetType === AssetType.COLD_ROOM) payload.coldRoomId = assetId;

            if (form.capacityNeededKg) payload.capacityNeededKg = parseFloat(form.capacityNeededKg);
            if (initialAsset?.siteId) payload.siteId = initialAsset.siteId;

            console.debug('[RentalSubmit] payload:', JSON.stringify(payload, null, 2));

            await rentalsService.createRental(payload as any);
            toast.success('Rental request submitted! Check My Rentals to track its status.');
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
                className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 z-10"
            >
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-black text-gray-900 mb-1">Request a Rental</h2>
                <p className="text-sm text-gray-400 mb-6">Fill in the details to book a cold asset</p>

                {/* Asset banner when pre-selected, or guide when browsing needed */}
                {initialAsset?.id ? (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                        <div className="w-8 h-8 bg-[#1a4d2e] rounded-xl flex items-center justify-center flex-shrink-0">
                            {(() => { const I = ASSET_ICONS[form.assetType] || Box; return <I className="w-4 h-4 text-white" />; })()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#1a4d2e] uppercase tracking-wider">{form.assetType.replaceAll('_', ' ')}</p>
                            <p className="text-[10px] text-gray-500 font-mono truncate">#{initialAsset.id.slice(0, 16)}</p>
                        </div>
                        <span className="text-[10px] font-bold text-[#38a169] bg-white border border-green-200 px-2 py-1 rounded-full">Pre-Selected</span>
                    </div>
                ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-4 flex gap-3 items-start">
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-amber-800">No asset selected</p>
                            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                                Browse the <span className="font-bold">Cold Rooms</span> or <span className="font-bold">Tricycles</span> tab and click <span className="font-bold">"Rent Now"</span> on the asset you'd like to book.
                            </p>
                        </div>
                    </div>
                )}


                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Start Date *</label>
                            <input
                                type="date"
                                value={form.rentalStartDate}
                                onChange={e => setForm(f => ({ ...f, rentalStartDate: e.target.value }))}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38a169]/30 focus:border-[#38a169]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">End Date *</label>
                            <input
                                type="date"
                                value={form.rentalEndDate}
                                onChange={e => setForm(f => ({ ...f, rentalEndDate: e.target.value }))}
                                required
                                min={form.rentalStartDate || new Date().toISOString().split('T')[0]}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38a169]/30 focus:border-[#38a169]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated Fee (Rwf) *</label>
                            <input
                                type="number"
                                value={form.estimatedFee}
                                onChange={e => setForm(f => ({ ...f, estimatedFee: e.target.value }))}
                                placeholder="e.g. 50000"
                                required
                                min={0}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38a169]/30 focus:border-[#38a169]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Capacity Needed (kg)</label>
                            <input
                                type="number"
                                value={form.capacityNeededKg}
                                onChange={e => setForm(f => ({ ...f, capacityNeededKg: e.target.value }))}
                                placeholder="Optional"
                                min={0}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38a169]/30 focus:border-[#38a169]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1a4d2e] text-white font-black py-3 rounded-2xl hover:bg-[#38a169] transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                    >
                        {loading ? (
                            <><RefreshCw className="w-4 h-4 animate-spin" /> Submitting…</>
                        ) : (
                            <><Plus className="w-4 h-4" /> Submit Request</>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

// ── Empty / Error States ──────────────────────────────────────────────────────
const EmptyState: React.FC<{
    icon: React.ElementType;
    title: string;
    message: string;
    action?: React.ReactNode;
}> = ({ icon: Icon, title, message, action }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-gray-100 p-16 text-center shadow-sm"
    >
        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Icon className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-black text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        {action}
    </motion.div>
);

// ── Shared Props for Tabs ─────────────────────────────────────────────────────
interface TabProps {
    onRentAsset: (asset: { type: AssetType; id: string; siteId?: string; fee?: number }) => void;
}

// ── Rentals Content (existing logic) ──────────────────────────────────────────
const RentalsContent: React.FC<TabProps> = ({ onRentAsset }) => {
    const { user } = useAppSelector((state) => state.auth);
    const [rentals, setRentals] = useState<RentalEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<{ status: number; message: string } | null>(null);
    const [statusFilter, setStatusFilter] = useState<RentalStatus | 'ALL'>('ALL');
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const fetchRentals = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const data = await rentalsService.getRentals({ clientId: user?.id });
            setRentals(Array.isArray(data) ? data : []);
        } catch (err: any) {
            const status = getApiErrorStatus(err);
            const message = handleApiError(err);
            setFetchError({ status, message });
            setRentals([]);
            if (status !== 403 && status !== 401) {
                toast.error(`Failed to load rentals: ${message}`);
            }
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    useEffect(() => { fetchRentals(); }, [fetchRentals]);

    const handleCancel = async (id: string) => {
        setCancellingId(id);
        try {
            await rentalsService.cancelRental(id);
            toast.success('Rental cancelled');
            fetchRentals();
        } catch (err: any) {
            toast.error(handleApiError(err));
        } finally {
            setCancellingId(null);
        }
    };

    const filtered = statusFilter === 'ALL' ? rentals : rentals.filter(r => r.status === statusFilter);
    const statuses: (RentalStatus | 'ALL')[] = ['ALL', RentalStatus.REQUESTED, RentalStatus.APPROVED, RentalStatus.ACTIVE, RentalStatus.COMPLETED, RentalStatus.CANCELLED];

    const renderBody = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-[2rem] h-56 animate-pulse border border-gray-100" />
                    ))}
                </div>
            );
        }

        if (fetchError?.status === 403 || fetchError?.status === 401) {
            return (
                <EmptyState
                    icon={LockKeyhole}
                    title="Access Restricted"
                    message="Your account doesn't have permission to view rentals list. You can still request a new rental below."
                    action={
                        <button
                            onClick={() => onRentAsset({ type: AssetType.COLD_BOX, id: '' })}
                            className="bg-[#1a4d2e] text-white font-bold px-6 py-3 rounded-2xl hover:bg-[#38a169] transition-colors text-sm"
                        >
                            Request a Rental
                        </button>
                    }
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
                        <button onClick={fetchRentals} className="text-[#38a169] font-bold text-sm hover:underline flex items-center gap-1 mx-auto">
                            <RefreshCw className="w-4 h-4" /> Try Again
                        </button>
                    }
                />
            );
        }

        if (filtered.length === 0) {
            return (
                <EmptyState
                    icon={Box}
                    title="No rentals found"
                    message={statusFilter === 'ALL' ? "You haven't made any rental requests yet." : `No ${statusFilter.toLowerCase()} rentals.`}
                    action={
                        statusFilter === 'ALL' ? (
                            <button
                                onClick={() => onRentAsset({ type: AssetType.COLD_BOX, id: '' })}
                                className="bg-[#1a4d2e] text-white font-bold px-6 py-3 rounded-2xl hover:bg-[#38a169] transition-colors text-sm"
                            >
                                Request Your First Rental
                            </button>
                        ) : undefined
                    }
                />
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((rental, idx) => {
                    const style = STATUS_STYLES[rental.status] || STATUS_STYLES.REQUESTED;
                    const StatusIcon = style.icon;
                    const AssetIcon = ASSET_ICONS[rental.assetType] || Box;
                    const gradient = ASSET_COLORS[rental.assetType] || 'from-gray-400 to-gray-600';
                    const canCancel = rental.status === 'REQUESTED' || rental.status === 'APPROVED';

                    return (
                        <motion.div
                            key={rental.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-200 transition-all group"
                        >
                            <div className={`h-2 bg-gradient-to-r ${gradient}`} />
                            <div className="p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
                                        <AssetIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${style.bg} ${style.text}`}>
                                        <StatusIcon className="w-3 h-3" />
                                        {rental.status}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="font-black text-gray-900 text-sm">
                                        {rental.assetName || rental.assetType?.replace('_', ' ')}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5 font-mono truncate">#{rental.id.slice(0, 14)}</p>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="font-medium">
                                        {new Date(rental.rentalStartDate).toLocaleDateString()} → {new Date(rental.rentalEndDate).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                                    <div className="flex items-center gap-1.5 text-xs">
                                        <Tag className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="font-black text-gray-900">{(rental.estimatedFee ?? 0).toLocaleString()} Rwf</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {canCancel && (
                                            <button
                                                onClick={() => handleCancel(rental.id)}
                                                disabled={cancellingId === rental.id}
                                                className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline disabled:opacity-50"
                                            >
                                                {cancellingId === rental.id ? 'Cancelling…' : 'Cancel'}
                                            </button>
                                        )}
                                        <button className="flex items-center gap-0.5 text-[10px] font-bold text-[#38a169] hover:underline">
                                            Details <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <div className="space-y-6">
                {/* Rentals Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-gray-500">{rentals.length} rental{rentals.length !== 1 ? 's' : ''} total</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchRentals}
                            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => onRentAsset({ type: AssetType.COLD_BOX, id: '' })}
                            className="flex items-center gap-2 bg-[#1a4d2e] text-white font-bold px-5 py-2.5 rounded-2xl hover:bg-[#38a169] transition-colors text-sm shadow-lg shadow-[#1a4d2e]/20"
                        >
                            <Plus className="w-4 h-4" /> Request Rental
                        </button>
                    </div>
                </div>

                {/* Status filter tabs */}
                {!fetchError && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {statuses.map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${statusFilter === s ? 'bg-[#1a4d2e] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                {renderBody()}
            </div>
        </>
    );
};

// ── Root wrapper with tab switcher ────────────────────────────────────────────
type RentalsTab = 'rentals' | 'cold-rooms' | 'tricycles';

const TAB_CONFIG: { key: RentalsTab; label: string; icon: React.ElementType }[] = [
    { key: 'rentals', label: 'My Rentals', icon: Box },
    { key: 'cold-rooms', label: 'Cold Rooms', icon: Snowflake },
    { key: 'tricycles', label: 'Tricycles', icon: Truck },
];

const RentalsSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<RentalsTab>('rentals');
    const [showModal, setShowModal] = useState(false);
    const [initialAsset, setInitialAsset] = useState<any>(null);

    const handleRentAsset = (asset: any) => {
        setInitialAsset(asset);
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {showModal && (
                    <NewRentalModal
                        onClose={() => {
                            setShowModal(false);
                            setInitialAsset(null);
                        }}
                        onSuccess={() => {
                            // If we were on tricycles/cold-rooms, maybe switch to rentals tab?
                            setActiveTab('rentals');
                        }}
                        initialAsset={initialAsset}
                    />
                )}
            </AnimatePresence>
            {/* Section Title + Tab Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-black text-gray-900">Rentals & Storage</h2>

                {/* Segmented Control */}
                <div className="flex items-center bg-gray-100 rounded-2xl p-1 self-start sm:self-auto">
                    {TAB_CONFIG.map(({ key, label, icon: TabIcon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === key
                                ? 'bg-white text-gray-900 shadow-md'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <TabIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === 'rentals' ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: activeTab === 'rentals' ? 10 : -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'rentals' && <RentalsContent onRentAsset={handleRentAsset} />}
                    {activeTab === 'cold-rooms' && <ColdRoomsSection onRentAsset={handleRentAsset} />}
                    {activeTab === 'tricycles' && <TricyclesSection onRentAsset={handleRentAsset} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default RentalsSection;

