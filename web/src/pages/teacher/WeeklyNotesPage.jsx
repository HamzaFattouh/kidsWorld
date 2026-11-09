import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  CheckCircle2,
  Clock,
  Edit3,
  Save,
  Calendar,
  Sparkles,
  Send,
  UserCheck
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { weeklyNoteApi } from '../../api/weeklyNote';

export function TeacherWeeklyNotesPage() {
  const { t } = useTranslation();
  const assignedClass = { id: 'class-birds-3-4', name: 'روضة العصافير (3 - 4 سنوات)' };

  const [activeStudent, setActiveStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [behaviorNote, setBehaviorNote] = useState('');
  const [participationNote, setParticipationNote] = useState('');
  const [socialNote, setSocialNote] = useState('');
  const [recommendations, setRecommendations] = useState('');

  const [students, setStudents] = useState([
    {
      id: 'c1',
      name: 'عمر أحمد الشكعة',
      written: true,
      lastUpdated: '2026-09-14',
      behavior: 'هادئ ومتعاون، يستجيب للإرشادات التربوية برحابة صدر.',
      participation: 'تفاعل ممتاز في حصص الفنون والألعاب التفاعلية.',
      social: 'علاقات طيبة جداً مع كافة زملائه.',
      recommendations: 'الاستمرار في تشجيعه على مهارات التحدث والتعبير الذاتي.'
    },
    {
      id: 'c2',
      name: 'يوسف خالد جودت',
      written: false,
      lastUpdated: null,
      behavior: '',
      participation: '',
      social: '',
      recommendations: ''
    },
    {
      id: 'c3',
      name: 'خليل سمير النابلسي',
      written: true,
      lastUpdated: '2026-09-14',
      behavior: 'نشيط وذكي، يحب الاكتشاف والأنشطة العملية.',
      participation: 'مشاركة فعالة ومبادرة رائعة.',
      social: 'يحب القيادة وتنسيق الألعاب الجماعية.',
      recommendations: 'تنظيم وقت القيلولة في المنزل.'
    },
    {
      id: 'c4',
      name: 'سارة مريم المصري',
      written: true,
      lastUpdated: '2026-09-13',
      behavior: 'طيبة ولطيفة ومرتبة في أدواتها.',
      participation: 'مستمعة جيدة وتحب القصص المصورة.',
      social: 'صديقة محبوبة من الجميع.',
      recommendations: 'تعزيز مهارات مسك القلم والتلوين.'
    },
    {
      id: 'c5',
      name: 'ليان أحمد الشكعة',
      written: false,
      lastUpdated: null,
      behavior: '',
      participation: '',
      social: '',
      recommendations: ''
    }
  ]);

  const openEditModal = (std) => {
    setActiveStudent(std);
    setBehaviorNote(std.behavior || 'سلوك إيجابي والتزام ممتاز داخل القاعة الصفية.');
    setParticipationNote(std.participation || 'مشاركة فاعلة في الأنشطة اليومية وحلقات التعلم.');
    setSocialNote(std.social || 'تواصل طيب وانسجام رائع مع الأقران والمعلمة.');
    setRecommendations(std.recommendations || 'متابعة تشجيع الطفل وتنمية مهاراته الإبداعية.');
    setIsModalOpen(true);
  };

  const handleSaveNote = () => {
    if (!activeStudent) return;

    setStudents(prev => prev.map(s => {
      if (s.id === activeStudent.id) {
        return {
          ...s,
          written: true,
          lastUpdated: new Date().toISOString().split('T')[0],
          behavior: behaviorNote,
          participation: participationNote,
          social: socialNote,
          recommendations: recommendations,
        };
      }
      return s;
    }));

    setIsModalOpen(false);
  };

  const completedCount = students.filter(s => s.written).length;

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title={`التقارير والملاحظات الأسبوعية - ${assignedClass.name}`}
        description="كتابة واعتماد التقارير الأسبوعية للطلاب لإطلاع أولياء الأمور على التطور السلوكي والتربوي"
      />

      {/* Progress Card */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                نسبة إنجاز تقارير الأسبوع الحالي
              </h3>
              <p className="text-xs text-text-muted dark:text-text-mutedDark mt-0.5">
                تم اعتماد {completedCount} من أصل {students.length} تقارير ({Math.round((completedCount / students.length) * 100)}%)
              </p>
            </div>
          </div>

          <div className="w-full sm:w-64 bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / students.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {students.map((std) => (
          <Card
            key={std.id}
            className={`border transition-colors bg-surface dark:bg-surface-dark ${
              std.written ? 'border-gray-200 dark:border-gray-800' : 'border-amber-200 dark:border-amber-900/50'
            }`}
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {std.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{std.name}</h4>
                    <span className="text-xs text-text-muted dark:text-text-mutedDark">
                      {std.lastUpdated ? `تاريخ آخر تحديث: ${std.lastUpdated}` : 'لم يُكتب بعد لهذا الأسبوع'}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                    std.written
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}
                >
                  {std.written ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> مكتمل
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" /> بانتظار الكتابة
                    </>
                  )}
                </span>
              </div>

              {std.written ? (
                <div className="space-y-2 text-xs bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="font-bold text-gray-700 dark:text-gray-300">السلوك والمشاركة:</span>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{std.behavior}</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-700 dark:text-gray-300">التوصيات لولي الأمر:</span>{' '}
                    <span className="text-gray-600 dark:text-gray-400">{std.recommendations}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200 dark:border-amber-900/30">
                  يرجى تدوين الملاحظات التقييمية وإرسالها لولي الأمر قبل نهاية الأسبوع.
                </p>
              )}

              <button
                onClick={() => openEditModal(std)}
                className="w-full py-2 bg-gray-50 dark:bg-gray-800 hover:bg-primary hover:text-white text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-gray-200 dark:border-gray-700"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {std.written ? 'تعديل التقرير الأسبوعي' : 'كتابة التقرير الأسبوعي الآن'}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Note Editor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeStudent ? `التقرير الأسبوعي: ${activeStudent.name}` : ''}
      >
        {activeStudent && (
          <div className="space-y-4 text-right">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                1. السلوك والانضباط الصفي:
              </label>
              <textarea
                rows={2}
                value={behaviorNote}
                onChange={(e) => setBehaviorNote(e.target.value)}
                className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-xs focus:outline-none focus:border-primary text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                2. المشاركة في الأنشطة والتعلم:
              </label>
              <textarea
                rows={2}
                value={participationNote}
                onChange={(e) => setParticipationNote(e.target.value)}
                className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-xs focus:outline-none focus:border-primary text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                3. التفاعل الاجتماعي مع الزملاء:
              </label>
              <textarea
                rows={2}
                value={socialNote}
                onChange={(e) => setSocialNote(e.target.value)}
                className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-xs focus:outline-none focus:border-primary text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                4. توصيات ونصائح لولي الأمر:
              </label>
              <textarea
                rows={2}
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-xs focus:outline-none focus:border-primary text-right"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveNote}
                className="flex-1 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> حفظ واعتماد التقرير
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
