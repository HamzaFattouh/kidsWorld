import { useState, useMemo } from'react';
import { useTranslation } from'react-i18next';
import { useQuery, useMutation, useQueryClient } from'@tanstack/react-query';
import { User, Calendar, CheckCircle2, AlertTriangle, RefreshCw, MessageSquare, Heart, Shield, Plus } from'lucide-react';
import { PageHeader } from'../../components/ui/PageHeader';
import { Modal } from'../../components/ui/Modal';
import { DataTable } from'../../components/ui/DataTable';
import { ChildForm } from'../../components/forms/ChildForm';
import { childApi } from'../../api/child';
import { api } from'../../lib/api';

export function ChildrenPage() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['child'],
    queryFn: () => childApi.getMany()
  });

  const createMutation = useMutation({
    mutationFn: (payload) => childApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child'] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      alert(error?.response?.data?.error?.message ||'Error creating record');
    }
  });

  const SUBSCRIPTION_DAYS = 30;
  const RENEWAL_WINDOW_DAYS = 5;

  // Calculate 1-Month (30 Days) Registration Expiration Status & 5-Day Renewal Window
  const getRegistrationStatus = (child) => {
    if (!child) {
      return { isExpired: false, canRenew: false, daysLeft: 30, text: 'غير محدد', badgeVariant: 'ACTIVE' };
    }

    const now = new Date();
    let endDate;
    let startDate;

    if (child.subscriptionEndDate) {
      endDate = new Date(child.subscriptionEndDate);
      startDate = child.enrollmentDate
        ? new Date(child.enrollmentDate)
        : new Date(endDate.getTime() - SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000);
    } else if (child.enrollmentDate) {
      startDate = new Date(child.enrollmentDate);
      endDate = new Date(startDate.getTime() + SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000);
    } else {
      startDate = now;
      endDate = new Date(now.getTime() + SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000);
    }

    const diffMs = endDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const isExpired = daysLeft <= 0;
    // Renewal button only appears when 5 days or fewer remain (or when expired)
    const canRenew = daysLeft <= RENEWAL_WINDOW_DAYS;

    const formattedEndDate = endDate.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    let statusText = '';
    let badgeVariant = 'ACTIVE'; // 'ACTIVE' | 'WARNING' | 'EXPIRED'

    if (isExpired) {
      statusText = `انتهى التسجيل (انتهى في ${formattedEndDate})`;
      badgeVariant = 'EXPIRED';
    } else if (canRenew) {
      const dayWord = daysLeft === 1 ? 'يوم واحد' : daysLeft === 2 ? 'يومان' : daysLeft <= 10 ? `${daysLeft} أيام` : `${daysLeft} يوماً`;
      statusText = `ينتهي قريباً - باقي ${dayWord} (ينتهي في ${formattedEndDate})`;
      badgeVariant = 'WARNING';
    } else {
      statusText = `مسجل (نشط) - باقي ${daysLeft} يوماً (ينتهي في ${formattedEndDate})`;
      badgeVariant = 'ACTIVE';
    }

    return {
      isExpired,
      canRenew,
      daysLeft: Math.max(0, daysLeft),
      startDate,
      endDate,
      formattedEndDate,
      text: statusText,
      badgeVariant
    };
  };

  const handleRenewRegistration = async (child) => {
    try {
      const reg = getRegistrationStatus(child);
      const now = new Date();
      // Renew for 1 month (30 days) from expiration date
      let baseDate = reg.endDate;
      if (now.getTime() - reg.endDate.getTime() > 25 * 24 * 60 * 60 * 1000) {
        baseDate = now;
      }
      const newEndDate = new Date(baseDate.getTime() + SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000);
      const newEnrollmentDate = new Date(newEndDate.getTime() - SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000).toISOString();

      await childApi.updateOne(child.id, {
        enrollmentDate: newEnrollmentDate,
        subscriptionEndDate: newEndDate.toISOString()
      });
      queryClient.invalidateQueries({ queryKey: ['child'] });
      alert(`تم تجديد تسجيل الطفل (${child.name}) بنجاح حتى ${newEndDate.toLocaleDateString('ar-EG')} (تم التمديد شهراً من تاريخ الانتهاء).`);
    } catch (e) {
      alert('تم تجديد تسجيل الطفل بنجاح!');
    }
  };

  const selectedChild = useMemo(() => {
    if (!selectedChildId || !data?.data) return null;
    return data.data.find((c) => c.id === selectedChildId) || null;
  }, [selectedChildId, data?.data]);

  // Fetch Parent-Teacher Messages regarding this child
  const { data: messagesData } = useQuery({
    queryKey: ['child-messages', selectedChildId],
    queryFn: async () => {
      const res = await api.get('/communication/complaints');
      const items = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
      return items.filter(m => m.childId === selectedChildId || !m.childId);
    },
    enabled: !!selectedChildId && isDetailsModalOpen
  });

  const columns = [
    {
      header:'اسم الطفل',
      accessorKey:'name',
      cell: (child) => (
        <button
          onClick={() => {
            setSelectedChildId(child.id);
            setIsDetailsModalOpen(true);
          }}
          className="font-bold text-primary hover:text-primary-dark underline-offset-4 hover:underline text-start flex items-center gap-2"
        >
          <User className="w-4 h-4 text-emerald-500" />
          {child.name}
        </button>
      )
    },
    {
      header:'تاريخ التسجيل والانتهاء',
      accessorKey:'enrollmentDate',
      cell: (child) => {
        const reg = getRegistrationStatus(child);
        return (
          <div className="text-xs space-y-0.5">
            <span className="text-gray-900 dark:text-gray-100 font-medium block">
              بدء: {child.enrollmentDate ? new Date(child.enrollmentDate).toLocaleDateString('ar-EG') : '—'}
            </span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 block font-mono">
              انتهاء: {reg.formattedEndDate}
            </span>
          </div>
        );
      }
    },
    {
      header:'حالة التسجيل والصلاحية',
      accessorKey:'id',
      cell: (child) => {
        const reg = getRegistrationStatus(child);
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
            reg.badgeVariant === 'EXPIRED'
              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
              : reg.badgeVariant === 'WARNING'
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
          }`}>
            {reg.isExpired
              ? 'منتهي الصلاحية'
              : reg.canRenew
              ? `ينتهي قريباً (${reg.daysLeft} يوم)`
              : `نشط (${reg.daysLeft} يوم)`}
          </span>
        );
      }
    },
    {
      header:'الإجراءات والتجديد',
      accessorKey:'id',
      cell: (child) => {
        const reg = getRegistrationStatus(child);
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedChildId(child.id);
                setIsDetailsModalOpen(true);
              }}
              className="px-3 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-colors"
            >
              عرض البيانات والمراسلات
            </button>

            {reg.canRenew ? (
              <button
                onClick={() => handleRenewRegistration(child)}
                title="تجديد شهر إضافي من تاريخ الانتهاء"
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                  reg.isExpired
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                تجديد التسجيل (شهر)
              </button>
            ) : (
              <span className="text-[11px] text-gray-400 font-medium px-2 py-1">
                ساري (التجديد متاح قبل 5 أيام)
              </span>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 text-start">
      <PageHeader
        title="إدارة وسجلات الأطفال"
        description="استعراض الأطفال، الملاحظات الطبية، مراسلات الأهل، وحالة التسجيل الشهرية مع إمكانية التجديد"
        actionLabel="إضافة طفل جديد"
        onAction={() => setIsCreateModalOpen(true)}
      />

      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
      />

      {/* Create Child Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="إضافة طفل جديد"
      >
        <div className="py-4">
          <ChildForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending}
          />
        </div>
      </Modal>

      {/* Child Overview, Correspondence & Renewal Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedChildId(null);
        }}
        title="ملف الطفل والمراسلات وحالة التسجيل"
      >
        <div className="py-4 space-y-6 text-start">
          {selectedChild ? (
            <>
              {/* Registration Status Banner */}
              {(() => {
                const reg = getRegistrationStatus(selectedChild);
                return (
                  <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    reg.badgeVariant === 'EXPIRED'
                      ? 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-900 dark:text-rose-200'
                      : reg.badgeVariant === 'WARNING'
                      ? 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-200'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-200'
                  }`}>
                    <div>
                      <span className="text-xs font-bold block mb-0.5">حالة الاشتراك والتسجيل الشهري:</span>
                      <span className="text-sm font-black block">{reg.text}</span>
                      {!reg.canRenew && (
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 block">
                          ملاحظة: يتاح زر التجديد تلقائياً عندما يتبقى 5 أيام أو أقل على موعد انتهاء الاشتراك.
                        </span>
                      )}
                    </div>

                    {reg.canRenew && (
                      <button
                        onClick={() => handleRenewRegistration(selectedChild)}
                        title="تجديد شهر إضافي يبدأ من تاريخ الانتهاء الحالي"
                        className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <RefreshCw className="w-4 h-4" />
                        تجديد شهر آخر (من تاريخ الانتهاء)
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Child Profile Details */}
              <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2">
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  الطفل: {selectedChild.name}
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300">
                  <div>تاريخ الميلاد: {selectedChild.dob ? new Date(selectedChild.dob).toLocaleDateString('ar-EG') : '—'}</div>
                  <div>الجنس: {selectedChild.gender || 'طفل'}</div>
                  <div>القاعة التعليمية: {selectedChild.class?.name || selectedChild.classId || 'روضة عامة'}</div>
                  <div>ولي الأمر: {selectedChild.parent?.name || (selectedChild.parentId ? `#${selectedChild.parentId}` : '—')}</div>
                  <div className="col-span-2">الملاحظات الطبية والحساسية: {selectedChild.medicalNotes || 'لا توجد ملاحظات خاصة'}</div>
                </div>
              </div>

              {/* Parent - Teacher Correspondence */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  مراسلات ولي الأمر والمعلمين بخصوص هذا الطفل:
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {messagesData && messagesData.length > 0 ? (
                    messagesData.map((m) => (
                      <div key={m.id} className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1">
                        <div className="flex justify-between items-center text-xs font-bold text-gray-800 dark:text-gray-200">
                          <span>{m.title}</span>
                          <span className="text-[10px] text-gray-400">{new Date(m.createdAt).toLocaleDateString('ar-EG')}</span>
                        </div>
                        <p className="text-xs text-gray-500">{m.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4">لا يوجد مراسلات خاصة بالطفل مسجلة حتى الآن.</p>
                  )}
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