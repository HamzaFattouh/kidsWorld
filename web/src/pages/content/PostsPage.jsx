import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';

import { PostForm } from '../../components/forms/PostForm';
import { postApi } from '../../api/post';


export function PostsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['post'],
    queryFn: () => postApi.getMany()
  });

  const createMutation = useMutation({
    mutationFn: (payload) => postApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post'] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      alert(error?.response?.data?.error?.message || 'Error creating record');
    }
  });

  const columns = [

  {
    header: 'titleEn',
    accessorKey: 'titleEn'
  },
  {
    header: 'contentEn',
    accessorKey: 'contentEn'
  }];


  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.posts.title', 'Posts')}
        description={t('pages.posts.description', 'Manage Posts')}
        actionLabel={t('pages.posts.create', 'Create')}
        onAction={() => setIsCreateModalOpen(true)} />
      
      
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading} />
      
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.posts.create', 'Create')}>
        
        <div className="py-4">
          <PostForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending} />
          
        </div>
      </Modal>
    </div>);

}