import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ClipboardList,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  UserCheck,
  Trash2,
  Calendar,
  MessageSquareText,
  BellRing,
  Filter,
  Flame,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../lib/api';

const TEACHERS_LIST = [
  { id: 'usr-teacher-noura', name: 'أ. نورة النابلسي', class: 'روضة العصافير' },
  { id: 'usr-teacher-sara', name: 'أ. سارة الخالد', class: 'روضة الزهور' },
  { id: 'usr-teacher-mona', name: 'أ. منى التميمي', class: 'روضة الأمل' },
];

const INITIAL_TASKS = [
  {
    id: 'task-101',
    title: 'إعداد تقارير التقييم الشهري للطلاب',
    description: 'يرجى كتابة وتحديث تقييم السلوك والتعلم لجميع أطفال الصفحة وإرسالها قبل نهاية الأسبوع.',
    priority: 'HIGH', // LOW | MEDIUM | HIGH | URGENT
    assignedTeachers: ['أ. نورة النابلسي', 'أ. سارة الخالد'],
    dueDate: '2026-09-20',
    createdAt: '2026-09-14T09:00:00.000Z',
    status: 'COMPLETED', // PENDING | COMPLETED
    completedBy: 'أ. نورة النابلسي',
    completedAt: '2026-09-15T10:30:00.000Z',
    teacherNote: 'تم إنجاز كافة تقييمات روضة العصافير بنجاح وإرسالها لأولياء الأمور.',
    adminNotificationReceived: true,
  },
  {
    id: 'task-102',
    title: 'تجهيز ركن المعرض الفني وتلوين الرسومات',
    description: 'تحضير المواد والأدوات الفنية ومساعدة الأطفال في رسم اللوحات لمعرض النشاط القادم.',
    priority: 'URGENT',
    assignedTeachers: ['أ. سارة الخالد', 'أ. منى التميمي'],
    dueDate: '2026-09-17',
    createdAt: '2026-09-15T08:00:00.000Z',
    status: 'PENDING',
    completedBy: null,
    completedAt: null,
    teacherNote: '',
    adminNotificationReceived: false,
  },
  {
    id: 'task-103',
    title: 'مراجعة وجبات التغذية والوجبات البديلة للطلاب',
    description: 'مراجعة قائمة الحساسية الغذائية والاطمئنان على تقديم الوجبات المناسبة لكل طفل.',
    priority: 'MEDIUM',
    assignedTeachers: ['أ. منى التميمي'],
    dueDate: '2026-09-18',
    createdAt: '2026-09-15T11:00:00.000Z',
    status: 'PENDING',
    completedBy: null,
    completedAt: null,
    teacherNote: '',
    adminNotificationReceived: false,
  },
];

