import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Gamepad2,
  Clock,
  CheckCircle2,
  Plus,
  Save,
  Palette,
  BookOpen,
  Music,
  Activity,
  Sun,
  Moon
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';

export function TeacherDailyActivitiesPage() {
  const { t } = useTranslation();
  const assignedClass = { id: 'class-birds-3-4', name: 'روضة العصافير (3 - 4 سنوات)' };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newCategory, setNewCategory] = useState('ART');
  const [newDescription, setNewDescription] = useState('');

  const [activities, setActivities] = useState([
    {
      id: 'a1',
      title: 'حلقة الصباح والترحيب',
      time: '08:00 - 08:30',
      category: 'CIRCLE',
      description: 'أناشيد الصباح، تفقد الحضور، ومعرفة حالة الطقس وأيام الأسبوع.',
      completed: true,
      icon: Sun,
      color: 'text-amber-500'
    },
    {
      id: 'a2',
      title: 'نشاط الفنون والألوان المائية',
      time: '09:30 - 10:15',
      category: 'ART',
      description: 'الرسم بالأصابع والتعرف على خلط الألوان الأساسية.',
      completed: true,
      icon: Palette,
      color: 'text-purple-500'
    },
    {
      id: 'a3',
      title: 'الألعاب الحركية وبناء التوازن',
      time: '10:30 - 11:15',
      category: 'MOTOR',
      description: 'أنشطة حركية في القاعة الرياضية لتنمية التآزر البصري الحركي.',
      completed: true,
      icon: Activity,
      color: 'text-emerald-500'
    },
    {
      id: 'a4',
      title: 'قراءة قصة تفاعلية',
      time: '12:45 - 01:15',
      category: 'READING',
      description: 'قصة الصداقة ومساعدة الآخرين، مع طرح أسئلة تحفيزية للأطفال.',
      completed: false,
      icon: BookOpen,
      color: 'text-blue-500'
    },
    {
      id: 'a5',
      title: 'وقت الاسترخاء والقيلولة الهادئة',
      time: '01:30 - 02:30',
      category: 'NAP',
      description: 'موسيقى هادئة وتعتيم الإضاءة لمساعدة الأطفال على النوم المنعش.',
      completed: false,
      icon: Moon,
      color: 'text-indigo-500'
    }
  ]);

  const toggleActivityStatus = (id) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const handleAddActivity = () => {
    if (!newTitle || !newTime) return;

    setActivities(prev => [
      ...prev,
      {
        id: `a${Date.now()}`,
        title: newTitle,
        time: newTime,
        category: newCategory,
        description: newDescription,
        completed: false,
        icon: Gamepad2,
        color: 'text-primary'
      }
    ]);

    setNewTitle('');
    setNewTime('');
    setNewDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title={`الأنشطة والجدول اليومي - ${assignedClass.name}`}
        description="تنظيم وتتبع فعاليات اليوم التعليمية والحركية والترفيهية ومشاركتها في تقرير اليوم"
        actionLabel="إضافة نشاط جديد"
        onAction={() => setIsModalOpen(true)}
      />

      {/* Activities Timeline List */}
      <div className="space-y-3">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <Card
              key={act.id}
              className={`border transition-colors bg-surface dark:bg-surface-dark ${
                act.completed
                  ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20'
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 ${act.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{act.title}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {act.time}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted dark:text-text-mutedDark mt-1">
                      {act.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleActivityStatus(act.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                    act.completed
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {act.completed ? 'تم الإنجاز' : 'تحديد كمكتمل'}
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Activity Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="إضافة نشاط يومي جديد"
      >
        <div className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">عنوان النشاط:</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="مثال: نشاط الحساب والأرقام الخشبية"
              className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-xs focus:outline-none focus:border-primary text-right"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">الوقت المخصص:</label>
            <input
              type="text"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              placeholder="مثال: 11:30 - 12:15"
              className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-xs focus:outline-none focus:border-primary text-right"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">وصف وأهداف النشاط:</label>
            <textarea
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="أدخل ملخص الأهداف التربوية أو الأدوات المستخدمة..."
              className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-xs focus:outline-none focus:border-primary text-right"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleAddActivity}
              className="flex-1 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" /> حفظ وإدراج في الجدول
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
