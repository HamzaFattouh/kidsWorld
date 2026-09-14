import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import {
  LayoutDashboard, Baby, CalendarCheck, Utensils,
  Gamepad2, FileText, Star, AlertTriangle,
  MessageSquare, Bell, Calendar, LogOut, Menu, X } from
'lucide-react';

export function TeacherLayout() {
  const { t, i18n } = useTranslation();
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');

  const handleLogout = () => {
    clearAuth();
    navigate('/auth/login');
  };

  const navGroups = [
  {
    title: t('nav.overview', 'Overview'),
    items: [
    { href: '/teacher', label: t('nav.dashboard', 'Dashboard'), icon: LayoutDashboard }]

  },
  {
    title: t('nav.classroom', 'Classroom'),
    items: [
    { href: '/teacher/children', label: t('nav.my_children', 'My Children'), icon: Baby },
    { href: '/teacher/attendance', label: t('nav.attendance', 'Attendance'), icon: CalendarCheck },
    { href: '/teacher/meals', label: t('nav.meals', 'Meals'), icon: Utensils },
    { href: '/teacher/activities', label: t('nav.activities', 'Daily Activities'), icon: Gamepad2 }]

  },
  {
    title: t('nav.reports', 'Reports'),
    items: [
    { href: '/teacher/notes', label: t('nav.notes', 'Weekly Notes'), icon: FileText },
    { href: '/teacher/evaluations', label: t('nav.evaluations', 'Evaluations'), icon: Star },
    { href: '/teacher/incidents', label: t('nav.incidents', 'Incidents'), icon: AlertTriangle }]

  },
  {
    title: t('nav.communication', 'Communication'),
    items: [
    { href: '/teacher/complaints', label: t('nav.complaints', 'Complaints'), icon: AlertTriangle },
    { href: '/teacher/messages', label: t('nav.messages', 'Messages'), icon: MessageSquare },
    { href: '/teacher/notifications', label: t('nav.notifications', 'Notifications'), icon: Bell },
    { href: '/teacher/calendar', label: t('nav.calendar', 'Calendar'), icon: Calendar }]

  }];


  const SidebarContent = () =>
  <div className="h-full flex flex-col overflow-y-auto bg-surface dark:bg-surface-dark border-e border-gray-200 dark:border-gray-800">
      <Link to="/" className="p-6 flex flex-col items-center gap-3 hover:opacity-80 transition-opacity">
        <img src="/images/logo_icon.png?v=6" alt="عالم الأطفال" className="h-32 w-auto object-contain" />
        <h1 className="text-xl font-bold text-brand-green">عالم الأطفال - المعلم</h1>
      </Link>
      <div className="flex-1 px-4 space-y-6 pb-20">
        {navGroups.map((group, idx) =>
      <div key={idx}>
            <h3 className="px-2 mb-2 text-xs font-semibold text-text-muted dark:text-text-mutedDark uppercase tracking-wider">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) =>
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/teacher'}
            onClick={() => setIsMobileOpen(false)}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors font-medium",
              isActive ?
              "bg-primary/10 text-primary dark:bg-primary/20" :
              "text-text dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800"
            )}>
            
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
          )}
            </div>
          </div>
      )}
      </div>
    </div>;


  return (
    <div className="min-h-screen bg-background dark:bg-background-dark flex flex-col md:flex-row">
      <div className="md:hidden flex items-center justify-between p-4 bg-surface dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-white rounded-full p-1 shadow-sm">
            <img src="/images/logo_icon.png" alt="عالم الأطفال" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-lg font-bold text-brand-green">عالم الأطفال - المعلم</h1>
        </Link>
        <button onClick={() => setIsMobileOpen(true)} className="p-2">
          <Menu className="h-6 w-6 text-text dark:text-text-dark" />
        </button>
      </div>

      {isMobileOpen &&
      <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="relative w-64 max-w-xs flex-1 bg-surface dark:bg-surface-dark h-full overflow-y-auto">
            <button onClick={() => setIsMobileOpen(false)} className="absolute top-4 end-4 p-2">
              <X className="h-6 w-6 text-text dark:text-text-dark" />
            </button>
            <SidebarContent />
          </div>
        </div>
      }

      <div className="hidden md:block w-64 lg:w-72 shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </div>

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="sticky top-0 z-10 bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex-1" />
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" onClick={toggleLanguage}>
              {t('toggle_language')}
            </Button>
            <ThemeToggle />
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
            <span className="text-sm font-medium text-text dark:text-text-dark hidden sm:inline-block">
              {user?.name || user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 sm:me-2" />
              <span className="hidden sm:inline">{t('logout')}</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>);

}