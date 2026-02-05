import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Globe, ChevronDown } from 'lucide-react';
import logo from '@/assets/Logo.png';

type Language = 'en' | 'fr' | 'rw';

interface Translations {
  en: {
    home: string;
    about: string;
    howItWorks: string;
    contact: string;
    login: string;
  };
  fr: {
    home: string;
    about: string;
    howItWorks: string;
    contact: string;
    login: string;
  };
  rw: {
    home: string;
    about: string;
    howItWorks: string;
    contact: string;
    login: string;
  };
}

const translations: Translations = {
  en: {
    home: 'Home',
    about: 'About us',
    howItWorks: 'How it works',
    contact: 'Contact us',
    login: 'log in',
  },
  fr: {
    home: 'Accueil',
    about: 'À propos',
    howItWorks: 'Comment ça marche',
    contact: 'Contactez-nous',
    login: 'se connecter',
  },
  rw: {
    home: 'Ahabanza',
    about: 'Kuri twe',
    howItWorks: 'Imikorere',
    contact: 'Twandikire',
    login: 'injira',
  },
};

const languageLabels = {
  en: 'Eng',
  fr: 'Fra',
  rw: 'Kin',
};

export function Header() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const t = translations[currentLanguage];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1728px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#/" className="flex items-center">
              <img src={logo} alt="MoFresh" className="h-10 lg:h-12 w-auto" />
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <a
              href="#/"
              className="text-gray-700 hover:text-[#1B4332] font-medium transition-colors"
            >
              {t.home}
            </a>
            <a
              href="#/about"
              className="text-gray-700 hover:text-[#1B4332] font-medium transition-colors"
            >
              {t.about}
            </a>
            <a
              href="#/how-it-works"
              className="text-gray-700 hover:text-[#1B4332] font-medium transition-colors"
            >
              {t.howItWorks}
            </a>
            <a
              href="#/contact"
              className="text-gray-700 hover:text-[#1B4332] font-medium transition-colors"
            >
              {t.contact}
            </a>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Shopping Cart */}
            <button className="p-2 text-gray-700 hover:text-[#1B4332] transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </button>

            {/* Language Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">{languageLabels[currentLanguage]}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isLanguageDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors ${
                      currentLanguage === 'en' ? 'bg-gray-100 font-semibold' : ''
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('fr')}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors ${
                      currentLanguage === 'fr' ? 'bg-gray-100 font-semibold' : ''
                    }`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => handleLanguageChange('rw')}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors ${
                      currentLanguage === 'rw' ? 'bg-gray-100 font-semibold' : ''
                    }`}
                  >
                    Kinyarwanda
                  </button>
                </div>
              )}
            </div>

            {/* Login Button */}
            <button className="bg-[#1B4332] text-white px-5 lg:px-6 py-2 lg:py-2.5 rounded-lg hover:bg-[#0f2419] font-medium transition-colors">
              {t.login}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}