import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  Utensils,
  FileText,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ClipboardList,
  Sparkles,
  Baby
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useAuthStore } from '../../store/authStore';

export function TeacherDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const teacherName = user?.name || 'أ. نورة النابلسي';
  const assignedClass = { id: 'class-birds-3-4', name: 'روضة العصافير (3 - 4 سنوات)' };

  // Classroom quick roster
  const [students, setStudents] = useState([
    { id: '1', name: 'عمر أحمد الشكعة', present: true, mealLogged: true, noteWritten: true },
    { id: '2', name: 'يوسف خالد جودت', present: true, mealLogged: true, noteWritten: false },
    { id: '3', name: 'خليل سمير النابلسي', present: true, mealLogged: false, noteWritten: true },
    { id: '4', name: 'سارة مريم المصري', present: false, mealLogged: false, noteWritten: false },
    { id: '5', name: 'ليان أحمد الشكعة', present: true, mealLogged: false, noteWritten: false },
  ]);

  const presentCount = students.filter(s => s.present).length;
  const mealCount = students.filter(s => s.mealLogged).length;
  const noteCount = students.filter(s => s.noteWritten).length;

  const toggleAttendance = (id) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, present: !s.present } : s));
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title={`مرحباً بك، ${teacherName}`}
        description={`لوحة تحكم المعلم - الصف المسؤول: ${assignedClass.name}`}
      />

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-muted dark:text-text-mutedDark">إجمالي أطفال الصف</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{students.length}</h3>
              <p className="text-xs text-primary font-medium mt-1">مسجلون في هذا الفصل</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
              <Baby className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-muted dark:text-text-mutedDark">حضور اليوم</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{presentCount} / {students.length}</h3>
              <p className="text-xs text-text-muted dark:text-text-mutedDark mt-1">نسبة الحضور: {Math.round((presentCount / students.length) * 100)}%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-muted dark:text-text-mutedDark">الوجبات المسجلة</p>
              <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{mealCount} / {presentCount}</h3>
              <p className="text-xs text-text-muted dark:text-text-mutedDark mt-1">المتبقي: {Math.max(0, presentCount - mealCount)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
              <Utensils className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-text-muted dark:text-text-mutedDark">التقارير الأسبوعية</p>
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{noteCount} / {students.length}</h3>
              <p className="text-xs text-text-muted dark:text-text-mutedDark mt-1">مكتمل هذا الأسبوع</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
              <FileText className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/teacher/attendance"
          className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-3 hover:border-primary transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">تسجيل الحضور</h4>
            <p className="text-xs text-text-muted dark:text-text-mutedDark">كشف الحضور اليومي</p>
          </div>
        </Link>

        <Link
          to="/teacher/meals"
          className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-3 hover:border-primary transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">تسجيل الوجبات</h4>
            <p className="text-xs text-text-muted dark:text-text-mutedDark">الفطور والغداء والخفيف</p>
          </div>
        </Link>

        <Link
          to="/teacher/notes"
          className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-3 hover:border-primary transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">الملاحظات الأسبوعية</h4>
            <p className="text-xs text-text-muted dark:text-text-mutedDark">تقارير أولياء الأمور</p>
          </div>
        </Link>

        <Link
          to="/teacher/evaluations"
          className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-3 hover:border-primary transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">التقييمات</h4>
            <p className="text-xs text-text-muted dark:text-text-mutedDark">تطور المهارات والسلوك</p>
          </div>
        </Link>
      </div>

      {/* Classroom Fast Check-in Table */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div>
            <CardTitle className="text-base font-bold text-gray-900 dark:text-white">
              قائمة أطفال الصف والمتابعة الميدانية السريعة
            </CardTitle>
            <p className="text-xs text-text-muted dark:text-text-mutedDark mt-0.5">
              يمكنك النقر على حالة الحضور لتحديثها فورياً لليوم الحالي
            </p>
          </div>
          <Link
            to="/teacher/children"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            عرض كافة التفاصيل
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50 dark:bg-gray-800/60 text-xs text-gray-600 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4">اسم الطفل</th>
                  <th className="py-3 px-4 text-center">حضور اليوم</th>
                  <th className="py-3 px-4 text-center">تسجيل الوجبة</th>
                  <th className="py-3 px-4 text-center">التقرير الأسبوعي</th>
                  <th className="py-3 px-4 text-left">إجراءات سريعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {students.map((std) => (
                  <tr key={std.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {std.name.charAt(0)}
                      </div>
                      {std.name}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleAttendance(std.id)}
                        className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                          std.present
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                        }`}
                      >
                        {std.present ? 'حاضر اليوم' : 'غائب'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {std.mealLogged ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> مسجلة
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                          <Clock className="w-3.5 h-3.5" /> بانتظار التحديث
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {std.noteWritten ? (
                        <span className="inline-flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> مكتمل
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" /> غير مكتمل
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-left">
                      <Link
                        to="/teacher/notes"
                        className="text-xs font-bold text-primary hover:text-primary-dark transition-colors"
                      >
                        كتابة ملاحظة
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