export function TasksPage() {
  const { t } = useTranslation();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/auto/task');
      if (response?.data?.data) {
        setTasks(response.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch tasks', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const [filterTab, setFilterTab] = useState('ALL'); // ALL | PENDING | COMPLETED | URGENT
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [taskDueDate, setTaskDueDate] = useState('2026-09-20');
  const [selectedTeachers, setSelectedTeachers] = useState([]);


  const handleToggleTeacherSelection = (teacherName) => {
    if (selectedTeachers.includes(teacherName)) {
      setSelectedTeachers(selectedTeachers.filter((t) => t !== teacherName));
    } else {
      setSelectedTeachers([...selectedTeachers, teacherName]);
    }
  };

  const handleSelectAllTeachers = () => {
    if (selectedTeachers.length === TEACHERS_LIST.length) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(TEACHERS_LIST.map((t) => t.name));
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || selectedTeachers.length === 0) {
      alert('يرجى كتابة عنوان المهمة واختيار معلم واحد على الأقل.');
      return;
    }

    const newTask = {
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      priority: taskPriority,
      assignedTeachers: selectedTeachers,
      dueDate: taskDueDate,
      status: 'PENDING',
      adminNotificationReceived: false,
    };

    try {
      await api.post('/auto/task', newTask);
      await fetchTasks();
      
      setTaskTitle('');
      setTaskDescription('');
      setSelectedTeachers([]);
      setTaskPriority('MEDIUM');
      setIsCreateModalOpen(false);
      alert('تم إرسال المهمة للمعلمين بنجاح 🚀');
    } catch (e) {
      console.error('Failed to create task', e);
      alert('فشل إنشاء المهمة');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('هل أنت تأكد من إزالة هذه المهمة من السجل؟')) {
      try {
        await api.delete(`/auto/task/${taskId}`);
        await fetchTasks();
      } catch (e) {
        console.error('Failed to delete task', e);
      }
    }
  };

  // Filtered Tasks
  const filteredTasks = tasks.filter((t) => {
    if (filterTab === 'PENDING') return t.status === 'PENDING';
    if (filterTab === 'COMPLETED') return t.status === 'COMPLETED';
    if (filterTab === 'URGENT') return t.priority === 'URGENT' || t.priority === 'HIGH';
    return true;
  });

  const totalCount = tasks.length;
  const pendingCount = tasks.filter((t) => t.status === 'PENDING').length;
  const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;
  const urgentCount = tasks.filter((t) => t.priority === 'URGENT' || t.priority === 'HIGH').length;

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
        return (
          <span className="bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            عاجلة جداً 🔴
          </span>
        );
      case 'HIGH':
        return (
          <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            عالية 🟠
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            متوسطة 🟡
          </span>
        );
      default:
        return (
          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            منخفضة 🟢
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-start" dir="rtl">
      <PageHeader
        title="إدارة وتكليف المهام للمعلمين 📋"
        description="إرسال المهام اليومية والتعليمية للمعلمين مع تحديد درجة الأهمية والتفاصيل ومتابعة الإنجاز والإشعارات"
        actionLabel="إضافة مهمة جديدة للمعلمين"
        onAction={() => setIsCreateModalOpen(true)}
      />

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="text-xs font-bold text-gray-500 block">إجمالي المهام</span>
          <span className="text-2xl font-black text-gray-900 dark:text-white mt-1 block">{totalCount} مهمة</span>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 shadow-sm">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block">قيد التنفيذ ⏳</span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">{pendingCount} مهمة</span>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-sm">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">تم إنجازها ✅</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">{completedCount} مهمة</span>
        </div>

        <div className="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-200 dark:border-rose-800 shadow-sm">
          <span className="text-xs font-bold text-rose-700 dark:text-rose-300 block">مهام عاجلة / عالية 🔴</span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block">{urgentCount} مهمة</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl max-w-xl">
        {[
          { id: 'ALL', label: `الكل (${totalCount})` },
          { id: 'PENDING', label: `قيد التنفيذ ⏳ (${pendingCount})` },
          { id: 'COMPLETED', label: `المكتملة ✅ (${completedCount})` },
          { id: 'URGENT', label: `العاجلة 🔴 (${urgentCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id)}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              filterTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks Feed Cards */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-bold text-sm">لا توجد مهام في هذه القائمة حالياً.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border transition-all shadow-sm space-y-4 ${
                task.status === 'COMPLETED'
                  ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Header Row */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-[240px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getPriorityBadge(task.priority)}

                    {task.status === 'COMPLETED' ? (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> تم الإنجاز ✅
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> قيد التنفيذ ⏳
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-white pt-1">{task.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{task.description}</p>
                </div>

                {/* Delete Task Button */}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                  title="حذف المهمة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Assigned Teachers Badges */}
              <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-gray-100 dark:border-gray-700/60">
                <span className="font-bold text-gray-500 flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  المعلمين المكلفين:
                </span>
                {task.assignedTeachers.map((teacher, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-md font-bold text-[11px]"
                  >
                    {teacher}
                  </span>
                ))}
              </div>

              {/* Completion Banner if Task is Finished */}
              {task.status === 'COMPLETED' && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      تم الإنجاز بواسطة المعلم/ة: <strong className="text-emerald-950 dark:text-white">{task.completedBy}</strong>
                    </span>
                    <span className="bg-emerald-200/60 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded text-[11px]">
                      📅 {new Date(task.completedAt).toLocaleString('ar-EG')}
                    </span>
                  </div>

                  {task.teacherNote && (
                    <div className="text-xs text-emerald-900 dark:text-emerald-200 bg-white/70 dark:bg-slate-900/50 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900">
                      <strong className="block text-emerald-700 dark:text-emerald-400 mb-0.5">💬 ملاحظة المعلم/ة:</strong>
                      {task.teacherNote}
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                    <BellRing className="w-3.5 h-3.5 text-emerald-600" />
                    تم إرسال إشعار فوري للمدير بإنجاز المهمة والملاحظة 🔔
                  </div>
                </div>
              )}

              {/* Task Meta Footer */}
              <div className="flex justify-between items-center text-[11px] text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700/60">
                <span>تاريخ الإنشاء: {new Date(task.createdAt).toLocaleDateString('ar-EG')}</span>
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  🗓️ آخر موعد للتسليم: {task.dueDate}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Create New Task */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="إضافة وتكليف مهمة جديدة للمعلمين 📋"
      >
        <form onSubmit={handleCreateTask} className="space-y-4 py-2 text-start" dir="rtl">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">عنوان المهمة:</label>
            <input
              type="text"
              required
              placeholder="مثال: تحضير تقارير التقييم الأسبوعي..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-slate-800 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">وصف المهمة والتعليمات:</label>
            <textarea
              rows={3}
              placeholder="أدخل الوصف الكامل والتفاصيل المطلوبة من المعلم/ة..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-slate-800 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Teacher Selector */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                اختر المعلم أو المعلمين المكلفين:
              </label>
              <button
                type="button"
                onClick={handleSelectAllTeachers}
                className="text-[11px] text-blue-600 font-bold hover:underline"
              >
                {selectedTeachers.length === TEACHERS_LIST.length ? 'إلغاء التحديد' : 'تحديد جميع المعلمين'}
              </button>
            </div>

            <div className="space-y-2 border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-slate-800/60 max-h-40 overflow-y-auto">
              {TEACHERS_LIST.map((t) => {
                const isSelected = selectedTeachers.includes(t.name);
                return (
                  <label
                    key={t.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-700/60 cursor-pointer border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleTeacherSelection(t.name)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                      />
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{t.name}</span>
                    </div>
                    <span className="text-[10px] bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-200 px-2 py-0.5 rounded font-semibold">
                      {t.class}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Priority & Due Date Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">درجة الأهمية:</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-slate-800 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">منخفضة 🟢</option>
                <option value="MEDIUM">متوسطة 🟡</option>
                <option value="HIGH">عالية 🟠</option>
                <option value="URGENT">عاجلة جداً 🔴</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">تاريخ الاستحقاق:</label>
              <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-slate-800 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors text-xs mt-2"
          >
            تأكيد وإرسال المهمة للمعلمين 🚀
          </button>
        </form>
      </Modal>
    </div>
  );
}
