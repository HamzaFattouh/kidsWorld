import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { User, Plus, MessageSquare, AlertTriangle, Users, Mail, Phone, MapPin, Shield, Check, Calendar } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';

import { UserForm } from '../../components/forms/UserForm';
import { ChildForm } from '../../components/forms/ChildForm';
import { usersApi } from '../../api/users';
import { childApi } from '../../api/child';
import { api } from '../../lib/api';

export function ParentsPage() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState(null);

  const page = 1;
  const limit = 50;
  const role = 'PARENT';

  const { data, isLoading } = useQuery({
    queryKey: ['users', role, page, limit],
    queryFn: () => usersApi.getUsers({ page, limit, role })
  });

  const createMutation = useMutation({
    mutationFn: (payload) => usersApi.createUser({ ...payload, role: 'PARENT' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', role] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      alert(error?.response?.data?.error?.message || 'Error creating user');
    }
  });

  const addChildMutation = useMutation({
    mutationFn: (payload) => childApi.createOne({ ...payload, parentId: selectedParentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children', selectedParentId] });
      queryClient.invalidateQueries({ queryKey: ['child'] });
      setIsAddChildModalOpen(false);
      alert('تمت إضافة الطفل وربطه بولي الأمر بنجاح! ✅');
    },
    onError: (error) => {
      alert(error?.response?.data?.error?.message || 'حدث خطأ أثناء إضافة الطفل');
    }
  });

  const selectedParent = useMemo(() => {
    if (!selectedParentId || !data?.data) return null;
    return data.data.find((u) => u.id === selectedParentId) || null;
  }, [selectedParentId, data?.data]);

  // Fetch children for selected parent
  const { data: childrenData, isLoading: isLoadingChildren } = useQuery({
    queryKey: ['children', selectedParentId],
    queryFn: () => childApi.getMany({ parentId: selectedParentId }),
    enabled: !!selectedParentId && isDetailsModalOpen
  });

  // Fetch complaints/messages for selected parent
  const { data: complaintsData } = useQuery({
    queryKey: ['parent-complaints', selectedParentId],
    queryFn: async () => {
      const res = await api.get('/communication/complaints');
      const items = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
      return items.filter(c => c.parentId === selectedParentId || !c.parentId);
    },
    enabled: !!selectedParentId && isDetailsModalOpen
  });

  const columns = [
    {
      header: 'اسم ولي الأمر',
      accessorKey: 'name',
      cell: (user) => (
        <button
          onClick={() => {
            setSelectedParentId(user.id);
            setIsDetailsModalOpen(true);
          }}
          className="font-bold text-primary hover:text-primary-dark underline-offset-4 hover:underline text-start flex items-center gap-2"
        >
          <User className="w-4 h-4 text-emerald-500" />
          {user.name || (i18n.language === 'ar' ? '(بانتظار إكمال البيانات)' : '(Pending Setup)')}
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
      header: 'الإجراءات والتفاصيل',
      accessorKey: 'id',
      cell: (user) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedParentId(user.id);
              setIsDetailsModalOpen(true);
            }}
            className="px-3 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-colors"
          >
            عرض التفاصيل والأبناء والرسائل
          </button>

          <button
            onClick={() => {
              setSelectedParentId(user.id);
              setIsAddChildModalOpen(true);
            }}
            className="px-3 py-1 bg-primary text-white hover:bg-primary-dark rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            إضافة طفل
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 text-start">
      <PageHeader
        title="إدارة أولياء الأمور 👨‍👩‍👧"
        description="استعراض بيانات أولياء الأمور، الأبناء المربوطين، الرسائل والشكاوى، وإضافة طفل جديد"
        actionLabel="إضافة ولي أمر جديد"
        onAction={() => setIsCreateModalOpen(true)}
      />

      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
      />

      {/* Create Parent Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="إضافة ولي أمر جديد"
      >
        <div className="py-4">
          <UserForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending}
          />
        </div>
      </Modal>

      {/* Parent Overview, Children, Messages & Complaints Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedParentId(null);
        }}
        title="ملف ولي الأمر والأبناء والرسائل 📋"
      >
        <div className="py-4 space-y-6 text-start">
          {selectedParent ? (
            <>
              {/* Parent Profile Box */}
              <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedParent.name || 'ولي أمر بدون اسم'}
                  </h4>
                  <button
                    onClick={() => setIsAddChildModalOpen(true)}
                    className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow hover:bg-primary-dark transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    إضافة طفل لهذا الأب
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div>✉️ البريد: {selectedParent.email}</div>
                  <div>📞 الهاتف: {selectedParent.phone || '—'}</div>
                  <div>🆔 الهوية: {selectedParent.nationalId || '—'}</div>
                  <div>📍 العنوان: {selectedParent.address || 'نابلس - نابلس الجديدة'}</div>
                </div>
              </div>

              {/* Linked Children */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" />
                  الأطفال المربوطون بحساب ولي الأمر:
                </h4>

                {isLoadingChildren ? (
                  <p className="text-xs text-gray-400">جاري التحميل...</p>
                ) : childrenData?.data && childrenData.data.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {childrenData.data.map((child) => (
                      <div key={child.id} className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-xs text-emerald-900 dark:text-emerald-300">{child.name}</p>
                          <p className="text-[10px] text-gray-500">القاعة: {child.classId || 'عامة'}</p>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                          مربوط ✅
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-slate-800/40 rounded-xl text-center text-xs text-gray-500">
                    لا يوجد أطفال مربوطين بهذا الحساب حتى الآن.
                  </div>
                )}
              </div>

              {/* Messages & Complaints Feed */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                  سجل الشكاوى والرسائل المتبادلة:
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {complaintsData && complaintsData.length > 0 ? (
                    complaintsData.map((c) => (
                      <div key={c.id} className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-gray-800 space-y-1">
                        <div className="flex justify-between items-center text-xs font-bold text-gray-800 dark:text-gray-200">
                          <span>{c.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                            c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {c.status === 'RESOLVED' ? 'تم الرد ✅' : 'قيد الانتظار ⏳'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{c.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4">لا يوجد رسائل أو شكاوى سابقة مسجلة لولي الأمر هذا.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-6">جاري التحميل...</p>
          )}
        </div>
      </Modal>

      {/* Add & Link Child Modal */}
      <Modal
        isOpen={isAddChildModalOpen}
        onClose={() => setIsAddChildModalOpen(false)}
        title="إضافة طفل جديد وربطه بولي الأمر"
      >
        <div className="py-4">
          <ChildForm
            initialData={{ parentId: selectedParentId }}
            onSubmit={(childData) => addChildMutation.mutate(childData)}
            isLoading={addChildMutation.isPending}
          />
        </div>
      </Modal>
    </div>
  );
}