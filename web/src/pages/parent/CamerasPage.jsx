import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Camera,
  Video,
  ShieldCheck,
  Clock,
  Radio,
  Layers,
  AlertCircle,
  RefreshCw,
  Lock,
  Eye,
  Info
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { WebRTCPlayer } from '../../components/camera/WebRTCPlayer';
import { cameraApi } from '../../api/camera';

// 7 Standard Nursery Cameras: 4 Sleep Rooms + 3 Playroom Cameras
const DEFAULT_CAMERAS = [
  {
    id: 'cam-sleep-1',
    name: 'غرفة نوم الأطفال (عمر سنة)',
    className: 'قسم الرضّع - سنة واحدة',
    classId: 'class-sleep-1',
    streamKey: 'cam1',
    category: 'SLEEP',
    isActive: true,
    isWithinSchedule: true,
    operatingHours: '11:30 ص - 02:30 م'
  },
  {
    id: 'cam-sleep-2',
    name: 'غرفة نوم الأطفال (عمر سنتين)',
    className: 'قسم الصغار - سنتين',
    classId: 'class-sleep-2',
    streamKey: 'cam2',
    category: 'SLEEP',
    isActive: true,
    isWithinSchedule: true,
    operatingHours: '12:00 م - 02:30 م'
  },
  {
    id: 'cam-sleep-3',
    name: 'غرفة نوم الأطفال (عمر 3 سنوات)',
    className: 'قسم البراعم - 3 سنوات',
    classId: 'class-sleep-3',
    streamKey: 'cam3',
    category: 'SLEEP',
    isActive: true,
    isWithinSchedule: true,
    operatingHours: '12:30 م - 02:30 م'
  },
  {
    id: 'cam-sleep-4',
    name: 'غرفة نوم الأطفال (عمر 4 سنوات)',
    className: 'قسم الروضة - 4 سنوات',
    classId: 'class-sleep-4',
    streamKey: 'cam4',
    category: 'SLEEP',
    isActive: true,
    isWithinSchedule: true,
    operatingHours: '01:00 م - 02:30 م'
  },
  {
    id: 'cam-play-1',
    name: 'غرفة الألعاب (الأنشطة الحركية)',
    className: 'الزاوية الحركية وألعاب التسلق',
    classId: 'class-playroom-1',
    streamKey: 'cam5',
    category: 'PLAYROOM',
    isActive: true,
    isWithinSchedule: true,
    operatingHours: '07:30 ص - 01:30 م'
  },
  {
    id: 'cam-play-2',
    name: 'غرفة الألعاب (الألعاب الهادئة والرسم)',
    className: 'زاوية الرسم وبناء المكعبات',
    classId: 'class-playroom-2',
    streamKey: 'cam6',
    category: 'PLAYROOM',
    isActive: true,
    isWithinSchedule: true,
    operatingHours: '07:30 ص - 01:30 م'
  },
  {
    id: 'cam-play-3',
    name: 'غرفة الألعاب (الساحة المركزية)',
    className: 'منطقة اللعب المشترك والأنشطة الجماعية',
    classId: 'class-playroom-3',
    streamKey: 'cam7',
    category: 'PLAYROOM',
    isActive: true,
    isWithinSchedule: true,
    operatingHours: '07:30 ص - 02:30 م'
  }
];

