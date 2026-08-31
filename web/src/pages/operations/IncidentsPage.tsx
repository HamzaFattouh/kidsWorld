import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { IncidentForm, type IncidentFormValues } from '../../components/forms/IncidentForm';
import { incidentApi } from '../../api/incident';
import type { Incident } from '../../api/incident';

export function IncidentsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['incident'],
    queryFn: () => incidentApi.getMany(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: IncidentFormValues) => incidentApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident'] });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      alert(error?.response?.data?.error?.message || 'Error creating record');
    }
  });

  const columns: Column<Incident>[] = [

    {
      header: 'childId',
      accessorKey: 'childId',
    },
    {
      header: 'date',
      accessorKey: 'date',
    },
    {
      header: 'time',
      accessorKey: 'time',
    },
    {
      header: 'severity',
      accessorKey: 'severity',
    },
    {
      header: 'description',
      accessorKey: 'description',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('pages.incidents.title', 'Incidents')} 
        description={t('pages.incidents.description', 'Manage Incidents')} 
        actionLabel={t('pages.incidents.create', 'Create')} 
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
        title={t('pages.incidents.create', 'Create')}
      >
        <div className="py-4">
          <IncidentForm 
            onSubmit={(data) => createMutation.mutate(data)} 
            isLoading={createMutation.isPending} 
          />
        </div>
      </Modal>
    </div>
  );
}
