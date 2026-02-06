import { useState, type FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router';

// Import your assets
import heroImage from '@/assets/login.png';
import logo from '@/assets/Logo.png';

export default function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Logic for auth...

    // Redirect to your app's main area
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-brightness-90" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-10 sm:p-14 text-white text-center">

          <div className="flex flex-col items-center mb-10">
            <img src={logo} alt="MoFresh" className="h-10 mb-2 drop-shadow-md" />
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </div>

          <h1 className="text-4xl font-bold mb-2 tracking-tight drop-shadow-lg">
            Welcome Back
          </h1>
          <p className="text-white/80 text-sm mb-10">
            Log in to your account
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                required
                type="email"
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/20 rounded-full py-3.5 pl-12 pr-4 outline-none focus:bg-white/10 focus:border-white/50 transition-all placeholder:text-white/50"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full bg-white/5 border border-white/20 rounded-full py-3.5 pl-12 pr-12 outline-none focus:bg-white/10 focus:border-white/50 transition-all placeholder:text-white/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between px-2 text-xs font-medium text-white/70">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" className="accent-[#4ade80] w-4 h-4 rounded border-none bg-white/10" />
                Remember me
              </label>
              {/* FORGOT PASSWORD LINK */}
              <Link to="/forgot-password" className="hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(74, 222, 128, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-white py-4 rounded-xl font-bold text-lg shadow-lg uppercase tracking-widest"
            >
              Login
            </motion.button>

            <div className="pt-4 text-xs font-medium text-white/60 flex flex-col gap-3">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="text-white hover:underline font-bold">Sign up</Link>
              </p>

              {/* GO BACK HOME LINK */}
              <Link
                to="/"
                className="mt-2 text-white/40 hover:text-white transition-colors uppercase tracking-widest text-[10px]"
              >
                Go back home
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}