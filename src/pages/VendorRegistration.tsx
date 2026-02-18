import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import {
  Mail,
  Loader2,
  CheckCircle2,
  Store,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AuthLayout } from "@/components/ui/AuthLayout";

export default function VendorRegistration() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubmitted(true);
    toast.success(t('vendorEmailSent') || "Vendor credentials will be sent to your email!");

    // Redirect to login after 3 seconds
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <AuthLayout
        title={t('vendorRegistration') || 'Vendor Registration'}
        subtitle={t('checkYourEmail') || 'Check your email'}
      >
        <div className="text-center py-12 space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">
              {t('emailSentSuccess') || 'Email Sent Successfully!'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {t('vendorCredentialsMessage') ||
                'We will send your vendor credentials and instructions to your email address. Please check your inbox.'}
            </p>
          </div>

          <div className="pt-4">
            <Link
              to="/login"
              className="inline-block text-[#38a169] font-semibold hover:underline"
            >
              {t('backToLogin') || 'Back to Login →'}
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={t('vendorRegistration') || 'Vendor Registration'}
      subtitle={t('enterYourEmail') || 'Enter your email to get started'}
    >
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex gap-3">
            <Store className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">
                {t('vendorRegistrationInfo') || 'Vendor Registration Process'}
              </p>
              <p className="text-blue-700">
                {t('vendorRegistrationDescription') ||
                  'Submit your email and our team will review your application. You will receive vendor credentials and access instructions via email within 24-48 hours.'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#2d6a4f] block ml-1">
              {t('emailAddressLabel') || 'Email Address'}
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#2d6a4f]" />
              <input
                type="email"
                placeholder={t('enterEmail') || 'Enter your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] text-gray-900 transition-all placeholder:text-gray-400"
                required
              />
            </div>
            <p className="text-xs text-gray-500 ml-1 mt-1">
              {t('vendorEmailNote') || 'Use a valid business email address'}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#2d6a4f] block ml-1">
              {t('phoneLabel') || 'Phone Number'}
            </label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#2d6a4f]" />
              <input
                type="tel"
                placeholder={t('enterPhone') || 'Enter your phone number'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] text-gray-900 transition-all placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-[#38a169] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#2d6a4f] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('submitting') || 'Submitting...'}
              </>
            ) : (
              t('submitApplication') || 'Submit Application'
            )}
          </motion.button>

          <div className="pt-4 text-center space-y-3">
            <p className="text-sm text-gray-500">
              {t('alreadyHaveAccount') || 'Already have an account?'}{' '}
              <Link to="/login" className="text-[#38a169] font-bold hover:underline">
                {t('signIn') || 'Sign in'}
              </Link>
            </p>

            <Link
              to="/"
              className="inline-block text-[10px] text-gray-400 hover:text-[#2d6a4f] uppercase tracking-[0.3em] font-medium transition-colors"
            >
              {t('goBackHome') || 'Go back home'}
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
