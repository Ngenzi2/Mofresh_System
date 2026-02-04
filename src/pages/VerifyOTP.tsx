import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { verifyOtp } from '@/store/authSlice';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import heroImage from '@/assets/register.jpeg';
import logo from '@/assets/Logo.png';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, otpEmail } = useAppSelector((state) => state.auth);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length === 6) {
      const result = await dispatch(verifyOtp({ otp: otpString }));
      
      if (verifyOtp.fulfilled.match(result)) {
        toast.success('Verification successful!', {
          description: 'Your account has been verified. Redirecting...',
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast.error('Verification failed', {
          description: result.payload as string || 'Invalid OTP code',
        });
      }
    }
  };

  const handleResendOtp = () => {
    // Reset OTP inputs
    setOtp(['', '', '', '', '', '']);
    // In a real app, this would trigger another API call
    toast.success('OTP resent', {
      description: 'A new OTP has been sent to your email',
    });
  };

  return (
    <div className="min-h-screen bg-[#2a2a2a] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[1200px] flex flex-col lg:flex-row shadow-xl overflow-hidden rounded-lg">
        {/* Left Side - Hero Image */}
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

        {/* Right Side - OTP Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-[450px] mx-auto w-full">
            {/* Logo */}
            <div className="mb-8">
              <img src={logo} alt="Via Fresh" className="h-12" />
            </div>

            {/* Mail Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#e6f4ea] flex items-center justify-center">
                <Mail className="w-10 h-10 text-[#00b050]" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-center text-3xl mb-4 text-[#00b050]">Verify OTP</h1>
            <p className="text-center text-gray-600 mb-8">
              We sent an OTP to <span className="font-medium">{otpEmail || 'your Email'}</span> enter it below to continue
            </p>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Inputs */}
              <div className="flex justify-center gap-2 sm:gap-3">
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
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b050] focus:border-transparent"
                  />
                ))}
              </div>

              {/* Resend OTP */}
              <p className="text-center text-sm text-gray-600">
                Didn't receive?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[#00b050] hover:underline"
                >
                  Resend OTP
                </button>
              </p>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading || otp.some((digit) => !digit)}
                className="w-full bg-[#1e5631] hover:bg-[#163f24] text-white py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>

              {/* Back to Login Link */}
              <p className="text-center text-sm text-gray-600">
                Go Back to{' '}
                <Link to="/login" className="text-[#00b050] hover:underline">
                  Log In?
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}