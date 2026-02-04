import { ShoppingCart, Globe } from 'lucide-react';
import logo from '@/assets/Logo.png';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <a href="#/">
              <img src={logo} alt="MoFresh" className="h-10" />
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#/" className="text-gray-700 hover:text-gray-900">
              Home
            </a>
            <a href="#/about" className="text-gray-700 hover:text-gray-900">
              About us
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              How it works
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Contact us
            </a>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-1 text-gray-700">
              <Globe className="w-4 h-4" />
              <span className="text-sm">Eng</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="bg-[#1B4332] text-white px-6 py-2 rounded-md hover:bg-[#0f2419]">
              log in
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}