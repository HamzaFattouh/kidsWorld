import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Utensils, CheckSquare, Bell, Calendar, Edit3, Save, CheckCircle2, RefreshCw } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';

export function MealsPage() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('daily_checklist'); // 'daily_checklist' | 'weekly_menu'

  const [selectedClassId, setSelectedClassId] = useState('class-birds-3-4');
  const [notificationToast, setNotificationToast] = useState(null);

  // Mock daily meal checklist state per class
  const [dailyMeals, setDailyMeals] = useState({
    'class-birds-3-4': [
      { id: 'c1', name: 'عمر أحمد الشكعة', parent: 'أحمد الشكعة', ate: true, time: '09:30 ص', notes: 'تناول الوجبة الكاملة بالفواكه' },
      { id: 'c2', name: 'يوسف خالد جودت', parent: 'خالد جودت', ate: false, time: '—', notes: 'لم يتناول الوجبة بعد' },
      { id: 'c3', name: 'خليل سمير النابلسي', parent: 'سمير النابلسي', ate: true, time: '09:40 ص', notes: 'تناول نصف الوجبة' },
    ],
    'class-flowers-4-5': [
      { id: 'c4', name: 'سارة مريم المصري', parent: 'مريم المصري', ate: true, time: '09:15 ص', notes: 'تناولت الوجبة بنجاح' },
    ],
    'class-hope-2-3': [
      { id: 'c5', name: 'ليان أحمد الشكعة', parent: 'أحمد الشكعة', ate: true, time: '09:20 ص', notes: 'تغذية صحية ممتازة' },
    ],
  });

  // Mock Weekly Meal Schedule Table (الأحد - الخميس)
  const [weeklyMenu, setWeeklyMenu] = useState([
    { day: 'الأحد', breakfast: 'جبنة بيضاء ومناقيش زعتر بلدي + خيار', lunch: 'أرز بدجاج ومكسرات وخضار مشكلة', snack: 'فواكه طازجة (تفاح وموز)' },
    { day: 'الإثنين', breakfast: 'بيض مسلوق وزيت وزعتر + حليب دافئ', lunch: 'صينية خضار بالفرن ومعكرونة', snack: 'بسكويت شوفان وعصير طازج' },
    { day: 'الثلاثاء', breakfast: 'لبنة بلدية وزيتون أسود وخُبز أسمر', lunch: 'شوربة عدس مغذية + كبسة دجاج', snack: 'برتقال وشرائح جزر' },
    { day: 'الأربعاء', breakfast: 'فول مدمس خفيف وجبنة شيدر', lunch: 'مقلوبة زهرة ودجاج مع لبن رائب', snack: 'سلطة فواكه مشكلة' },
    { day: 'الخميس', breakfast: 'فطائر سبانخ وجبنة + عصير برتقال', lunch: 'كفتة بالطحينية وأرز أبيض', snack: 'كيك بيتي بالفواكه' },
  ]);

  const [isEditingMenu, setIsEditingMenu] = useState(false);

  const classesList = [
    { id: 'class-birds-3-4', name: 'روضة العصافير 🐥' },
    { id: 'class-flowers-4-5', name: 'روضة الزهور 🌸' },
    { id: 'class-hope-2-3', name: 'روضة الأمل 🌟' },
  ];

  const handleToggleMeal = (childId, childName, parentName) => {
    setDailyMeals((prev) => {
      const currentList = prev[selectedClassId] || [];
      const updated = currentList.map((c) => {
        if (c.id === childId) {
          const newAteState = !c.ate;
          if (newAteState) {
            // Show parent notification feedback toast
            showNotificationToast(`🔔 تم إرسال إشعار فوري لولي الأمر (${parentName}): "الطفل ${childName} أكل وجبته اليومية بنجاح 🍏"`);
          }
          return {
            ...c,
            ate: newAteState,
            time: newAteState ? new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '—',
          };
        }
        return c;
      });
      return { ...prev, [selectedClassId]: updated };
    });
  };

  const showNotificationToast = (msg) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 5000);
  };

  const handleMenuChange = (index, field, value) => {
    const updated = [...weeklyMenu];
    updated[index][field] = value;
    setWeeklyMenu(updated);
  };

  const currentList = dailyMeals[selectedClassId] || [];

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="إدارة الوجبات والتغذية اليومية 🍏"
        description="متابعة تناول الطلاب لوجباتهم اليومية وإدارة جدول الوجبات الأسبوعي"
      />

      {/* Toast Notification Alert */}
      {notificationToast && (
        <div className="bg-emerald-600 text-white font-bold p-4 rounded-2xl shadow-lg flex items-center justify-between animate-bounce">
          <div className="flex items-center">
            <Bell className="w-5 h-5 ml-3" />
            <span>{notificationToast}</span>
          </div>
          <button onClick={() => setNotificationToast(null)} className="text-xs bg-emerald-700 px-3 py-1 rounded-lg">إغلاق</button>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl max-w-xl">
        <button
          onClick={() => setActiveTab('daily_checklist')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
            activeTab === 'daily_checklist'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Utensils className="w-4 h-4 ml-2" />
          كشف الوجبات اليومي للأطفال 🍏
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

      {activeTab === 'daily_checklist' ? (
        <div className="space-y-6">
          {/* Class Buttons Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-gray-700">اختر الصف لعرض كشف الوجبات اليومي:</h4>
              <span className="text-xs text-gray-500 font-semibold flex items-center">
                <RefreshCw className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                يتجدد الكشف تلقائياً كل يوم عند الساعة 12 منتصف الليل
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {classesList.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all border ${
                    selectedClassId === cls.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-105'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cls.name}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Checklist Table / Cards */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900">
                كشف تناول الوجبة - {classesList.find((c) => c.id === selectedClassId)?.name}
              </h3>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full">
                تم تناول الوجبة: {currentList.filter((c) => c.ate).length} / {currentList.length} طفل
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {currentList.map((child) => (
                <div
                  key={child.id}
                  onClick={() => handleToggleMeal(child.id, child.name, child.parent)}
                  className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 px-3 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <input
                      type="checkbox"
                      checked={child.ate}
                      onChange={() => handleToggleMeal(child.id, child.name, child.parent)}
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer ml-3"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{child.name}</p>
                      <p className="text-xs text-gray-500">ولي الأمر: {child.parent}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 space-x-reverse">
                    <span className="text-xs text-gray-500">وقت التناول: {child.time}</span>
                    {child.ate ? (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                        أكل وجبته اليومية 🍏 (تم التنبيه)
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3.5 py-1.5 rounded-full">
                        لم يأكل بعد ⏳
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Weekly Meal Schedule Menu Table */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">جدول الوجبات الأسبوعي المعتمد 🥗</h3>
              <p className="text-xs text-gray-500 mt-1">يظهر هذا الجدول تلقائياً في داشبورد أولياء الأمور لمعرفة وجبات الأسبوع</p>
            </div>

            <button
              onClick={() => setIsEditingMenu(!isEditingMenu)}
              className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                isEditingMenu ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {isEditingMenu ? <Save className="w-4 h-4 ml-1.5" /> : <Edit3 className="w-4 h-4 ml-1.5" />}
              {isEditingMenu ? 'حفظ التعديلات' : 'تعديل الجدول الأسبوعي'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm text-gray-700">
              <thead className="bg-gray-50 text-gray-900 text-xs font-bold uppercase border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">اليوم</th>
                  <th className="py-3.5 px-4">وجبة الإفطار (الصباح) 🥚</th>
                  <th className="py-3.5 px-4">وجبة الغداء (الظهيرة) 🍲</th>
                  <th className="py-3.5 px-4">وجبة الفواكه / السناك 🍎</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {weeklyMenu.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="py-4 px-4 font-bold text-gray-900 bg-gray-50/50">{item.day}</td>
                    <td className="py-4 px-4">
                      {isEditingMenu ? (
                        <input
                          type="text"
                          value={item.breakfast}
                          onChange={(e) => handleMenuChange(idx, 'breakfast', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                        />
                      ) : (
                        item.breakfast
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {isEditingMenu ? (
                        <input
                          type="text"
                          value={item.lunch}
                          onChange={(e) => handleMenuChange(idx, 'lunch', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                        />
                      ) : (
                        item.lunch
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {isEditingMenu ? (
                        <input
                          type="text"
                          value={item.snack}
                          onChange={(e) => handleMenuChange(idx, 'snack', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                        />
                      ) : (
                        item.snack
                      )}
                    </td>
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