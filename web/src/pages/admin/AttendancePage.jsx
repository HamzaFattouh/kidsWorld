import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, ShieldCheck, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useAuthStore } from '../../store/authStore';

export function AttendancePage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const isTeacher = user?.role === 'TEACHER';
  const TODAY_DAY = 15; // Today is September 15th

  // Calendar mode: 'students' | 'teachers'
  const [calendarMode, setCalendarMode] = useState('students');

  // Selected date square (1 to 30)
  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedMonth] = useState('سبتمبر 2026');

  // Student workflow steps: 'date_grid' -> 'classes_list' -> 'students_checklist'
  const [studentStep, setStudentStep] = useState('date_grid');
  const [selectedClass, setSelectedClass] = useState(null);

  // Teacher workflow steps: 'date_grid' -> 'teachers_checklist'
  const [teacherStep, setTeacherStep] = useState('date_grid');

  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  // All classes
  const allClasses = [
    { id: 'class-birds-3-4', name: 'روضة العصافير 🐥', teacherName: 'أ. نورة النابلسي' },
    { id: 'class-flowers-4-5', name: 'روضة الزهور 🌸', teacherName: 'أ. سارة الخالد' },
    { id: 'class-hope-2-3', name: 'روضة الأمل 🌟', teacherName: 'أ. منى التميمي' },
  ];

  // If user is a teacher, restrict visible classes ONLY to their assigned class!
  const teacherClass = allClasses[0]; // Assigned class for teacher
  const visibleClasses = isTeacher ? [teacherClass] : allClasses;

  // Persistent Student Attendance State BY DAY
  const [studentAttendanceByDay, setStudentAttendanceByDay] = useState(() => {
    try {
      const raw = localStorage.getItem('kidsworld_student_attendance_db');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn(e);
    }
    const initial = {};
    for (let day = 1; day <= 30; day++) {
      const isFuture = day > TODAY_DAY;
      initial[day] = {
        'class-birds-3-4': [
          { id: 'c1', name: 'عمر أحمد الشكعة', parent: 'أحمد الشكعة', present: isFuture ? false : day % 2 === 0 },
          { id: 'c2', name: 'يوسف خالد جودت', parent: 'خالد جودت', present: isFuture ? false : day % 3 === 0 },
          { id: 'c3', name: 'خليل سمير النابلسي', parent: 'سمير النابلسي', present: isFuture ? false : true },
        ],
        'class-flowers-4-5': [
          { id: 'c4', name: 'سارة مريم المصري', parent: 'مريم المصري', present: isFuture ? false : true },
          { id: 'c5', name: 'سلمى إبراهيم حامد', parent: 'إبراهيم حامد', present: isFuture ? false : day % 4 !== 0 },
        ],
        'class-hope-2-3': [
          { id: 'c6', name: 'ليان أحمد الشكعة', parent: 'أحمد الشكعة', present: isFuture ? false : true },
          { id: 'c7', name: 'حمزة محمود القاسم', parent: 'محمود القاسم', present: false },
        ],
      };
    }
    return initial;
  });

  // Persistent Teacher Attendance State BY DAY
  // ALL teachers default to present: true for current/past days (days <= 15)
  const [teacherAttendanceByDay, setTeacherAttendanceByDay] = useState(() => {
    try {
      const raw = localStorage.getItem('kidsworld_teacher_attendance_db');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn(e);
    }
    const initial = {};
    for (let day = 1; day <= 30; day++) {
      const isFuture = day > TODAY_DAY;
      initial[day] = [
        { id: 't1', name: 'أ. نورة النابلسي', class: 'روضة العصافير', time: isFuture ? '—' : '07:30 ص', present: isFuture ? false : true },
        { id: 't2', name: 'أ. سارة الخالد', class: 'روضة الزهور', time: isFuture ? '—' : '07:45 ص', present: isFuture ? false : true },
        { id: 't3', name: 'أ. منى التميمي', class: 'روضة الأمل', time: isFuture ? '—' : '08:00 ص', present: isFuture ? false : true },
      ];
    }
    return initial;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kidsworld_student_attendance_db', JSON.stringify(studentAttendanceByDay));
    } catch (e) {
      console.warn(e);
    }
  }, [studentAttendanceByDay]);

  useEffect(() => {
    try {
      localStorage.setItem('kidsworld_teacher_attendance_db', JSON.stringify(teacherAttendanceByDay));
    } catch (e) {
      console.warn(e);
    }
  }, [teacherAttendanceByDay]);

  const handleDateSquareClick = (dayNum) => {
    setSelectedDay(dayNum);
    if (calendarMode === 'students') {
      if (isTeacher) {
        setSelectedClass(teacherClass);
        setStudentStep('students_checklist');
      } else {
        setStudentStep('classes_list');
      }
    } else {
      setTeacherStep('teachers_checklist');
    }
  };

  const handleClassClick = (cls) => {
    setSelectedClass(cls);
    setStudentStep('students_checklist');
  };

  // Toggle student attendance for selectedDay & classId
  const toggleStudentCheck = (studentId) => {
    if (!selectedClass) return;
    setStudentAttendanceByDay((prev) => {
      const dayData = prev[selectedDay] || {};
      const classStudents = dayData[selectedClass.id] || [];
      const updatedStudents = classStudents.map((std) =>
        std.id === studentId ? { ...std, present: !std.present } : std
      );
      return {
        ...prev,
        [selectedDay]: {
          ...dayData,
          [selectedClass.id]: updatedStudents,
        },
      };
    });
  };

  // Toggle teacher attendance for selectedDay
  const toggleTeacherCheck = (teacherId) => {
    setTeacherAttendanceByDay((prev) => {
      const dayList = prev[selectedDay] || [];
      const updatedList = dayList.map((t) =>
        t.id === teacherId ? { ...t, present: !t.present, time: !t.present ? '07:30 ص' : '—' } : t
      );
      return { ...prev, [selectedDay]: updatedList };
    });
  };

  const updateTeacherTime = (teacherId, newTime) => {
    setTeacherAttendanceByDay((prev) => {
      const dayList = prev[selectedDay] || [];
      const updatedList = dayList.map((t) => (t.id === teacherId ? { ...t, time: newTime } : t));
      return { ...prev, [selectedDay]: updatedList };
    });
  };

  // Active list for current selectedDay & class
  const activeStudentList =
    selectedClass && studentAttendanceByDay[selectedDay]?.[selectedClass.id]
      ? studentAttendanceByDay[selectedDay][selectedClass.id]
      : [];

  const activeTeacherList = teacherAttendanceByDay[selectedDay] || [];

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="تقويم الحضور والغياب اليومي 📅"
        description="اختر مربع التاريخ في التقويم لعرض وتأكيد حضور وغياب اليوم المحدد"
      />

      {/* Mode Selector Tabs */}
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

        {/* Teacher Calendar is visible ONLY for Admin */}
        {!isTeacher && (
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
            تقويم المعلمين 👩‍🏫 (خاص بالأدمن)
          </button>
        )}
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
                  تقويم شهر {selectedMonth} - اضغط على مربع التاريخ لعرض الحضور
                </h3>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  تاريخ اليوم: {TODAY_DAY} {selectedMonth}
                </span>
              </div>

              {/* Grid of 30 Calendar Date Squares */}
              <div className="grid grid-cols-7 gap-3">
                {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((dayName, idx) => (
                  <div key={idx} className="text-center text-xs font-bold text-gray-500 py-1">
                    {dayName}
                  </div>
                ))}

                {calendarDays.map((d) => {
                  const isFuture = d > TODAY_DAY;
                  return (
                    <div
                      key={d}
                      onClick={() => handleDateSquareClick(d)}
                      className={`h-20 rounded-2xl border p-2 cursor-pointer transition-all flex flex-col justify-between hover:border-blue-500 hover:shadow-md ${
                        selectedDay === d
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                          : isFuture
                          ? 'bg-gray-50/70 border-gray-200 text-gray-400'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold">{d}</span>
                        {isFuture && <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 rounded">قادم</span>}
                      </div>
                      <span
                        className={`text-[10px] font-semibold text-center rounded-md py-0.5 ${
                          selectedDay === d
                            ? 'bg-blue-700 text-white'
                            : isFuture
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {isTeacher ? 'عرض حضور صفك' : 'عرض الصفوف'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Classes List after clicking Date Square (Admin View Only) */}
          {studentStep === 'classes_list' && !isTeacher && (
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
                {visibleClasses.map((cls) => (
                  <div
                    key={cls.id}
                    onClick={() => handleClassClick(cls)}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-5 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-base font-bold text-gray-900 mb-1">{cls.name}</h4>
                      <p className="text-xs text-gray-500 font-medium">المعلمة المسؤولة: {cls.teacherName}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center text-xs font-bold text-blue-600">
                      <span>عرض كشف الحضور والـ Checkbox</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Students Checklist with SMOOTH & RESPONSIVE CHECKBOXES */}
          {studentStep === 'students_checklist' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <button
                  onClick={() => (isTeacher ? setStudentStep('date_grid') : setStudentStep('classes_list'))}
                  className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100"
                >
                  <ArrowRight className="w-4 h-4 ml-1" />
                  {isTeacher ? 'الرجوع للتقويم الشهري' : 'الرجوع لقائمة الصفوف'}
                </button>

                <div className="text-right">
                  <h3 className="text-lg font-bold text-gray-900">
                    كشف حضور {selectedClass?.name} - يوم {selectedDay} {selectedMonth}
                    {selectedDay > TODAY_DAY && <span className="mr-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">(تاريخ قادم - غير معبأ تلقائياً)</span>}
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold mt-1">
                    المعلمة المسؤولة: <strong className="text-gray-800">{selectedClass?.teacherName}</strong>
                  </p>
                </div>
              </div>

              {/* Student Checklist Table */}
              <div className="divide-y divide-gray-100">
                {activeStudentList.map((std) => (
                  <div
                    key={std.id}
                    className="py-4 flex items-center justify-between hover:bg-gray-50 px-3 rounded-xl transition-colors"
                  >
                    <label className="flex items-center space-x-3 space-x-reverse cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={std.present}
                        onChange={() => toggleStudentCheck(std.id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer ml-3 accent-blue-600"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{std.name}</p>
                        <p className="text-xs text-gray-500">ولي الأمر: {std.parent}</p>
                      </div>
                    </label>

                    <div className="cursor-pointer" onClick={() => toggleStudentCheck(std.id)}>
                      {std.present ? (
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                          حاضر اليوم ({selectedDay} {selectedMonth}) 🟢
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3.5 py-1.5 rounded-full">
                          غائب / لم يسجل ({selectedDay} {selectedMonth}) 🔴
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
      {calendarMode === 'teachers' && !isTeacher && (
        <div className="space-y-6">
          {/* STEP 1: Date Squares Grid for Teachers */}
          {teacherStep === 'date_grid' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <ShieldCheck className="w-5 h-5 ml-2 text-emerald-600" />
                    تقويم دوام المعلمين (خاص بالأدمن) - شهر {selectedMonth}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">اضغط على مربع التاريخ لعرض قائمة دوام وساعات المعلمات</p>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-3">
                {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((dayName, idx) => (
                  <div key={idx} className="text-center text-xs font-bold text-gray-500 py-1">
                    {dayName}
                  </div>
                ))}

                {calendarDays.map((d) => {
                  const isFuture = d > TODAY_DAY;
                  return (
                    <div
                      key={d}
                      onClick={() => handleDateSquareClick(d)}
                      className={`h-20 rounded-2xl border p-2 cursor-pointer transition-all flex flex-col justify-between hover:border-emerald-500 hover:shadow-md ${
                        selectedDay === d
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-105'
                          : isFuture
                          ? 'bg-gray-50/70 border-gray-200 text-gray-400'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold">{d}</span>
                        {isFuture && <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 rounded">قادم</span>}
                      </div>
                      <span
                        className={`text-[10px] font-semibold text-center rounded-md py-0.5 ${
                          selectedDay === d ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        عرض المعلمين
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Teachers List with Checkbox & Hour Input for selectedDay */}
          {teacherStep === 'teachers_checklist' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <button
                  onClick={() => setTeacherStep('date_grid')}
                  className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl hover:bg-emerald-100"
                >
                  <ArrowRight className="w-4 h-4 ml-1" />
                  الرجوع لتقويم المعلمين الشهري
                </button>

                <h3 className="text-lg font-bold text-gray-900">
                  كشف دوام المعلمات يوم {selectedDay} {selectedMonth}
                </h3>
              </div>

              <div className="divide-y divide-gray-100">
                {activeTeacherList.map((t) => (
                  <div
                    key={t.id}
                    className="py-4 flex flex-wrap items-center justify-between gap-4 px-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <label className="flex items-center space-x-3 space-x-reverse cursor-pointer">
                      <input
                        type="checkbox"
                        checked={t.present}
                        onChange={() => toggleTeacherCheck(t.id)}
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer ml-3 accent-emerald-600"
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{t.name}</p>
                        <p className="text-xs text-gray-500">الصف المسؤول عنه: {t.class}</p>
                      </div>
                    </label>

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

                      <div className="cursor-pointer" onClick={() => toggleTeacherCheck(t.id)}>
                        {t.present ? (
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                            مداومة يوم ({selectedDay} {selectedMonth}) 🟢
                          </span>
                        ) : (
                          <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3.5 py-1.5 rounded-full">
                            لم تحضر 🔴
                          </span>
                        )}
                      </div>
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