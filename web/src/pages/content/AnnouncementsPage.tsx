import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { AnnouncementForm, type AnnouncementFormValues } from '../../components/forms/AnnouncementForm';
import { announcementApi } from '../../api/announcement';
import type { Announcement } from '../../api/announcement';

export function AnnouncementsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['announcement'],
    queryFn: () => announcementApi.getMany(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: AnnouncementFormValues) => announcementApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcement'] });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      alert(error?.response?.data?.error?.message || 'Error creating record');
    }
  });

  const columns: Column<Announcement>[] = [

    {
      header: 'titleEn',
      accessorKey: 'titleEn',
    },
    {
      header: 'titleAr',
      accessorKey: 'titleAr',
    },
    {
      header: 'contentEn',
      accessorKey: 'contentEn',
    },
    {
      header: 'priority',
      accessorKey: 'priority',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('pages.announcements.title', 'Announcements')} 
        description={t('pages.announcements.description', 'Manage Announcements')} 
        actionLabel={t('pages.announcements.create', 'Create')} 
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
        title={t('pages.announcements.create', 'Create')}
      >
        <div className="py-4">
          <AnnouncementForm 
            onSubmit={(data) => createMutation.mutate(data)} 
            isLoading={createMutation.isPending} 
          />
        </div>
      </Modal>
    </div>
  );
}
