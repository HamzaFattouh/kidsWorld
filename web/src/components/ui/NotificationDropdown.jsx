import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'تسجيل حضور وغياب',
      message: 'قامت المعلمة سارة بتسجيل حضور الصف الأول: 15 حاضر، 2 غائب',
      time: 'منذ 5 دقائق',
      isRead: false,
      link: '/admin/attendance'
    },
    {
      id: 2,
      title: 'تحديث في الموقع',
      message: 'تم تحديث الصفحة الرئيسية بنجاح',
      time: 'منذ ساعتين',
      isRead: true,
      link: '/admin/homepage'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    setNotifications(notifications.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
    setIsOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Bell className="h-5 w-5 text-text dark:text-text-dark" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 rounded-md border border-gray-200 bg-surface dark:border-gray-800 dark:bg-surface-dark z-50">
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-text dark:text-text-dark">
              الإشعارات
            </h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">
                تحديد الكل كمقروء
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "cursor-pointer border-b border-gray-100 p-4 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50",
                    !notification.isRead && "bg-primary/5 dark:bg-primary/10"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-medium text-text dark:text-text-dark">
                      {notification.title}
                    </h4>
                    <span className="text-xs text-text-muted dark:text-text-mutedDark">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted dark:text-text-mutedDark mt-1">
                    {notification.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-text-muted dark:text-text-mutedDark">
                لا توجد إشعارات
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
