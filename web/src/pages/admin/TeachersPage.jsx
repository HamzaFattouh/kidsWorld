import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Calendar, CheckCircle2, XCircle, MessageSquare, Award, Clock, BookOpen } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import { UserForm } from '../../components/forms/UserForm';
import { usersApi } from '../../api/users';
import { api } from '../../lib/api';

export function TeachersPage() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  const page = 1;
  const limit = 50;
  const role = 'TEACHER';

  const { data, isLoading } = useQuery({
    queryKey: ['users', role, page, limit],
    queryFn: () => usersApi.getUsers({ page, limit, role })
  });

  const createMutation = useMutation({
    mutationFn: (payload) => usersApi.createUser({ ...payload, role: 'TEACHER' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', role] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      alert(error?.response?.data?.error?.message || 'Error creating user');
    }
  });

  const selectedTeacher = useMemo(() => {
    if (!selectedTeacherId || !data?.data) return null;
    return data.data.find((u) => u.id === selectedTeacherId) || null;
  }, [selectedTeacherId, data?.data]);

  // Generate Monthly Attendance Days Report with Friday Exclusion & Sync with AttendancePage DB
  const attendanceReport = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let teacherDb = null;
    try {
      const raw = localStorage.getItem('kidsworld_teacher_attendance_db');
      if (raw) teacherDb = JSON.parse(raw);
    } catch (e) {
      console.warn(e);
    }

    let fridayCount = 0;
    const daysList = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const dayOfWeek = d.getDay(); // 0 = Sun, 5 = Fri
      const isFriday = dayOfWeek === 5;

      if (isFriday) {
        fridayCount++;
      }

      const isPast = day <= today.getDate();
      let isPresent = isPast && !isFriday;

      if (teacherDb && teacherDb[day] && selectedTeacher) {
        const teacherNameKey = selectedTeacher.name || '';
        const teacherRec = teacherDb[day].find(
          (t) =>
            t.name === teacherNameKey ||
            (teacherNameKey && t.name && (t.name.includes(teacherNameKey.replace('أ. ', '')) || teacherNameKey.includes(t.name.replace('أ. ', ''))))
        );
        if (teacherRec !== undefined) {
          isPresent = isPast && !isFriday && Boolean(teacherRec.present);
        }
      }

      daysList.push({
        day,
        dateStr: d.toISOString().split('T')[0],
        isFriday,
        isPresent,
        isPast,
      });
    }

    const netWorkingDays = daysInMonth - fridayCount;
    const attendedDays = daysList.filter((d) => d.isPresent && !d.isFriday).length;
    const percentage = netWorkingDays > 0 ? Math.round((attendedDays / netWorkingDays) * 100) : 100;

    return {
      daysInMonth,
      fridayCount,
      netWorkingDays,
      attendedDays,
      percentage,
      daysList,
    };
  }, [selectedTeacherId, selectedTeacher, isAttendanceModalOpen]);

  const columns = [
    {
      header: 'اسم المعلم/ة',
      accessorKey: 'name',
      cell: (user) => (
        <button
          onClick={() => {
            setSelectedTeacherId(user.id);
            setIsDetailsModalOpen(true);
          }}
          className="font-bold text-primary hover:text-primary-dark underline-offset-4 hover:underline text-start flex items-center gap-2"
        >
          <User className="w-4 h-4 text-blue-500" />
          {user.name || (i18n.language === 'ar' ? 'معلم بدون اسم' : 'Unnamed Teacher')}
        </button>
      )
    },
    {
      header: 'البريد الإلكتروني',
      accessorKey: 'email'
    },
    {
      header: 'رقم الهاتف',
      accessorKey: 'phone',
      cell: (user) => user.phone || '—'
    },
    {
      header: 'الحالة',
      accessorKey: 'isActive',
      cell: (user) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${user.isActive ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
          {user.isActive ? 'نشط 🟢' : 'غير نشط 🔴'}
        </span>
      )
    },
    {
      header: 'تقرير الحضور والتقويم (خصم الجمعة)',
      accessorKey: 'id',
      cell: (user) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedTeacherId(user.id);
              setIsAttendanceModalOpen(true);
            }}
            className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            تقويم وتقرير الحضور (خصم الجمعة)
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 text-start">
      <PageHeader
        title="إدارة المعلمين والكادر 👩‍🏫"
        description="عرض المعلمين، تقارير الحضور والتقويم مع خصم أيام الجمعة، والرسائل والشكاوى الموجهة لهم"
        actionLabel="إضافة معلم جديد"
        onAction={() => setIsCreateModalOpen(true)}
      />

      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
      />

      {/* Create Teacher Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="إضافة معلم جديد"
      >
        <div className="py-4">
          <UserForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending}
          />
        </div>
      </Modal>

      {/* Teacher Overview & Communications Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedTeacherId(null);
        }}
        title="ملف المعلم/ة والسجل والتواصل 📋"
      >
        <div className="py-4 space-y-4 text-start">
          {selectedTeacher ? (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2">
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  {selectedTeacher.name || 'معلم بدون اسم'}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <div>✉️ البريد: {selectedTeacher.email}</div>
                  <div>📞 الهاتف: {selectedTeacher.phone || '—'}</div>
                  <div>📍 العنوان: {selectedTeacher.address || 'نابلس - نابلس الجديدة'}</div>
                  <div>📅 الانضمام: {new Date(selectedTeacher.createdAt).toLocaleDateString('ar-EG')}</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    setIsAttendanceModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  عرض تقويم وتقارير الحضور لهذا المعلم (مع خصم الجمعة)
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">جاري التحميل...</p>
          )}
        </div>
      </Modal>

      {/* Teacher Attendance Calendar & Friday Deduction Report Modal */}
      <Modal
        isOpen={isAttendanceModalOpen}
        onClose={() => {
          setIsAttendanceModalOpen(false);
          setSelectedTeacherId(null);
        }}
        title="تقرير وتقويم حضور المعلم (خصم أيام الجمعة) 📅"
      >
        <div className="py-4 space-y-6 text-start">
          {selectedTeacher ? (
            <>
              {/* Teacher Header */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  المعلم/ة: {selectedTeacher.name || selectedTeacher.email}
                </h4>
                <span className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full">
                  الشهر الحالي
                </span>
              </div>

              {/* Attendance Ratio Stats Cards */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                  <span className="block text-xl font-black text-emerald-600">{attendanceReport.attendedDays} أيام</span>
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">أيام الحضور</span>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-2xl border border-amber-200 dark:border-amber-800">
                  <span className="block text-xl font-black text-amber-600">-{attendanceReport.fridayCount} جمعة</span>
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">مخصومة (عطلة)</span>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <span className="block text-xl font-black text-blue-600">{attendanceReport.percentage}%</span>
                  <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300">نسبة الالتزام</span>
                </div>
              </div>

              {/* Attendance Formula Notice */}
              <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                📌 <span className="font-bold">معادلة النسبة:</span> إجمالي ألمجموع = {attendanceReport.daysInMonth} يوماً - {attendanceReport.fridayCount} أيام جمعة (عطلة رسمية) = {attendanceReport.netWorkingDays} يوماً صافي العمل.
              </div>

              {/* Calendar Days Grid */}
              <div className="space-y-2">
                <h5 className="font-bold text-xs text-gray-700 dark:text-gray-300">تقويم أيام الشهر:</h5>
                <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                  {attendanceReport.daysList.map((d) => (
                    <div
                      key={d.day}
                      className={`p-2 rounded-lg border font-bold flex flex-col items-center justify-center min-h-[44px] ${
                        d.isFriday
                          ? 'bg-amber-50 border-amber-200 text-amber-700'
                          : d.isPresent
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : d.isPast
                          ? 'bg-rose-50 border-rose-200 text-rose-700'
                          : 'bg-gray-50 border-gray-200 text-gray-400'
                      }`}
                    >
                      <span className="text-[10px] text-gray-400">{d.day}</span>
                      <span className="text-[11px]">
                        {d.isFriday ? 'جمعة 🌴' : d.isPresent ? 'حاضر 🟢' : d.isPast ? 'غائب 🔴' : 'مستقبل'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-6">جاري التحميل...</p>
          )}
        </div>
      </Modal>
    </div>
  );
}