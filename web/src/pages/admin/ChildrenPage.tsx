import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { ChildForm, type ChildFormValues } from '../../components/forms/ChildForm';
import { childApi } from '../../api/child';
import type { Child } from '../../api/child';

export function ChildrenPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['child'],
    queryFn: () => childApi.getMany(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: ChildFormValues) => childApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['child'] });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      alert(error?.response?.data?.error?.message || 'Error creating record');
    }
  });

  const columns: Column<Child>[] = [

    {
      header: 'name',
      accessorKey: 'name',
    },
    {
      header: 'parentId',
      accessorKey: 'parentId',
    },
    {
      header: 'classId',
      accessorKey: 'classId',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('pages.children.title', 'Children')} 
        description={t('pages.children.description', 'Manage Children')} 
        actionLabel={t('pages.children.create', 'Create')} 
        onAction={() => setIsCreateModalOpen(true)} 
      />
      
      <DataTable 
        data={data?.data || []} 
        columns={columns} 
        isLoading={isLoading} 
      />
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.children.create', 'Create')}
      >
        <div className="py-4">
          <ChildForm 
            onSubmit={(data) => createMutation.mutate(data)} 
            isLoading={createMutation.isPending} 
          />
        </div>
      </Modal>
    </div>
  );
}
