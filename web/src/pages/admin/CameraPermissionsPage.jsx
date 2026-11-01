import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RotateCcw,
  Camera,
  Video,
  Eye,
  Info,
  Baby,
  Edit3,
  Save,
  Check,
  Ban
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { cameraApi } from '../../api/camera';

// Fallback seed data if backend is starting
const FALLBACK_USERS = [
  {
    id: 'user-parent-001',
    name: 'أحمد الشكعة',
    email: 'ahmed.parent@gmail.com',
    phone: '0599888777',
    role: 'PARENT',
    children: [
      { id: 'c1', name: 'عمر أحمد الشكعة', classId: 'class-sleep-2', className: 'قسم الصغار (سنتين)' },
      { id: 'c2', name: 'ليان أحمد الشكعة', classId: 'class-sleep-1', className: 'قسم الرضّع (سنة واحدة)' }
    ],
    overrides: {}
  },
  {
    id: 'user-parent-002',
    name: 'مريم المصري',
    email: 'marian.parent@gmail.com',
    phone: '0599555666',
    role: 'PARENT',
    children: [
      { id: 'c3', name: 'سارة مريم المصري', classId: 'class-sleep-3', className: 'قسم البراعم (3 سنوات)' }
    ],
    overrides: {}
  },
  {
    id: 'user-teacher-001',
    name: 'أ. نورة النابلسي',
    email: 'nora@kidsworld.com',
    phone: '0599111222',
    role: 'TEACHER',
    assignedClass: 'class-sleep-2',
    children: [],
    overrides: {}
  },
  {
    id: 'user-teacher-002',
    name: 'أ. سارة الخالد',
    email: 'sara@kidsworld.com',
    phone: '0599333444',
    role: 'TEACHER',
    assignedClass: 'class-sleep-3',
    children: [],
    overrides: {}
  }
];

const FALLBACK_CAMERAS = [
  { id: 'cam-sleep-1', name: 'غرفة نوم (سنة)', streamUrl: 'cam1', className: 'قسم الرضّع', isPlayroom: false },
  { id: 'cam-sleep-2', name: 'غرفة نوم (سنتين)', streamUrl: 'cam2', className: 'قسم الصغار', isPlayroom: false },
  { id: 'cam-sleep-3', name: 'غرفة نوم (3 سنوات)', streamUrl: 'cam3', className: 'قسم البراعم', isPlayroom: false },
  { id: 'cam-sleep-4', name: 'غرفة نوم (4 سنوات)', streamUrl: 'cam4', className: 'قسم الروضة', isPlayroom: false },
  { id: 'cam-play-1', name: 'غرفة الألعاب (الحركية)', streamUrl: 'cam5', className: 'أنشطة حركية', isPlayroom: true },
  { id: 'cam-play-2', name: 'غرفة الألعاب (الرسم)', streamUrl: 'cam6', className: 'ألعاب هادئة', isPlayroom: true },
  { id: 'cam-play-3', name: 'غرفة الألعاب (الساحة)', streamUrl: 'cam7', className: 'ساحة مركزية', isPlayroom: true }
];

