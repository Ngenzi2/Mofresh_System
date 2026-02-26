import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    RefreshCw, MapPin, Zap, Battery, Sun,
    AlertCircle, Snowflake, Gauge, ChevronRight,
} from 'lucide-react';
import { infrastructureService } from '@/api';
import { handleApiError, getApiErrorStatus } from '@/api/client';
import type { ColdRoomEntity, ColdRoomOccupancy, AssetType } from '@/types/api.types';
import { AssetType as AssetTypeEnum } from '@/types/api.types';
import { toast } from 'sonner';

interface ColdRoomCardProps {
    room: ColdRoomEntity;
    idx: number;
    onRentAsset: (asset: { type: AssetType; id: string; siteId?: string; fee?: number }) => void;
}

// ── Power type visuals ────────────────────────────────────────────────────────
const POWER_CFG: Record<string, { icon: React.ElementType; label: string; color: string }> = {
    GRID: { icon: Zap, label: 'Grid Power', color: 'text-[#38a169]' },
    SOLAR: { icon: Sun, label: 'Solar Power', color: 'text-amber-500' },
    HYBRID: { icon: Battery, label: 'Hybrid Power', color: 'text-purple-500' },
};

// ── Empty State ───────────────────────────────────────────────────────────────
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
        <p className="text-gray-400 text-sm mb-4 max-w-xs mx-auto">{message}</p>
        {action}
    </motion.div>
);

