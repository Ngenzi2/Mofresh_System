import React from 'react';
import { motion } from 'framer-motion';
import logo from '@/assets/Logo.png';
import heroImage from '@/assets/login.png'; // Using existing login asset as background

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  sideTitle: string;
  sideSubtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  sideTitle,
  sideSubtitle,
}) => {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 lg:p-8 relative overflow-hidden font-sans"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row min-h-[600px]"
      >
        {/* Left Side - Hero Panel */}
        <div className="lg:w-[45%] bg-gradient-to-br from-[#1a4d2e] via-[#2d6a4f] to-[#1a4d2e] p-12 text-white flex flex-col justify-center relative overflow-hidden">
          {/* Abstract Decorations (Circles) */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#9be15d]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
            <div className="absolute bottom-20 right-10 w-48 h-48 border border-white rounded-full" />
            <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-white rounded-full" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative z-10 space-y-6"
          >
            <h2 className="text-5xl font-black leading-tight tracking-tight uppercase">
              {sideTitle}
            </h2>
            <p className="text-lg text-white/80 leading-relaxed max-w-xs">
              {sideSubtitle}
            </p>
          </motion.div>
        </div>

        {/* Right Side - Form Panel */}
        <div className="lg:w-[55%] bg-white p-8 sm:p-12 lg:p-16 flex flex-col items-center justify-center relative">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img src={logo} alt="MoFresh" className="h-10 lg:h-12 object-contain" />
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-500">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
