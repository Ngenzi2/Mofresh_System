import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, RefreshCw, Download, CreditCard,
    CheckCircle, Clock, XCircle, ChevronDown, ChevronUp,
    Smartphone, LockKeyhole, AlertCircle,
} from 'lucide-react';
import { invoicesService, paymentsService } from '@/api';
import { handleApiError, getApiErrorStatus } from '@/api/client';
import { InvoiceStatus } from '@/types/api.types';
import type { InvoiceResponseDto } from '@/types/api.types';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';

const STATUS_CFG: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    UNPAID: { bg: 'bg-orange-50', text: 'text-orange-600', icon: Clock },
    PAID: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
    VOID: { bg: 'bg-gray-100', text: 'text-gray-500', icon: XCircle },
};

// ── Reusable Empty / Error ────────────────────────────────────────────────────
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

// ── Pay Modal ─────────────────────────────────────────────────────────────────
const PayModal: React.FC<{
    invoice: InvoiceResponseDto; onClose: () => void; onSuccess: () => void;
}> = ({ invoice, onClose, onSuccess }) => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.match(/^07[2389]\d{7}$/)) {
            toast.error('Enter a valid MTN Rwanda number (e.g. 0781234567)');
            return;
        }
        setLoading(true);
        try {
            await paymentsService.initiatePayment({ invoiceId: invoice.id, phoneNumber: phone });
            toast.success('Payment initiated — check your phone for the prompt!');
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const amountDue = invoice.totalAmount - invoice.paidAmount;

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
                className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 z-10"
            >
                <h2 className="text-xl font-black text-gray-900 mb-1">Pay Invoice #{invoice.invoiceNumber}</h2>
                <p className="text-sm text-gray-400 mb-6">MTN Mobile Money</p>

                <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-bold">Amount Due</span>
                    <span className="text-2xl font-black text-gray-900">
                        {amountDue.toLocaleString()} <span className="text-sm font-bold text-gray-400">Rwf</span>
                    </span>
                </div>

                <form onSubmit={handlePay} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">MTN Phone Number</label>
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="078 123 4567"
                                required
                                className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#38a169]/30 focus:border-[#38a169]"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-2xl hover:bg-gray-50 transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[#ffb703] text-[#1a4d2e] font-black py-3 rounded-2xl hover:bg-[#fb8500] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
                        >
                            {loading
                                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Processing…</>
                                : <><CreditCard className="w-4 h-4" /> Pay with MoMo</>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// ── Invoice Card ──────────────────────────────────────────────────────────────
const InvoiceCard: React.FC<{
    invoice: InvoiceResponseDto;
    onPayClick: (inv: InvoiceResponseDto) => void;
}> = ({ invoice, onPayClick }) => {
    const [expanded, setExpanded] = useState(false);
    const cfg = STATUS_CFG[invoice.status] || STATUS_CFG.UNPAID;
    const Icon = cfg.icon;
    const amountDue = invoice.totalAmount - invoice.paidAmount;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
        >
            <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                            <FileText className="w-5 h-5 text-[#38a169]" />
                        </div>
                        <div>
                            <p className="font-black text-gray-900 text-sm">INV #{invoice.invoiceNumber}</p>
                            <p className="text-xs text-gray-400">
                                Due: {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '—'}
                            </p>
                        </div>
                    </div>
                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                        <Icon className="w-3 h-3" />{invoice.status}
                    </span>
                </div>

                {/* Amount Blocks */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-2xl p-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</p>
                        <p className="font-black text-gray-900 text-sm mt-0.5">{(invoice.totalAmount ?? 0).toLocaleString()} Rwf</p>
                    </div>
                    <div className={`${invoice.status === 'UNPAID' ? 'bg-orange-50' : 'bg-green-50'} rounded-2xl p-3`}>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {invoice.status === 'PAID' ? 'Paid' : 'Due'}
                        </p>
                        <p className={`font-black text-sm mt-0.5 ${invoice.status === 'UNPAID' ? 'text-orange-600' : 'text-green-700'}`}>
                            {amountDue.toLocaleString()} Rwf
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                    <button
                        onClick={() => setExpanded(p => !p)}
                        className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-700"
                    >
                        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {expanded ? 'Less' : 'View Items'}
                    </button>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-600">
                            <Download className="w-3 h-3" /> PDF
                        </button>
                        {invoice.status === 'UNPAID' && (
                            <button
                                onClick={() => onPayClick(invoice)}
                                className="flex items-center gap-1.5 bg-[#1a4d2e] text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-[#38a169] transition-colors"
                            >
                                <CreditCard className="w-3 h-3" /> Pay Now
                            </button>
                        )}
                    </div>
                </div>

                {/* Line Items */}
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="border-t border-gray-50 pt-4 space-y-1.5"
                    >
                        {(invoice.items ?? []).length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-2">No line items</p>
                        ) : (
                            invoice.items.map(item => (
                                <div key={item.id} className="flex items-center justify-between text-xs py-1">
                                    <span className="text-gray-600 font-medium truncate max-w-[55%]">{item.description}</span>
                                    <span className="text-gray-500 text-right">
                                        {item.quantity} {item.unit} ×{' '}
                                        {item.unitPrice.toLocaleString()} ={' '}
                                        <strong className="text-gray-800">{item.subtotal.toLocaleString()} Rwf</strong>
                                    </span>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

// ── Main ─────────────────────────────────────────────────────────────────────
const InvoiceSection: React.FC = () => {
    const { user } = useAppSelector(state => state.auth);
    const [invoices, setInvoices] = useState<InvoiceResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<{ status: number; message: string } | null>(null);
    const [filter, setFilter] = useState<InvoiceStatus | 'ALL'>('ALL');
    const [payingInvoice, setPayingInvoice] = useState<InvoiceResponseDto | null>(null);

    const fetchInvoices = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const data = await invoicesService.getAllInvoices({ clientId: user?.id });
            const arr = Array.isArray(data) ? data : (data as any)?.data || [];
            setInvoices(arr);
        } catch (err: any) {
            const status = getApiErrorStatus(err);
            const message = handleApiError(err);
            setFetchError({ status, message });
            setInvoices([]);
            if (status !== 403 && status !== 401) {
                toast.error(`Failed to load invoices: ${message}`);
            }
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

    const statuses: (InvoiceStatus | 'ALL')[] = ['ALL', InvoiceStatus.UNPAID, InvoiceStatus.PAID, InvoiceStatus.VOID];
    const filtered = filter === 'ALL' ? invoices : invoices.filter(i => i.status === filter);

    const totalUnpaid = invoices
        .filter(i => i.status === 'UNPAID')
        .reduce((s, i) => s + (i.totalAmount - i.paidAmount), 0);
    const totalPaid = invoices
        .filter(i => i.status === 'PAID')
        .reduce((s, i) => s + i.paidAmount, 0);

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
                    message="Your account doesn't have permission to view invoices. Contact your site manager for access."
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
                        <button onClick={fetchInvoices} className="text-[#38a169] font-bold text-sm hover:underline flex items-center gap-1 mx-auto">
                            <RefreshCw className="w-4 h-4" /> Try Again
                        </button>
                    }
                />
            );
        }

        if (filtered.length === 0) {
            return (
                <EmptyState
                    icon={FileText}
                    title="No invoices"
                    message={filter === 'ALL' ? 'No invoices have been generated for your account yet.' : `No ${filter.toLowerCase()} invoices.`}
                />
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(invoice => (
                    <InvoiceCard key={invoice.id} invoice={invoice} onPayClick={setPayingInvoice} />
                ))}
            </div>
        );
    };

    return (
        <>
            {payingInvoice && (
                <PayModal
                    invoice={payingInvoice}
                    onClose={() => setPayingInvoice(null)}
                    onSuccess={fetchInvoices}
                />
            )}

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Invoices</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{invoices.length} invoices total</p>
                    </div>
                    <button
                        onClick={fetchInvoices}
                        className="self-start sm:self-auto p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Summary — only show when data loaded */}
                {!fetchError && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { label: 'Total Invoices', value: invoices.length.toString(), color: 'text-gray-900', bg: 'bg-white' },
                            { label: 'Amount Owed', value: `${totalUnpaid.toLocaleString()} Rwf`, color: 'text-orange-600', bg: 'bg-orange-50' },
                            { label: 'Amount Paid', value: `${totalPaid.toLocaleString()} Rwf`, color: 'text-green-700', bg: 'bg-green-50' },
                        ].map((s, i) => (
                            <div key={i} className={`${s.bg} rounded-2xl border border-gray-100 p-5 shadow-sm`}>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                                <p className={`text-xl font-black mt-1 ${s.color}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Filters */}
                {!fetchError && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {statuses.map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === s ? 'bg-[#1a4d2e] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
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

export default InvoiceSection;
