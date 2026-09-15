import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, CheckCircle2, AlertCircle, Edit, Eye, Save, Sparkles, User } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';

export function WeeklyNotesPage() {
  const { t } = useTranslation();

  const [selectedClassId, setSelectedClassId] = useState('class-birds-3-4');

  const classesList = [
    { id: 'class-birds-3-4', name: 'روضة العصافير 🐥' },
    { id: 'class-flowers-4-5', name: 'روضة الزهور 🌸' },
    { id: 'class-hope-2-3', name: 'روضة الأمل 🌟' },
  ];

  // Mock student weekly reports state per class
  const [reportsData, setReportsData] = useState({
    'class-birds-3-4': [
      {
        id: 'r1',
        studentId: 'child-omar-shakaa',
        studentName: 'عمر أحمد الشكعة',
        parentName: 'أحمد الشكعة',
        written: true,
        reportDate: '2026-09-14',
        behavior: 'ممتاز وهادئ ومتعاون مع أصدقائه',
        participation: 'تفاعل عالي في حصة الإنشاد والقراءة',
        socialSkills: 'يبادر باللعب ومشاركة الألعاب',
        generalNotes: 'طفل متميز وذكي جداً في الأنشطة الإبداعية',
      },
      {
        id: 'r2',
        studentId: 'child-yousef-jowdat',
        studentName: 'يوسف خالد جودت',
        parentName: 'خالد جودت',
        written: false,
        reportDate: null,
        behavior: '',
        participation: '',
        socialSkills: '',
        generalNotes: '',
      },
      {
        id: 'r3',
        studentId: 'child-khalil',
        studentName: 'خليل سمير النابلسي',
        parentName: 'سمير النابلسي',
        written: true,
        reportDate: '2026-09-13',
        behavior: 'جيد جداً وينفذ تعليمات المعلمة',
        participation: 'مشاركة جيدة في أنشطة الرسم والتلوين',
        socialSkills: 'تواصل إيجابي ممتاز',
        generalNotes: 'تقدم ملحوظ في التركيز',
      },
    ],
    'class-flowers-4-5': [
      {
        id: 'r4',
        studentId: 'child-sara-masri',
        studentName: 'سارة مريم المصري',
        parentName: 'مريم المصري',
        written: true,
        reportDate: '2026-09-14',
        behavior: 'مطيعة ولطيفة جداً',
        participation: 'تشارك بشغف في كافة الأنشطة',
        socialSkills: 'قيادية ومحبوبة بين زميلاتها',
        generalNotes: 'تستحق كل التقدير والثناء',
      },
    ],
    'class-hope-2-3': [
      {
        id: 'r5',
        studentId: 'child-layan-shakaa',
        studentName: 'ليان أحمد الشكعة',
        parentName: 'أحمد الشكعة',
        written: false,
        reportDate: null,
        behavior: '',
        participation: '',
        socialSkills: '',
        generalNotes: '',
      },
    ],
  });

  const [selectedReportStudent, setSelectedReportStudent] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportForm, setReportForm] = useState({
    behavior: '',
    participation: '',
    socialSkills: '',
    generalNotes: '',
  });

  const handleOpenReport = (report) => {
    setSelectedReportStudent(report);
    setReportForm({
      behavior: report.behavior || 'ممتاز وهادئ ومتعاون مع أصدقائه',
      participation: report.participation || 'تفاعل عالي ونشاط ملحوظ',
      socialSkills: report.socialSkills || 'تواصل اجتماعي ممتاز',
      generalNotes: report.generalNotes || 'طفل متميز ويتطور بشكل رائع',
    });
    setIsReportModalOpen(true);
  };

  const handleSaveReport = () => {
    if (!selectedReportStudent) return;

    setReportsData((prev) => {
      const currentList = prev[selectedClassId] || [];
      const updated = currentList.map((r) => {
        if (r.studentId === selectedReportStudent.studentId) {
          return {
            ...r,
            written: true,
            reportDate: new Date().toISOString().split('T')[0],
            ...reportForm,
          };
        }
        return r;
      });
      return { ...prev, [selectedClassId]: updated };
    });

    setIsReportModalOpen(false);
    alert(`تم حفظ وتحديث التقرير الأسبوعي للطالب (${selectedReportStudent.studentName}) بنجاح ✅`);
  };

  const currentReports = reportsData[selectedClassId] || [];

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="الملاحظات والتقارير الأسبوعية 📝"
        description="متابعة حالة كتابة التقارير الأسبوعية للأطفال ومراجعتها والتعديل عليها"
      />

      {/* Class Selector Tabs */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-gray-700">اختر الصف لمتابعة تقارير الطلاب:</h4>
        <div className="flex flex-wrap gap-3">
          {classesList.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all border ${
                selectedClassId === cls.id
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      {/* Students Reports Completion List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-gray-900">
            حالة كتابة التقارير الأسبوعية - {classesList.find((c) => c.id === selectedClassId)?.name}
          </h3>
          <span className="text-xs font-bold bg-purple-50 text-purple-700 px-3.5 py-1.5 rounded-full">
            تمت كتابة التقرير: {currentReports.filter((r) => r.written).length} / {currentReports.length} طفل
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {currentReports.map((report) => (
            <div
              key={report.studentId}
              onClick={() => handleOpenReport(report)}
              className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 px-3 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="bg-purple-50 p-2.5 rounded-xl text-purple-600 ml-3">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{report.studentName}</p>
                  <p className="text-xs text-gray-500">ولي الأمر: {report.parentName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 space-x-reverse">
                {report.written ? (
                  <>
                    <span className="text-xs text-gray-500 font-medium">تاريخ الإرسال: {report.reportDate}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                      كُتب التقرير الأسبوعي ✅
                    </span>
                  </>
                ) : (
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 ml-1" />
                    لم يُكتب بعد ⚠️
                  </span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenReport(report);
                  }}
                  className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center mr-2"
                >
                  <Eye className="w-3.5 h-3.5 ml-1" />
                  {report.written ? 'عرض وتعديل' : 'كتابة التقرير'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal View & Edit Weekly Report */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title={`التقرير الأسبوعي للطالب: ${selectedReportStudent?.studentName || ''}`}
      >
        <div className="space-y-4 py-2" dir="rtl">
          <div className="bg-purple-50 p-3.5 rounded-xl border border-purple-100 text-xs text-purple-900 font-semibold flex justify-between items-center">
            <span>ولي الأمر: {selectedReportStudent?.parentName}</span>
            <span>الحالة: {selectedReportStudent?.written ? 'مكتوب ومُرسل ✅' : 'قيد الإنشاء ⏳'}</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">السلوك العام والانضباط:</label>
              <textarea
                rows={2}
                value={reportForm.behavior}
                onChange={(e) => setReportForm({ ...reportForm, behavior: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">التفاعل والمشاركة في الحصص:</label>
              <textarea
                rows={2}
                value={reportForm.participation}
                onChange={(e) => setReportForm({ ...reportForm, participation: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">المهارات الاجتماعية والتواصل:</label>
              <textarea
                rows={2}
                value={reportForm.socialSkills}
                onChange={(e) => setReportForm({ ...reportForm, socialSkills: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">ملاحظات وتوصيات المعلمة العامة:</label>
              <textarea
                rows={2}
                value={reportForm.generalNotes}
                onChange={(e) => setReportForm({ ...reportForm, generalNotes: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSaveReport}
            className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors text-sm flex items-center justify-center"
          >
            <Save className="w-4 h-4 ml-2" />
            حفظ وتحديث التقرير الأسبوعي
          </button>
        </div>
      </Modal>
    </div>
  );
}