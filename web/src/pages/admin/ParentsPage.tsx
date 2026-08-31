import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { UserForm, type UserFormValues } from '../../components/forms/UserForm';
import { usersApi } from '../../api/users';
import { childApi } from '../../api/child';
import type { User } from '../../api/users';

export function ParentsPage() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isChildrenModalOpen, setIsChildrenModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  
  const page = 1;
  const limit = 50;
  const role = 'PARENT';

  const { data, isLoading } = useQuery({
    queryKey: ['users', role, page, limit],
    queryFn: () => usersApi.getUsers({ page, limit, role }),
  });

  const createMutation = useMutation({
    mutationFn: (payload: UserFormValues) => usersApi.createUser({ ...payload, role: 'PARENT' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', role] });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      alert(error?.response?.data?.error?.message || 'Error creating user');
    }
  });

  const selectedParent = useMemo(() => {
    if (!selectedParentId || !data?.data) return null;
    return data.data.find(u => u.id === selectedParentId) || null;
  }, [selectedParentId, data?.data]);

  const columns: Column<User>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: (user) => (
        <button
          onClick={() => {
            setSelectedParentId(user.id);
            setIsDetailsModalOpen(true);
          }}
          className="text-primary hover:text-primary-dark font-medium underline-offset-4 hover:underline text-left"
        >
          {user.name || (i18n.language === 'ar' ? '(بانتظار إكمال الحساب)' : '(Pending Setup)')}
        </button>
      ),
    },
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
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (user) => (
        <div className="flex space-x-2 rtl:space-x-reverse">
          <button
            onClick={() => {
              setSelectedParentId(user.id);
              setIsChildrenModalOpen(true);
            }}
            className="text-primary hover:text-primary-dark"
          >
            {t('view_children', 'View Children')}
          </button>
        </div>
      ),
    }
  ];

  const { data: childrenData, isLoading: isLoadingChildren } = useQuery({
    queryKey: ['children', selectedParentId],
    queryFn: () => childApi.getMany({ parentId: selectedParentId }),
    enabled: !!selectedParentId && isChildrenModalOpen,
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('pages.parents.title', 'Parents')} 
        description={t('pages.parents.description', 'Manage Parents settings and records.')} 
        actionLabel={t('pages.parents.create', 'Create Parent')} 
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
        title={t('pages.parents.create', 'Create Parent')}
      >
        <div className="py-4">
          <UserForm 
            onSubmit={(data) => createMutation.mutate(data)} 
            isLoading={createMutation.isPending} 
          />
        </div>
      </Modal>

      <Modal
        isOpen={isChildrenModalOpen}
        onClose={() => {
          setIsChildrenModalOpen(false);
          setSelectedParentId(null);
        }}
        title={t('children_list', 'Children List')}
      >
        <div className="py-4 space-y-4">
          {isLoadingChildren ? (
            <p>{t('loading', 'Loading...')}</p>
          ) : childrenData?.data && childrenData.data.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {childrenData.data.map((child: any) => (
                <li key={child.id} className="py-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {child.name}
                  </span>
                  <Link
                    to={`/admin/children/${child.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Details
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">{t('no_data', 'No data available')}</p>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedParentId(null);
        }}
        title={i18n.language === 'ar' ? 'تفاصيل ولي الأمر' : 'Parent Details'}
      >
        <div className="py-4 space-y-4">
          {selectedParent ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{i18n.language === 'ar' ? 'الاسم' : 'Name'}</h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedParent.name || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{i18n.language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedParent.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{i18n.language === 'ar' ? 'رقم الهوية' : 'National ID'}</h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedParent.nationalId || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{i18n.language === 'ar' ? 'رقم الهاتف' : 'Phone'}</h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedParent.phone || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{i18n.language === 'ar' ? 'رقم هاتف بديل' : 'Alt Phone'}</h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedParent.alternatePhone || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{i18n.language === 'ar' ? 'تاريخ الإنشاء' : 'Created At'}</h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{new Date(selectedParent.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{i18n.language === 'ar' ? 'العنوان' : 'Address'}</h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedParent.address || '-'}</p>
                </div>
              </div>
            </div>
          ) : (
            <p>{t('loading', 'Loading...')}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
