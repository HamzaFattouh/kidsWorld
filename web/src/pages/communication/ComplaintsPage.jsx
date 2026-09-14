import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';

import { ComplaintForm } from '../../components/forms/ComplaintForm';
import { complaintApi } from '../../api/complaint';


export function ComplaintsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['complaint'],
    queryFn: () => complaintApi.getMany()
  });

  const createMutation = useMutation({
    mutationFn: (payload) => complaintApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaint'] });
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
    header: 'title',
    accessorKey: 'title'
  },
  {
    header: 'description',
    accessorKey: 'description'
  }];


  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.complaints.title', 'Complaints')}
        description={t('pages.complaints.description', 'Manage Complaints')}
        actionLabel={t('pages.complaints.create', 'Create')}
        onAction={() => setIsCreateModalOpen(true)} />
      
      
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading} />
      
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.complaints.create', 'Create')}>
        
        <div className="py-4">
          <ComplaintForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending} />
          
        </div>
      </Modal>
    </div>);

}