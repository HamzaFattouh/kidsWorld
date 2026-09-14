import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';

import { EvaluationForm } from '../../components/forms/EvaluationForm';
import { evaluationApi } from '../../api/evaluation';


export function EvaluationsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['evaluation'],
    queryFn: () => evaluationApi.getMany()
  });

  const createMutation = useMutation({
    mutationFn: (payload) => evaluationApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluation'] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      alert(error?.response?.data?.error?.message || 'Error creating record');
    }
  });

  const columns = [

  {
    header: 'childId',
    accessorKey: 'childId'
  },
  {
    header: 'term',
    accessorKey: 'term'
  },
  {
    header: 'learning',
    accessorKey: 'learning'
  },
  {
    header: 'behavior',
    accessorKey: 'behavior'
  }];


  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.evaluations.title', 'Evaluations')}
        description={t('pages.evaluations.description', 'Manage Evaluations')}
        actionLabel={t('pages.evaluations.create', 'Create')}
        onAction={() => setIsCreateModalOpen(true)} />
      
      
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading} />
      
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.evaluations.create', 'Create')}>
        
        <div className="py-4">
          <EvaluationForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending} />
          
        </div>
      </Modal>
    </div>);

}