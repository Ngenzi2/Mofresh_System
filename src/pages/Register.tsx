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

// Assets
import heroImage from "@/assets/register.png";
import logo from "@/assets/Logo.png";

export default function Register() {
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
      toast.error("Passwords do not match");
      return;
    }

    if (!acceptTerms) {
      toast.error("Please accept terms");
      return;
    }

    const result = await dispatch(
      registerUser({ fullName, phone, email, password }),
    );

    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created successfully!");
      setTimeout(() => navigate("/verify-otp"), 1000);
    } else {
      toast.error("Registration failed", {
        description: (result.payload as string) || "Please try again",
      });
    }
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
      {/* Background Polish */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-xl"
      >
        {/* THE BALANCED GLASS CARD */}
        <div className="bg-white/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="p-8 sm:p-12">

            {/* Header / Logo */}
            <div className="flex flex-col items-center mb-8">
              <img src={logo} alt="MoFresh" className="h-10 mb-4" />
              <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
              <div className="h-1 w-8 bg-green-500 rounded-full mt-2" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-green-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 outline-none focus:bg-white/10 focus:border-white/30 text-white transition-all placeholder:text-white/30"
                    required
                  />
                </div>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-green-400" />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 outline-none focus:bg-white/10 focus:border-white/30 text-white transition-all placeholder:text-white/30"
                    required
                  />
                </div>
              </div>

              {/* Email Row */}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-green-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 outline-none focus:bg-white/10 focus:border-white/30 text-white transition-all placeholder:text-white/30"
                  required
                />
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-green-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-10 outline-none focus:bg-white/10 focus:border-white/30 text-white transition-all placeholder:text-white/30"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-green-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-10 outline-none focus:bg-white/10 focus:border-white/30 text-white transition-all placeholder:text-white/30"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-center gap-3 py-2">
                <label className="relative flex items-center cursor-pointer">
                  <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="sr-only peer" />
                  <div className="w-5 h-5 border border-white/20 rounded-md peer-checked:bg-green-500 peer-checked:border-green-500 transition-all flex items-center justify-center">
                    <AnimatePresence>{acceptTerms && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <CheckCircle2 size={12} className="text-white" />
                      </motion.div>
                    )}</AnimatePresence>
                  </div>
                </label>
                <span className="text-xs text-white/40 leading-none">
                  I agree to the <Link to="/terms" className="text-white hover:underline">Terms</Link> & <Link to="/privacy" className="text-white hover:underline">Privacy</Link>
                </span>
              </div>

              {/* Action Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
              </motion.button>
            </form>

            {/* Bottom Links */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center flex flex-col gap-4">
              <p className="text-sm text-white/40">
                Already have an account? <Link to="/login" className="text-white font-bold hover:text-green-400">Sign In</Link>
              </p>
              <Link to="/" className="text-[10px] text-white/20 hover:text-white uppercase tracking-[0.4em] transition-all">
                Go back home
              </Link>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}