// ── Occupancy bar ─────────────────────────────────────────────────────────────
const OccupancyBar: React.FC<{ used: number; total: number }> = ({ used, total }) => {
    const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
    const color = pct > 85 ? 'bg-red-500' : pct > 60 ? 'bg-amber-400' : 'bg-emerald-500';
    return (
        <div className="w-full">
            <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                <span className="text-gray-400">Capacity</span>
                <span className="text-gray-600">{used.toLocaleString()} / {total.toLocaleString()} kg</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${color}`}
                />
            </div>
            <div className="flex items-center justify-between text-[10px] mt-1">
                <span className="font-bold text-gray-500">{pct.toFixed(0)}% used</span>
                <span className={`font-bold ${pct > 85 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {(total - used).toLocaleString()} kg free
                </span>
            </div>
        </div>
    );
};

// ── Cold Room Card ────────────────────────────────────────────────────────────
const ColdRoomCard: React.FC<ColdRoomCardProps> = ({ room, idx, onRentAsset }) => {
    const [occupancy, setOccupancy] = useState<ColdRoomOccupancy | null>(null);
    const [loadingOcc, setLoadingOcc] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const power = POWER_CFG[room.powerType] || POWER_CFG.GRID;
    const PowerIcon = power.icon;

    const loadOccupancy = async () => {
        if (occupancy) { setExpanded(e => !e); return; }
        setLoadingOcc(true);
        try {
            const data = await infrastructureService.getColdRoomOccupancy(room.id);
            setOccupancy(data);
            setExpanded(true);
        } catch {
            // Occupancy may not be available for discovery rooms
            setExpanded(true);
        } finally {
            setLoadingOcc(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
        >
            {/* Top gradient bar */}
            <div className="h-2 bg-gradient-to-r from-[#38a169] to-[#1a4d2e]" />

            <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#38a169] to-[#1a4d2e] rounded-2xl flex items-center justify-center shadow-md shadow-[#38a169]/20">
                            <Snowflake className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900 text-sm leading-tight">{room.name}</h3>
                            <p className="text-[10px] text-gray-400 font-mono">#{room.id.slice(0, 12)}</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-bold ${power.color}`}>
                        <PowerIcon className="w-3.5 h-3.5" />
                        {power.label}
                    </div>
                </div>

                {/* Temperature range */}
                <div className="flex items-center gap-2 bg-green-50/50 rounded-xl px-3 py-2.5">
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Temperature Range</p>
                        <p className="text-sm font-black text-[#1a4d2e]">
                            {room.temperatureMin}°C  →  {room.temperatureMax}°C
                        </p>
                    </div>
                </div>

                {/* Capacity */}
                <OccupancyBar
                    used={room.usedCapacityKg ?? 0}
                    total={room.totalCapacityKg ?? 0}
                />

                {/* Expanded occupancy detail */}
                {expanded && occupancy && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="border-t border-gray-50 pt-3 space-y-2"
                    >
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-emerald-50 rounded-xl p-3 text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Available</p>
                                <p className="text-sm font-black text-emerald-700">{occupancy.availableKg?.toLocaleString()} kg</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-3 text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Occupancy</p>
                                <p className="text-sm font-black text-[#1a4d2e]">{occupancy.occupancyPercentage?.toFixed(1)}%</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${occupancy.canAcceptMore ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                            }`}>
                            <Gauge className="w-3.5 h-3.5" />
                            {occupancy.canAcceptMore ? 'Accepting new products' : 'At full capacity'}
                        </div>
                    </motion.div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                    <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Site: {room.siteId?.slice(0, 8) ?? '—'}…
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={loadOccupancy}
                            disabled={loadingOcc}
                            className="flex items-center gap-1 text-[10px] font-bold text-[#38a169] hover:text-[#1a4d2e] hover:underline disabled:opacity-50"
                        >
                            {loadingOcc ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : expanded ? (
                                'Less'
                            ) : (
                                <>Occupancy <ChevronRight className="w-3 h-3" /></>
                            )}
                        </button>
                        <button
                            onClick={() => onRentAsset({
                                type: AssetTypeEnum.COLD_ROOM,
                                id: room.id,
                                siteId: room.siteId,
                                fee: 0 // Will be calculated or filled in modal
                            })}
                            className="bg-[#1a4d2e] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#38a169] transition-colors"
                        >
                            Rent Space
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ColdRoomsSection: React.FC<{
    onRentAsset: (asset: { type: AssetType; id: string; siteId?: string; fee?: number }) => void;
}> = ({ onRentAsset }) => {
    const [rooms, setRooms] = useState<ColdRoomEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<{ status: number; message: string } | null>(null);
    const [search, setSearch] = useState('');

    const fetchRooms = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            // Public discovery endpoint — no auth needed
            const data = await infrastructureService.discoverColdRooms();
            setRooms(data);
        } catch (err: any) {
            const status = getApiErrorStatus(err);
            const message = handleApiError(err);
            setFetchError({ status, message });
            if (status !== 403 && status !== 401) {
                toast.error(`Could not load cold rooms: ${message}`);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchRooms(); }, [fetchRooms]);

    const filtered = rooms.filter(r =>
        !search || r.name?.toLowerCase().includes(search.toLowerCase())
    );

    // Summary stats
    const totalCapacity = rooms.reduce((s, r) => s + (r.totalCapacityKg ?? 0), 0);
    const totalUsed = rooms.reduce((s, r) => s + (r.usedCapacityKg ?? 0), 0);
    const totalFree = totalCapacity - totalUsed;

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

        if (fetchError) {
            return (
                <EmptyState
                    icon={AlertCircle}
                    title="Could not load cold rooms"
                    message={fetchError.message}
                    action={
                        <button onClick={fetchRooms} className="text-[#38a169] font-bold text-sm hover:underline flex items-center gap-1 mx-auto">
                            <RefreshCw className="w-4 h-4" /> Try Again
                        </button>
                    }
                />
            );
        }

        if (filtered.length === 0) {
            return (
                <EmptyState
                    icon={Snowflake}
                    title={search ? 'No matching cold rooms' : 'No cold rooms available'}
                    message={search ? `No rooms match "${search}".` : 'There are currently no cold rooms in the discovery catalog.'}
                />
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((room, idx) => (
                    <ColdRoomCard key={room.id} room={room} idx={idx} onRentAsset={onRentAsset} />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">Cold Rooms</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {isLoading ? 'Discovering…' : `${rooms.length} cold room${rooms.length !== 1 ? 's' : ''} available`}
                    </p>
                </div>
                <button
                    onClick={fetchRooms}
                    className="self-start sm:self-auto p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
                    title="Refresh"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Summary stats */}
            {!isLoading && !fetchError && rooms.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Total Rooms', value: rooms.length.toString(), color: 'text-gray-900', bg: 'bg-white' },
                        { label: 'Total Capacity', value: `${totalCapacity.toLocaleString()} kg`, color: 'text-[#1a4d2e]', bg: 'bg-white' },
                        { label: 'Used', value: `${totalUsed.toLocaleString()} kg`, color: 'text-orange-600', bg: 'bg-orange-50' },
                        { label: 'Available', value: `${totalFree.toLocaleString()} kg`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    ].map((s, i) => (
                        <div key={i} className={`${s.bg} rounded-2xl border border-gray-100 p-4 text-center shadow-sm`}>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                            <p className={`text-xl font-black mt-1 ${s.color}`}>{s.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Search */}
            {!fetchError && rooms.length > 3 && (
                <div className="relative max-w-md">
                    <Snowflake className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search cold rooms…"
                        className="w-full border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#38a169]/30 focus:border-[#38a169] bg-white"
                    />
                </div>
            )}

            {renderBody()}
        </div>
    );
};

export default ColdRoomsSection;
