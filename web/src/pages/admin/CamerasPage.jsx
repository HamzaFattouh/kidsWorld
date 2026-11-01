import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Video,
  Eye,
  Edit3,
  Clock,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  Grid,
  Columns,
  List,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertCircle,
  Radio,
  Plus
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { WebRTCPlayer } from '../../components/camera/WebRTCPlayer';
import { cameraApi } from '../../api/camera';

// 7 Standard Nursery Cameras
const INITIAL_CAMERAS = [
  {
    id: 'cam-sleep-1',
    name: 'غرفة نوم الأطفال (عمر سنة)',
    className: 'قسم الرضّع - سنة واحدة',
    classId: 'class-sleep-1',
    streamUrl: 'cam1',
    streamKey: 'cam1',
    isActive: true,
    isWithinSchedule: true,
    schedule: {
      startTime: '11:30',
      endTime: '14:30',
      daysOfWeek: [0, 1, 2, 3, 4],
      is24h: false,
      forceLocked: false
    }
  },
  {
    id: 'cam-sleep-2',
    name: 'غرفة نوم الأطفال (عمر سنتين)',
    className: 'قسم الصغار - سنتين',
    classId: 'class-sleep-2',
    streamUrl: 'cam2',
    streamKey: 'cam2',
    isActive: true,
    isWithinSchedule: true,
    schedule: {
      startTime: '12:00',
      endTime: '14:30',
      daysOfWeek: [0, 1, 2, 3, 4],
      is24h: false,
      forceLocked: false
    }
  },
  {
    id: 'cam-sleep-3',
    name: 'غرفة نوم الأطفال (عمر 3 سنوات)',
    className: 'قسم البراعم - 3 سنوات',
    classId: 'class-sleep-3',
    streamUrl: 'cam3',
    streamKey: 'cam3',
    isActive: true,
    isWithinSchedule: true,
    schedule: {
      startTime: '12:30',
      endTime: '14:30',
      daysOfWeek: [0, 1, 2, 3, 4],
      is24h: false,
      forceLocked: false
    }
  },
  {
    id: 'cam-sleep-4',
    name: 'غرفة نوم الأطفال (عمر 4 سنوات)',
    className: 'قسم الروضة - 4 سنوات',
    classId: 'class-sleep-4',
    streamUrl: 'cam4',
    streamKey: 'cam4',
    isActive: true,
    isWithinSchedule: true,
    schedule: {
      startTime: '13:00',
      endTime: '14:30',
      daysOfWeek: [0, 1, 2, 3, 4],
      is24h: false,
      forceLocked: false
    }
  },
  {
    id: 'cam-play-1',
    name: 'غرفة الألعاب (الأنشطة الحركية والتسلق)',
    className: 'زاوية التسلق والألعاب الحركية',
    classId: 'class-playroom-1',
    streamUrl: 'cam5',
    streamKey: 'cam5',
    isActive: true,
    isWithinSchedule: true,
    schedule: {
      startTime: '07:30',
      endTime: '14:30',
      daysOfWeek: [0, 1, 2, 3, 4],
      is24h: false,
      forceLocked: false
    }
  },
  {
    id: 'cam-play-2',
    name: 'غرفة الألعاب (الألعاب الهادئة والرسم)',
    className: 'زاوية الرسم وتركيب المكعبات',
    classId: 'class-playroom-2',
    streamUrl: 'cam6',
    streamKey: 'cam6',
    isActive: true,
    isWithinSchedule: true,
    schedule: {
      startTime: '07:30',
      endTime: '14:30',
      daysOfWeek: [0, 1, 2, 3, 4],
      is24h: false,
      forceLocked: false
    }
  },
  {
    id: 'cam-play-3',
    name: 'غرفة الألعاب (الساحة المركزية)',
    className: 'منطقة اللعب المشترك والأنشطة الجماعية',
    classId: 'class-playroom-3',
    streamUrl: 'cam7',
    streamKey: 'cam7',
    isActive: true,
    isWithinSchedule: true,
    schedule: {
      startTime: '07:30',
      endTime: '14:30',
      daysOfWeek: [0, 1, 2, 3, 4],
      is24h: false,
      forceLocked: false
    }
  }
];

