import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Star,
  Award,
  CheckCircle2,
  Edit,
  Save,
  TrendingUp,
  Brain,
  Activity,
  Smile,
  Palette,
  Sparkles
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { evaluationApi } from '../../api/evaluation';

export function TeacherEvaluationsPage() {
  const { t } = useTranslation();
  const assignedClass = { id: 'class-birds-3-4', name: 'روضة العصافير (3 - 4 سنوات)' };

  const [activeChild, setActiveChild] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Domains & Scores (1 to 5)
  const [scores, setScores] = useState({
    learning: 4,
    communication: 5,
    socialSkills: 4,
    motorSkills: 5,
    creativity: 4,
    behavior: 5,
  });

  const domains = [
    { key: 'learning', label: 'التعلم والاستيعاب', icon: Brain, desc: 'القدرة على استيعاب المفاهيم الجديدة' },
    { key: 'communication', label: 'التواصل واللغة', icon: Sparkles, desc: 'التعبير اللفظي ومخارج الكلمات' },
    { key: 'socialSkills', label: 'المهارات الاجتماعية', icon: Smile, desc: 'المشاركة والتعاون مع الزملاء' },
    { key: 'motorSkills', label: 'التطور الحركي', icon: Activity, desc: 'الحركة الدقيقة والأنشطة الرياضية' },
    { key: 'creativity', label: 'الإبداع والفنون', icon: Palette, desc: 'الرسم والموسيقى والتخيل' },
    { key: 'behavior', label: 'السلوك والانضباط', icon: Award, desc: 'اتباع تعليمات الحضانة' },
  ];

  const [evaluations, setEvaluations] = useState([
    {
      id: 'e1',
      childName: 'عمر أحمد الشكعة',
      term: 'الفصل الأول - تقييم شهري',
      date: '2026-09-10',
      averageScore: 4.5,
      status: 'COMPLETED',
      scores: { learning: 4, communication: 5, socialSkills: 4, motorSkills: 5, creativity: 4, behavior: 5 }
    },
    {
      id: 'e2',
      childName: 'يوسف خالد جودت',
      term: 'الفصل الأول - تقييم شهري',
      date: '2026-09-10',
      averageScore: 4.2,
      status: 'COMPLETED',
      scores: { learning: 4, communication: 4, socialSkills: 5, motorSkills: 4, creativity: 4, behavior: 4 }
    },
    {
      id: 'e3',
      childName: 'خليل سمير النابلسي',
      term: 'الفصل الأول - تقييم شهري',
      date: '2026-09-08',
      averageScore: 4.0,
      status: 'COMPLETED',
      scores: { learning: 4, communication: 4, socialSkills: 4, motorSkills: 4, creativity: 4, behavior: 4 }
    },
    {
      id: 'e4',
      childName: 'سارة مريم المصري',
      term: 'الفصل الأول - تقييم شهري',
      date: null,
      averageScore: 0,
      status: 'PENDING',
      scores: { learning: 3, communication: 3, socialSkills: 3, motorSkills: 3, creativity: 3, behavior: 3 }
    },
    {
      id: 'e5',
      childName: 'ليان أحمد الشكعة',
      term: 'الفصل الأول - تقييم شهري',
      date: null,
      averageScore: 0,
      status: 'PENDING',
      scores: { learning: 3, communication: 3, socialSkills: 3, motorSkills: 3, creativity: 3, behavior: 3 }
    }
  ]);

  const openEvaluationModal = (item) => {
    setActiveChild(item);
    setScores(item.scores);
    setIsModalOpen(true);
  };

  const handleScoreChange = (domainKey, value) => {
    setScores(prev => ({ ...prev, [domainKey]: value }));
  };

  const handleSaveEvaluation = () => {
    if (!activeChild) return;
    const values = Object.values(scores);
    const avg = Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));

    setEvaluations(prev => prev.map(e => {
      if (e.id === activeChild.id) {
        return {
          ...e,
          scores,
          averageScore: avg,
          status: 'COMPLETED',
          date: new Date().toISOString().split('T')[0]
        };
      }
      return e;
    }));

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title={`تقييمات التطور والمهارات - ${assignedClass.name}`}
        description="تقييم مهارات الطفل الحركية واللغوية والاجتماعية بمقاييس تربوية دقيقة ومشاركتها مع الأهل"
      />

      {/* Evaluations Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evaluations.map((item) => (
          <Card key={item.id} className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{item.childName}</h4>
                  <p className="text-xs text-text-muted dark:text-text-mutedDark">{item.term}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    item.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}
                >
                  {item.status === 'COMPLETED' ? 'مكتمل' : 'قيد التقييم'}
                </span>
              </div>

              {item.status === 'COMPLETED' ? (
                <div className="space-y-3 bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-700 dark:text-gray-300">المعدل العام للتطور:</span>
                    <span className="font-bold text-primary flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {item.averageScore} / 5
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div>اللغة: {item.scores.communication} ⭐</div>
                    <div>الحركة: {item.scores.motorSkills} ⭐</div>
                    <div>الاجتماعي: {item.scores.socialSkills} ⭐</div>
                    <div>الإبداع: {item.scores.creativity} ⭐</div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                  لم يتم إجراء التقييم الدوري لهذا الطالب بعد
                </p>
              )}

              <button
                onClick={() => openEvaluationModal(item)}
                className="w-full py-2 bg-gray-50 dark:bg-gray-800 hover:bg-primary hover:text-white text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-gray-200 dark:border-gray-700"
              >
                <Edit className="w-3.5 h-3.5" />
                {item.status === 'COMPLETED' ? 'تعديل التقييم' : 'إجراء التقييم الآن'}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Evaluation Scoring Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeChild ? `تقييم مهارات الطالب: ${activeChild.childName}` : ''}
      >
        {activeChild && (
          <div className="space-y-4 text-right">
            <p className="text-xs text-text-muted dark:text-text-mutedDark">
              قم باختيار التقييم من 1 إلى 5 لكل مجال من المجالات التطورية التالية:
            </p>

            <div className="space-y-3">
              {domains.map((dom) => {
                const Icon = dom.icon;
                const currentScore = scores[dom.key] || 3;
                return (
                  <div
                    key={dom.key}
                    className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-900 dark:text-white">{dom.label}</h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{dom.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleScoreChange(dom.key, star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= currentScore
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveEvaluation}
                className="flex-1 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> حفظ التقييم واعتماده
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
