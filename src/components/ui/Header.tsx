import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Globe, ChevronDown, Sun, Moon, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from './ThemeProvider';
import { Link, useLocation } from 'react-router';
import Logo from '@/assets/Logo.png';
import { useAppSelector } from '@/store/hooks';
import { Sheet, SheetContent, SheetTrigger } from './sheet';
import { motion, AnimatePresence } from 'motion/react';

type Language = 'en' | 'fr' | 'rw';

const languageLabels = {
  en: 'Eng',
  fr: 'Fra',
  rw: 'Kin',
};

export function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  // Scroll effect for "Sticky Premium" feel
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    i18n.changeLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  const currentLanguage = i18n.language as Language;

  // Helper to handle hash links if user is on a different page (like /about)
  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/${id}`;
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 py-2"
          : "bg-white dark:bg-gray-900 py-4 lg:py-6"
        }`}
    >
      <div className="w-full max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex items-center justify-between h-12 lg:h-14">

          {/* Left: Logo + mobile menu */}
          <div className="flex items-center gap-4">
            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-white dark:bg-gray-900 p-6">
                  <nav className="flex flex-col gap-6 mt-10">
                    <Link to="/" className="text-2xl font-black text-gray-900 dark:text-white">{t('home')}</Link>
                    <Link to="/about" className="text-2xl font-black text-gray-900 dark:text-white">{t('about')}</Link>
                    <a href="#how-it-works" className="text-2xl font-black text-gray-900 dark:text-white">{t('howItWorks')}</a>
                    <Link to="/contact" className="text-2xl font-black text-gray-900 dark:text-white">{t('contact')}</Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            <Link to="/" className="flex items-center group">
              <img
                src={Logo}
                alt="MoFresh Logo"
                className="h-8 lg:h-10 w-auto group-hover:scale-105 transition-transform"
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="nav-link">{t('home')}</Link>
            <Link to="/about" className="nav-link">{t('about')}</Link>
            {/* Direct Anchor for HeroSection ID */}
            <a
              href="#how-it-works"
              onClick={() => scrollToSection('#how-it-works')}
              className="nav-link"
            >
              {t('howItWorks')}
            </a>
            <Link to="/contact" className="nav-link">{t('contact')}</Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#9be15d]/20 hover:text-[#2d6a4f] transition-all"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#9be15d]/20 hover:text-[#2d6a4f] transition-all"
            >
              <ShoppingCart size={20} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 min-w-[20px] h-[20px] rounded-full bg-[#9be15d] text-[11px] font-black text-[#2d6a4f] flex items-center justify-center shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Language Selector */}
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-bold text-sm"
              >
                <Globe size={16} />
                {languageLabels[currentLanguage] || 'Eng'}
                <ChevronDown size={14} className={`transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden p-1 z-50">
                  {(['en', 'fr', 'rw'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`w-full px-4 py-2 text-left text-sm rounded-xl transition-colors ${currentLanguage === lang ? 'bg-[#9be15d] text-[#2d6a4f] font-bold' : 'hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white'
                        }`}
                    >
                      {lang === 'en' ? 'English' : lang === 'fr' ? 'Français' : 'Kinyarwanda'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login Button */}
            <Link
              to="/login"
              className="hidden md:inline-flex bg-[#2d6a4f] text-[#9be15d] px-6 py-2.5 rounded-xl hover:bg-[#23553e] font-black transition-all shadow-lg shadow-green-900/10 active:scale-95"
            >
              {t('login')}
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .nav-link {
          @apply text-gray-600 dark:text-gray-400 font-bold hover:text-[#2d6a4f] dark:hover:text-[#9be15d] transition-colors relative py-2;
        }
        .nav-link::after {
          content: '';
          @apply absolute bottom-0 left-0 w-0 h-0.5 bg-[#9be15d] transition-all duration-300;
        }
        .nav-link:hover::after {
          @apply w-full;
        }
      `}</style>
    </header>
  );
}