import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

// Assets
import heroImage from '@/assets/register.png';
import logo from '@/assets/Logo.png';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success(t('resetLinkSent') || 'Reset link sent!', {
        description: t('resetLinkSentDesc') || `We've sent a password reset link to ${email}`,
      });
    }, 1500);
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
      {/* Cinematic Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="p-8 sm:p-12">

            {/* Header / Logo */}
            <div className="flex flex-col items-center mb-8">
              <img src={logo} alt="MoFresh" className="h-10 mb-4 drop-shadow-xl" />
              <div className="h-1 w-8 bg-green-500 rounded-full" />
            </div>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                      {t('forgotPassword') || 'Forgot Password?'}
                    </h1>
                    <p className="text-white/50 text-sm mt-2">
                      {t('forgotPasswordDesc') || "No worries! Enter your email and we'll send reset instructions."}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-green-400 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('emailPlaceholder') || "Email Address"}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:bg-white/10 focus:border-white/30 text-white transition-all placeholder:text-white/30"
                        required
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('sendResetLink') || 'Send Reset Link'}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
                  <p className="text-white/50 text-sm mb-6 px-4">
                    Instructions have been sent to <span className="text-white font-medium">{email}</span>
                  </p>

                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-green-400 text-xs font-bold uppercase tracking-widest hover:text-green-300 transition-colors"
                  >
                    Resend Email
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

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