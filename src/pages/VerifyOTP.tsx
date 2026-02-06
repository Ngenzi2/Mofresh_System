import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { verifyOtp } from '@/store/authSlice';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Assets
import heroImage from '@/assets/register.png';
import logo from '@/assets/Logo.png';

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
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        toast.error(t('verificationFailed') || 'Failed', {
          description: result.payload as string || 'Invalid OTP',
        });
      }
    }
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    toast.success('New code sent!');
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden font-sans"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="p-8 sm:p-12">

            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8">
              <img src={logo} alt="MoFresh" className="h-10 mb-4" />
              <div className="h-1 w-8 bg-green-500 rounded-full" />
            </div>

            {/* Icon & Text */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Mail className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {t('verifyOTP') || 'Verify OTP'}
              </h1>
              <p className="text-white/50 text-sm mt-2">
                Sent to <span className="text-white font-medium">{otpEmail || 'your email'}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* OTP Inputs */}
              <div className="flex justify-between gap-2">
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
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-green-500/50 outline-none text-white transition-all"
                  />
                ))}
              </div>

              {/* Action Button */}
              <motion.button
                type="submit"
                disabled={isLoading || otp.some((digit) => !digit)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('verifyContinue') || 'Verify & Continue'}
              </motion.button>

              {/* Resend Logic */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-white/40 hover:text-green-400 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  {t('resendOTP') || 'Resend Code'}
                </button>
              </div>
            </form>

            {/* Bottom Navigation */}
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
              <Link
                to="/login"
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('backToLogin') || 'Back to Login'}
              </Link>
              <Link
                to="/"
                className="text-[10px] text-white/20 hover:text-white uppercase tracking-[0.4em] transition-all"
              >
                Go back home
              </Link>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}