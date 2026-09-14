import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';

import { MealForm } from '../../components/forms/MealForm';
import { mealRecordApi } from '../../api/mealRecord';


export function MealsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['mealRecord'],
    queryFn: () => mealRecordApi.getMany()
  });

  const createMutation = useMutation({
    mutationFn: (payload) => mealRecordApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealRecord'] });
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
    header: 'type',
    accessorKey: 'type'
  },
  {
    header: 'consumed',
    accessorKey: 'consumed'
  }];


  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.meals.title', 'Meals')}
        description={t('pages.meals.description', 'Manage Meals')}
        actionLabel={t('pages.meals.create', 'Create')}
        onAction={() => setIsCreateModalOpen(true)} />
      
      
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading} />
      
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.meals.create', 'Create')}>
        
        <div className="py-4">
          <MealForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending} />
          
        </div>
      </Modal>
    </div>);

}