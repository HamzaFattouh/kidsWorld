import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, ShieldCheck, CheckCircle2, Clock, ChevronLeft, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';

export function AttendancePage() {
  const { t } = useTranslation();

  const [calendarMode, setCalendarMode] = useState('students'); // 'students' | 'teachers'

  // Selected Date Square state
  const [selectedDay, setSelectedDay] = useState(15); // e.g. 15th of September
  const [selectedMonth, setSelectedMonth] = useState('سبتمبر 2026');

  // Navigation steps inside Student Calendar: 'date_grid' -> 'classes_list' -> 'students_checklist'
  const [studentStep, setStudentStep] = useState('date_grid');
  const [selectedClass, setSelectedClass] = useState(null);

  // Navigation steps inside Teacher Calendar: 'date_grid' -> 'teachers_checklist'
  const [teacherStep, setTeacherStep] = useState('date_grid');

  // Days array for calendar grid (1 to 30)
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  // Mock classes
  const classesList = [
    { id: 'class-birds-3-4', name: 'روضة العصافير 🐥', teacher: 'أ. نورة النابلسي' },
    { id: 'class-flowers-4-5', name: 'روضة الزهور 🌸', teacher: 'أ. سارة الخالد' },
    { id: 'class-hope-2-3', name: 'روضة الأمل 🌟', teacher: 'أ. منى التميمي' },
  ];

  // Mock student attendance per class
  const [studentAttendance, setStudentAttendance] = useState({
    'class-birds-3-4': [
      { id: 'c1', name: 'عمر أحمد الشكعة', parent: 'أحمد الشكعة', present: true },
      { id: 'c2', name: 'يوسف خالد جودت', parent: 'خالد جودت', present: false },
      { id: 'c3', name: 'خليل سمير النابلسي', parent: 'سمير النابلسي', present: true },
    ],
    'class-flowers-4-5': [
      { id: 'c4', name: 'سارة مريم المصري', parent: 'مريم المصري', present: true },
      { id: 'c5', name: 'سلمى إبراهيم حامد', parent: 'إبراهيم حامد', present: true },
    ],
    'class-hope-2-3': [
      { id: 'c6', name: 'ليان أحمد الشكعة', parent: 'أحمد الشكعة', present: true },
      { id: 'c7', name: 'حمزة محمود القاسم', parent: 'محمود القاسم', present: false },
    ],
  });

  // Mock teacher attendance
  const [teacherAttendance, setTeacherAttendance] = useState([
    { id: 't1', name: 'أ. نورة النابلسي', class: 'روضة العصافير', time: '07:30 ص', present: true },
    { id: 't2', name: 'أ. سارة الخالد', class: 'روضة الزهور', time: '07:45 ص', present: true },
    { id: 't3', name: 'أ. منى التميمي', class: 'روضة الأمل', time: '08:00 ص', present: false },
  ]);

  const handleDateSquareClick = (dayNum) => {
    setSelectedDay(dayNum);
    if (calendarMode === 'students') {
      setStudentStep('classes_list');
    } else {
      setTeacherStep('teachers_checklist');
    }
  };

  const handleClassClick = (cls) => {
    setSelectedClass(cls);
    setStudentStep('students_checklist');
  };

  const toggleStudentCheck = (studentId) => {
    if (!selectedClass) return;
    setStudentAttendance((prev) => {
      const list = prev[selectedClass.id] || [];
      const updated = list.map((s) => (s.id === studentId ? { ...s, present: !s.present } : s));
      return { ...prev, [selectedClass.id]: updated };
    });
  };

  const toggleTeacherCheck = (teacherId) => {
    setTeacherAttendance((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, present: !t.present, time: !t.present ? '07:30 ص' : '—' } : t))
    );
  };

  const updateTeacherTime = (teacherId, newTime) => {
    setTeacherAttendance((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, time: newTime } : t))
    );
  };

  const currentStudentsList = selectedClass ? studentAttendance[selectedClass.id] || [] : [];

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="تقويم الحضور والغياب اليومي 📅"
        description="اختر مربع التاريخ من التقويم لعرض الصفوف وكشوفات الحضور"
      />

      {/* Mode Selector Tabs: Students Calendar vs Teachers Calendar (Admin Only) */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl max-w-xl">
        <button
          onClick={() => {
            setCalendarMode('students');
            setStudentStep('date_grid');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
            calendarMode === 'students' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4 ml-2" />
          تقويم أطفال الصفوف 👶
        </button>
        <button
          onClick={() => {
            setCalendarMode('teachers');
            setTeacherStep('date_grid');
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
            calendarMode === 'teachers' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 ml-2" />
          تقويم المعلمين 👩‍🏫 (يظهر للأدمن فقط)
        </button>
      </div>

      {/* ---------------- STUDENT CALENDAR WORKFLOW ---------------- */}
      {calendarMode === 'students' && (
        <div className="space-y-6">
          {/* STEP 1: Date Squares Grid */}
          {studentStep === 'date_grid' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 ml-2 text-blue-600" />
                  تقويم شهر {selectedMonth} - اضغط على مربع التاريخ لعرض الصفوف
                </h3>
              </div>

              {/* Grid of Calendar Date Squares */}
              <div className="grid grid-cols-7 gap-3">
                {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((dayName, idx) => (
                  <div key={idx} className="text-center text-xs font-bold text-gray-500 py-1">
                    {dayName}
                  </div>
                ))}

                {calendarDays.map((d) => (
                  <div
                    key={d}
                    onClick={() => handleDateSquareClick(d)}
                    className={`h-20 rounded-2xl border p-2 cursor-pointer transition-all flex flex-col justify-between hover:border-blue-500 hover:shadow-md ${
                      selectedDay === d ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    <span className="text-sm font-bold">{d}</span>
                    <span className={`text-[10px] font-semibold text-center rounded-md py-0.5 ${
                      selectedDay === d ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-700'
                    }`}>
                      اضغط لعرض الصفوف
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Classes List after clicking Date Square */}
          {studentStep === 'classes_list' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <button
                  onClick={() => setStudentStep('date_grid')}
                  className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100"
                >
                  <ArrowRight className="w-4 h-4 ml-1" />
                  الرجوع للتقويم الشهري
                </button>
                <h3 className="text-lg font-bold text-gray-900">
                  صفوف يوم {selectedDay} {selectedMonth} - اضغط على الصف لعرض الطلاب
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {classesList.map((cls) => (
                  <div
                    key={cls.id}
                    onClick={() => handleClassClick(cls)}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-base font-bold text-gray-900 mb-1">{cls.name}</h4>
                      <p className="text-xs text-gray-500 font-medium">المعلمة المسؤولة: {cls.teacher}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-xs font-bold text-blue-600">
                      <span>عرض قائمة الطلاب وحضورهم</span>
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Students Checklist after clicking Class */}
          {studentStep === 'students_checklist' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <button
                  onClick={() => setStudentStep('classes_list')}
                  className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100"
                >
                  <ArrowRight className="w-4 h-4 ml-1" />
                  الرجوع لقائمة الصفوف
                </button>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    كشف حضور {selectedClass?.name} - تاريخ {selectedDay} {selectedMonth}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">المعلمة المسؤولة: {selectedClass?.teacher}</p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {currentStudentsList.map((std) => (
                  <div
                    key={std.id}
                    onClick={() => toggleStudentCheck(std.id)}
                    className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 px-3 rounded-xl transition-colors"
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <input
                        type="checkbox"
                        checked={std.present}
                        onChange={() => toggleStudentCheck(std.id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer ml-3"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{std.name}</p>
                        <p className="text-xs text-gray-500">ولي الأمر: {std.parent}</p>
                      </div>
                    </div>

                    <div>
                      {std.present ? (
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                          حاضر 🟢
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3.5 py-1.5 rounded-full">
                          غائب 🔴
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- TEACHER CALENDAR WORKFLOW (ADMIN ONLY) ---------------- */}
      {calendarMode === 'teachers' && (
        <div className="space-y-6">
          {/* STEP 1: Date Squares Grid for Teachers */}
          {teacherStep === 'date_grid' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <ShieldCheck className="w-5 h-5 ml-2 text-emerald-600" />
                    تقويم دوام المعلمين (خاص بالأدمن فقط) - شهر {selectedMonth}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">اضغط على مربع التاريخ لعرض قائمة المعلمين وساعات الحضور</p>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-3">
                {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((dayName, idx) => (
                  <div key={idx} className="text-center text-xs font-bold text-gray-500 py-1">
                    {dayName}
                  </div>
                ))}

                {calendarDays.map((d) => (
                  <div
                    key={d}
                    onClick={() => handleDateSquareClick(d)}
                    className={`h-20 rounded-2xl border p-2 cursor-pointer transition-all flex flex-col justify-between hover:border-emerald-500 hover:shadow-md ${
                      selectedDay === d ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-105' : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    <span className="text-sm font-bold">{d}</span>
                    <span className={`text-[10px] font-semibold text-center rounded-md py-0.5 ${
                      selectedDay === d ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      عرض المعلمين
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Teachers List with Checkbox & Hour Input after clicking Date Square */}
          {teacherStep === 'teachers_checklist' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <button
                  onClick={() => setTeacherStep('date_grid')}
                  className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl hover:bg-emerald-100"
                >
                  <ArrowRight className="w-4 h-4 ml-1" />
                  الرجوع لتقويم المعلمين
                </button>

                <h3 className="text-lg font-bold text-gray-900">
                  كشف دوام المعلمين يوم {selectedDay} {selectedMonth}
                </h3>
              </div>

              <div className="divide-y divide-gray-100">
                {teacherAttendance.map((t) => (
                  <div
                    key={t.id}
                    className="py-4 flex flex-wrap items-center justify-between gap-4 px-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    {/* Teacher Checkbox & Info */}
                    <div className="flex items-center space-x-3 space-x-reverse cursor-pointer" onClick={() => toggleTeacherCheck(t.id)}>
                      <input
                        type="checkbox"
                        checked={t.present}
                        onChange={() => toggleTeacherCheck(t.id)}
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer ml-3"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-500">{t.class}</p>
                      </div>
                    </div>

                    {/* Hour Input & Attendance Status */}
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700">
                        <Clock className="w-4 h-4 ml-1.5 text-gray-500" />
                        <span>ساعة الحضور:</span>
                        <input
                          type="text"
                          value={t.time}
                          onChange={(e) => updateTeacherTime(t.id, e.target.value)}
                          className="mr-2 border border-gray-300 rounded px-2 py-0.5 text-xs text-center w-20 bg-white font-bold"
                        />
                      </div>

                      {t.present ? (
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                          حاضرة ومداومة 🟢
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3.5 py-1.5 rounded-full">
                          لم تحضر 🔴
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}