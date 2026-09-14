import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';

import { ClassForm } from '../../components/forms/ClassForm';
import { classApi } from '../../api/class';


export function ClassesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['class'],
    queryFn: () => classApi.getMany()
  });

  const createMutation = useMutation({
    mutationFn: (payload) => classApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class'] });
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
    header: 'capacity',
    accessorKey: 'capacity'
  },
  {
    header: 'ageGroup',
    accessorKey: 'ageGroup'
  }];


  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.classes.title', 'Classes')}
        description={t('pages.classes.description', 'Manage Classes')}
        actionLabel={t('pages.classes.create', 'Create')}
        onAction={() => setIsCreateModalOpen(true)} />
      
      
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading} />
      
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.classes.create', 'Create')}>
        
        <div className="py-4">
          <ClassForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending} />
          
        </div>
      </Modal>
    </div>);

}