export function CameraPermissionsPage() {
  const queryClient = useQueryClient();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // 'ALL' | 'PARENT' | 'TEACHER'
  const [overrideFilter, setOverrideFilter] = useState('ALL'); // 'ALL' | 'CUSTOM_ONLY'

  // Edit Permissions Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOverrides, setUserOverrides] = useState({});

  // Query permissions matrix from API
  const { data: responseData, isLoading } = useQuery({
    queryKey: ['camera-permissions'],
    queryFn: () => cameraApi.getPermissionsMatrix(),
    retry: 1
  });

  const cameras = responseData?.data?.cameras || FALLBACK_CAMERAS;
  const rawUsers = responseData?.data?.users || FALLBACK_USERS;

  // Mutation: Save overrides
  const saveMutation = useMutation({
    mutationFn: ({ userId, overrides }) => cameraApi.updateUserPermissions(userId, overrides),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['camera-permissions'] });
      setSelectedUser(null);
    },
    onError: (err) => {
      alert(err.response?.data?.error || err.message || 'حدث خطأ أثناء حفظ الصلاحيات');
    }
  });

  // Mutation: Reset overrides to default
  const resetMutation = useMutation({
    mutationFn: (userId) => cameraApi.resetUserPermissions(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['camera-permissions'] });
      setSelectedUser(null);
    }
  });

  // Open Edit Modal for a user
  const openEditModal = (user) => {
    setSelectedUser(user);
    setUserOverrides({ ...(user.overrides || {}) });
  };

  // Set permission for a camera in modal ('ALLOW' | 'DENY' | 'DEFAULT')
  const setCameraStatus = (camId, status) => {
    setUserOverrides((prev) => {
      const updated = { ...prev };
      if (status === 'DEFAULT') {
        delete updated[camId];
      } else {
        updated[camId] = status;
      }
      return updated;
    });
  };

  // Bulk actions in modal
  const allowAllCameras = () => {
    const updated = {};
    cameras.forEach((cam) => {
      updated[cam.id] = 'ALLOW';
    });
    setUserOverrides(updated);
  };

  const denyAllCameras = () => {
    const updated = {};
    cameras.forEach((cam) => {
      updated[cam.id] = 'DENY';
    });
    setUserOverrides(updated);
  };

  const resetAllToDefault = () => {
    setUserOverrides({});
  };

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return rawUsers.filter((u) => {
      // Role filter
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;

      // Override filter
      const hasCustom = u.overrides && Object.keys(u.overrides).length > 0;
      if (overrideFilter === 'CUSTOM_ONLY' && !hasCustom) return false;

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = u.name?.toLowerCase().includes(term);
        const matchesEmail = u.email?.toLowerCase().includes(term);
        const matchesPhone = u.phone?.includes(term);
        const matchesChild = (u.children || []).some((c) => c.name?.toLowerCase().includes(term));
        return matchesName || matchesEmail || matchesPhone || matchesChild;
      }

      return true;
    });
  }, [rawUsers, roleFilter, overrideFilter, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = rawUsers.length;
    const parents = rawUsers.filter((u) => u.role === 'PARENT').length;
    const teachers = rawUsers.filter((u) => u.role === 'TEACHER').length;
    const custom = rawUsers.filter((u) => u.overrides && Object.keys(u.overrides).length > 0).length;
    return { total, parents, teachers, custom };
  }, [rawUsers]);

  return (
    <div className="space-y-6 select-none" dir="rtl">
      {/* 1. Page Header */}
      <PageHeader
        title="صلاحيات وأذونات الكاميرات"
        description="التحكم الكامل في السماح والمنع لأي مستخدم لمشاهدة كاميرات محددة، مع ضبط الوضع الافتراضي"
      />

      {/* 2. Default Rule Guidance Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 flex items-start space-x-3 space-x-reverse">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 ml-2" />
        <div className="text-xs text-text dark:text-gray-200 leading-relaxed">
          <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm mb-1">
            قاعدة الصلاحيات الافتراضية للنظام
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            • <strong>الوضع الافتراضي:</strong> يشاهد كل ولي أمر تلقائياً كاميرا الصف الموجود فيه طفله + جميع كاميرات غرفة الألعاب الـ 3 (مرفق مشترك).
            <br />
            • <strong>الاستثناءات والتحكم:</strong> يمكنك في هذه الصفحة منح سماح مخصص لكاميرات إضافية أو فرض حظر مخصص لأي مستخدم عن كاميرا معينة بضغطة زر.
          </p>
        </div>
      </div>

      {/* 3. Stats KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">إجمالي المستخدمين</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">أولياء الأمور</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.parents}</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">المعلمات</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.teachers}</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">أذونات مخصصة نشطة</p>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.custom}</p>
        </div>
      </div>

      {/* 4. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالاسم أو الهاتف أو اسم الطفل..."
            className="w-full pl-3 pr-9 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 space-x-reverse w-full sm:w-auto">
          <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold">
            <button
              onClick={() => setRoleFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                roleFilter === 'ALL'
                  ? 'bg-surface dark:bg-surface-dark text-emerald-600 dark:text-emerald-400 border border-gray-200 dark:border-gray-800'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setRoleFilter('PARENT')}
              className={`px-3 py-1.5 rounded-lg transition ${
                roleFilter === 'PARENT'
                  ? 'bg-surface dark:bg-surface-dark text-emerald-600 dark:text-emerald-400 border border-gray-200 dark:border-gray-800'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
              }`}
            >
              أولياء الأمور
            </button>
            <button
              onClick={() => setRoleFilter('TEACHER')}
              className={`px-3 py-1.5 rounded-lg transition ${
                roleFilter === 'TEACHER'
                  ? 'bg-surface dark:bg-surface-dark text-emerald-600 dark:text-emerald-400 border border-gray-200 dark:border-gray-800'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
              }`}
            >
              المعلمات
            </button>
          </div>

          <button
            onClick={() => setOverrideFilter(overrideFilter === 'ALL' ? 'CUSTOM_ONLY' : 'ALL')}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition ${
              overrideFilter === 'CUSTOM_ONLY'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-surface dark:bg-surface-dark text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300'
            }`}
          >
            المعدلة يدوياً فقط
          </button>
        </div>
      </div>

      {/* 5. Permissions Matrix Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-semibold">
              <tr>
                <th className="p-3.5 min-w-[200px]">المستخدم والتصنيف</th>
                <th className="p-3.5 min-w-[160px]">الأطفال / الصفوف</th>
                {cameras.map((cam) => (
                  <th key={cam.id} className="p-3 text-center min-w-[105px]">
                    <div className="truncate font-bold text-gray-800 dark:text-gray-200">
                      {cam.name.replace('الأطفال', '').trim()}
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono block">
                      {cam.streamUrl?.toUpperCase() || 'CAM'}
                    </span>
                  </th>
                ))}
                <th className="p-3.5 text-center min-w-[120px]">التحكم بالصلاحيات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredUsers.map((user) => {
                const userChildren = user.children || [];
                const userClassIds = userChildren.map((c) => c.classId);
                if (user.assignedClass) userClassIds.push(user.assignedClass);

                const hasCustom = user.overrides && Object.keys(user.overrides).length > 0;

                return (
                  <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition">
                    {/* User Info */}
                    <td className="p-3.5">
                      <div className="flex items-center space-x-2.5 space-x-reverse">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5 space-x-reverse">
                            <span className="font-bold text-gray-900 dark:text-white">{user.name}</span>
                            {hasCustom && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                مخصص
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400 font-mono">{user.phone || user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Children / Class Info */}
                    <td className="p-3.5">
                      {user.role === 'PARENT' ? (
                        <div className="space-y-0.5">
                          {userChildren.map((ch) => (
                            <div key={ch.id} className="flex items-center text-[11px] text-gray-600 dark:text-gray-300">
                              <Baby className="w-3 h-3 ml-1 text-emerald-500 shrink-0" />
                              <span className="truncate">{ch.name} ({ch.className})</span>
                            </div>
                          ))}
                          {userChildren.length === 0 && (
                            <span className="text-[11px] text-gray-400">لا يوجد أطفال مسجلين</span>
                          )}
                        </div>
                      ) : (
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                          معلمة صف ({user.assignedClass || 'غير محدد'})
                        </div>
                      )}
                    </td>

                    {/* 7 Cameras Permission Indicators */}
                    {cameras.map((cam) => {
                      const override = user.overrides?.[cam.id];

                      // Default computation
                      const isPlayroom = cam.isPlayroom || cam.name?.includes('ألعاب');
                      const isChildClass = userClassIds.some((cid) => {
                        if (!cid) return false;
                        if (cid === cam.classId) return true;
                        if (cid.includes('hope') && cam.id.includes('sleep-1')) return true;
                        if (cid.includes('birds') && cam.id.includes('sleep-2')) return true;
                        if (cid.includes('flowers') && cam.id.includes('sleep-3')) return true;
                        return false;
                      });

                      const defaultAllowed = isPlayroom || isChildClass;
                      const isAllowed = override === 'ALLOW' ? true : override === 'DENY' ? false : defaultAllowed;

                      return (
                        <td key={cam.id} className="p-2 text-center">
                          <span
                            title={
                              override === 'ALLOW'
                                ? 'سماح مخصص من الإدارة'
                                : override === 'DENY'
                                ? 'حظر مخصص من الإدارة'
                                : isPlayroom
                                ? 'مسموح افتراضياً (غرفة الألعاب)'
                                : isChildClass
                                ? 'مسموح افتراضياً (صف الطفل)'
                                : 'ممنوع افتراضياً (صف آخر)'
                            }
                            className={`inline-flex items-center justify-center px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                              isAllowed
                                ? override === 'ALLOW'
                                  ? 'bg-emerald-500 text-white border-emerald-600'
                                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                : override === 'DENY'
                                ? 'bg-red-500 text-white border-red-600'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            {isAllowed ? (
                              <>
                                <Check className="w-3 h-3 ml-0.5" />
                                <span>{override === 'ALLOW' ? 'سماح*' : 'مسموح'}</span>
                              </>
                            ) : (
                              <>
                                <Ban className="w-3 h-3 ml-0.5" />
                                <span>{override === 'DENY' ? 'حظر*' : 'ممنوع'}</span>
                              </>
                            )}
                          </span>
                        </td>
                      );
                    })}

                    {/* Action Button */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => openEditModal(user)}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-emerald-500 hover:text-white dark:bg-gray-800 dark:hover:bg-emerald-600 text-gray-700 dark:text-gray-200 transition text-xs font-bold"
                      >
                        <Edit3 className="w-3.5 h-3.5 ml-1.5" />
                        <span>تعديل الصلاحيات</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Focused User Permissions Modal */}
      <Modal
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        title={`إدارة صلاحيات الكاميرات: ${selectedUser?.name || ''}`}
      >
        <div className="space-y-4 py-2 text-right">
          {/* User Summary Pill */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-gray-900 dark:text-white">{selectedUser?.name}</p>
              <p className="text-gray-500 dark:text-gray-400 text-[11px]">{selectedUser?.role === 'PARENT' ? 'ولي أمر' : 'معلمة'}</p>
            </div>
            <div className="flex items-center space-x-1.5 space-x-reverse">
              <button
                type="button"
                onClick={allowAllCameras}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition"
              >
                السماح بالكل
              </button>
              <button
                type="button"
                onClick={denyAllCameras}
                className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 text-[11px] font-bold transition"
              >
                حظر الكل
              </button>
              <button
                type="button"
                onClick={resetAllToDefault}
                className="px-2.5 py-1 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-gray-700 dark:text-gray-300 text-[11px] font-bold transition"
              >
                الافتراضي
              </button>
            </div>
          </div>

          {/* Camera List with 3-Way Toggles */}
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {cameras.map((cam) => {
              const currentStatus = userOverrides[cam.id] || 'DEFAULT';

              // User's default status for this camera
              const userChildren = selectedUser?.children || [];
              const userClassIds = userChildren.map((c) => c.classId);
              if (selectedUser?.assignedClass) userClassIds.push(selectedUser.assignedClass);

              const isPlayroom = cam.isPlayroom || cam.name?.includes('ألعاب');
              const isChildClass = userClassIds.some((cid) => {
                if (!cid) return false;
                if (cid === cam.classId) return true;
                if (cid.includes('hope') && cam.id.includes('sleep-1')) return true;
                if (cid.includes('birds') && cam.id.includes('sleep-2')) return true;
                if (cid.includes('flowers') && cam.id.includes('sleep-3')) return true;
                return false;
              });

              const defaultAllowed = isPlayroom || isChildClass;

              return (
                <div
                  key={cam.id}
                  className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{cam.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      الافتراضي: {defaultAllowed ? 'مسموح (صف الطفل / غرفة الألعاب)' : 'ممنوع (صف آخر)'}
                    </p>
                  </div>

                  {/* 3-Way Toggle Pills: Default | Allow | Deny */}
                  <div className="flex items-center p-0.5 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setCameraStatus(cam.id, 'DEFAULT')}
                      className={`px-2.5 py-1 rounded transition ${
                        currentStatus === 'DEFAULT'
                          ? 'bg-surface dark:bg-surface-dark text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800'
                          : 'text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      تلقائي
                    </button>

                    <button
                      type="button"
                      onClick={() => setCameraStatus(cam.id, 'ALLOW')}
                      className={`px-2.5 py-1 rounded transition ${
                        currentStatus === 'ALLOW'
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-400 hover:text-emerald-600'
                      }`}
                    >
                      سماح
                    </button>

                    <button
                      type="button"
                      onClick={() => setCameraStatus(cam.id, 'DENY')}
                      className={`px-2.5 py-1 rounded transition ${
                        currentStatus === 'DENY'
                          ? 'bg-red-600 text-white'
                          : 'text-gray-400 hover:text-red-600'
                      }`}
                    >
                      حظر
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('هل تريد بالتأكيد استعادة الصلاحيات الافتراضية بالكامل لهذا المستخدم؟')) {
                  resetMutation.mutate(selectedUser.id);
                }
              }}
              disabled={resetMutation.isPending}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition flex items-center"
            >
              <RotateCcw className="w-3.5 h-3.5 ml-1" />
              <span>استعادة الافتراضي</span>
            </button>

            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={() => {
                  saveMutation.mutate({
                    userId: selectedUser.id,
                    overrides: userOverrides
                  });
                }}
                disabled={saveMutation.isPending}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center"
              >
                <Save className="w-3.5 h-3.5 ml-1.5" />
                <span>{saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ الصلاحيات'}</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}