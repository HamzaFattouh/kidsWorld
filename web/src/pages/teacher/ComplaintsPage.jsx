import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Reply,
  Filter,
  User,
  Save,
  Baby
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { complaintApi } from '../../api/complaint';

export function TeacherComplaintsPage() {
  const { t } = useTranslation();
  const assignedClass = { id: 'class-birds-3-4', name: 'روضة العصافير (3 - 4 سنوات)' };

  const [activeTicket, setActiveTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [tickets, setTickets] = useState([
    {
      id: 't1',
      title: 'استفسار عن الملابس البديلة للطفل عمر',
      parentName: 'أحمد الشكعة',
      childName: 'عمر أحمد الشكعة',
      date: '2026-09-14',
      status: 'OPEN',
      description: 'أرجو التأكد من تغيير ملابس عمر بعد نشاط الرسم بالألوان المائية حيث لاحظت بعض البقع بالأمس.',
      teacherReply: ''
    },
    {
      id: 't2',
      title: 'ملاحظة حول وجبة الغداء',
      parentName: 'مريم المصري',
      childName: 'سارة مريم المصري',
      date: '2026-09-12',
      status: 'RESOLVED',
      description: 'سارة لم تتناول الخضار في المنزل، نرجو المساعدة في تشجيعها مع زملائها في الصف.',
      teacherReply: 'تم التنسيق مع المعلمة المساعدة وتم تناول حصة الخضار بنجاح اليوم.'
    },
    {
      id: 't3',
      title: 'إذن مغادرة مبكرة يوم الخميس القادم',
      parentName: 'خالد جودت',
      childName: 'يوسف خالد جودت',
      date: '2026-09-11',
      status: 'IN_PROGRESS',
      description: 'لدينا موعد طبيب أسنان في تمام الساعة 12:30 ظهراً، أرجو تجهيز يوسف للاستلام.',
      teacherReply: 'تم تسجيل الموعد في دفتر المتابعة وسيتم تجهيز يوسف في الوقت المحدد.'
    }
  ]);

  const openReplyModal = (ticket) => {
    setActiveTicket(ticket);
    setReplyText(ticket.teacherReply || '');
    setIsModalOpen(true);
  };

  const handleSaveReply = () => {
    if (!activeTicket) return;

    setTickets(prev => prev.map(t => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          teacherReply: replyText,
          status: 'RESOLVED'
        };
      }
      return t;
    }));

    setIsModalOpen(false);
  };

  const filteredTickets = statusFilter === 'ALL'
    ? tickets
    : tickets.filter(t => t.status === statusFilter);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">جديد / قيد الانتظار</span>;
      case 'IN_PROGRESS':
        return <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">قيد المتابعة</span>;
      case 'RESOLVED':
        return <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">تم الرد والمعالجة</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title={`استفسارات وملاحظات أولياء الأمور - ${assignedClass.name}`}
        description="الاطلاع على طلبات وملاحظات أولياء أمور طلاب الصف والرد المباشر عليها"
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        {[
          { id: 'ALL', label: 'الكل' },
          { id: 'OPEN', label: 'قيد الانتظار' },
          { id: 'IN_PROGRESS', label: 'قيد المتابعة' },
          { id: 'RESOLVED', label: 'تمت المعالجة' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setStatusFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              statusFilter === f.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.map((t) => (
          <Card key={t.id} className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
            <CardContent className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{t.title}</h4>
                    <p className="text-xs text-text-muted dark:text-text-mutedDark">
                      الطالب: <span className="font-semibold text-gray-800 dark:text-gray-200">{t.childName}</span> | ولي الأمر: {t.parentName} | التاريخ: {t.date}
                    </p>
                  </div>
                </div>
                {getStatusBadge(t.status)}
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300">
                {t.description}
              </div>

              {t.teacherReply && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                  <span className="font-bold block">رد المعلمة:</span>
                  <p>{t.teacherReply}</p>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => openReplyModal(t)}
                  className="px-4 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-primary hover:text-white text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg transition-colors border border-gray-200 dark:border-gray-700 flex items-center gap-1.5"
                >
                  <Reply className="w-3.5 h-3.5" />
                  {t.teacherReply ? 'تعديل الرد' : 'الرد على الاستفسار'}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reply Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeTicket ? `الرد على: ${activeTicket.title}` : ''}
      >
        {activeTicket && (
          <div className="space-y-4 text-right">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-xs space-y-1">
              <span className="font-bold text-gray-500">رسالة ولي الأمر:</span>
              <p className="text-gray-800 dark:text-gray-200">{activeTicket.description}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                كتابة رد المعلمة أو الإجراء المتخذ:
              </label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="أدخلي تفاصيل الرد والتأكيد على المتابعة الصفية..."
                className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-xs focus:outline-none focus:border-primary text-right"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveReply}
                className="flex-1 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> حفظ وإرسال الرد
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
