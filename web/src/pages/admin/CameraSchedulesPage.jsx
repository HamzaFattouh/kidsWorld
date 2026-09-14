import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';

import { CameraScheduleForm } from '../../components/forms/CameraScheduleForm';
import { cameraScheduleApi } from '../../api/cameraSchedule';


export function CameraSchedulesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['cameraSchedule'],
    queryFn: () => cameraScheduleApi.getMany()
  });

  const createMutation = useMutation({
    mutationFn: (payload) => cameraScheduleApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cameraSchedule'] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      alert(error?.response?.data?.error?.message || 'Error creating record');
    }
  });

  const columns = [

  {
    header: 'cameraId',
    accessorKey: 'cameraId'
  },
  {
    header: 'dayOfWeek',
    accessorKey: 'dayOfWeek'
  },
  {
    header: 'startTime',
    accessorKey: 'startTime'
  },
  {
    header: 'endTime',
    accessorKey: 'endTime'
  }];


  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.cameraschedules.title', 'CameraSchedules')}
        description={t('pages.cameraschedules.description', 'Manage CameraSchedules')}
        actionLabel={t('pages.cameraschedules.create', 'Create')}
        onAction={() => setIsCreateModalOpen(true)} />
      
      
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading} />
      
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.cameraschedules.create', 'Create')}>
        
        <div className="py-4">
          <CameraScheduleForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending} />
          
        </div>
      </Modal>
    </div>);

}