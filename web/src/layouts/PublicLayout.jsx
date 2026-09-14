import { Outlet, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

export function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
  { href: '#about', label: 'من نحن' },
  { href: '#programs', label: 'برامجنا' },
  { href: '#gallery', label: 'المعرض' },
  { href: '#events', label: 'الفعاليات' },
  { href: '#contact', label: 'اتصل بنا' }];


  const scrollTo = (href) => {
    setIsMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark flex flex-col font-sans overflow-x-hidden">
      {/* Navbar */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`
        }>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-3.5 group">
                <div className={`relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-all duration-300 group-hover:scale-105 shrink-0 ${
                  scrolled 
                    ? 'bg-transparent p-0 shadow-none border-0' 
                    : 'bg-white rounded-full p-2.5 shadow-xl border-2 border-white/90'
                }`}>
                  <img 
                    src="/images/logo_icon.png?v=7" 
                    alt="عالم الأطفال" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div className="flex flex-col">
                  <span className={`text-2xl sm:text-3xl font-display font-bold leading-none ${scrolled ? 'text-brand-dark dark:text-white' : 'text-white'}`}>
                    عالم الأطفال
                  </span>
                  <span className={`text-[0.7rem] sm:text-xs font-bold tracking-wider uppercase mt-1 ${scrolled ? 'text-brand-dark/75 dark:text-gray-300' : 'text-white/90'}`}>
                    تعلم والعب
                  </span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
              {navLinks.map((link) =>
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`font-display font-semibold text-sm xl:text-base transition-colors hover:text-brand-yellow whitespace-nowrap ${
                scrolled ? 'text-brand-dark dark:text-gray-200' : 'text-white'}`
                }>
                
                  {link.label}
                </button>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="hidden xl:flex items-center gap-2 me-2">
                <a href="#" className="w-8 h-8 bg-brand-yellow hover:bg-brand-orange text-white rounded flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
                </a>
                <a href="#" className="w-8 h-8 bg-brand-yellow hover:bg-brand-orange text-white rounded flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="w-8 h-8 bg-brand-yellow hover:bg-brand-orange text-white rounded flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33 2.78 2.78 0 001.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33 29 29 0 00-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
              </div>
              {isAuthenticated ?
              <Link to={user?.role === 'ADMIN' ? '/admin' : user?.role === 'TEACHER' ? '/teacher' : '/parent'} className="ms-2">
                  <Button size="sm" className={scrolled ? '' : 'bg-white text-brand-green hover:bg-brand-yellow hover:text-white'}>لوحة التحكم</Button>
                </Link> :

              <Link to="/auth/login" className="ms-2">
                  <Button size="sm" className={scrolled ? '' : 'bg-white text-brand-green hover:bg-brand-yellow hover:text-white'}>تسجيل الدخول</Button>
                </Link>
              }
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 ${scrolled ? 'text-brand-dark dark:text-white' : 'text-white'}`}>
                
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen &&
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800 shadow-xl absolute w-full top-full start-0">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) =>
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="block w-full text-start px-3 py-3 rounded-xl font-display font-medium text-brand-dark hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-slate-800">
              
                  {link.label}
                </button>
            )}
              <div className="flex gap-4 px-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <a href="#" className="w-10 h-10 bg-brand-yellow text-white rounded-xl flex items-center justify-center"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg></a>
                <a href="#" className="w-10 h-10 bg-brand-yellow text-white rounded-xl flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                <a href="#" className="w-10 h-10 bg-brand-yellow text-white rounded-xl flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33 2.78 2.78 0 001.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.33 29 29 0 00-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
              </div>
              <div className="px-3 pt-4">
                {isAuthenticated ?
              <Link to={user?.role === 'ADMIN' ? '/admin' : user?.role === 'TEACHER' ? '/teacher' : '/parent'}>
                    <Button className="w-full">لوحة التحكم</Button>
                  </Link> :

              <Link to="/auth/login">
                    <Button className="w-full">تسجيل الدخول</Button>
                  </Link>
              }
              </div>
            </div>
          </div>
        }
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full p-2.5 shadow-lg flex items-center justify-center overflow-hidden border-2 border-brand-green/20 shrink-0">
                <img src="/images/logo_icon.png?v=6" alt="عالم الأطفال" className="w-full h-full object-contain" />
              </div>
              <div className="text-3xl font-display font-bold">عالم الأطفال</div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              في عالم الأطفال، نضع دائماً جودة التعليم ورعاية الأطفال في المقام الأول، لذا يرجى الاطمئنان عند اختيار روضتنا.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold text-xl mb-6">روابط سريعة</h4>
            <ul className="space-y-3 text-gray-400">
              {navLinks.map((link) =>
              <li key={link.href}>
                  <button onClick={() => scrollTo(link.href)} className="hover:text-brand-yellow transition-colors">
                    {link.label}
                  </button>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-xl mb-6">معلومات الاتصال</h4>
            <ul className="space-y-3 text-gray-400" dir="ltr">
              <li className="text-end">123 Education Lane</li>
              <li className="text-end">New York, NY 10001</li>
              <li className="text-end">hello@kidtime.com</li>
              <li className="text-end">+1 (555) 123-4567</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-xl mb-6">النشرة البريدية</h4>
            <p className="text-gray-400 text-sm mb-4">اشترك للحصول على آخر الأخبار والتحديثات.</p>
            <div className="flex">
              <input type="email" placeholder="بريدك الإلكتروني" className="px-4 py-2 w-full rounded-s-md text-brand-dark outline-none focus:ring-2 focus:ring-brand-yellow" />
              <button className="bg-brand-yellow px-4 py-2 rounded-e-md text-white font-bold hover:bg-brand-orange transition-colors">اشترك</button>
            </div>
          </div>
        </div>
      </footer>
    </div>);

}