import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser } from "@/store/authSlice";
import {
  Mail,
  Lock,
  User,
  Phone,
  CheckCircle2,
  Loader2,
  Building2,
  UserCircle,
  ArrowRight,
  MapPin,
  Eye,
  EyeOff,
  Home,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { BecomeVendorModal } from "@/components/ui/BecomeVendorModal";
import { sitesService } from "@/api";
import type { SiteEntity } from "@/types/api.types";

export default function Register() {
  const { t } = useTranslation();
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [siteId, setSiteId] = useState("");
  const [sites, setSites] = useState<SiteEntity[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const data = await sitesService.getAllSites();
        setSites(data);
      } catch (error) {
        console.error("Failed to fetch sites:", error);
      }
    };
    fetchSites();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(t('passwordsDoNotMatch') || 'Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      toast.error(t('pleaseAcceptTerms') || "Please accept terms");
      return;
    }

    const result = await dispatch(
      registerUser({
        accountType,
        firstName,
        lastName,
        phone,
        email,
        password,
        businessName: accountType === 'business' ? businessName : undefined,
        siteId: siteId || undefined,
      } as any)
    );

    if (registerUser.fulfilled.match(result)) {
      toast.success(t('registrationSuccess') || 'Registration successful!', {
        description: t('verificationSent') || 'Please check your email for the verification code.',
      });
      navigate('/verify-otp');
    } else {
      toast.error(t('registrationFailed') || 'Registration failed', {
        description: result.payload as string || 'An error occurred during registration',
      });
    }
  };

  return (
    <AuthLayout
      title={t('createNewAccount') || 'Create Account'}
      subtitle={t('joinMoFreshCommunity') || 'Join the MoFresh community today'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

        {/* Account Type Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAccountType('personal')}
            className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl border-2 transition-all ${accountType === 'personal'
              ? 'border-[#2E8B2E] bg-[#2E8B2E]/5 text-[#2E8B2E] shadow-sm'
              : 'border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] text-gray-400 dark:text-gray-500'
              }`}
          >
            <UserCircle className="w-5 h-5" />
            <span className="font-black text-[10px] sm:text-xs uppercase tracking-widest">{t('personal') || 'Personal'}</span>
          </button>
          <button
            type="button"
            onClick={() => setAccountType('business')}
            className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl border-2 transition-all ${accountType === 'business'
              ? 'border-[#2E8B2E] bg-[#2E8B2E]/5 text-[#2E8B2E] shadow-sm'
              : 'border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] text-gray-400 dark:text-gray-500'
              }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="font-black text-[10px] sm:text-xs uppercase tracking-widest">{t('business') || 'Business'}</span>
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t('firstName')}</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-[#2E8B2E]" />
                <input
                  type="text"
                  placeholder="𝖥𝗂𝗋𝗌𝗍 𝗇𝖺𝗆𝖾..."
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-[#2E8B2E]/10 focus:border-[#2E8B2E] outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-bold text-sm sm:text-base"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t('lastName')}</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-[#2E8B2E]" />
                <input
                  type="text"
                  placeholder="𝖫𝖺𝗌𝗍 𝗇𝖺𝗆𝖾..."
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-[#2E8B2E]/10 focus:border-[#2E8B2E] outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-bold text-sm sm:text-base"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t('emailAddressLabel')}</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-[#2E8B2E]" />
                <input
                  type="email"
                  placeholder="𝖤𝗆𝖺𝗂𝗅..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-[#2E8B2E]/10 focus:border-[#2E8B2E] outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-bold text-sm sm:text-base"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t('phoneLabel')}</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-[#2E8B2E]" />
                <input
                  type="tel"
                  placeholder="𝖯𝗁𝗈𝗇𝖾..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-[#2E8B2E]/10 focus:border-[#2E8B2E] outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 font-bold text-sm sm:text-base"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t('selectSite') || 'Assigned Site'}</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-[#2E8B2E]" />
              <select
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-[#2E8B2E]/10 focus:border-[#2E8B2E] outline-none transition-all text-gray-900 dark:text-white font-bold text-sm sm:text-base appearance-none cursor-pointer"
                required
              >
                <option value="" disabled className="text-gray-400">𝖲𝖾𝗅𝖾𝖼𝗍 𝗒𝗈𝗎𝗋 𝗌𝗂𝗍𝖾 𝗍𝗈 𝗌𝗍𝖺𝗋𝗍...</option>
                {sites.map(site => (
                  <option key={site.id} value={site.id} className="text-gray-900 bg-white">{site.name}</option>
                ))}
              </select>
            </div>
          </div>

          <AnimatePresence>
            {accountType === 'business' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t('businessName')}</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-[#2E8B2E]" />
                    <input
                      type="text"
                      placeholder="𝖡𝗎𝗌𝗂𝗇𝖾𝗌𝗌 𝗇𝖺𝗆𝖾 𝗍𝗈 𝗌𝗍𝖺𝗋𝗍..."
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-[#2E8B2E]/10 focus:border-[#2E8B2E] outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 font-bold text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t('password')}</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-[#2E8B2E]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="𝖯𝖺𝗌𝗌𝗐𝗈𝗋𝖽..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-gray-50/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-[#2E8B2E]/10 focus:border-[#2E8B2E] outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 font-bold text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-[#2E8B2E] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">{t('confirmPassword')}</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within:text-[#2E8B2E]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="𝖢𝗈𝗇𝖿𝗂𝗋𝗆..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-gray-50/50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-4 focus:ring-[#2E8B2E]/10 focus:border-[#2E8B2E] outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 font-bold text-sm sm:text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-[#2E8B2E] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 py-1.5 bg-gray-50/50 dark:bg-white/[0.02] p-2 rounded-xl">
          <label className="relative flex items-center cursor-pointer">
            <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="sr-only peer" />
            <div className="w-5 h-5 border-2 border-gray-300 dark:border-white/20 rounded-md peer-checked:bg-[#2E8B2E] peer-checked:border-[#2E8B2E] transition-all flex items-center justify-center">
              <CheckCircle2 size={12} className="text-white scale-0 peer-checked:scale-100 transition-transform" />
            </div>
          </label>
          <span className="text-[10px] sm:text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none">
            {t('agreeToTermsDesc') || 'I agree to the'} <Link to="/terms" className="text-[#2E8B2E] hover:text-[#1a4d2e] hover:underline">Terms</Link>
          </span>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-[#2E8B2E] hover:bg-[#1a4d2e] text-white font-black py-4.5 rounded-xl transition-all shadow-lg shadow-[#2E8B2E]/10 hover:shadow-xl disabled:opacity-50 uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <>
              <span>{t('createAccount') || 'Sign Up'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>

        <div className="pt-4 border-t border-gray-100 dark:border-white/[0.05] flex flex-col items-center gap-3">
          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {t('alreadyHaveAccount')}?{' '}
            <Link to="/login" className="text-[#2E8B2E] hover:text-[#1a4d2e] hover:underline ml-1 transition-colors">
              {t('signIn') || 'Login'}
            </Link>
          </p>

          {/* Become a Vendor Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowVendorModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 dark:text-black text-white rounded-lg font-black text-[10px] uppercase tracking-wider transition-all shadow-lg shadow-black/10 dark:shadow-white/5"
          >
            <Store className="w-3 h-3" />
            <span>{t('becomeAVendor') || 'Become a Vendor'}</span>
          </motion.button>

          <Link
            to="/"
            className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-600 hover:text-[#2E8B2E] uppercase tracking-wider transition-all mt-1"
          >
            <Home className="w-3 h-3" />
            {t('goBackHome')}
          </Link>
        </div>
      </form>

      {/* Vendor Modal */}
      <BecomeVendorModal isOpen={showVendorModal} onClose={() => setShowVendorModal(false)} />
    </AuthLayout>
  );
}
