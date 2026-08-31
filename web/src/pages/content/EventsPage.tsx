import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { EventForm, type EventFormValues } from '../../components/forms/EventForm';
import { eventApi } from '../../api/event';
import type { Event } from '../../api/event';

export function EventsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['event'],
    queryFn: () => eventApi.getMany(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: EventFormValues) => eventApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event'] });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      alert(error?.response?.data?.error?.message || 'Error creating record');
    }
  });

  const columns: Column<Event>[] = [

    {
      header: 'titleEn',
      accessorKey: 'titleEn',
    },
    {
      header: 'titleAr',
      accessorKey: 'titleAr',
    },
    {
      header: 'eventDate',
      accessorKey: 'eventDate',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('pages.events.title', 'Events')} 
        description={t('pages.events.description', 'Manage Events')} 
        actionLabel={t('pages.events.create', 'Create')} 
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
        title={t('pages.events.create', 'Create')}
      >
        <div className="py-4">
          <EventForm 
            onSubmit={(data) => createMutation.mutate(data)} 
            isLoading={createMutation.isPending} 
          />
        </div>
      </Modal>
    </div>
  );
}
