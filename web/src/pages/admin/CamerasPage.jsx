import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';

import { CameraForm } from '../../components/forms/CameraForm';
import { cameraApi } from '../../api/camera';


export function CamerasPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
    header: 'name',
    accessorKey: 'name'
  },
  {
    header: 'streamUrl',
    accessorKey: 'streamUrl'
  },
  {
    header: 'classId',
    accessorKey: 'classId'
  }];


  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.cameras.title', 'Cameras')}
        description={t('pages.cameras.description', 'Manage Cameras')}
        actionLabel={t('pages.cameras.create', 'Create')}
        onAction={() => setIsCreateModalOpen(true)} />
      
      
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading} />
      
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.cameras.create', 'Create')}>
        
        <div className="py-4">
          <CameraForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending} />
          
        </div>
      </Modal>
    </div>);

}