
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useThemeStore, applyTheme } from '../store/themeStore';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';

export function RootLayout() {
  const { theme, setTheme } = useThemeStore();
  const { t, i18n } = useTranslation();

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') applyTheme('system');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">KidsWorld</h1>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={toggleLanguage}>
            {t('toggle_language')}
          </Button>
          <Button variant="outline" onClick={cycleTheme}>
            {t('toggle_theme')} ({theme})
          </Button>
        </div>
      </header>
      
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
