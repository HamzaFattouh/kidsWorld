import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Video, Eye, Radio, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import { CameraForm } from '../../components/forms/CameraForm';
import { WebRTCPlayer } from '../../components/camera/WebRTCPlayer';
import { cameraApi } from '../../api/camera';

export function CamerasPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewCam, setPreviewCam] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['camera'],
    queryFn: () => cameraApi.getMany()
  });

  const createMutation = useMutation({
    mutationFn: (payload) => cameraApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['camera'] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      alert(error?.response?.data?.error?.message || 'Error creating record');
    }
  });

  const columns = [
    {
      header: 'اسم الكاميرا',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Video className="w-4 h-4" />
          </div>
          <span className="font-bold text-gray-900 dark:text-gray-100">{row.original.name}</span>
        </div>
      )
    },
    {
      header: 'مفتاح البث (RTSP / go2rtc)',
      accessorKey: 'streamUrl',
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
          {row.original.streamUrl || 'cam1'}
        </span>
      )
    },
    {
      header: 'معرف القاعة',
      accessorKey: 'classId'
    },
    {
      header: 'البث الحي',
      id: 'actions',
      cell: ({ row }) => (
        <button
          onClick={() => setPreviewCam(row.original)}
          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition"
        >
          <Eye className="w-3.5 h-3.5 ml-1.5" />
          <span>معاينة WebRTC</span>
        </button>
      )
    }
  ];

  const previewAccessData = previewCam
    ? {
        cameraId: previewCam.id,
        cameraName: previewCam.name,
        className: previewCam.classId || 'قاعة الأطفال',
        streamKey: previewCam.streamUrl?.toLowerCase() || 'cam1',
        token: 'admin-token',
        webrtcOfferUrl: `https://stream.yourdomain.com/api/webrtc?src=${previewCam.streamUrl?.toLowerCase() || 'cam1'}`
      }
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="كاميرات الحضانة وبث WebRTC"
        description="إدارة ومراقبة كاميرات الحضانة الـ 7 وبث الفيديو الحي عالي السرعة"
        actionLabel="إضافة كاميرا جديدة"
        onAction={() => setIsCreateModalOpen(true)}
      />

      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
      />

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="إضافة كاميرا جديدة"
      >
        <div className="py-4">
          <CameraForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending}
          />
        </div>
      </Modal>

      {/* Live Preview Modal */}
      <Modal
        isOpen={Boolean(previewCam)}
        onClose={() => setPreviewCam(null)}
        title={`معاينة البث المباشر: ${previewCam?.name || ''}`}
      >
        <div className="py-2">
          {previewCam && (
            <WebRTCPlayer
              accessData={previewAccessData}
              cameraName={previewCam.name}
              className={previewCam.classId}
              isLoadingAccess={false}
              error={null}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}