export function ParentCamerasPage() {
  const [selectedCamId, setSelectedCamId] = useState(DEFAULT_CAMERAS[0].id);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'SLEEP' | 'PLAYROOM'

  // Fetch cameras from backend
  const {
    data: responseData,
    isLoading: isLoadingCameras,
    refetch: refetchCameras
  } = useQuery({
    queryKey: ['cameras', 'accessible'],
    queryFn: () => cameraApi.getAccessibleCameras(),
    retry: 1
  });

  const cameras = (responseData?.data && responseData.data.length > 0)
    ? responseData.data
    : DEFAULT_CAMERAS;

  const selectedCam = cameras.find((c) => c.id === selectedCamId) || cameras[0];

  // Request WebRTC Access Token for selected camera
  const {
    data: accessResponse,
    isLoading: isLoadingAccess,
    error: accessError,
    mutate: requestAccess
  } = useMutation({
    mutationFn: (camId) => cameraApi.requestCameraAccess(camId)
  });

  useEffect(() => {
    if (selectedCam?.id) {
      requestAccess(selectedCam.id);
    }
  }, [selectedCam?.id, requestAccess]);

  const accessData = accessResponse?.data || {
    cameraId: selectedCam.id,
    cameraName: selectedCam.name,
    className: selectedCam.className,
    streamKey: selectedCam.streamKey || 'cam1',
    token: 'demo-token',
    webrtcOfferUrl: `https://stream.yourdomain.com/api/webrtc?src=${selectedCam.streamKey || 'cam1'}`,
    webrtcWsUrl: `wss://stream.yourdomain.com/api/ws?src=${selectedCam.streamKey || 'cam1'}`
  };

  const errorMessage = accessError?.response?.data?.error || accessError?.message || null;

  // Filter Cameras
  const filteredCameras = cameras.filter((cam) => {
    const isSleep = cam.category === 'SLEEP' || cam.id?.includes('sleep') || cam.name?.includes('نوم');
    const isPlay = cam.category === 'PLAYROOM' || cam.id?.includes('play') || cam.name?.includes('ألعاب');

    if (activeFilter === 'SLEEP') return isSleep;
    if (activeFilter === 'PLAYROOM') return isPlay;
    return true;
  });

  return (
    <div className="space-y-6 select-none" dir="rtl">
      {/* 1. Page Header */}
      <PageHeader
        title="البث المباشر والكاميرات"
        description="متابعة بصرية فورية وآمنة عبر تقنية WebRTC بزمن تأخير أقل من ثانية"
      />

      {/* 2. Security Notice Banner */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-start space-x-3 space-x-reverse">
        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 ml-2" />
        <div className="text-xs text-text dark:text-gray-200 leading-relaxed">
          <p className="font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">
            نظام حماية وخصوصية مشدد
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            البث مشفر بالكامل ولا يمكن الوصول إليه إلا لأولياء الأمور المعتمدين وخلال ساعات الدوام الرسمية للأطفال وفق جدول الروضة المعتمد.
          </p>
        </div>
      </div>

      {/* 3. Main Live Stream Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: WebRTC Player */}
        <div className="lg:col-span-2 space-y-4">
          <WebRTCPlayer
            accessData={accessData}
            cameraName={selectedCam?.name}
            className={selectedCam?.className}
            isLoadingAccess={isLoadingAccess}
            error={errorMessage}
            onRetry={() => requestAccess(selectedCam.id)}
          />

          {/* Quick Camera Info Bar */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="font-semibold text-gray-500 dark:text-gray-400">القاعة الحالية:</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{selectedCam?.className}</span>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 ml-1 text-emerald-500" />
              <span>أوقات البث: 07:30 ص - 02:00 م</span>
            </div>

            <div className="flex items-center space-x-1.5 space-x-reverse">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-emerald-600 dark:text-emerald-400">WebRTC نشط</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Camera Selection & Schedule Details */}
        <div className="space-y-4">
          {/* Filter Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`flex-1 py-2 rounded-lg text-center transition ${
                activeFilter === 'ALL'
                  ? 'bg-surface dark:bg-surface-dark text-emerald-600 dark:text-emerald-400 border border-gray-200 dark:border-gray-800'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
              }`}
            >
              الكل ({cameras.length})
            </button>
            <button
              onClick={() => setActiveFilter('SLEEP')}
              className={`flex-1 py-2 rounded-lg text-center transition ${
                activeFilter === 'SLEEP'
                  ? 'bg-surface dark:bg-surface-dark text-emerald-600 dark:text-emerald-400 border border-gray-200 dark:border-gray-800'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
              }`}
            >
              غرف النوم (4)
            </button>
            <button
              onClick={() => setActiveFilter('PLAYROOM')}
              className={`flex-1 py-2 rounded-lg text-center transition ${
                activeFilter === 'PLAYROOM'
                  ? 'bg-surface dark:bg-surface-dark text-emerald-600 dark:text-emerald-400 border border-gray-200 dark:border-gray-800'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'
              }`}
            >
              غرفة الألعاب (3)
            </button>
          </div>

          {/* Camera List */}
          <div className="space-y-2.5 max-h-[490px] overflow-y-auto pr-1">
            {filteredCameras.map((cam) => {
              const isSelected = cam.id === selectedCam.id;
              return (
                <button
                  key={cam.id}
                  onClick={() => setSelectedCamId(cam.id)}
                  className={`w-full text-right p-3.5 rounded-xl border transition flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20 text-gray-900 dark:text-white'
                      : 'border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark hover:border-gray-300 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <Video className="w-5 h-5" />
                    </div>

                    <div>
                      <p className={`text-sm font-bold ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>
                        {cam.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {cam.className}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1" />
                      LIVE
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {cam.streamKey?.toUpperCase() || 'CAM'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Schedule Help Card */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark p-4 text-xs text-gray-500 dark:text-gray-400 space-y-2">
            <div className="flex items-center text-gray-900 dark:text-gray-200 font-bold">
              <Info className="w-4 h-4 ml-1.5 text-emerald-500" />
              <span>إرشادات المشاهدة الحية</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pr-1 text-[11px] leading-relaxed">
              <li>يتم فتح الكاميرات تلقائياً عند حضور الطفل للحضانة.</li>
              <li>البث المباشر يعمل بأحدث تقنيات WebRTC لتوفير سرعة استجابة فورية.</li>
              <li>للتبديل بين الكاميرات، اضغط على اسم القاعة من القائمة أعلاه.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}