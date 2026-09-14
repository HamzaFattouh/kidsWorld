import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';

import { EventForm } from '../../components/forms/EventForm';
import { eventApi } from '../../api/event';


export function EventsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['event'],
    queryFn: () => eventApi.getMany()
  });

  const createMutation = useMutation({
    mutationFn: (payload) => eventApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event'] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      alert(error?.response?.data?.error?.message || 'Error creating record');
    }
  });

  const columns = [
  {
    header: 'Image',
    accessorKey: 'imageUrl',
    cell: (info) => info.getValue() ? <img src={info.getValue()} alt="Event" className="w-12 h-12 object-cover rounded" /> : null
  },
  {
    header: 'Title (EN)',
    accessorKey: 'titleEn'
  },
  {
    header: 'Title (AR)',
    accessorKey: 'titleAr'
  },
  {
    header: 'Date',
    accessorKey: 'eventDate',
    cell: (info) => new Date(info.getValue()).toLocaleDateString()
  },
  {
    header: 'Published',
    accessorKey: 'isPublished',
    cell: (info) => info.getValue() ? 'Yes' : 'No'
  }];

  const handleCreate = (data) => {
    const formData = new FormData();
    formData.append('titleEn', data.titleEn);
    formData.append('titleAr', data.titleAr);
    formData.append('descriptionEn', data.descriptionEn);
    formData.append('descriptionAr', data.descriptionAr);
    formData.append('eventDate', data.eventDate);
    formData.append('isPublished', !!data.isPublished);
    if (data.image && data.image.length > 0) {
      formData.append('image', data.image[0]);
    }
    createMutation.mutate(formData);
  };


  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.events.title', 'Events')}
        description={t('pages.events.description', 'Manage Events')}
        actionLabel={t('pages.events.create', 'Create')}
        onAction={() => setIsCreateModalOpen(true)} />
      
      
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading} />
      
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.events.create', 'Create')}>
        
        <div className="py-4">
          <EventForm
            onSubmit={handleCreate}
            isLoading={createMutation.isPending} />
          
        </div>
      </Modal>
    </div>);

}