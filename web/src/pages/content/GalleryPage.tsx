import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { GalleryForm, type GalleryFormValues } from '../../components/forms/GalleryForm';
import { galleryImageApi } from '../../api/galleryImage';
import type { Gallery } from '../../api/galleryImage';

export function GalleryPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['galleryImage'],
    queryFn: () => galleryImageApi.getMany(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: GalleryFormValues) => galleryImageApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImage'] });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      alert(error?.response?.data?.error?.message || 'Error creating record');
    }
  });

  const columns: Column<Gallery>[] = [

    {
      header: 'url',
      accessorKey: 'url',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('pages.gallery.title', 'Gallery')} 
        description={t('pages.gallery.description', 'Manage Gallery')} 
        actionLabel={t('pages.gallery.create', 'Create')} 
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
        title={t('pages.gallery.create', 'Create')}
      >
        <div className="py-4">
          <GalleryForm 
            onSubmit={(data) => createMutation.mutate(data)} 
            isLoading={createMutation.isPending} 
          />
        </div>
      </Modal>
    </div>
  );
}
