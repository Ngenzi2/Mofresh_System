import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Truck, RefreshCw, MapPin, AlertCircle,
    Search, X, Gauge, CheckCircle, XCircle,
} from 'lucide-react';
import { logisticsService } from '@/api';
import { handleApiError, getApiErrorStatus } from '@/api/client';
import type { TricycleEntity } from '@/types/api.types';
import { toast } from 'sonner';
import { AssetType } from '@/types/api.types';

interface TricycleCardProps {
    tricycle: TricycleEntity;
    idx: number;
    onRentAsset: (asset: { type: AssetType; id: string; siteId?: string; fee?: number }) => void;
}

// ── Status visuals ────────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    AVAILABLE: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-400', label: 'Available' },
    RENTED: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400', label: 'Rented' },
    MAINTENANCE: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', label: 'Maintenance' },
    RETIRED: { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400', label: 'Retired' },
};

// ── Empty State ───────────────────────────────────────────────────────────────
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

// ── Tricycle Card ─────────────────────────────────────────────────────────────
const TricycleCard: React.FC<TricycleCardProps> = ({ tricycle, idx, onRentAsset }) => {
    const cfg = STATUS_CFG[tricycle.status] || STATUS_CFG.AVAILABLE;
    const isAvailable = tricycle.status === 'AVAILABLE';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
        >
            {/* Image or Gradient */}
            <div className="relative h-40 overflow-hidden flex-shrink-0">
                {tricycle.imageUrl ? (
                    <img
                        src={tricycle.imageUrl}
                        alt={tricycle.plateNumber}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#38a169] to-[#1a4d2e] flex items-center justify-center">
                        <Truck className="w-16 h-16 text-white/50" />
                    </div>
                )}

                {/* Status badge */}
                <div className="absolute top-3 left-3">
                    <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                    </span>
                </div>

                {/* Category badge */}
                {tricycle.category && (
                    <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-bold bg-black/40 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                            {tricycle.category}
                        </span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <h3 className="font-black text-gray-900 text-sm leading-tight">
                            {tricycle.plateNumber}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                            #{tricycle.id.slice(0, 12)}
                        </p>
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#38a169] to-[#1a4d2e] rounded-xl flex items-center justify-center shadow-md shadow-[#38a169]/20">
                        <Truck className="w-5 h-5 text-white" />
                    </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                        <Gauge className="w-3.5 h-3.5 text-[#38a169] mx-auto mb-0.5" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Capacity</p>
                        <p className="text-xs font-black text-gray-800 mt-0.5">{tricycle.capacity || '—'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                        <MapPin className="w-3.5 h-3.5 text-blue-500 mx-auto mb-0.5" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Site</p>
                        <p className="text-xs font-black text-gray-800 mt-0.5 truncate">
                            {tricycle.siteId ? tricycle.siteId.slice(0, 8) + '…' : '—'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${isAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
                        }`}>
                        {isAvailable ? (
                            <><CheckCircle className="w-3.5 h-3.5" /> Ready</>
                        ) : (
                            <><XCircle className="w-3.5 h-3.5" /> {cfg.label}</>
                        )}
                    </div>
                    {isAvailable && (
                        <button
                            onClick={() => onRentAsset({
                                type: AssetType.TRICYCLE,
                                id: tricycle.id,
                                siteId: tricycle.siteId,
                                fee: 0 // Placeholder
                            })}
                            className="bg-[#1a4d2e] text-white text-[10px] font-bold px-4 py-2 rounded-lg hover:bg-[#38a169] transition-colors shadow-sm"
                        >
                            Rent Now
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const TricyclesSection: React.FC<{
    onRentAsset: (asset: { type: AssetType; id: string; siteId?: string; fee?: number }) => void;
}> = ({ onRentAsset }) => {
    const [tricycles, setTricycles] = useState<TricycleEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<{ status: number; message: string } | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    const fetchTricycles = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            // Try filtered public first, fall back to all/public
            let data: TricycleEntity[];
            try {
                data = await logisticsService.getPublicTricycles();
            } catch {
                data = await logisticsService.getAllPublicTricycles();
            }
            setTricycles(data);
        } catch (err: any) {
            const status = getApiErrorStatus(err);
            const message = handleApiError(err);
            setFetchError({ status, message });
            if (status !== 403 && status !== 401) {
                toast.error(`Could not load tricycles: ${message}`);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchTricycles(); }, [fetchTricycles]);

    // Filtering
    const filtered = tricycles.filter(t => {
        const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
        const matchSearch = !search || [t.plateNumber, t.category, t.capacity].some(
            s => s?.toLowerCase().includes(search.toLowerCase())
        );
        return matchStatus && matchSearch;
    });

    const statuses = ['ALL', ...Array.from(new Set(tricycles.map(t => t.status).filter(Boolean))).sort()];
    const availableCount = tricycles.filter(t => t.status === 'AVAILABLE').length;

    const renderBody = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-[2rem] h-64 animate-pulse border border-gray-100" />
                    ))}
                </div>
            );
        }

        if (fetchError) {
            return (
                <EmptyState
                    icon={AlertCircle}
                    title="Could not load tricycles"
                    message={fetchError.message}
                    action={
                        <button onClick={fetchTricycles} className="text-[#38a169] font-bold text-sm hover:underline flex items-center gap-1 mx-auto">
                            <RefreshCw className="w-4 h-4" /> Try Again
                        </button>
                    }
                />
            );
        }

        if (filtered.length === 0) {
            return (
                <EmptyState
                    icon={Truck}
                    title={search ? 'No matching tricycles' : 'No tricycles available'}
                    message={search ? `No tricycles match "${search}".` : 'There are currently no tricycles in the catalog.'}
                />
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((tricycle, idx) => (
                    <TricycleCard key={tricycle.id} tricycle={tricycle} idx={idx} onRentAsset={onRentAsset} />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500">
                        {isLoading ? 'Loading…' : `${tricycles.length} tricycle${tricycles.length !== 1 ? 's' : ''} total`}
                    </p>
                </div>
                <button
                    onClick={fetchTricycles}
                    className="self-start sm:self-auto p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
                    title="Refresh"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Stats */}
            {!isLoading && !fetchError && tricycles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
                        <p className="text-2xl font-black text-gray-900">{tricycles.length}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Total Fleet</p>
                    </div>
                    <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4 text-center">
                        <p className="text-2xl font-black text-emerald-600">{availableCount}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Available</p>
                    </div>
                    <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4 text-center">
                        <p className="text-2xl font-black text-[#1a4d2e]">{tricycles.length - availableCount}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">In Use</p>
                    </div>
                </div>
            )}

            {/* Search + Status filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                {tricycles.length > 3 && (
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by plate, category…"
                            className="w-full border border-gray-200 rounded-2xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#38a169]/30 focus:border-[#38a169] bg-white"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                    {statuses.map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${statusFilter === s
                                ? 'bg-[#1a4d2e] text-white shadow-md'
                                : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {renderBody()}
        </div>
    );
};

export default TricyclesSection;
