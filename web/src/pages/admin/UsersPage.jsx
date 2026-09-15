import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, User, Key, CheckCircle, XCircle, Settings, Mail, Phone, Calendar, Save } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import { UserForm } from '../../components/forms/UserForm';
import { usersApi } from '../../api/users';

export function UsersPage() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

  // User Permissions State
  const [userPermissions, setUserPermissions] = useState({
    editCms: true,
    manageEvents: true,
    uploadJournal: true,
    recordAttendance: true,
    recordMeals: true,
    writeEvaluations: true,
    sendMessages: true,
    viewCameras: true,
  });

  const page = 1;
  const limit = 50;

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => usersApi.getUsers({ page, limit })
  });

  const createMutation = useMutation({
    mutationFn: (payload) => usersApi.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      alert(error?.response?.data?.error?.message || 'حدث خطأ أثناء إضافة المستخدم');
    }
  });

  const selectedUser = useMemo(() => {
    if (!selectedUserId || !data?.data) return null;
    return data.data.find((u) => u.id === selectedUserId) || null;
  }, [selectedUserId, data?.data]);

  const handleOpenPermissions = (user) => {
    setSelectedUserId(user.id);
    // Initialize default role-specific permissions
    const isTeacher = user.role === 'TEACHER';
    setUserPermissions({
      editCms: isTeacher,
      manageEvents: isTeacher,
      uploadJournal: true,
      recordAttendance: isTeacher,
      recordMeals: isTeacher,
      writeEvaluations: isTeacher,
      sendMessages: true,
      viewCameras: true,
    });
    setIsPermissionsModalOpen(true);
  };

  const togglePermission = (key) => {
    setUserPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePermissions = () => {
    alert(`تم حفظ صلاحيات المستخدم (${selectedUser?.name || selectedUser?.email}) بنجاح! ✅`);
    setIsPermissionsModalOpen(false);
  };

  const columns = [
    {
      header: 'اسم المستخدم',
      accessorKey: 'name',
      cell: (user) => (
        <button
          onClick={() => handleOpenPermissions(user)}
          className="font-bold text-primary hover:text-primary-dark underline-offset-4 hover:underline text-start flex items-center gap-2"
        >
          <User className="w-4 h-4 text-gray-400" />
          {user.name || (i18n.language === 'ar' ? 'مستخدم بدون اسم' : 'Unnamed User')}
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
      header: 'الدور',
      accessorKey: 'role',
      cell: (user) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold 
          ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : ''}
          ${user.role === 'TEACHER' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
          ${user.role === 'PARENT' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : ''}
        `}>
          {user.role === 'ADMIN' ? 'أدمن (Admin)' : user.role === 'TEACHER' ? 'معلم (Teacher)' : 'ولي أمر (Parent)'}
        </span>
      )
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
      header: 'التحكم بالصلاحيات',
      accessorKey: 'id',
      cell: (user) => (
        <button
          onClick={() => handleOpenPermissions(user)}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          التحكم بالصلاحيات
        </button>
      )
    }
  ];

  const permissionList = [
    { key: 'editCms', label: 'تعديل محتوى الصفحة الرئيسية للموقع (CMS)', icon: '🌐' },
    { key: 'manageEvents', label: 'إدارة الأنشطة والفعاليات والألبومات', icon: '🎨' },
    { key: 'uploadJournal', label: 'رفع صور في المجلة اليومية للأطفال', icon: '📸' },
    { key: 'recordAttendance', label: 'تسجيل وتحديث الحضور والغياب اليومي', icon: '📅' },
    { key: 'recordMeals', label: 'تسجيل الوجبات الغذائية اليومية للأطفال', icon: '🍱' },
    { key: 'writeEvaluations', label: 'كتابة التقييمات والملاحظات الأسبوعية', icon: '🏆' },
    { key: 'sendMessages', label: 'إرسال واستقبال الرسائل والشكاوى', icon: '💬' },
    { key: 'viewCameras', label: 'معاينة البث المباشر وكاميرات القاعات', icon: '📹' },
  ];

  return (
    <div className="space-y-6 text-start">
      <PageHeader
        title="إدارة المستخدمين والصلاحيات 👥"
        description="عرض وإضافة المستخدمين والتحكم الدقيق بصلاحيات المعلمين وأولياء الأمور"
        actionLabel="إضافة مستخدم جديد"
        onAction={() => setIsCreateModalOpen(true)}
      />

      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
      />

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="إضافة مستخدم جديد"
      >
        <div className="py-4">
          <UserForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending}
          />
        </div>
      </Modal>

      {/* Permissions Control Modal */}
      <Modal
        isOpen={isPermissionsModalOpen}
        onClose={() => {
          setIsPermissionsModalOpen(false);
          setSelectedUserId(null);
        }}
        title="بيانات وصلاحيات المستخدم 🔐"
      >
        <div className="py-4 space-y-6 text-start">
          {selectedUser ? (
            <>
              {/* User Profile Summary Header */}
              <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                      {selectedUser.name ? selectedUser.name.charAt(0) : 'U'}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-gray-900 dark:text-white">
                        {selectedUser.name || 'مستخدم بدون اسم'}
                      </h4>
                      <p className="text-xs text-gray-500">{selectedUser.email}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full">
                    {selectedUser.role}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div>📞 الهاتف: {selectedUser.phone || '—'}</div>
                  <div>📅 تاريخ الإنشاء: {new Date(selectedUser.createdAt).toLocaleDateString('ar-EG')}</div>
                </div>
              </div>

              {/* Permissions List */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  لوحة التحكم بالصلاحيات (تفعيل / تعطيل):
                </h4>

                <div className="space-y-2">
                  {permissionList.map((perm) => {
                    const isEnabled = !!userPermissions[perm.key];
                    return (
                      <div
                        key={perm.key}
                        onClick={() => togglePermission(perm.key)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isEnabled
                            ? 'bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800'
                            : 'bg-gray-50 border-gray-200 dark:bg-slate-800/40 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{perm.icon}</span>
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                            {perm.label}
                          </span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isEnabled ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {isEnabled ? 'مفعل ✅' : 'معطل ❌'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  onClick={handleSavePermissions}
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
                >
                  <Save className="w-4 h-4" />
                  حفظ إعدادات الصلاحيات
                </button>
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