import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserPlus, UserMinus, Eye, GraduationCap, ShieldCheck, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../lib/api';

const DEFAULT_CLASSES = [
  {
    id: 'class-birds-3-4',
    name: 'روضة العصافير 🐥',
    ageGroup: '3 - 4 سنوات',
    capacity: 20,
    teacher: 'أ. نورة النابلسي',
    teacherPhone: '0599111222',
    students: [
      { id: 'child-omar-shakaa', name: 'عمر أحمد الشكعة', gender: 'ذكر', parent: 'أحمد الشكعة' },
      { id: 'child-yousef-jowdat', name: 'يوسف خالد جودت', gender: 'ذكر', parent: 'خالد جودت' },
    ],
  },
  {
    id: 'class-flowers-4-5',
    name: 'روضة الزهور 🌸',
    ageGroup: '4 - 5 سنوات',
    capacity: 22,
    teacher: 'أ. سارة الخالد',
    teacherPhone: '0599333444',
    students: [
      { id: 'child-sara-masri', name: 'سارة مريم المصري', gender: 'أنثى', parent: 'مريم المصري' },
    ],
  },
  {
    id: 'class-hope-2-3',
    name: 'روضة الأمل 🌟',
    ageGroup: '2 - 3 سنوات',
    capacity: 15,
    teacher: 'أ. منى التميمي',
    teacherPhone: '0599444555',
    students: [
      { id: 'child-layan-shakaa', name: 'ليان أحمد الشكعة', gender: 'أنثى', parent: 'أحمد الشكعة' },
    ],
  },
];

const DEFAULT_AVAILABLE_STUDENTS = [
  { id: 'child-khalil', name: 'خليل سمير النابلسي', gender: 'ذكر', parent: 'سمير النابلسي' },
  { id: 'child-salma', name: 'سلمى إبراهيم حامد', gender: 'أنثى', parent: 'إبراهيم حامد' },
  { id: 'child-hamza', name: 'حمزة محمود القاسم', gender: 'ذكر', parent: 'محمود القاسم' },
];

