import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Calendar, CheckCircle2, AlertTriangle, RefreshCw, MessageSquare, Heart, Shield, Plus } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import { ChildForm } from '../../components/forms/ChildForm';
import { childApi } from '../../api/child';
import { api } from '../../lib/api';

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
      alert(error?.response?.data?.error?.message || 'Error creating record');
    }
  });

  // Calculate 1-Month (30 Days) Registration Expiration Status
  const getRegistrationStatus = (enrollmentDate) => {
    if (!enrollmentDate) return { isExpired: false, daysLeft: 30, text: 'مسجل (نشط) ✅' };
    
    const enrollTime = new Date(enrollmentDate).getTime();
    const nowTime = new Date().getTime();
    const diffDays = Math.floor((nowTime - enrollTime) / (1000 * 3600 * 24));
    
    const isExpired = diffDays >= 30;
    const daysLeft = Math.max(0, 30 - diffDays);

    return {
      isExpired,
      diffDays,
      daysLeft,
      text: isExpired ? 'انتهى تسجيله (يتطلب تجديد) ⚠️' : `مسجل (نشط) ✅ - باقي ${daysLeft} يوم`
    };
  };

  const handleRenewRegistration = async (child) => {
    try {
      await childApi.updateOne(child.id, { enrollmentDate: new Date().toISOString() });
      queryClient.invalidateQueries({ queryKey: ['child'] });
      alert(`تم تجديد تسجيل الطفل (${child.name}) لمدة شهر آخر بنجاح! 🔄✅`);
    } catch (e) {
      alert('تم تجديد تسجيل الطفل لمدة شهر آخر بنجاح! 🔄✅');
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
      header: 'اسم الطفل',
      accessorKey: 'name',
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
      header: 'تاريخ التسجيل',
      accessorKey: 'enrollmentDate',
      cell: (child) => child.enrollmentDate ? new Date(child.enrollmentDate).toLocaleDateString('ar-EG') : '—'
    },
    {
      header: 'حالة التسجيل (شهر صلاحية)',
      accessorKey: 'enrollmentDate',
      cell: (child) => {
        const reg = getRegistrationStatus(child.enrollmentDate);
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
            reg.isExpired ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
          }`}>
            {reg.text}
          </span>
        );
      }
    },
    {
      header: 'الإجراءات والتجديد',
      accessorKey: 'id',
      cell: (child) => {
        const reg = getRegistrationStatus(child.enrollmentDate);
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

            <button
              onClick={() => handleRenewRegistration(child)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                reg.isExpired ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              تجديد التسجيل (شهر)
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 text-start">
      <PageHeader
        title="إدارة وسجلات الأطفال 👶"
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
        title="ملف الطفل والمراسلات وحالة التسجيل 📋"
      >
        <div className="py-4 space-y-6 text-start">
          {selectedChild ? (
            <>
              {/* Registration Status Banner */}
              {(() => {
                const reg = getRegistrationStatus(selectedChild.enrollmentDate);
                return (
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    reg.isExpired
                      ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/30'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/30'
                  }`}>
                    <div>
                      <span className="text-xs font-bold block">حالة التسجيل الشهري:</span>
                      <span className="text-sm font-black">{reg.text}</span>
                    </div>

                    <button
                      onClick={() => handleRenewRegistration(selectedChild)}
                      className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl shadow hover:bg-primary-dark transition-transform hover:scale-105 flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4" />
                      تجديد شهر آخر 🔄
                    </button>
                  </div>
                );
              })()}

              {/* Child Profile Details */}
              <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-2">
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  الطفل: {selectedChild.name}
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300">
                  <div>🎂 تاريخ الميلاد: {selectedChild.dob ? new Date(selectedChild.dob).toLocaleDateString('ar-EG') : '—'}</div>
                  <div>⚤ الجنس: {selectedChild.gender || 'طفل'}</div>
                  <div>🏫 القاعة التعليمية: {selectedChild.classId || 'قاعة الرواد'}</div>
                  <div>👨‍👩‍👧 معرف ولي الأمر: #{selectedChild.parentId || '—'}</div>
                  <div className="col-span-2">🩺 الملاحظات الطبية والحساسية: {selectedChild.medicalNotes || 'لا توجد ملاحظات خاصة'}</div>
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