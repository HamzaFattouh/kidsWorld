import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';

import { PickupForm } from '../../components/forms/PickupForm';
import { authorizedPickupApi } from '../../api/authorizedPickup';


export function PickupsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['authorizedPickup'],
    queryFn: () => authorizedPickupApi.getMany()
  });

  const createMutation = useMutation({
    mutationFn: (payload) => authorizedPickupApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authorizedPickup'] });
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
    header: 'phone',
    accessorKey: 'phone'
  },
  {
    header: 'childId',
    accessorKey: 'childId'
  }];


  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.pickups.title', 'Pickups')}
        description={t('pages.pickups.description', 'Manage Pickups')}
        actionLabel={t('pages.pickups.create', 'Create')}
        onAction={() => setIsCreateModalOpen(true)} />
      
      
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading} />
      
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.pickups.create', 'Create')}>
        
        <div className="py-4">
          <PickupForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending} />
          
        </div>
      </Modal>
    </div>);

}