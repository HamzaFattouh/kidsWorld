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

  // Helper to load saved permissions per user ID from localStorage
  const loadPermissionsFromDb = () => {
    try {
      const raw = localStorage.getItem('kidsworld_user_permissions_db');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn(e);
    }
    return {};
  };

  const handleOpenPermissions = (user) => {
    setSelectedUserId(user.id);
    const db = loadPermissionsFromDb();
    const isTeacher = user.role === 'TEACHER';

    if (db[user.id]) {
      setUserPermissions(db[user.id]);
    } else {
      // Default role-specific permissions
      const defaultTeacherPerms = {
        recordAttendance: true,
        recordMeals: true,
        writeEvaluations: true,
        uploadJournal: true,
        manageEvents: true,
        sendMessages: true,
        viewCameras: true,
      };
      const defaultParentPerms = {
        viewReports: true,
        sendMessages: true,
        submitRequests: true,
        viewCameras: true,
        downloadDocuments: true,
      };
      setUserPermissions(isTeacher ? defaultTeacherPerms : defaultParentPerms);
    }
    setIsPermissionsModalOpen(true);
  };

  const togglePermission = (key) => {
    setUserPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePermissions = () => {
    if (!selectedUserId || !selectedUser) return;
    try {
      const db = loadPermissionsFromDb();
      const updatedDb = {
        ...db,
        [selectedUserId]: userPermissions,
      };
      localStorage.setItem('kidsworld_user_permissions_db', JSON.stringify(updatedDb));
      alert(`تم حفظ وتطبيق صلاحيات (${selectedUser.name || selectedUser.email}) بنجاح! ✅ (محفوظ دائماً)`);
    } catch (e) {
      console.warn(e);
    }
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
      header: 'الدور القيادي',
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

  // Specific permission lists for Teacher vs Parent
  const TEACHER_PERMISSIONS_LIST = [
    { key: 'recordAttendance', label: 'تسجيل وتحديث الحضور والغياب اليومي للطلاب', icon: '📅' },
    { key: 'recordMeals', label: 'تسجيل الوجبات الغذائية اليومية للأطفال', icon: '🍱' },
    { key: 'writeEvaluations', label: 'كتابة وتحديث التقييمات والملاحظات الأسبوعية', icon: '🏆' },
    { key: 'uploadJournal', label: 'رفع صور في المجلة اليومية للأطفال', icon: '📸' },
    { key: 'manageEvents', label: 'إدارة وتعديل الفعاليات والأنشطة', icon: '🎨' },
    { key: 'sendMessages', label: 'إرسال واستقبال الرسائل والشكاوى', icon: '💬' },
    { key: 'viewCameras', label: 'معاينة البث المباشر وكاميرات القاعات', icon: '📹' },
  ];

  const PARENT_PERMISSIONS_LIST = [
    { key: 'viewReports', label: 'الاطلاع ومتابعة التقييمات والملاحظات الأسبوعية للأطفال', icon: '📊' },
    { key: 'sendMessages', label: 'إرسال واستقبال الرسائل والشكاوى لإدارة الروضة', icon: '💬' },
    { key: 'submitRequests', label: 'تقديم طلبات المغادرة والإذن الاستثنائي وشخص الاستلام', icon: '📝' },
    { key: 'viewCameras', label: 'معاينة البث المباشر وكاميرات القاعات', icon: '📹' },
    { key: 'downloadDocuments', label: 'تحميل وتنزيل المستندات والملفات المرفقة', icon: '📁' },
  ];

  const currentPermissionList =
    selectedUser?.role === 'PARENT' ? PARENT_PERMISSIONS_LIST : TEACHER_PERMISSIONS_LIST;

  return (
    <div className="space-y-6 text-start" dir="rtl">
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
        title={`بيانات وصلاحيات (${selectedUser?.name || ''}) 🔐`}
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
                  <span className={`px-3 py-1 font-bold text-xs rounded-full ${
                    selectedUser.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedUser.role === 'TEACHER' ? 'معلم 👩‍🏫' : 'ولي أمر 👨‍👩‍👧'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div>📞 الهاتف: {selectedUser.phone || '—'}</div>
                  <div>📅 تاريخ الإنشاء: {new Date(selectedUser.createdAt).toLocaleDateString('ar-EG')}</div>
                </div>
              </div>

              {/* Permissions List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    صلاحيات حساب {selectedUser.role === 'TEACHER' ? 'المعلم/ة' : 'ولي الأمر'} المتاحة:
                  </h4>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                    صلاحيات مخصصة للدور
                  </span>
                </div>

                <div className="space-y-2">
                  {currentPermissionList.map((perm) => {
                    const isEnabled = userPermissions[perm.key] !== undefined ? Boolean(userPermissions[perm.key]) : true;
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
                  حفظ وتأكيد صلاحيات الحساب
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