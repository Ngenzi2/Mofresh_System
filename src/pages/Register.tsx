import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser } from "@/store/authSlice";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AuthLayout } from "@/components/ui/AuthLayout";

export default function Register() {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(t('passwordsDoNotMatch') || "Passwords do not match");
      return;
    }

    if (!acceptTerms) {
      toast.error(t('pleaseAcceptTerms') || "Please accept terms");
      return;
    }

    const result = await dispatch(
      registerUser({ fullName, phone, email, password }),
    );

    if (registerUser.fulfilled.match(result)) {
      toast.success(t('accountCreatedSuccess') || "Account created successfully!");
      setTimeout(() => navigate("/verify-otp"), 1000);
    } else {
      toast.error("Registration failed", {
        description: (result.payload as string) || "Please try again",
      });
    }
  };

  return (
    <AuthLayout
      title={t('signUp')}
      subtitle={t('createAccount')}
      sideTitle={t('registerTitle')}
      sideSubtitle={t('registerSubtitle')}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#2d6a4f] block ml-1">
            {t('fullName')}
          </label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#2d6a4f]" />
            <input
              type="text"
              placeholder={t('enterFullName')}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] text-gray-900 transition-all placeholder:text-gray-400"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#2d6a4f] block ml-1">
            {t('phoneLabel')}
          </label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#2d6a4f]" />
            <input
              type="tel"
              placeholder={t('enterPhone')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] text-gray-900 transition-all placeholder:text-gray-400"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#2d6a4f] block ml-1">
            {t('emailAddressLabel')}
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#2d6a4f]" />
            <input
              type="email"
              placeholder={t('enterEmail')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] text-gray-900 transition-all placeholder:text-gray-400"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#2d6a4f] block ml-1">
              {t('password')}
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#2d6a4f]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-10 outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] text-gray-900 transition-all placeholder:text-gray-400"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2d6a4f]">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#2d6a4f] block ml-1">
              {t('confirmPassword') || 'Confirm'}
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#2d6a4f]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t('confirmPassword') || 'Confirm'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-10 outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] text-gray-900 transition-all placeholder:text-gray-400"
                required
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2d6a4f]">
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 py-1">
          <label className="relative flex items-center cursor-pointer">
            <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="sr-only peer" />
            <div className="w-5 h-5 border border-gray-200 rounded-md peer-checked:bg-[#38a169] peer-checked:border-[#38a169] transition-all flex items-center justify-center">
              <AnimatePresence>{acceptTerms && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <CheckCircle2 size={12} className="text-white" />
                </motion.div>
              )}</AnimatePresence>
            </div>
          </label>
          <span className="text-xs text-gray-500 font-medium">
            I agree to the <Link to="/terms" className="text-[#38a169] hover:underline font-bold">Terms</Link> & <Link to="/privacy" className="text-[#38a169] hover:underline font-bold">Privacy</Link>
          </span>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-[#38a169] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#2d6a4f] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('createAccount')}
        </motion.button>

        <div className="pt-4 text-center space-y-4">
          <p className="text-sm text-gray-500">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-[#38a169] font-bold hover:underline">
              {t('signIn')}
            </Link>
          </p>

          <Link
            to="/"
            className="inline-block text-[10px] text-gray-400 hover:text-[#2d6a4f] uppercase tracking-[0.3em] font-medium transition-colors"
          >
            Go back home
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
