import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Utensils, CheckCircle2, Calendar, ShieldCheck, Heart } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { useParentStore } from '../../store/parentStore';

export function ParentMealsPage() {
  const { t } = useTranslation();
  const { selectedChildId } = useParentStore();

  const [activeTab, setActiveTab] = useState('daily_log'); // 'daily_log' | 'weekly_menu'

  // Daily Meal Log for Child
  const dailyMealsLog = [
    {
      id: 'm1',
      date: 'اليوم (2026-09-15)',
      type: 'BREAKFAST',
      title: 'وجبة الإفطار الصباحي',
      statusText: 'أكل وجبته اليومية بنجاح 🍏 (تم التنبيه)',
      notes: 'تناول الطفل طعامه بشهية وحيوية عالية مع المعلمة والمشرفة.',
    },
    {
      id: 'm2',
      date: 'اليوم (2026-09-15)',
      type: 'SNACK',
      title: 'سناك الفواكه والتحلية',
      statusText: 'أكل الوجبة بالكامل ✅',
      notes: 'تناول طبق شرائح التفاح والموز كاملاً.',
    },
  ];

  // Approved Weekly Meal Schedule Table (جدول الوجبات الأسبوعي)
  const weeklyMenu = [
    { day: 'الأحد', breakfast: 'جبنة بيضاء ومناقيش زعتر بلدي + خيار', lunch: 'أرز بدجاج ومكسرات وخضار مشكلة', snack: 'فواكه طازجة (تفاح وموز)' },
    { day: 'الإثنين', breakfast: 'بيض مسلوق وزيت وزعتر + حليب دافئ', lunch: 'صينية خضار بالفرن ومعكرونة', snack: 'بسكويت شوفان وعصير طازج' },
    { day: 'الثلاثاء', breakfast: 'لبنة بلدية وزيتون أسود وخُبز أسمر', lunch: 'شوربة عدس مغذية + كبسة دجاج', snack: 'برتقال وشرائح جزر' },
    { day: 'الأربعاء', breakfast: 'فول مدمس خفيف وجبنة شيدر', lunch: 'مقلوبة زهرة ودجاج مع لبن رائب', snack: 'سلطة فواكه مشكلة' },
    { day: 'الخميس', breakfast: 'فطائر سبانخ وجبنة + عصير برتقال', lunch: 'كفتة بالطحينية وأرز أبيض', snack: 'كيك بيتي بالفواكه' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="سجل الوجبات وجدول التغذية الأسبوعي 🍱"
        description="متابعة الوجبات اليومية للطفل وتصفح البرنامج الغذائي الأسبوعي المعتمد"
      />

      {/* Main Tab Navigation */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl max-w-xl">
        <button
          onClick={() => setActiveTab('daily_log')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
            activeTab === 'daily_log'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Utensils className="w-4 h-4 ml-2" />
          سجل وجبات الطفل اليومية 🍏
        </button>
        <button
          onClick={() => setActiveTab('weekly_menu')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
            activeTab === 'weekly_menu'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4 ml-2" />
          جدول الوجبات الأسبوعي 📋
        </button>
      </div>

      {activeTab === 'daily_log' ? (
        <div className="space-y-4">
          {dailyMealsLog.map((meal) => (
            <div key={meal.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-xs font-bold bg-amber-50 text-amber-800 px-3 py-1 rounded-full">
                  {meal.title}
                </span>
                <span className="text-xs text-gray-500 font-medium">{meal.date}</span>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 ml-2 text-emerald-600" />
                {meal.statusText}
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl text-xs text-gray-700">
                <span className="font-bold text-gray-900 block mb-1">ملاحظات المعلمة والمشرفة:</span>
                {meal.notes}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Approved Weekly Meal Schedule Table for Parents */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">جدول الوجبات الغذائية الأسبوعي المعتمد 🥗</h3>
            <p className="text-xs text-gray-500 mt-1">يحتوي هذا الجدول على الوجبات المقدمة للأطفال خلال أيام الأسبوع</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-900 text-xs font-bold uppercase border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">اليوم</th>
                  <th className="py-3.5 px-4">وجبة الإفطار 🍳</th>
                  <th className="py-3.5 px-4">وجبة الغداء 🍲</th>
                  <th className="py-3.5 px-4">وجبة الفواكه / السناك 🍎</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {weeklyMenu.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-4 px-4 font-bold text-gray-900 bg-gray-50/50">{item.day}</td>
                    <td className="py-4 px-4">{item.breakfast}</td>
                    <td className="py-4 px-4">{item.lunch}</td>
                    <td className="py-4 px-4">{item.snack}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}