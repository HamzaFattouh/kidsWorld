import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';

import { WeeklyNoteForm } from '../../components/forms/WeeklyNoteForm';
import { weeklyNoteApi } from '../../api/weeklyNote';


export function WeeklyNotesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['weeklyNote'],
    queryFn: () => weeklyNoteApi.getMany()
  });

  const createMutation = useMutation({
    mutationFn: (payload) => weeklyNoteApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyNote'] });
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
    header: 'weekStartDate',
    accessorKey: 'weekStartDate'
  },
  {
    header: 'generalNotes',
    accessorKey: 'generalNotes'
  }];


  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.weeklynotes.title', 'WeeklyNotes')}
        description={t('pages.weeklynotes.description', 'Manage WeeklyNotes')}
        actionLabel={t('pages.weeklynotes.create', 'Create')}
        onAction={() => setIsCreateModalOpen(true)} />
      
      
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading} />
      
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.weeklynotes.create', 'Create')}>
        
        <div className="py-4">
          <WeeklyNoteForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending} />
          
        </div>
      </Modal>
    </div>);

}