export function CamerasPage() {
  const queryClient = useQueryClient();

  // Layout View State: 'GRID_3' (3x3), 'GRID_2' (2x2), 'GRID_1' (1x1 Large Focus), 'TABLE'
  const [layoutMode, setLayoutMode] = useState('GRID_2');
  const [focusedCamId, setFocusedCamId] = useState(null);

  // Edit Modal State
  const [editingCam, setEditingCam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    streamUrl: '',
    classId: '',
    isActive: true,
    startTime: '07:30',
    endTime: '14:30',
    is24h: false,
    forceLocked: false
  });

  // Local ordering storage for cameras
  const [orderedIds, setOrderedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('kidsworld_cam_order');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Fetch cameras
  const { data: responseData, isLoading } = useQuery({
    queryKey: ['cameras', 'admin'],
    queryFn: () => cameraApi.getAccessibleCameras()
  });

  const rawCameras = responseData?.data && responseData.data.length > 0
    ? responseData.data
    : INITIAL_CAMERAS;

  // Sort according to user reorder preference
  const cameras = useMemo(() => {
    if (!orderedIds || !Array.isArray(orderedIds)) return rawCameras;
    const sorted = [...rawCameras].sort((a, b) => {
      const idxA = orderedIds.indexOf(a.id);
      const idxB = orderedIds.indexOf(b.id);
      if (idxA === -1 && idxB === -1) return 0;
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
    return sorted;
  }, [rawCameras, orderedIds]);

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => cameraApi.updateCamera(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
      setEditingCam(null);
    },
    onError: (err) => {
      alert(err.response?.data?.error || err.message || 'حدث خطأ أثناء حفظ التعديلات');
    }
  });

  // Reordering handlers
  const moveCamera = (index, direction) => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cameras.length) return;

    const newOrder = [...cameras];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    const newIds = newOrder.map((c) => c.id);
    setOrderedIds(newIds);
    try {
      localStorage.setItem('kidsworld_cam_order', JSON.stringify(newIds));
    } catch (e) {
      // ignore
    }
  };

  // Open Edit Modal
  const openEditModal = (cam) => {
    setEditingCam(cam);
    const sched = cam.schedule || {};
    setFormData({
      name: cam.name || '',
      streamUrl: cam.streamUrl || '',
      classId: cam.classId || '',
      isActive: cam.isActive !== undefined ? cam.isActive : true,
      startTime: sched.startTime || '07:30',
      endTime: sched.endTime || '14:30',
      is24h: sched.is24h || false,
      forceLocked: sched.forceLocked || false
    });
  };

  // Quick toggle emergency lock
  const toggleEmergencyLock = (cam) => {
    const currentLocked = cam.schedule?.forceLocked || false;
    updateMutation.mutate({
      id: cam.id,
      data: {
        schedule: {
          ...(cam.schedule || {}),
          forceLocked: !currentLocked
        }
      }
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingCam) return;

    updateMutation.mutate({
      id: editingCam.id,
      data: {
        name: formData.name,
        streamUrl: formData.streamUrl,
        classId: formData.classId,
        isActive: formData.isActive,
        schedule: {
          startTime: formData.startTime,
          endTime: formData.endTime,
          is24h: formData.is24h,
          forceLocked: formData.forceLocked
        }
      }
    });
  };

  return (
    <div className="space-y-6 select-none" dir="rtl">
      {/* 1. Header with Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            شاشة مراقبة الكاميرات وبث WebRTC
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            البث المباشر لـ 7 كاميرات، تغيير الترتيب وأحجام العرض، وضبط أوقات فتح وقفل البث
          </p>
        </div>

        {/* View Size Switcher Buttons */}
        <div className="flex items-center space-x-2 space-x-reverse self-start md:self-center bg-gray-100 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-800 text-xs font-semibold">
          <button
            onClick={() => setLayoutMode('GRID_1')}
            title="عرض شاشة كبيرة (1x1)"
            className={`px-3 py-1.5 rounded-lg flex items-center transition ${
              layoutMode === 'GRID_1'
                ? 'bg-surface dark:bg-surface-dark text-emerald-600 dark:text-emerald-400 border border-gray-200 dark:border-gray-800'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
            }`}
          >
            <Columns className="w-3.5 h-3.5 ml-1.5" />
            <span>كبير (1×1)</span>
          </button>

          <button
            onClick={() => setLayoutMode('GRID_2')}
            title="شبكة 2x2"
            className={`px-3 py-1.5 rounded-lg flex items-center transition ${
              layoutMode === 'GRID_2'
                ? 'bg-surface dark:bg-surface-dark text-emerald-600 dark:text-emerald-400 border border-gray-200 dark:border-gray-800'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 ml-1.5" />
            <span>متوسط (2×2)</span>
          </button>

          <button
            onClick={() => setLayoutMode('GRID_3')}
            title="شبكة مدمجة 3x3 (جدار مراقبة)"
            className={`px-3 py-1.5 rounded-lg flex items-center transition ${
              layoutMode === 'GRID_3'
                ? 'bg-surface dark:bg-surface-dark text-emerald-600 dark:text-emerald-400 border border-gray-200 dark:border-gray-800'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
            }`}
          >
            <Grid className="w-3.5 h-3.5 ml-1.5" />
            <span>مدمج (3×3)</span>
          </button>

          <button
            onClick={() => setLayoutMode('TABLE')}
            title="عرض جدول البيانات"
            className={`px-3 py-1.5 rounded-lg flex items-center transition ${
              layoutMode === 'TABLE'
                ? 'bg-surface dark:bg-surface-dark text-emerald-600 dark:text-emerald-400 border border-gray-200 dark:border-gray-800'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
            }`}
          >
            <List className="w-3.5 h-3.5 ml-1.5" />
            <span>جدول</span>
          </button>
        </div>
      </div>

      {/* 2. Focused Single Camera Large View (Mode: GRID_1) */}
      {layoutMode === 'GRID_1' && (
        <div className="space-y-4">
          {(() => {
            const currentFocusCam = cameras.find((c) => c.id === (focusedCamId || cameras[0]?.id)) || cameras[0];
            const accessData = {
              cameraId: currentFocusCam.id,
              cameraName: currentFocusCam.name,
              className: currentFocusCam.className,
              streamKey: currentFocusCam.streamUrl?.toLowerCase() || 'cam1',
              token: 'admin-preview-token',
              webrtcOfferUrl: `https://stream.yourdomain.com/api/webrtc?src=${currentFocusCam.streamUrl?.toLowerCase() || 'cam1'}`
            };

            return (
              <div className="space-y-4">
                <WebRTCPlayer
                  accessData={accessData}
                  cameraName={currentFocusCam.name}
                  className={currentFocusCam.className}
                  isLoadingAccess={false}
                  error={null}
                />

                {/* Thumbnails Row */}
                <div className="flex items-center space-x-3 space-x-reverse overflow-x-auto pb-2">
                  {cameras.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setFocusedCamId(c.id)}
                      className={`shrink-0 px-4 py-2.5 rounded-xl border text-right transition ${
                        c.id === currentFocusCam.id
                          ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold'
                          : 'border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <p className="text-xs">{c.name}</p>
                      <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">
                        {c.streamUrl?.toUpperCase() || 'CAM'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. Multi-Camera Grid Views (GRID_2 and GRID_3) */}
      {(layoutMode === 'GRID_2' || layoutMode === 'GRID_3') && (
        <div
          className={`grid gap-5 ${
            layoutMode === 'GRID_2' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {cameras.map((cam, idx) => {
            const isLocked = cam.schedule?.forceLocked || false;
            const startTime = cam.schedule?.startTime || '07:30';
            const endTime = cam.schedule?.endTime || '14:30';
            const is24h = cam.schedule?.is24h || false;

            const accessData = {
              cameraId: cam.id,
              cameraName: cam.name,
              className: cam.className,
              streamKey: cam.streamUrl?.toLowerCase() || 'cam1',
              token: 'admin-preview-token',
              webrtcOfferUrl: `https://stream.yourdomain.com/api/webrtc?src=${cam.streamUrl?.toLowerCase() || 'cam1'}`
            };

            return (
              <div
                key={cam.id}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark overflow-hidden flex flex-col justify-between transition-colors"
              >
                {/* Card Header with Reordering and Controls */}
                <div className="p-3.5 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/30">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[170px]">
                        {cam.name}
                      </h3>
                      <p className="text-[11px] text-gray-400">{cam.className}</p>
                    </div>
                  </div>

                  {/* Reordering Up/Down & Edit Buttons */}
                  <div className="flex items-center space-x-1 space-x-reverse">
                    <button
                      onClick={() => moveCamera(idx, 'UP')}
                      disabled={idx === 0}
                      title="تحريك للأعلى"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveCamera(idx, 'DOWN')}
                      disabled={idx === cameras.length - 1}
                      title="تحريك للأسفل"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openEditModal(cam)}
                      title="تعديل بيانات ورابط وجدول الكاميرا"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Embedded WebRTC Player View */}
                <div className="p-3">
                  <WebRTCPlayer
                    accessData={accessData}
                    cameraName={cam.name}
                    className={cam.className}
                    isLoadingAccess={false}
                    error={isLocked ? 'البث مقفل حالياً يدوياً من الإدارة' : null}
                  />
                </div>

                {/* Card Footer: Stream Link & Embedded Schedule Details */}
                <div className="p-3.5 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/40 dark:bg-gray-900/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                  {/* Left: Stream Key */}
                  <div className="flex items-center space-x-1.5 space-x-reverse">
                    <span className="text-gray-400 font-medium">الرابط:</span>
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {cam.streamUrl?.toUpperCase() || 'CAM'}
                    </span>
                  </div>

                  {/* Middle: Schedule Times */}
                  <div className="flex items-center space-x-1.5 space-x-reverse text-gray-500 dark:text-gray-400 text-[11px]">
                    <Clock className="w-3.5 h-3.5 ml-1 text-emerald-500" />
                    <span>
                      {is24h ? 'بث 24/7 دون قفل' : `${startTime} إلى ${endTime}`}
                    </span>
                  </div>

                  {/* Right: Quick Emergency Lock Toggle */}
                  <button
                    onClick={() => toggleEmergencyLock(cam)}
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold transition border ${
                      isLocked
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Lock className="w-3 h-3 ml-1" />
                        <span>مقفل يدوياً (فتح)</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3 ml-1" />
                        <span>البث نشط (قفل)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Tabular View (Mode: TABLE) */}
      {layoutMode === 'TABLE' && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark overflow-hidden">
          <table className="w-full text-right text-xs">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-semibold">
              <tr>
                <th className="p-3.5">الترتيب</th>
                <th className="p-3.5">اسم الكاميرا</th>
                <th className="p-3.5">رابط / مفتاح البث</th>
                <th className="p-3.5">القاعة</th>
                <th className="p-3.5">ساعات فتح وقفل البث</th>
                <th className="p-3.5">حالة البث</th>
                <th className="p-3.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {cameras.map((cam, idx) => {
                const isLocked = cam.schedule?.forceLocked || false;
                const is24h = cam.schedule?.is24h || false;
                return (
                  <tr key={cam.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition">
                    <td className="p-3.5 text-center">
                      <div className="flex items-center space-x-1 space-x-reverse justify-center">
                        <button
                          onClick={() => moveCamera(idx, 'UP')}
                          disabled={idx === 0}
                          className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-gray-500">{idx + 1}</span>
                        <button
                          onClick={() => moveCamera(idx, 'DOWN')}
                          disabled={idx === cameras.length - 1}
                          className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-gray-900 dark:text-white">{cam.name}</td>
                    <td className="p-3.5 font-mono text-emerald-600 dark:text-emerald-400">{cam.streamUrl}</td>
                    <td className="p-3.5 text-gray-600 dark:text-gray-300">{cam.className}</td>
                    <td className="p-3.5 text-gray-500">
                      {is24h ? '24/7 طوال الوقت' : `${cam.schedule?.startTime || '07:30'} - ${cam.schedule?.endTime || '14:30'}`}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          isLocked
                            ? 'bg-red-500/10 text-red-600'
                            : 'bg-emerald-500/10 text-emerald-600'
                        }`}
                      >
                        {isLocked ? 'مقفل للطوارئ' : 'البث متاح'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => openEditModal(cam)}
                        className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500 hover:text-white text-gray-700 dark:text-gray-200 transition text-xs font-semibold"
                      >
                        <Edit3 className="w-3 h-3 ml-1" />
                        <span>تعديل</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Comprehensive Camera & Schedule Edit Modal */}
      <Modal
        isOpen={Boolean(editingCam)}
        onClose={() => setEditingCam(null)}
        title={`تعديل إعدادات الكاميرا والجدول: ${editingCam?.name || ''}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 py-2 text-right">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">
              اسم الكاميرا
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">
                رابط البث أو مفتاح go2rtc (Stream Key / RTSP)
              </label>
              <input
                type="text"
                value={formData.streamUrl}
                onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                placeholder="مثال: cam1 أو rtsp://..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark font-mono text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">
                رمز القاعة أو الصف (Class ID)
              </label>
              <input
                type="text"
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Embedded Schedule Section */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/10 p-3.5 space-y-3">
            <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center">
              <Clock className="w-3.5 h-3.5 ml-1.5" />
              <span>جدول أوقات فتح وقفل البث على الموقع والتطبيق</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  وقت بدء البث (الفتح)
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  وقت قفل البث (الإغلاق)
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is24h}
                  onChange={(e) => setFormData({ ...formData, is24h: e.target.checked })}
                  className="rounded text-emerald-600 ml-1.5"
                />
                <span className="text-gray-700 dark:text-gray-300">بث مستمر طوال اليوم (24/7 دون قفل)</span>
              </label>

              <label className="flex items-center space-x-2 space-x-reverse cursor-pointer text-red-600 dark:text-red-400 font-bold">
                <input
                  type="checkbox"
                  checked={formData.forceLocked}
                  onChange={(e) => setFormData({ ...formData, forceLocked: e.target.checked })}
                  className="rounded text-red-600 ml-1.5"
                />
                <span>قفل البث يدوياً الآن (إيقاف للطوارئ)</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 space-x-reverse pt-2">
            <button
              type="button"
              onClick={() => setEditingCam(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center"
            >
              <Save className="w-3.5 h-3.5 ml-1.5" />
              <span>{updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}