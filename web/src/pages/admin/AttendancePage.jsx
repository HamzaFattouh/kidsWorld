import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckSquare, Square, Users, ShieldCheck, Clock, CheckCircle2, ChevronRight, Calculator } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';

export function AttendancePage() {
  const { t } = useTranslation();

  const [activeCalendarTab, setActiveCalendarTab] = useState('students'); // 'students' | 'teachers'

  // Selected date state
  const [selectedDate, setSelectedDate] = useState('2026-09-15');

  // Selected class for student calendar
  const [selectedClassId, setSelectedClassId] = useState('class-birds-3-4');

  // Mock student attendance state per class & date
  const [studentAttendance, setStudentAttendance] = useState({
    'class-birds-3-4': [
      { id: 'child-omar-shakaa', name: 'عمر أحمد الشكعة', parent: 'أحمد الشكعة', present: true, time: '07:45 ص' },
      { id: 'child-yousef-jowdat', name: 'يوسف خالد جودت', parent: 'خالد جودت', present: false, time: '—' },
      { id: 'child-khalil', name: 'خليل سمير النابلسي', parent: 'سمير النابلسي', present: true, time: '08:00 ص' },
    ],
    'class-flowers-4-5': [
      { id: 'child-sara-masri', name: 'سارة مريم المصري', parent: 'مريم المصري', present: true, time: '07:55 ص' },
      { id: 'child-salma', name: 'سلمى إبراهيم حامد', parent: 'إبراهيم حامد', present: true, time: '08:05 ص' },
    ],
    'class-hope-2-3': [
      { id: 'child-layan-shakaa', name: 'ليان أحمد الشكعة', parent: 'أحمد الشكعة', present: true, time: '08:10 ص' },
      { id: 'child-hamza', name: 'حمزة محمود القاسم', parent: 'محمود القاسم', present: false, time: '—' },
    ],
  });

  // Mock teacher attendance state
  const [teachersAttendance, setTeachersAttendance] = useState([
    { id: 't1', name: 'أ. نورة النابلسي', role: 'معلمة روضة العصافير', phone: '0599111222', present: true, time: '07:30 ص' },
    { id: 't2', name: 'أ. سارة الخالد', role: 'معلمة روضة الزهور', phone: '0599333444', present: true, time: '07:35 ص' },
    { id: 't3', name: 'أ. منى التميمي', role: 'معلمة روضة الأمل', phone: '0599444555', present: false, time: '—' },
  ]);

  const classesList = [
    { id: 'class-birds-3-4', name: 'روضة العصافير 🐥' },
    { id: 'class-flowers-4-5', name: 'روضة الزهور 🌸' },
    { id: 'class-hope-2-3', name: 'روضة الأمل 🌟' },
  ];

  const toggleStudentAttendance = (studentId) => {
    setStudentAttendance((prev) => {
      const classStudents = prev[selectedClassId] || [];
      const updated = classStudents.map((s) =>
        s.id === studentId ? { ...s, present: !s.present, time: !s.present ? '08:00 ص' : '—' } : s
      );
      return { ...prev, [selectedClassId]: updated };
    });
  };

  const toggleTeacherAttendance = (teacherId) => {
    setTeachersAttendance((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, present: !t.present, time: !t.present ? '07:30 ص' : '—' } : t))
    );
  };

  const currentStudents = studentAttendance[selectedClassId] || [];

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="تقويم الحضور والغياب اليومي 📅"
        description="سجل حضور طلاب الصفوف وتقويم دوام المعلمين التفاعلي"
      />

      {/* Main Tab Buttons */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl max-w-xl">
        <button
          onClick={() => setActiveCalendarTab('students')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
            activeCalendarTab === 'students'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4 ml-2" />
          تقويم أطفال الصفوف 👶
        </button>
        <button
          onClick={() => setActiveCalendarTab('teachers')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
            activeCalendarTab === 'teachers'
              ? 'bg-white text-emerald-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 ml-2" />
          تقويم دوام المعلمين 👩‍🏫 (خاص بالأدمن)
        </button>
      </div>

      {/* Date Picker Control Box */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Calendar className="w-6 h-6 text-blue-600" />
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">اختر تاريخ التقويم:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="text-xs bg-blue-50 text-blue-800 font-bold px-4 py-2 rounded-xl">
          التاريخ المحدد: {selectedDate}
        </div>
      </div>

      {activeCalendarTab === 'students' ? (
        /* Student Calendar Section */
        <div className="space-y-6">
          {/* Class Selectors */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-gray-700">اختر الصف المطلوب لعرض كشف الحضور:</h4>
            <div className="flex flex-wrap gap-3">
              {classesList.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all border ${
                    selectedClassId === cls.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cls.name}
                </button>
              ))}
            </div>
          </div>

          {/* Students Checklist */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900">
                قائمة طلاب {classesList.find((c) => c.id === selectedClassId)?.name}
              </h3>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full">
                حاضر: {currentStudents.filter((s) => s.present).length} / {currentStudents.length} طفل
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {currentStudents.map((std) => (
                <div
                  key={std.id}
                  onClick={() => toggleStudentAttendance(std.id)}
                  className="py-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 px-3 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <input
                      type="checkbox"
                      checked={std.present}
                      onChange={() => toggleStudentAttendance(std.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer ml-3"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{std.name}</p>
                      <p className="text-xs text-gray-500">ولي الأمر: {std.parent}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="text-xs text-gray-500 font-medium">وقت الحضور: {std.time}</span>
                    {std.present ? (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                        حاضر 🟢
                      </span>
                    ) : (
                      <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full">
                        غائب 🔴
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Teacher Calendar Section (Admin Only) */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">تقويم دوام المعلمين 👩‍🏫</h3>
              <p className="text-xs text-gray-500 mt-1">خاص بالأدمن فقط لتسجيل حضور وغياب طاقم التدريس</p>
            </div>
            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full">
              عدد الكادر الحاضر: {teachersAttendance.filter((t) => t.present).length} / {teachersAttendance.length} معلمة
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {teachersAttendance.map((t) => (
              <div
                key={t.id}
                onClick={() => toggleTeacherAttendance(t.id)}
                className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <input
                    type="checkbox"
                    checked={t.present}
                    onChange={() => toggleTeacherAttendance(t.id)}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer ml-3"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role} ({t.phone})</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className="text-xs text-gray-500 font-medium">ساعة تسجيل الحضور: {t.time}</span>
                  {t.present ? (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                      دوام مكتمل 🟢
                    </span>
                  ) : (
                    <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3.5 py-1.5 rounded-full">
                      لم تحضر بعد 🔴
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}