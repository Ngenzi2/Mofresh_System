import { useState, type FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '@/components/ui/AuthLayout';

export default function Login() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <AuthLayout
      title={t('signIn')}
      subtitle={t('signIn')} // Using signIn as temporary subtitle, or t('logInToAccount')
      sideTitle={t('loginTitle')}
      sideSubtitle={t('loginSubtitle')}
    >
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#2d6a4f] block ml-1">
            {t('emailAddressLabel')}
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2d6a4f] transition-colors" />
            <input
              required
              type="email"
              placeholder={t('enterEmail')}
              className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#2d6a4f] block ml-1">
            {t('password')}
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2d6a4f] transition-colors" />
            <input
              required
              type={showPassword ? 'text' : 'password'}
              placeholder={t('enterPassword')}
              className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-12 pr-12 outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] transition-all text-gray-900 placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2d6a4f]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex justify-end">
            <Link to="/forgot-password" title={t('forgotPassword')} className="text-xs font-semibold text-[#4ade80] hover:text-[#2d6a4f] transition-colors">
              {t('forgotPassword')}
            </Link>
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-[#38a169] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#2d6a4f] transition-all mt-4"
        >
          {t('logIn')}
        </motion.button>

        <div className="text-center pt-6 space-y-4">
          <p className="text-sm text-gray-500">
            {t('dontHaveAccount')}{' '}
            <Link to="/register" className="text-[#38a169] font-bold hover:underline">
              {t('signUp')}
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
    </AuthLayout >
  );
}
