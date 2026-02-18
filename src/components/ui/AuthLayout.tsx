import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '@/assets/Logo.png';
import Home from '@/pages/Home'; // Assuming this is your landing page component

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  sideTitle?: React.ReactNode;
  sideDescription?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  sideTitle = <>WELCOME <br /> BACK</>,
  sideDescription = "Sign in to access your dashboard and manage your business."
}) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans bg-white dark:bg-black transition-colors duration-300">

      {/* 1. BACKGROUND LAYER - The Home Page blurred */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="opacity-40 blur-[10px] scale-105 brightness-90">
          <Home />
        </div>
        {/* Dark mode overlay for better integration */}
        <div className="absolute inset-0 bg-black/20 dark:bg-black/60 mix-blend-overlay" />
      </div>

      {/* 2. OVERLAY LAYER - Darkens the background for readability */}
      <div className="fixed inset-0 z-10 bg-black/40 backdrop-blur-[2px] transition-all duration-500" />

      {/* 3. CONTENT LAYER - The Auth Modal */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col lg:flex-row min-h-[700px] border border-transparent dark:border-gray-800 transition-colors duration-300"
        >
          {/* LEFT PANEL - Green Branding */}
          <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#2E8B2E] to-[#1a5c1a] relative p-16 flex-col justify-center text-white overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-black/10 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

            {/* Circles from design */}
            <div className="absolute top-12 left-12 w-32 h-32 rounded-full border-[3px] border-white/10" />
            <div className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full bg-white/5" />

            <div className="relative z-10">
              <h1 className="text-[56px] font-black leading-[0.95] tracking-tighter mb-8 uppercase drop-shadow-sm">
                {sideTitle}
              </h1>
              <p className="text-lg text-white/90 max-w-xs font-normal leading-relaxed">
                {sideDescription}
              </p>
            </div>
          </div>

          {/* RIGHT PANEL - Form */}
          <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Logo Section */}
            <div className="mb-10 text-center">
              <div className="inline-block p-2 mb-4 rounded-xl bg-gray-50 dark:bg-white/5">
                <img src={logo} alt="MoFresh" className="h-12 w-auto mx-auto" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight transition-colors duration-300">{title}</h2>
              <p className="text-gray-400 dark:text-gray-500 text-sm font-bold uppercase tracking-widest">{subtitle}</p>
            </div>

            {/* Form Content */}
            <div className="w-full max-w-md">
              {children}
            </div>

            {/* Footer Navigation */}
            <div className="mt-12 w-full text-center">
              <Link
                to="/"
                className="text-gray-400 dark:text-gray-600 text-[10px] font-black tracking-[0.3em] uppercase hover:text-[#2E8B2E] dark:hover:text-[#2E8B2E] transition-colors border-t border-gray-100 dark:border-gray-800 pt-6 block"
              >
                Go Back Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};