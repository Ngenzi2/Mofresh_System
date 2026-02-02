import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import heroImage from '@/assets/register.jpeg';
import logo from '@/assets/Logo.jpeg';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success('Reset link sent!', {
        description: `We've sent a password reset link to ${email}`,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#2a2a2a] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[1200px] flex flex-col lg:flex-row shadow-xl overflow-hidden rounded-lg">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-[400px] mx-auto w-full">
            {/* Logo */}
            <div className="mb-8">
              <img src={logo} alt="Via Fresh" className="h-12" />
            </div>

            {!isSubmitted ? (
              <>
                {/* Heading */}
                <h1 className="text-[#00b050] mb-3">Forgot Password?</h1>
                <p className="text-gray-600 mb-8 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b050] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1e5631] hover:bg-[#163f24] text-white py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>

                  {/* Back to Login Link */}
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 text-sm text-[#00b050] hover:underline"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </form>
              </>
            ) : (
              <>
                {/* Success Message */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-[#00b050]" />
                  </div>
                  <h1 className="text-[#00b050] mb-3">Check Your Email</h1>
                  <p className="text-gray-600 mb-8 text-sm">
                    We've sent a password reset link to <strong>{email}</strong>. 
                    Please check your inbox and follow the instructions.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 text-sm text-[#00b050] hover:underline"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side - Hero Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src={heroImage}
            alt="Keep It Fresh, Grow Your Business"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12">
            <h2 className="text-white text-4xl xl:text-5xl mb-2">
              Keep It <span className="text-[#00b050]">Fresh</span>,
            </h2>
            <h2 className="text-white text-4xl xl:text-5xl mb-2">Grow Your</h2>
            <h2 className="text-4xl xl:text-5xl">
              <span className="text-[#00b050]">Business</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}