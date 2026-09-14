import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useParentStore } from '../../store/parentStore';
import { api } from '../../lib/api';

export function ParentRequestsPage() {
  const { selectedChildId } = useParentStore();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('LEAVE');
  const [description, setDescription] = useState('');

  const { data: requestsData, isLoading } = useQuery({
    queryKey: ['parent-requests'],
    queryFn: async () => {
      const res = await api.get('/communication/requests');
      return res.data?.data || res.data || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/communication/requests', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent-requests'] });
      setIsOpen(false);
      setDescription('');
    },
    onError: (err) => {
      alert(err?.response?.data?.error?.message || 'حدث خطأ أثناء إرسال الطلب');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      type,
      description,
      childId: selectedChildId || undefined
    });
  };

  const columns = [
    {
      header: 'نوع الطلب',
      accessorKey: 'type',
      cell: (row) => {
        const typeMap = {
          LEAVE: 'طلب إجازة / غياب 📝',
          EARLY_PICKUP: 'طلب مغادرة مبكرة 🚗',
          PROFILE_UPDATE: 'تحديث بيانات 👤',
          DOCUMENT_REQUEST: 'طلب مستندات 📄',
          MEETING_REQUEST: 'طلب موعد اجتماع 🤝'
        };
        return <span className="font-bold">{typeMap[row.type] || row.type}</span>;
      }
    },
    {
      header: 'التفاصيل والسبب',
      accessorKey: 'description',
      cell: (row) => row.description
    },
    {
      header: 'الحالة',
      accessorKey: 'status',
      cell: (row) => {
        const statusMap = {
          OPEN: <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold">قيد الانتظار 🟡</span>,
          IN_PROGRESS: <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-bold">جاري المراجعة 🔵</span>,
          RESOLVED: <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-bold">تمت الموافقة ✅</span>,
          CLOSED: <span className="text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full text-xs font-bold">مرفوض / مغلق 🔒</span>
        };
        return statusMap[row.status] || row.status || '—';
      }
    },
    {
      header: 'تاريخ التقديم',
      accessorKey: 'createdAt',
      cell: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString('ar-EG') : '—'
    }
  ];

  return (
    <div className="space-y-6 text-start">
      <PageHeader
        title="طلبات أولياء الأمور"
        description="تقديم ومتابعة طلبات الإجازات والمغادرة والمستندات"
        actionLabel="تقديم طلب جديد"
        onAction={() => setIsOpen(true)}
      />

      <DataTable
        data={Array.isArray(requestsData) ? requestsData : []}
        columns={columns}
        isLoading={isLoading}
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="تقديم طلب جديد">
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text dark:text-text-dark">نوع الطلب</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="LEAVE">طلب إجازة / غياب</option>
              <option value="EARLY_PICKUP">طلب مغادرة مبكرة</option>
              <option value="DOCUMENT_REQUEST">طلب شهادة / مستندات</option>
              <option value="MEETING_REQUEST">طلب موعد اجتماع مع المعلمة أو الإدارة</option>
              <option value="PROFILE_UPDATE">تحديث بيانات الحساب</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-text dark:text-text-dark">التفاصيل والسبب</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="اكتب سبب وتفاصيل الطلب..."
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" isLoading={createMutation.isPending} className="w-full">
              حفظ وإرسال الطلب
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}