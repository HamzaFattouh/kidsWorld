import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Utensils,
  Coffee,
  Apple,
  CheckCircle2,
  Clock,
  Plus,
  Save,
  AlertCircle,
  Calendar,
  Baby
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { mealRecordApi } from '../../api/mealRecord';

export function TeacherMealsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const assignedClass = { id: 'class-birds-3-4', name: 'روضة العصافير (3 - 4 سنوات)' };
  const [selectedMealType, setSelectedMealType] = useState('LUNCH'); // BREAKFAST | LUNCH | SNACK
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChild, setActiveChild] = useState(null);
  const [consumedLevel, setConsumedLevel] = useState('ALL');
  const [mealNotes, setMealNotes] = useState('');

  // Local classroom students state with meal logs
  const [studentMeals, setStudentMeals] = useState([
    { id: 'c1', name: 'عمر أحمد الشكعة', breakfast: 'ALL', lunch: 'ALL', snack: 'PENDING', notes: 'أكل وجبته بشهية ممتازة' },
    { id: 'c2', name: 'يوسف خالد جودت', breakfast: 'ALL', lunch: 'MOST', snack: 'PENDING', notes: 'تناول معظم الخضار' },
    { id: 'c3', name: 'خليل سمير النابلسي', breakfast: 'HALF', lunch: 'PENDING', snack: 'PENDING', notes: 'حساسية من منتجات الألبان' },
    { id: 'c4', name: 'سارة مريم المصري', breakfast: 'NONE', lunch: 'NONE', snack: 'NONE', notes: 'غائبة اليوم' },
    { id: 'c5', name: 'ليان أحمد الشكعة', breakfast: 'ALL', lunch: 'PENDING', snack: 'PENDING', notes: 'شربت كمية جيدة من الماء' },
  ]);

  const mealTypes = [
    { id: 'BREAKFAST', label: 'وجبة الإفطار (08:30)', icon: Coffee, color: 'text-amber-500' },
    { id: 'LUNCH', label: 'وجبة الغداء (12:00)', icon: Utensils, color: 'text-emerald-500' },
    { id: 'SNACK', label: 'الوجبة الخفيفة (14:00)', icon: Apple, color: 'text-rose-500' },
  ];

  const consumptionLevels = [
    { id: 'ALL', label: 'أكل الوجبة كاملة', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
    { id: 'MOST', label: 'معظم الوجبة', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
    { id: 'HALF', label: 'نصف الوجبة', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
    { id: 'LITTLE', label: 'كمية قليلة', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' },
    { id: 'NONE', label: 'لم يأكل', badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300' },
  ];

  const openLogModal = (child) => {
    setActiveChild(child);
    const key = selectedMealType.toLowerCase();
    setConsumedLevel(child[key] === 'PENDING' ? 'ALL' : child[key]);
    setMealNotes(child.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveMeal = () => {
    if (!activeChild) return;
    const key = selectedMealType.toLowerCase();

    setStudentMeals(prev => prev.map(s => {
      if (s.id === activeChild.id) {
        return { ...s, [key]: consumedLevel, notes: mealNotes };
      }
      return s;
    }));

    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    if (status === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
          <Clock className="w-3 h-3" /> بانتظار التسجيل
        </span>
      );
    }
    const found = consumptionLevels.find(c => c.id === status);
    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold ${found?.badge || 'bg-gray-100 text-gray-800'}`}>
        <CheckCircle2 className="w-3 h-3" /> {found?.label || status}
      </span>
    );
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title={`متابعة وجبات طعام ${assignedClass.name}`}
        description="تسجيل استهلاك الوجبات وملاحظات التغذية اليومية وإرسالها فورياً لأولياء الأمور"
      />

      {/* Meal Type Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {mealTypes.map((m) => {
          const isSelected = selectedMealType === m.id;
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMealType(m.id)}
              className={`p-4 rounded-xl border text-right transition-colors flex items-center justify-between ${
                isSelected
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center ${m.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{m.label}</h4>
                  <p className="text-xs text-text-muted dark:text-text-mutedDark">
                    {isSelected ? 'الوجبة المحددة حالياً' : 'انقر للمتابعة والتسجيل'}
                  </p>
                </div>
              </div>
              {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
            </button>
          );
        })}
      </div>

      {/* Meals Table */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <CardTitle className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Utensils className="w-4 h-4 text-primary" />
            كشف الوجبة الحالية لجميع أطفال الصف
          </CardTitle>
          <div className="text-xs font-semibold text-text-muted dark:text-text-mutedDark">
            تاريخ اليوم: {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50 dark:bg-gray-800/60 text-xs text-gray-600 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4">اسم الطفل</th>
                  <th className="py-3 px-4 text-center">الإفطار</th>
                  <th className="py-3 px-4 text-center">الغداء</th>
                  <th className="py-3 px-4 text-center">خفيف</th>
                  <th className="py-3 px-4">ملاحظات التغذية</th>
                  <th className="py-3 px-4 text-left">تسجيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {studentMeals.map((child) => (
                  <tr key={child.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {child.name.charAt(0)}
                      </div>
                      {child.name}
                    </td>
                    <td className="py-3.5 px-4 text-center">{getStatusBadge(child.breakfast)}</td>
                    <td className="py-3.5 px-4 text-center">{getStatusBadge(child.lunch)}</td>
                    <td className="py-3.5 px-4 text-center">{getStatusBadge(child.snack)}</td>
                    <td className="py-3.5 px-4 text-xs text-gray-600 dark:text-gray-300 max-w-xs truncate">
                      {child.notes || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-left">
                      <button
                        onClick={() => openLogModal(child)}
                        className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        تعديل / تسجيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Log Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeChild ? `تسجيل وجبة: ${activeChild.name}` : 'تسجيل الوجبة'}
      >
        {activeChild && (
          <div className="space-y-4 text-right">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                مقدار ما تناوله الطفل:
              </label>
              <div className="space-y-2">
                {consumptionLevels.map((lvl) => (
                  <label
                    key={lvl.id}
                    onClick={() => setConsumedLevel(lvl.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      consumedLevel === lvl.id
                        ? 'border-primary bg-primary/5 dark:bg-primary/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{lvl.label}</span>
                    <input
                      type="radio"
                      name="consumption"
                      checked={consumedLevel === lvl.id}
                      onChange={() => setConsumedLevel(lvl.id)}
                      className="text-primary focus:ring-primary"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                ملاحظات المعلم لولي الأمر:
              </label>
              <textarea
                rows={3}
                value={mealNotes}
                onChange={(e) => setMealNotes(e.target.value)}
                placeholder="أدخل ملاحظات حول الشهية، أو تناول الماء، أو استجابة الطفل للوجبة..."
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-primary text-right"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveMeal}
                className="flex-1 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> حفظ وتأكيد الوجبة
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
