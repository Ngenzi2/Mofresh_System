import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { verifyOtp, resendOtp } from '@/store/authSlice';
import { Mail, Loader2, ArrowLeft, Home } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AuthLayout } from '@/components/ui/AuthLayout';

export default function VerifyOTP() {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, otpEmail } = useAppSelector((state) => state.auth);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length === 6) {
      const result = await dispatch(verifyOtp({ otp: otpString }));

      if (verifyOtp.fulfilled.match(result)) {
        toast.success(t('verificationSuccess') || 'Verified!');
        const userRole = result.payload.user.role;
        const dashboardPath = userRole === 'ADMIN' ? '/admin/dashboard' :
          userRole === 'SITE_MANAGER' ? '/manager/dashboard' :
            userRole === 'SUPPLIER' ? '/supplier/dashboard' : '/buyer/dashboard';
        setTimeout(() => navigate(dashboardPath), 1000);
      } else {
        toast.error(t('verificationFailed') || 'Failed', {
          description: result.payload as string || 'Invalid OTP',
        });
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      await dispatch(resendOtp());
      setOtp(['', '', '', '', '', '']);
      toast.success(t('newCodeSent') || 'New code sent!');
    } catch (error) {
      toast.error(t('resendFailed') || 'Failed to resend code');
    }
  };

  return (
    <AuthLayout
      title={t('secureVerification') || 'Identity Security'}
      subtitle={t('enterVerificationCode') || 'Enter the code sent to your email'}
    >
      <div className="w-full flex flex-col items-center">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#2E8B2E]/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-[#2E8B2E]/20">
            <Mail className="w-5 h-5 text-[#2E8B2E]/80" />
          </div>
          <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">
            {t('sentTo') || 'Verification sent to'} <br /> <span className="text-gray-900 dark:text-gray-300 text-xs font-black">{otpEmail || 'your email'}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 w-full">
          {/* OTP Inputs */}
          <div className="flex justify-between gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-full h-14 sm:h-16 text-center text-2xl font-black bg-gray-50/50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-[#2E8B2E]/10 focus:border-[#2E8B2E] outline-none transition-all text-gray-900 dark:text-white"
              />
            ))}
          </div>

          <div className="space-y-5">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading || otp.some((digit) => !digit)}
              className="w-full bg-[#2E8B2E] hover:bg-[#1a4d2e] text-white font-black py-4.5 rounded-2xl transition-all shadow-xl shadow-[#2E8B2E]/10 hover:shadow shadow-[#2E8B2E]/20 disabled:opacity-50 uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : t('verifyIdentity') || 'Verify Access'}
            </motion.button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-gray-400 dark:text-gray-600 hover:text-[#2E8B2E] text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                {t('resendOTP') || 'Request new code'}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 dark:border-white/[0.03] flex flex-col items-center gap-4 w-full">
          <Link
            to="/login"
            className="flex items-center gap-2 text-gray-400 dark:text-gray-600 hover:text-[#2E8B2E] transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToLogin') || 'Back to Login'}
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-[10px] font-black text-gray-300 dark:text-gray-700 hover:text-[#2E8B2E] uppercase tracking-wider transition-all"
          >
            <Home className="w-4 h-4" />
            {t('goBackHome')}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}