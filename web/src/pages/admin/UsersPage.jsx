import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';

import { UserForm } from '../../components/forms/UserForm';
import { usersApi } from '../../api/users';


export function UsersPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Hardcoded for now, could add state if pagination UI is added
  const page = 1;
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, limit],
    queryFn: () => usersApi.getUsers({ page, limit })
  });

  const createMutation = useMutation({
    mutationFn: (payload) => usersApi.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      alert(error?.response?.data?.error?.message || 'Error creating user');
    }
  });

  const columns = [
    {
      header: 'الاسم',
      accessorKey: 'name',
      cell: (user) => <span className="font-semibold">{user.name || 'غير محدد'}</span>
    },
    {
      header: 'البريد الإلكتروني',
      accessorKey: 'email'
    },
    {
      header: 'رقم الهاتف',
      accessorKey: 'phone',
      cell: (user) => user.phone || '—'
    },
    {
      header: 'الدور',
      accessorKey: 'role',
      cell: (user) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
          ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : ''}
          ${user.role === 'TEACHER' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
          ${user.role === 'PARENT' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
        `}>
          {user.role}
        </span>
      )
    },
    {
      header: 'الحالة',
      accessorKey: 'isActive',
      cell: (user) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
          {user.isActive ? 'نشط' : 'غير نشط'}
        </span>
      )
    },
    {
      header: 'تاريخ الإضافة',
      accessorKey: 'createdAt',
      cell: (user) => new Date(user.createdAt).toLocaleDateString('ar-EG')
    }
  ];


  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.users.title', 'Users')}
        description={t('pages.users.description', 'Manage Users settings and records.')}
        actionLabel={t('pages.users.create', 'Create Users')}
        onAction={() => setIsCreateModalOpen(true)} />
      
      
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading} />
      
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.users.create', 'Create Users')}>
        
        <div className="py-4">
          <UserForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending} />
          
        </div>
      </Modal>
    </div>);

}