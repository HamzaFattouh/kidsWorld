import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import { PickupForm } from '../../components/forms/PickupForm';
import { authorizedPickupApi } from '../../api/authorizedPickup';

export function PickupPage() {
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
      header: t('pages.pickups.columns.name', 'اسم المخول'),
      accessorKey: 'name'
    },
    {
      header: t('pages.pickups.columns.phone', 'رقم الهاتف'),
      accessorKey: 'phone'
    },
    {
      header: t('pages.pickups.columns.relation', 'صلة القرابة'),
      accessorKey: 'relationship'
    },
    {
      header: t('pages.pickups.columns.nationalId', 'رقم الهوية'),
      accessorKey: 'nationalId'
    },
    {
      header: t('pages.pickups.columns.childId', 'معرف الطفل'),
      accessorKey: 'childId'
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.pickups.title', 'المخولون بالاستلام')}
        description={t('pages.pickups.description', 'إدارة وتتبع الأشخاص المخولين باستلام الأطفال من الحضانة')}
        actionLabel={t('pages.pickups.create', 'إضافة شخص مخول')}
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
        title={t('pages.pickups.create', 'إضافة شخص مخول بالاستلام')}
      >
        <div className="py-4">
          <PickupForm
            onSubmit={(formData) => createMutation.mutate(formData)}
            isLoading={createMutation.isPending}
          />
        </div>
      </Modal>
    </div>
  );
}
