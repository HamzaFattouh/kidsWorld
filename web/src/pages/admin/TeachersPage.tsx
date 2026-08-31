import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { UserForm, type UserFormValues } from '../../components/forms/UserForm';
import { usersApi } from '../../api/users';
import type { User } from '../../api/users';

export function TeachersPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const page = 1;
  const limit = 50;
  const role = 'TEACHER';

  const { data, isLoading } = useQuery({
    queryKey: ['users', role, page, limit],
    queryFn: () => usersApi.getUsers({ page, limit, role }),
  });

  const createMutation = useMutation({
    mutationFn: (payload: UserFormValues) => usersApi.createUser({ ...payload, role: 'TEACHER' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', role] });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      alert(error?.response?.data?.error?.message || 'Error creating user');
    }
  });

  const columns: Column<User>[] = [
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      cell: (user) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: (user) => new Date(user.createdAt).toLocaleDateString(),
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('pages.teachers.title', 'Teachers')} 
        description={t('pages.teachers.description', 'Manage Teachers settings and records.')} 
        actionLabel={t('pages.teachers.create', 'Create Teacher')} 
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
        title={t('pages.teachers.create', 'Create Teacher')}
      >
        <div className="py-4">
          <UserForm 
            onSubmit={(data) => createMutation.mutate(data)} 
            isLoading={createMutation.isPending} 
          />
        </div>
      </Modal>
    </div>
  );
}
