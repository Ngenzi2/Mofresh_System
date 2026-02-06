import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import Logo from '@/assets/Logo.png';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#2d6a4f] dark:bg-gray-950 text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            {/* Logo - with better visibility */}
            <Link to="/" className="inline-block mb-4">
              <div className=" rounded-xl shadow-lg inline-block">
                <img 
                  src={Logo} 
                  alt="MoFresh Logo" 
                  className="h-8 w-auto"
                />
              </div>
            </Link>
            <p className="text-gray-300 dark:text-gray-400 text-sm mb-6 leading-relaxed">
              {t('footerDescription')}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded bg-[#2D6A4F] dark:bg-gray-800 flex items-center justify-center hover:bg-[#40916C] dark:hover:bg-gray-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded bg-[#2D6A4F] dark:bg-gray-800 flex items-center justify-center hover:bg-[#40916C] dark:hover:bg-gray-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded bg-[#2D6A4F] dark:bg-gray-800 flex items-center justify-center hover:bg-[#40916C] dark:hover:bg-gray-700 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded bg-[#2D6A4F] dark:bg-gray-800 flex items-center justify-center hover:bg-[#40916C] dark:hover:bg-gray-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold mb-4 text-white">{t('platform')}</h3>
            <ul className="space-y-2.5 text-gray-300 dark:text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t('features')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('marketplace')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('coldStorage')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('logistics')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('pricing')}</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-white">{t('company')}</h3>
            <ul className="space-y-2.5 text-gray-300 dark:text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">{t('aboutUs2')}</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('career')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('partners')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('blog')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('contactUs')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white">{t('contactTitle')}</h3>
            <ul className="space-y-3 text-gray-300 dark:text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{t('address')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{t('phone')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>{t('email')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#2D6A4F] dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300 dark:text-gray-400">
            <p>{t('copyright')}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">{t('privacyPolicy')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('termsOfService')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('cookies')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}