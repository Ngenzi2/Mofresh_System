import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, Building, Shield, Camera,
    Save, RefreshCw, CheckCircle, AlertCircle,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/authSlice';
import { toast } from 'sonner';

const ProfileSection: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user, isLoading } = useAppSelector(state => state.auth);
    const fileRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const [form, setForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        password: '',
        confirmPassword: '',
    });
    const [saving, setSaving] = useState(false);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
        const reader = new FileReader();
        reader.onload = () => setAvatarPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password && form.password !== form.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (!user?.id) return;
        setSaving(true);
        try {
            const payload: any = {
                firstName: form.firstName,
                lastName: form.lastName,
                phone: form.phone,
            };
            if (form.password) payload.password = form.password;

            await dispatch(updateUser({ id: user.id, userData: payload })).unwrap();
            toast.success('Profile updated successfully!');
            setForm(f => ({ ...f, password: '', confirmPassword: '' }));
        } catch (err: any) {
            toast.error(err || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const avatarSrc = avatarPreview || user?.profilePicture || null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-black text-gray-900">My Profile</h2>
                <p className="text-sm text-gray-500 mt-0.5">Manage your personal information</p>
            </div>

            {/* Avatar Card */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 flex flex-col sm:flex-row items-center gap-6"
            >
                <div className="relative">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1a4d2e] to-[#38a169] flex items-center justify-center overflow-hidden shadow-lg">
                        {avatarSrc ? (
                            <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-black text-white">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => fileRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#ffb703] rounded-xl flex items-center justify-center shadow-md hover:bg-[#fb8500] transition-colors"
                    >
                        <Camera className="w-4 h-4 text-[#1a4d2e]" />
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>

                <div className="text-center sm:text-left">
                    <h3 className="text-xl font-black text-gray-900">{user?.name || 'User'}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#38a169] bg-green-50 px-2.5 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" /> {user?.role}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${user?.isActive ? 'text-blue-700 bg-blue-50' : 'text-red-600 bg-red-50'
                            }`}>
                            {user?.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Info rows */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-4"
            >
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Account Info</h3>
                {[
                    { icon: Mail, label: 'Email', value: user?.email || '—' },
                    { icon: Shield, label: 'Account Type', value: user?.accountType || '—' },
                    { icon: Building, label: 'Business', value: user?.businessName || 'Personal Account' },
                ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                            <Icon className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                            <p className="text-sm font-bold text-gray-900 capitalize">{value}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Edit Form */}
            <motion.form
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.10 }}
                onSubmit={handleSave}
                className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-5"
            >
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Edit Details</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">First Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                value={form.firstName}
                                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38a169]/30 focus:border-[#38a169]"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Last Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                value={form.lastName}
                                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38a169]/30 focus:border-[#38a169]"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38a169]/30 focus:border-[#38a169]"
                        />
                    </div>
                </div>

                {/* Change Password */}
                <div className="pt-2 border-t border-gray-50">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Change Password (optional)</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                placeholder="Leave blank to keep"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#38a169]/30 focus:border-[#38a169]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
                            <input
                                type="password"
                                value={form.confirmPassword}
                                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                placeholder="Repeat new password"
                                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${form.confirmPassword && form.password !== form.confirmPassword
                                        ? 'border-red-300 ring-red-100'
                                        : 'border-gray-200 focus:ring-[#38a169]/30 focus:border-[#38a169]'
                                    }`}
                            />
                            {form.confirmPassword && form.password !== form.confirmPassword && (
                                <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Passwords don't match
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving || isLoading}
                    className="w-full bg-[#1a4d2e] text-white font-black py-3 rounded-2xl hover:bg-[#38a169] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {saving || isLoading ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</>
                    ) : (
                        <><Save className="w-4 h-4" /> Save Changes</>
                    )}
                </button>
            </motion.form>
        </div>
    );
};

export default ProfileSection;
