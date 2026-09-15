import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';

export function TeacherAttendancePage() {
  const { t } = useTranslation();

  // Teacher assigned class ONLY
  const teacherAssignedClass = { id: 'class-birds-3-4', name: 'روضة العصافير 🐥', teacherName: 'أ. نورة النابلسي' };

  const [selectedDay, setSelectedDay] = useState(15);
  const [selectedMonth] = useState('سبتمبر 2026');
  const [step, setStep] = useState('date_grid'); // 'date_grid' | 'checklist'

  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  // Student attendance per day for the teacher's class
  const [studentAttendanceByDay, setStudentAttendanceByDay] = useState(() => {
    const initial = {};
    for (let day = 1; day <= 30; day++) {
      initial[day] = [
        { id: 'c1', name: 'عمر أحمد الشكعة', parent: 'أحمد الشكعة', present: day % 2 === 0 },
        { id: 'c2', name: 'يوسف خالد جودت', parent: 'خالد جودت', present: day % 3 === 0 },
        { id: 'c3', name: 'خليل سمير النابلسي', parent: 'سمير النابلسي', present: true },
      ];
    }
    return initial;
  });

  const handleDateClick = (dayNum) => {
    setSelectedDay(dayNum);
    setStep('checklist');
  };

  const toggleCheck = (studentId) => {
    setStudentAttendanceByDay((prev) => {
      const dayList = prev[selectedDay] || [];
      const updated = dayList.map((s) => (s.id === studentId ? { ...s, present: !s.present } : s));
      return { ...prev, [selectedDay]: updated };
    });
  };

  const activeList = studentAttendanceByDay[selectedDay] || [];

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title={`حضور وغياب ${teacherAssignedClass.name} 📅`}
        description={`عرض كشف حضور الطلاب للصف المسؤول عنه المعلم (${teacherAssignedClass.teacherName})`}
      />

      {step === 'date_grid' ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 ml-2 text-blue-600" />
              تقويم الحضور - اضغطي على مربع التاريخ لعرض وحصر حضور صفك ({teacherAssignedClass.name})
            </h3>
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
                onClick={() => handleDateClick(d)}
                className={`h-20 rounded-2xl border p-2 cursor-pointer transition-all flex flex-col justify-between hover:border-blue-500 hover:shadow-md ${
                  selectedDay === d ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <span className="text-sm font-bold">{d}</span>
                <span className={`text-[10px] font-semibold text-center rounded-md py-0.5 ${
                  selectedDay === d ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-700'
                }`}>
                  عرض حضور الصف
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <button
              onClick={() => setStep('date_grid')}
              className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100"
            >
              <ArrowRight className="w-4 h-4 ml-1" />
              الرجوع للتقويم الشهري
            </button>

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                كشف حضور {teacherAssignedClass.name} - يوم {selectedDay} {selectedMonth}
              </h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">المعلمة المسؤولة: {teacherAssignedClass.teacherName}</p>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {activeList.map((std) => (
              <div
                key={std.id}
                onClick={() => toggleCheck(std.id)}
                className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <input
                    type="checkbox"
                    checked={std.present}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleCheck(std.id);
                    }}
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
                      حاضر اليوم ({selectedDay} {selectedMonth}) 🟢
                    </span>
                  ) : (
                    <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3.5 py-1.5 rounded-full">
                      غائب اليوم ({selectedDay} {selectedMonth}) 🔴
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