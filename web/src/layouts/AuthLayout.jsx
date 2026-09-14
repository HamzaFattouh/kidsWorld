import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export function AuthLayout() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-background-dark">
      <header className="p-4 sm:p-6 flex justify-between items-center max-w-7xl w-full mx-auto">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img src="/images/logo_icon.png?v=6" alt="عالم الأطفال" className="h-20 w-auto object-contain" />
          <h1 className="text-3xl font-display font-bold text-brand-green">عالم الأطفال</h1>
        </Link>
        <div className="flex gap-4 items-center">
          <ThemeToggle variant="outline" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}