export function ClassesPage() {
  const { t } = useTranslation();

  const [classesList, setClassesList] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedClass, setSelectedClass] = useState(null);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isRemoveStudentModalOpen, setIsRemoveStudentModalOpen] = useState(false);
  const [newStudentToAdd, setNewStudentToAdd] = useState('');
  const [studentToRemove, setStudentToRemove] = useState('');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [classRes, childRes] = await Promise.all([
        api.get('/auto/class'),
        api.get('/auto/child'),
      ]);
      const classes = classRes.data.data || [];
      const children = childRes.data.data || [];

      const mappedClasses = classes.map(cls => ({
        ...cls,
        students: children.filter(c => c.classId === cls.id),
      }));

      setClassesList(mappedClasses);
      setAvailableStudents(children.filter(c => !c.classId));
    } catch (error) {
      console.error('Failed to load classes or students:', error);
      alert('حدث خطأ في تحميل البيانات من الخادم');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenStudentsModal = (cls) => {
    const latestCls = classesList.find((c) => c.id === cls.id) || cls;
    setSelectedClass(latestCls);
    setIsStudentsModalOpen(true);
  };

  const handleOpenAddModal = (e, cls) => {
    e.stopPropagation();
    const latestCls = classesList.find((c) => c.id === cls.id) || cls;
    setSelectedClass(latestCls);
    setNewStudentToAdd('');
    setIsAddStudentModalOpen(true);
  };

  const handleOpenRemoveModal = (e, cls) => {
    e.stopPropagation();
    const latestCls = classesList.find((c) => c.id === cls.id) || cls;
    setSelectedClass(latestCls);
    setStudentToRemove('');
    setIsRemoveStudentModalOpen(true);
  };

  const handleAddStudent = async () => {
    if (!newStudentToAdd || !selectedClass) return;
    const studentObj = availableStudents.find((s) => s.id === newStudentToAdd);
    if (!studentObj) return;

    try {
      await api.put(`/auto/child/${studentObj.id}`, { classId: selectedClass.id });
      
      const updatedClasses = classesList.map((cls) => {
        if (cls.id === selectedClass.id) {
          return { ...cls, students: [...(cls.students || []), studentObj] };
        }
        return cls;
      });

      const updatedAvailable = availableStudents.filter((s) => s.id !== studentObj.id);

      setClassesList(updatedClasses);
      setAvailableStudents(updatedAvailable);
      setSelectedClass(updatedClasses.find((c) => c.id === selectedClass.id));
      setIsAddStudentModalOpen(false);
      alert(`تمت إضافة الطالب (${studentObj.name}) إلى صف ${selectedClass.name} بنجاح ✅`);
    } catch (e) {
      alert('حدث خطأ أثناء حفظ البيانات في الخادم');
    }
  };

  const handleRemoveStudent = async () => {
    if (!studentToRemove || !selectedClass) return;

    try {
      await api.put(`/auto/child/${studentToRemove}`, { classId: null });

      let removedStudentObj = null;
      const updatedClasses = classesList.map((cls) => {
        if (cls.id === selectedClass.id) {
          removedStudentObj = (cls.students || []).find((s) => s.id === studentToRemove);
          return {
            ...cls,
            students: (cls.students || []).filter((s) => s.id !== studentToRemove),
          };
        }
        return cls;
      });

      let updatedAvailable = availableStudents;
      if (removedStudentObj) {
        updatedAvailable = [...availableStudents, removedStudentObj];
      }

      setClassesList(updatedClasses);
      setAvailableStudents(updatedAvailable);
      setSelectedClass(updatedClasses.find((c) => c.id === selectedClass.id));
      setIsRemoveStudentModalOpen(false);
      alert(`تم حذف الطالب من صف ${selectedClass.name} وإعادته لقائمة المتاحين بنجاح 🗑️`);
    } catch (e) {
      alert('حدث خطأ أثناء إزالة الطالب من الخادم');
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="إدارة الصفوف والشعب 🏫"
        description="كل صف مسئولة عنه معلمة - اضغط على الصف لعرض أسماء الطلاب المسجلين بالصف"
      />

      {/* Classes Table / Cards */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-base font-bold text-gray-900">قائمة الصفوف والمعلمين المسؤولين</h3>
          <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            إجمالي الصفوف: {classesList.length}
          </span>
        </div>

        <div className="divide-y divide-gray-200">
          {classesList.map((cls) => (
            <div
              key={cls.id}
              onClick={() => handleOpenStudentsModal(cls)}
              className="p-5 hover:bg-blue-50/50 transition-colors cursor-pointer flex flex-wrap items-center justify-between gap-4"
            >
              {/* Class Info */}
              <div className="flex items-center space-x-4 space-x-reverse min-w-[220px]">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xl">
                  🐥
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 flex items-center">
                    {cls.name}
                    <span className="mr-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-semibold">
                      {cls.ageGroup}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    عدد الطلاب المسجلين بالصف: <span className="font-bold text-gray-800">{cls.students.length} / {cls.capacity}</span>
                  </p>
                </div>
              </div>

              {/* Responsible Teacher */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 flex items-center text-emerald-800">
                <ShieldCheck className="w-5 h-5 ml-2 text-emerald-600" />
                <div>
                  <span className="block text-[11px] text-emerald-600 font-bold">المعلمة المسؤولة عن الصف:</span>
                  <span className="text-sm font-bold">{cls.teacher}</span>
                </div>
              </div>

              {/* Action Buttons: Add & Delete Students */}
              <div className="flex items-center space-x-2 space-x-reverse" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => handleOpenAddModal(e, cls)}
                  className="flex items-center bg-blue-600 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <UserPlus className="w-4 h-4 ml-1.5" />
                  إضافة طلاب للصف
                </button>

                <button
                  onClick={(e) => handleOpenRemoveModal(e, cls)}
                  className="flex items-center bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-3.5 py-2.5 rounded-xl hover:bg-rose-100 transition-colors"
                >
                  <UserMinus className="w-4 h-4 ml-1.5" />
                  حذف طلاب من الصف
                </button>

                <button
                  onClick={() => handleOpenStudentsModal(cls)}
                  className="flex items-center bg-gray-100 text-gray-800 text-xs font-bold px-3.5 py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4 ml-1.5" />
                  عرض الطلاب ({cls.students.length})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1. Modal View Students List when clicking on class */}
      <Modal
        isOpen={isStudentsModalOpen}
        onClose={() => setIsStudentsModalOpen(false)}
        title={`قائمة الطلاب المسجلين بالصف - ${selectedClass?.name || ''}`}
      >
        <div className="space-y-4 py-2" dir="rtl">
          <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-100 text-xs text-blue-900 font-semibold flex justify-between items-center">
            <span>المعلمة المسؤولة عن الصف: <strong className="text-blue-700">{selectedClass?.teacher}</strong></span>
            <span>عدد الطلاب: {selectedClass?.students?.length} طفل</span>
          </div>

          {selectedClass?.students?.length === 0 ? (
            <p className="text-center text-gray-500 py-6 text-sm">لا يوجد طلاب مسجلون في هذا الصف حالياً.</p>
          ) : (
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1">
              {selectedClass?.students?.map((std, idx) => (
                <div key={std.id} className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center ml-3">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{std.name}</p>
                      <p className="text-xs text-gray-500">ولي الأمر: {std.parent}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-semibold">
                    {std.gender}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* 2. Modal Add Student to Class */}
      <Modal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        title={`إضافة طلاب إلى ${selectedClass?.name || ''}`}
      >
        <div className="space-y-4 py-2" dir="rtl">
          <p className="text-xs text-gray-600">اختر طفلاً من القائمة لإضافته وتعيينه في هذا الصف:</p>

          <select
            value={newStudentToAdd}
            onChange={(e) => setNewStudentToAdd(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- اختر الطفل لتنسيبه للصف --</option>
            {availableStudents.map((std) => (
              <option key={std.id} value={std.id}>
                {std.name} (ولي الأمر: {std.parent})
              </option>
            ))}
          </select>

          <button
            onClick={handleAddStudent}
            disabled={!newStudentToAdd}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
          >
            تأكيد إضافة الطالب للصف
          </button>
        </div>
      </Modal>

      {/* 3. Modal Remove Student from Class */}
      <Modal
        isOpen={isRemoveStudentModalOpen}
        onClose={() => setIsRemoveStudentModalOpen(false)}
        title={`حذف طالب من ${selectedClass?.name || ''}`}
      >
        <div className="space-y-4 py-2" dir="rtl">
          <p className="text-xs text-rose-600 font-medium">اختر الطالب المراد إزالته من قائمة الطلاب المسجلين بالصف:</p>

          <select
            value={studentToRemove}
            onChange={(e) => setStudentToRemove(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">-- اختر الطالب للحذف --</option>
            {selectedClass?.students?.map((std) => (
              <option key={std.id} value={std.id}>
                {std.name} (ولي الأمر: {std.parent})
              </option>
            ))}
          </select>

          <button
            onClick={handleRemoveStudent}
            disabled={!studentToRemove}
            className="w-full bg-rose-600 text-white font-bold py-3 rounded-xl hover:bg-rose-700 disabled:opacity-50 transition-colors text-sm"
          >
            تأكيد حذف الطالب من الصف
          </button>
        </div>
      </Modal>
    </div>
  );
}