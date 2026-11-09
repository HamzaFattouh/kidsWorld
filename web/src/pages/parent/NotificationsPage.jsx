import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  CalendarCheck,
  Utensils,
  FileText,
  Megaphone,
  Clock,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function ParentNotificationsPage() {
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'تم تسجيل حضور طفلك بنجاح',
      body: 'تم تسجيل وصول عمر إلى قاعة روضة العصافير في تمام الساعة 08:10 صباحاً.',
      time: 'منذ ساعتين',
      read: false,
      icon: CalendarCheck,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30'
    },
    {
      id: 'n2',
      title: 'تحديث وجبة الغداء',
      body: 'تناول عمر وجبة الغداء كاملة اليوم وشارك زملاءه بنشاط.',
      time: 'منذ 4 ساعات',
      read: false,
      icon: Utensils,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30'
    },
    {
      id: 'n3',
      title: 'التقرير الأسبوعي متاح الآن',
      body: 'قامت المعلمة نورة برفع تقرير الملاحظات الأسبوعي لطفلك. انقر للاطلاع عليه.',
      time: 'أمس',
      read: true,
      icon: FileText,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30'
    },
    {
      id: 'n4',
      title: 'إعلان الحضانة: عطلة المولد النبوي الشريف',
      body: 'تعلن الحضانة عن موعد العطلة الرسمية القادمة يوم الأحد 27 سبتمبر.',
      time: 'منذ يومين',
      read: true,
      icon: Megaphone,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PageHeader
          title="تنبيهات وإشعارات الطفل"
          description="متابعة فورية للحضور والوجبات والتقارير الأسبوعية وإعلانات الحضانة"
        />
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-3.5 py-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary hover:text-white rounded-lg transition-colors self-start sm:self-auto"
          >
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
            <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
              <Bell className="w-10 h-10 mx-auto text-gray-400 mb-2" />
              لا توجد إشعارات جديدة حالياً
            </CardContent>
          </Card>
        ) : (
          notifications.map((n) => {
            const Icon = n.icon;
            return (
              <Card
                key={n.id}
                className={`border transition-colors bg-surface dark:bg-surface-dark ${
                  !n.read ? 'border-primary/40 bg-primary/5' : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">{n.title}</h4>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs text-text-muted dark:text-text-mutedDark mt-0.5">{n.body}</p>
                      <span className="text-[11px] text-gray-400 mt-1 block flex items-center gap-1">
                        <Clock className="w-3 h-3 inline" /> {n.time}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="p-2 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
