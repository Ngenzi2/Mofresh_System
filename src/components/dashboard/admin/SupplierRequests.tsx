import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Calendar, MapPin, UserCheck, UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { usersService } from '@/api';

interface VendorRequest {
  id: string;
  email: string;
  phone: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export const SupplierRequests: React.FC = () => {
  const [requests, setRequests] = useState<VendorRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const reqs = await usersService.getVendorRequests();
      setRequests(reqs as VendorRequest[]);
    } catch (error: any) {
      toast.error('Failed to fetch vendor requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReply = async (email: string, action: 'APPROVE' | 'REJECT') => {
    const message = action === 'APPROVE'
      ? "Thank you for your request. We have approved your application. Please proceed to registration."
      : "Thank you for your interest. Unfortunately, we cannot approve your request at this time.";

    try {
      await usersService.replyVendorRequest({ email, message });
      toast.success(`Vendor request ${action === 'APPROVE' ? 'approved' : 'rejected'}`);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reply to vendor request');
    }
  };

  const pendingRequests = Array.isArray(requests) ? requests.filter(r => r.status === 'PENDING') : [];
  const pastRequests = Array.isArray(requests) ? requests.filter(r => r.status !== 'PENDING') : [];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-black text-gray-900 leading-tight">Supplier <span className="text-[#38a169]">Applications</span></h2>
        <p className="text-gray-500 text-sm">Review and approve new vendor requests</p>
      </div>

      {/* Pending Applications */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-[#2E8B2E] animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Fetching applications...</p>
        </div>
      ) : pendingRequests.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {pendingRequests.map((req) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-[#38a169]/30 transition-all"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-[#2E8B2E] shrink-0">
                  <UserPlus className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-gray-900">{req.email}</h3>
                    <span className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-black uppercase tracking-widest">Pending Review</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-[#2E8B2E]">
                      <MapPin className="w-3 h-3" /> {req.phone}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 italic leading-relaxed">
                    "{req.description}"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => handleReply(req.email, 'REJECT')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-red-100 text-red-500 hover:bg-red-50 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
                <button
                  onClick={() => handleReply(req.email, 'APPROVE')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#2E8B2E] text-white hover:bg-[#1a4d2e] rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-[#2E8B2E]/20"
                >
                  <Check className="w-4 h-4" /> Approve Vendor
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50/50 rounded-[2.5rem] p-12 text-center border border-dashed border-gray-200">
          <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No pending applications</p>
        </div>
      )}

      {/* Past Requests */}
      {pastRequests.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Processed Requests</h3>
          <div className="bg-white rounded-[2.5rem] border border-gray-50 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                  <th className="px-8 py-4">Supplier</th>
                  <th className="px-8 py-4">Branch</th>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pastRequests.map((req) => (
                  <tr key={req.id} className="text-sm">
                    <td className="px-8 py-4 font-bold text-gray-700">{req.email}</td>
                    <td className="px-8 py-4 text-gray-500 font-medium">{req.phone}</td>
                    <td className="px-8 py-4 text-gray-400 text-xs font-bold">{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td className="px-8 py-4 text-right">
                      <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${req.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
