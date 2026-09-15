import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserPlus, UserMinus, Eye, GraduationCap, ShieldCheck, Plus, Sparkles } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';

export function ClassesPage() {
  const { t } = useTranslation();

  // Mock initial classes state with teacher in charge & enrolled students
  const [classesList, setClassesList] = useState([
    {
      id: 'class-birds-3-4',
      name: 'روضة العصافير 🐥',
      ageGroup: '3 - 4 سنوات',
      capacity: 20,
      teacher: 'أ. نورة النابلسي (معلمة الصف المسؤول)',
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
      teacher: 'أ. سارة الخالد (معلمة الصف المسؤول)',
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
      teacher: 'أ. منى التميمي (معلمة الصف المسؤول)',
      teacherPhone: '0599444555',
      students: [
        { id: 'child-layan-shakaa', name: 'ليان أحمد الشكعة', gender: 'أنثى', parent: 'أحمد الشكعة' },
      ],
    },
  ]);

  // Unassigned pool of students available for addition
  const [availableStudents] = useState([
    { id: 'child-khalil', name: 'خليل سمير النابلسي', gender: 'ذكر', parent: 'سمير النابلسي' },
    { id: 'child-salma', name: 'سلمى إبراهيم حامد', gender: 'أنثى', parent: 'إبراهيم حامد' },
    { id: 'child-hamza', name: 'حمزة محمود القاسم', gender: 'ذكر', parent: 'محمود القاسم' },
  ]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isRemoveStudentModalOpen, setIsRemoveStudentModalOpen] = useState(false);
  const [newStudentToAdd, setNewStudentToAdd] = useState('');
  const [studentToRemove, setStudentToRemove] = useState('');

  const handleOpenStudentsModal = (cls) => {
    setSelectedClass(cls);
    setIsStudentsModalOpen(true);
  };

  const handleOpenAddModal = (cls) => {
    setSelectedClass(cls);
    setNewStudentToAdd('');
    setIsAddStudentModalOpen(true);
  };

  const handleOpenRemoveModal = (cls) => {
    setSelectedClass(cls);
    setStudentToRemove('');
    setIsRemoveStudentModalOpen(true);
  };

  const handleAddStudent = () => {
    if (!newStudentToAdd || !selectedClass) return;
    const studentObj = availableStudents.find((s) => s.id === newStudentToAdd);
    if (!studentObj) return;

    setClassesList((prev) =>
      prev.map((cls) => {
        if (cls.id === selectedClass.id) {
          // Prevent duplicates
          if (cls.students.some((s) => s.id === studentObj.id)) return cls;
          return { ...cls, students: [...cls.students, studentObj] };
        }
        return cls;
      })
    );

    setIsAddStudentModalOpen(false);
    alert(`تمت إضافة الطالب (${studentObj.name}) إلى صف ${selectedClass.name} بنجاح ✅`);
  };

  const handleRemoveStudent = () => {
    if (!studentToRemove || !selectedClass) return;

    setClassesList((prev) =>
      prev.map((cls) => {
        if (cls.id === selectedClass.id) {
          return {
            ...cls,
            students: cls.students.filter((s) => s.id !== studentToRemove),
          };
        }
        return cls;
      })
    );

    setIsRemoveStudentModalOpen(false);
    alert(`تم حذف الطالب من صف ${selectedClass.name} بنجاح 🗑️`);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="إدارة الصفوف والشعب 🏫"
        description="عرض الصفوف المعيّنة لكل معلمة ومتابعة قائمة الطلاب المسجلين بالصف"
      />

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classesList.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow relative"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{cls.name}</h3>
                <span className="inline-block mt-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  الفئة العمرية: {cls.ageGroup}
                </span>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            {/* Teacher Responsible */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 mb-4">
              <div className="flex items-center text-xs text-gray-500 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4 ml-1 text-emerald-600" />
                المعلمة المسؤولة عن الصف:
              </div>
              <p className="text-sm font-bold text-gray-800">{cls.teacher}</p>
            </div>

            {/* Students Counter */}
            <div className="flex justify-between items-center text-sm border-t border-b border-gray-100 py-3 mb-4">
              <span className="text-gray-600">عدد الطلاب المسجلين:</span>
              <span className="font-bold text-gray-900">
                {cls.students.length} / {cls.capacity} طفل
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleOpenStudentsModal(cls)}
                className="w-full flex items-center justify-center bg-gray-900 text-white text-sm font-semibold py-2.5 px-4 rounded-xl hover:bg-gray-800 transition-colors"
              >
                <Eye className="w-4 h-4 ml-2" />
                عرض قائمة الطلاب ({cls.students.length})
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOpenAddModal(cls)}
                  className="flex items-center justify-center bg-blue-50 text-blue-700 text-xs font-bold py-2 px-3 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <UserPlus className="w-4 h-4 ml-1" />
                  إضافة طالب
                </button>
                <button
                  onClick={() => handleOpenRemoveModal(cls)}
                  className="flex items-center justify-center bg-rose-50 text-rose-700 text-xs font-bold py-2 px-3 rounded-xl hover:bg-rose-100 transition-colors"
                >
                  <UserMinus className="w-4 h-4 ml-1" />
                  حذف طالب
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 1. Modal View Students List */}
      <Modal
        isOpen={isStudentsModalOpen}
        onClose={() => setIsStudentsModalOpen(false)}
        title={`قائمة الطلاب المسجلين - ${selectedClass?.name || ''}`}
      >
        <div className="space-y-4 py-2" dir="rtl">
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-xs text-blue-800 font-medium">
            المعلمة المسؤولة: <span className="font-bold">{selectedClass?.teacher}</span>
          </div>

          {selectedClass?.students?.length === 0 ? (
            <p className="text-center text-gray-500 py-6 text-sm">لا يوجد طلاب مسجلون في هذا الصف حالياً.</p>
          ) : (
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto pr-1">
              {selectedClass?.students?.map((std, idx) => (
                <div key={std.id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center ml-3">
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
        title={`إضافة طالب جديد - ${selectedClass?.name || ''}`}
      >
        <div className="space-y-4 py-2" dir="rtl">
          <p className="text-xs text-gray-600">اختر طفلاً من قائمة الطلاب غير الموزعين لإضافته إلى الصف:</p>
          
          <select
            value={newStudentToAdd}
            onChange={(e) => setNewStudentToAdd(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- اختر الطفل لتنسيبه --</option>
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
        title={`حذف طالب من - ${selectedClass?.name || ''}`}
      >
        <div className="space-y-4 py-2" dir="rtl">
          <p className="text-xs text-rose-600 font-medium">حدّد الطالب المراد إزالته من شعبة الصف:</p>

          <select
            value={studentToRemove}
            onChange={(e) => setStudentToRemove(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">-- اختر الطالب للحذف --</option>
            {selectedClass?.students?.map((std) => (
              <option key={std.id} value={std.id}>
                {std.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleRemoveStudent}
            disabled={!studentToRemove}
            className="w-full bg-rose-600 text-white font-bold py-3 rounded-xl hover:bg-rose-700 disabled:opacity-50 transition-colors text-sm"
          >
            تأكيد إزالة الطالب
          </button>
        </div>
      </Modal>
    </div>
  );
}