import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';

import { RequestForm } from '../../components/forms/RequestForm';
import { parentRequestApi } from '../../api/parentRequest';


export function RequestsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['parentRequest'],
    queryFn: () => parentRequestApi.getMany()
  });

  const createMutation = useMutation({
    mutationFn: (payload) => parentRequestApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parentRequest'] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      alert(error?.response?.data?.error?.message || 'Error creating record');
    }
  });

  const columns = [

  {
    header: 'parentId',
    accessorKey: 'parentId'
  },
  {
    header: 'type',
    accessorKey: 'type'
  },
  {
    header: 'description',
    accessorKey: 'description'
  }];


  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.requests.title', 'Requests')}
        description={t('pages.requests.description', 'Manage Requests')}
        actionLabel={t('pages.requests.create', 'Create')}
        onAction={() => setIsCreateModalOpen(true)} />
      
      
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading} />
      
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.requests.create', 'Create')}>
        
        <div className="py-4">
          <RequestForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending} />
          
        </div>
      </Modal>
    </div>);

}