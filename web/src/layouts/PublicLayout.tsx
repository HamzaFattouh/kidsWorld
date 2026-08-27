import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../store/themeStore';
import { Button } from '../components/ui/Button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';


export function PublicLayout() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  
  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const navLinks = [
    { href: '#about', label: t('public.nav.about', 'About Us') },
    { href: '#activities', label: t('public.nav.activities', 'Activities') },
    { href: '#gallery', label: t('public.nav.gallery', 'Gallery') },
    { href: '#events', label: t('public.nav.events', 'Events') },
    { href: '#contact', label: t('public.nav.contact', 'Contact') },
  ];

  const scrollTo = (href: string) => {
    setIsMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark flex flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-surface/90 dark:bg-surface-dark/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                KidsWorld
              </Link>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <button 
                  key={link.href} 
                  onClick={() => scrollTo(link.href)}
                  className="text-sm font-medium text-text-muted hover:text-primary dark:text-text-mutedDark dark:hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={toggleLanguage}>
                {t('toggle_language', 'عربي/EN')}
              </Button>
              <Button variant="ghost" size="sm" onClick={cycleTheme}>
                {theme}
              </Button>
              <Link to="/auth/login">
                <Button size="sm">{t('public.login', 'Login')}</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden gap-2">
              <Button variant="ghost" size="sm" onClick={toggleLanguage}>
                {i18n.language === 'en' ? 'عربي' : 'EN'}
              </Button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-text dark:text-text-dark"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 absolute w-full">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map(link => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-start px-3 py-2 rounded-md text-base font-medium text-text hover:bg-gray-50 dark:text-text-dark dark:hover:bg-gray-800"
                >
                  {link.label}
                </button>
              ))}
              <div className="px-3 py-2 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 mt-2">
                <Button variant="ghost" size="sm" onClick={cycleTheme}>
                  Theme: {theme}
                </Button>
                <Link to="/auth/login">
                  <Button size="sm" className="w-full">{t('public.login', 'Login')}</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">KidsWorld</h3>
            <p className="text-sm text-text-muted dark:text-text-mutedDark">
              Nurturing young minds in a safe, creative, and joyful environment.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-text dark:text-text-dark mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-text-muted dark:text-text-mutedDark">
              {navLinks.map(link => (
                <li key={link.href}>
                  <button onClick={() => scrollTo(link.href)} className="hover:text-primary transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text dark:text-text-dark mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-text-muted dark:text-text-mutedDark">
              <li>123 Education Lane</li>
              <li>Learning City, LC 12345</li>
              <li>info@kidsworld.example.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text dark:text-text-dark mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">F</a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">T</a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">I</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-text-muted dark:text-text-mutedDark">
          © {new Date().getFullYear()} KidsWorld Nursery. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
