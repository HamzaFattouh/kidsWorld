import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { useParentStore } from '../../store/parentStore';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../lib/api';
import { CalendarCheck, Utensils, Star, AlertTriangle, MessageSquare, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ParentDashboardPage() {
  const { selectedChildId } = useParentStore();
  const { user } = useAuthStore();

  const { data: attendance } = useQuery({
    queryKey: ['parent-dash-att', selectedChildId],
    queryFn: async () => {
      if (!selectedChildId) return [];
      const res = await api.get(`/operations/attendance/${selectedChildId}`);
      return res.data?.data || res.data || [];
    },
    enabled: !!selectedChildId
  });

  const { data: meals } = useQuery({
    queryKey: ['parent-dash-meals', selectedChildId],
    queryFn: async () => {
      if (!selectedChildId) return [];
      const res = await api.get(`/operations/meals/${selectedChildId}`);
      return res.data?.data || res.data || [];
    },
    enabled: !!selectedChildId
  });

  const { data: evaluations } = useQuery({
    queryKey: ['parent-dash-evals', selectedChildId],
    queryFn: async () => {
      if (!selectedChildId) return [];
      const res = await api.get(`/reporting/evaluations/${selectedChildId}`);
      return res.data?.data || res.data || [];
    },
    enabled: !!selectedChildId
  });

  return (
    <div className="space-y-6 text-start">
      <PageHeader
        title={`مرحباً بك، ${user?.name || 'ولي الأمر'}`}
        description="لوحة متابعة الطفل اليومية والأنشطة والتقارير"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">سجلات الحضور</p>
            <h4 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
              {Array.isArray(attendance) ? attendance.length : 0} يوم مسجل
            </h4>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/40">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">الوجبات المتناولة</p>
            <h4 className="text-xl font-bold text-amber-700 dark:text-amber-300">
              {Array.isArray(meals) ? meals.length : 0} وجبة مسجلة
            </h4>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/40">
          <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center shrink-0">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">التقييمات المعتمدة</p>
            <h4 className="text-xl font-bold text-purple-700 dark:text-purple-300">
              {Array.isArray(evaluations) ? evaluations.length : 0} تقييم متاح
            </h4>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-4 bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40">
          <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">حالة الحضانة</p>
            <h4 className="text-xl font-bold text-blue-700 dark:text-blue-300">
              نشط ومباشر 🟢
            </h4>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">روابط سريعة للمتابعة</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link to="/parent/attendance" className="p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-2xl text-center space-y-2 transition-colors">
              <CalendarCheck className="w-6 h-6 text-emerald-600 mx-auto" />
              <p className="text-xs font-bold">الحضور والغياب</p>
            </Link>
            <Link to="/parent/meals" className="p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-2xl text-center space-y-2 transition-colors">
              <Utensils className="w-6 h-6 text-amber-600 mx-auto" />
              <p className="text-xs font-bold">الوجبات</p>
            </Link>
            <Link to="/parent/notes" className="p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-2xl text-center space-y-2 transition-colors">
              <Star className="w-6 h-6 text-purple-600 mx-auto" />
              <p className="text-xs font-bold">الملاحظات الأسبوعية</p>
            </Link>
            <Link to="/parent/evaluations" className="p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-2xl text-center space-y-2 transition-colors">
              <Star className="w-6 h-6 text-blue-600 mx-auto" />
              <p className="text-xs font-bold">التقييمات</p>
            </Link>
            <Link to="/parent/complaints" className="p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-2xl text-center space-y-2 transition-colors">
              <AlertTriangle className="w-6 h-6 text-red-600 mx-auto" />
              <p className="text-xs font-bold">الشكاوى والمقترحات</p>
            </Link>
            <Link to="/parent/requests" className="p-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-2xl text-center space-y-2 transition-colors">
              <MessageSquare className="w-6 h-6 text-indigo-600 mx-auto" />
              <p className="text-xs font-bold">الطلبات والمغادرة</p>
            </Link>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">تنبيهات هامة</h3>
          <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-xl">
              📢 يسعدنا انضمامكم لعالم الأطفال. يرجى اختيار اسم الطفل من أعلى القائمة الجانبية لمتابعة بياناته.
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 rounded-xl">
              ✅ جميع السجلات والتقارير اليومية يتم تحديثها فورياً من قِبل معلمة الفصل.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}