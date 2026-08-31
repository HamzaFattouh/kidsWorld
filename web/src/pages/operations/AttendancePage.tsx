import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { AttendanceForm, type AttendanceFormValues } from '../../components/forms/AttendanceForm';
import { attendanceRecordApi } from '../../api/attendanceRecord';
import type { Attendance } from '../../api/attendanceRecord';

export function AttendancePage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['attendanceRecord'],
    queryFn: () => attendanceRecordApi.getMany(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: AttendanceFormValues) => attendanceRecordApi.createOne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendanceRecord'] });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      alert(error?.response?.data?.error?.message || 'Error creating record');
    }
  });

  const columns: Column<Attendance>[] = [

    {
      header: 'childId',
      accessorKey: 'childId',
    },
    {
      header: 'date',
      accessorKey: 'date',
    },
    {
      header: 'status',
      accessorKey: 'status',
    },
    {
      header: 'notes',
      accessorKey: 'notes',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('pages.attendance.title', 'Attendance')} 
        description={t('pages.attendance.description', 'Manage Attendance')} 
        actionLabel={t('pages.attendance.create', 'Create')} 
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
        title={t('pages.attendance.create', 'Create')}
      >
        <div className="py-4">
          <AttendanceForm 
            onSubmit={(data) => createMutation.mutate(data)} 
            isLoading={createMutation.isPending} 
          />
        </div>
      </Modal>
    </div>
  );
}
