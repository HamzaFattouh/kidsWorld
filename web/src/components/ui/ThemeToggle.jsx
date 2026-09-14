import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { Button } from './Button';

export function ThemeToggle({ variant = 'ghost', size = 'sm', className = '' }) {
  const { theme, setTheme } = useThemeStore();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getIcon = () => {
    if (theme === 'light') return <Sun className="w-5 h-5 text-amber-500" />;
    if (theme === 'dark') return <Moon className="w-5 h-5 text-indigo-400" />;
    return <Monitor className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
  };

  const getTitle = () => {
    if (theme === 'light') return 'مظهر فاتح (اضغط للتغيير إلى الداكن)';
    if (theme === 'dark') return 'مظهر داكن (اضغط للتغيير إلى النظام)';
    return 'مظهر النظام (اضغط للتغيير إلى الفاتح)';
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={cycleTheme} 
      className={`p-2 rounded-full ${className}`}
      title={getTitle()}
      aria-label="تغيير المظهر"
    >
      {getIcon()}
    </Button>
  );
}
