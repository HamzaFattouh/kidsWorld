import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Sparkles,
  Cake,
  Flag,
  BookOpen
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export function TeacherCalendarPage() {
  const { t } = useTranslation();

  const [events, setEvents] = useState([
    {
      id: 'ev1',
      title: 'اجتماع الكادر التعليمي الأسبوعي',
      date: '2026-09-17',
      time: '02:30 م - 03:30 م',
      location: 'قاعة الاجتماعات الرئيسية',
      type: 'MEETING',
      icon: Users,
      badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
    },
    {
      id: 'ev2',
      title: 'فعالية يوم الشجرة والزراعة المدرسية',
      date: '2026-09-20',
      time: '09:30 ص - 11:30 ص',
      location: 'الحديقة الخارجية للحضانة',
      type: 'ACTIVITY',
      icon: Sparkles,
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
    },
    {
      id: 'ev3',
      title: 'عيد ميلاد الطالب: عمر أحمد الشكعة',
      date: '2026-09-24',
      time: '11:00 ص',
      location: 'قاعة روضة العصافير',
      type: 'BIRTHDAY',
      icon: Cake,
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
    },
    {
      id: 'ev4',
      title: 'عطلة المولد النبوي الشريف',
      date: '2026-09-27',
      time: 'طوال اليوم',
      location: 'عطلة رسمية',
      type: 'HOLIDAY',
      icon: Flag,
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
    }
  ]);

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="التقويم والفعاليات المدرسية"
        description="عرض جدول الاجتماعات، الفعاليات الصفية، والعطلات الرسمية ومناسبات الطلاب"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Timeline */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-primary" />
            المواعيد القادمة لشهر سبتمبر 2026
          </h3>

          {events.map((ev) => {
            const Icon = ev.icon;
            return (
              <Card key={ev.id} className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center shrink-0 border border-gray-200 dark:border-gray-700">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">سبت</span>
                      <span className="text-base font-bold text-primary">{ev.date.split('-')[2]}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{ev.title}</h4>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${ev.badge}`}>
                          {ev.type === 'MEETING' ? 'اجتماع' : ev.type === 'ACTIVITY' ? 'نشاط' : ev.type === 'BIRTHDAY' ? 'عيد ميلاد' : 'عطلة'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted dark:text-text-mutedDark mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" /> {ev.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" /> {ev.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Calendar Side Info Card */}
        <div className="space-y-4">
          <Card className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-sm font-bold text-gray-900 dark:text-white">
                تذكيرات مهمة للمعلمات
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-xs space-y-3 text-gray-600 dark:text-gray-300">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900/30">
                <span className="font-bold text-purple-800 dark:text-purple-300 block mb-1">تسليم كشوفات الحضور:</span>
                يرجى تدقيق واعتماد الحضور اليومي على النظام قبل الساعة 10:00 صباحاً.
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <span className="font-bold text-blue-800 dark:text-blue-300 block mb-1">التقارير الأسبوعية:</span>
                آخر موعد لاعتماد التقارير الأسبوعية هو نهاية دوام كل يوم خميس.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
