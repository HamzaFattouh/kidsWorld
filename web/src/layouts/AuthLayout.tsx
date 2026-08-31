
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { useThemeStore } from '../store/themeStore';

export function AuthLayout() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useThemeStore();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background-dark">
      <header className="p-6 flex justify-between items-center max-w-7xl w-full mx-auto">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-white rounded-full p-1 shadow-md">
            <img src="/images/logo.jpg" alt="عالم الأطفال" className="w-full h-full object-contain rounded-full" />
          </div>
          <h1 className="text-2xl font-bold text-brand-green">عالم الأطفال</h1>
        </Link>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={toggleLanguage}>
            {t('toggle_language')}
          </Button>
          <Button variant="outline" onClick={cycleTheme}>
            {t('toggle_theme')}
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
