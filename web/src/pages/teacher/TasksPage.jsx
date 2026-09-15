import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
  Send,
  MessageSquareText,
  User,
  ShieldCheck,
  BellRing,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { useAuthStore } from '../../store/authStore';

export function TeacherTasksPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const currentTeacherName = user?.name || 'أ. نورة النابلسي';

  // Persistent Tasks State
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem('kidsworld_tasks_db');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn(e);
    }
    return [];
  });

  const [selectedTaskToComplete, setSelectedTaskToComplete] = useState(null);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [teacherNote, setTeacherNote] = useState('');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kidsworld_tasks_db', JSON.stringify(tasks));
    } catch (e) {
      console.warn(e);
    }
  }, [tasks]);

  // Filter tasks assigned to THIS teacher (or matched by substring/name)
  const myTasks = tasks.filter((t) =>
    t.assignedTeachers?.some(
      (name) =>
        name === currentTeacherName ||
        name.includes(currentTeacherName.replace('أ. ', '')) ||
        currentTeacherName.includes(name.replace('أ. ', ''))
    )
  );

  const pendingTasks = myTasks.filter((t) => t.status === 'PENDING');
  const completedTasks = myTasks.filter((t) => t.status === 'COMPLETED');

  const handleOpenCompletionModal = (task) => {
    setSelectedTaskToComplete(task);
    setTeacherNote('');
    setIsCompletionModalOpen(true);
  };

  const handleConfirmCompletion = (e) => {
    e.preventDefault();
    if (!selectedTaskToComplete) return;

    const updatedTasks = tasks.map((t) => {
      if (t.id === selectedTaskToComplete.id) {
        return {
          ...t,
          status: 'COMPLETED',
          completedBy: currentTeacherName,
          completedAt: new Date().toISOString(),
          teacherNote: teacherNote.trim(),
          adminNotificationReceived: true,
        };
      }
      return t;
    });

    setTasks(updatedTasks);
    setIsCompletionModalOpen(false);
    alert(`تم تسجيل إنجاز المهمة بنجاح وإرسال إشعار فوري للمدير مع ملاحظتك 🔔`);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            عاجلة جداً 🔴
          </span>
        );
      case 'HIGH':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            عالية 🟠
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            متوسطة 🟡
          </span>
        );
      default:
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            منخفضة 🟢
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-start" dir="rtl">
      <PageHeader
        title="مهامي والواجبات المطلوبة 📋"
        description="عرض المهام والواجبات الموجهة إليك من إدارة الروضة مع إمكانية تأكيد الإنجاز وإرفاق ملاحظات للمدير"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 block">المعلم/ة الحالية</span>
            <span className="text-lg font-black text-gray-900 dark:text-white mt-0.5 block">{currentTeacherName}</span>
          </div>
          <ShieldCheck className="w-8 h-8 text-blue-500" />
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block">مهام قيد التنفيذ ⏳</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5 block">{pendingTasks.length} مهام</span>
          </div>
          <Clock className="w-8 h-8 text-amber-500" />
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">مهام منجزة ومرفوعة ✅</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">{completedTasks.length} مهام</span>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-blue-600" />
          قائمة المهام المطلوبة منك ({myTasks.length})
        </h3>

        {myTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="text-gray-700 dark:text-gray-300 font-bold text-sm">أحسنت! لا يوجد لديك أي مهام معلقة حالياً.</p>
            <p className="text-xs text-gray-400">أي مهمة جديدة يرسلها المدير ستظهر هنا فوراً.</p>
          </div>
        ) : (
          myTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border transition-all shadow-sm space-y-4 ${
                task.status === 'COMPLETED'
                  ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Top Meta Row */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getPriorityBadge(task.priority)}

                    {task.status === 'COMPLETED' ? (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> تم إنجازها بواسطة المعلمة ✅
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> بانتظار إنجازك ⏳
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-gray-900 dark:text-white pt-1">{task.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{task.description}</p>
                </div>
              </div>

              {/* Completion Action for Pending Tasks */}
              {task.status === 'PENDING' && (
                <div className="bg-blue-50/60 dark:bg-slate-700/50 p-4 rounded-xl border border-blue-100 dark:border-slate-600 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-blue-900 dark:text-blue-200 font-semibold">
                    💡 عندما تنتهي من تنفيذ المهمة، اضغط على الزر لتأكيد الإنجاز وإبلاغ المدير بملاحظتك.
                  </div>
                  <button
                    onClick={() => handleOpenCompletionModal(task)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    إنجاز المهمة وإرسال إشعار للمدير 🔔
                  </button>
                </div>
              )}

              {/* Finished State Details */}
              {task.status === 'COMPLETED' && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      تم تأكيد الإنجاز بنجاح
                    </span>
                    <span className="bg-emerald-200/60 dark:bg-emerald-900/60 px-2.5 py-0.5 rounded text-[11px]">
                      📅 {new Date(task.completedAt).toLocaleString('ar-EG')}
                    </span>
                  </div>

                  {task.teacherNote && (
                    <div className="text-xs text-emerald-900 dark:text-emerald-200 bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900">
                      <strong className="block text-emerald-700 dark:text-emerald-400 mb-0.5">💬 ملاحظتك التي أُرسلت للمدير:</strong>
                      {task.teacherNote}
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                    <BellRing className="w-3.5 h-3.5 text-emerald-600" />
                    تم استلام الإشعار في لوحة الإدارة بنجاح 🔔
                  </div>
                </div>
              )}

              {/* Task Dates Footer */}
              <div className="flex justify-between items-center text-[11px] text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700/60">
                <span>تاريخ التكليف: {new Date(task.createdAt).toLocaleDateString('ar-EG')}</span>
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  🗓️ آخر موعد للتسليم: {task.dueDate}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Teacher Mark Completion */}
      <Modal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        title="تأكيد إنجاز المهمة وإرسال الإشعار 🔔"
      >
        <form onSubmit={handleConfirmCompletion} className="space-y-4 py-2 text-start" dir="rtl">
          <div className="bg-blue-50 dark:bg-slate-800 p-3.5 rounded-xl border border-blue-100 dark:border-slate-700 space-y-1">
            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300">المهمة المطلوب إنجازها:</h4>
            <p className="text-sm font-black text-gray-900 dark:text-white">{selectedTaskToComplete?.title}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              أضف ملاحظة للمدير بخصوص الإنجاز (اختياري):
            </label>
            <textarea
              rows={4}
              placeholder="اكتب أية ملاحظات، نتائج، أو استفسارات أرفقتها مع المهمة..."
              value={teacherNote}
              onChange={(e) => setTeacherNote(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-slate-800 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            🔔 عند الضغط على تأكيد، سيُرسل إشعار فوري للمدير يتضمن اسمك، وقت الإنجاز، والملاحظة المكتوبة.
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors text-xs flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            تأكيد إنجاز المهمة وإرسال الإشعار للمدير 🚀
          </button>
        </form>
      </Modal>
    </div>
  );
}
