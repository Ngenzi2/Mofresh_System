import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import Logo from '@/assets/Logo.png';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#2d6a4f] dark:bg-gray-950 text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 text-center sm:text-left">
          {/* Logo and Description */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1 flex flex-col items-center sm:items-start">
            {/* Logo - with better visibility */}
            <Link to="/" className="inline-block mb-4">
              <div className="rounded-xl inline-block">
                <img
                  src={Logo}
                  alt="MoFresh Logo"
                  className="h-8 w-auto"
                />
              </div>
            </Link>
            <p className="text-gray-300 dark:text-gray-400 text-sm mb-6 leading-relaxed max-w-sm">
              {t('footerDescription')}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-[#2D6A4F] dark:bg-gray-800 flex items-center justify-center hover:bg-[#40916C] dark:hover:bg-gray-700 transition-colors border border-white/10">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[#2D6A4F] dark:bg-gray-800 flex items-center justify-center hover:bg-[#40916C] dark:hover:bg-gray-700 transition-colors border border-white/10">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[#2D6A4F] dark:bg-gray-800 flex items-center justify-center hover:bg-[#40916C] dark:hover:bg-gray-700 transition-colors border border-white/10">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-[#2D6A4F] dark:bg-gray-800 flex items-center justify-center hover:bg-[#40916C] dark:hover:bg-gray-700 transition-colors border border-white/10">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white">{t('platform')}</h3>
            <ul className="space-y-3 text-gray-300 dark:text-gray-400 text-sm">
              <li><a href="#" className="hover:text-[#9be15d] transition-colors">{t('features')}</a></li>
              <li><a href="#" className="hover:text-[#9be15d] transition-colors">{t('marketplace')}</a></li>
              <li><a href="#" className="hover:text-[#9be15d] transition-colors">{t('coldStorage')}</a></li>
              <li><a href="#" className="hover:text-[#9be15d] transition-colors">{t('logistics')}</a></li>
              <li><a href="#" className="hover:text-[#9be15d] transition-colors">{t('pricing')}</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white">{t('company')}</h3>
            <ul className="space-y-3 text-gray-300 dark:text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-[#9be15d] transition-colors">{t('aboutUs2')}</Link></li>
              <li><a href="#" className="hover:text-[#9be15d] transition-colors">{t('career')}</a></li>
              <li><a href="#" className="hover:text-[#9be15d] transition-colors">{t('partners')}</a></li>
              <li><a href="#" className="hover:text-[#9be15d] transition-colors">{t('blog')}</a></li>
              <li><a href="#" className="hover:text-[#9be15d] transition-colors">{t('contactUs')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white">{t('contactTitle')}</h3>
            <ul className="space-y-4 text-gray-300 dark:text-gray-400 text-sm">
              <li className="flex items-start gap-3 justify-center sm:justify-start">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[#9be15d]" />
                <span className="leading-tight">{t('address')}</span>
              </li>
              <li className="flex items-center gap-3 justify-center sm:justify-start">
                <Phone className="w-5 h-5 flex-shrink-0 text-[#9be15d]" />
                <span>{t('phone')}</span>
              </li>
              <li className="flex items-center gap-3 justify-center sm:justify-start">
                <Mail className="w-5 h-5 flex-shrink-0 text-[#9be15d]" />
                <span className="break-all">{t('email')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-400">
            <p className="font-medium">{t('copyright')}</p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              <a href="#" className="hover:text-[#9be15d] transition-colors">{t('privacyPolicy')}</a>
              <a href="#" className="hover:text-[#9be15d] transition-colors">{t('termsOfService')}</a>
              <a href="#" className="hover:text-[#9be15d] transition-colors">{t('cookies')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}