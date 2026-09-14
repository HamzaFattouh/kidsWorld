import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useParentStore } from '../../store/parentStore';
import { api } from '../../lib/api';

export function ParentComplaintsPage() {
  const { selectedChildId } = useParentStore();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const { data: complaintsData, isLoading } = useQuery({
    queryKey: ['parent-complaints'],
    queryFn: async () => {
      const res = await api.get('/communication/complaints');
      return res.data?.data || res.data || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/communication/complaints', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent-complaints'] });
      setIsOpen(false);
      setTitle('');
      setDescription('');
    },
    onError: (err) => {
      alert(err?.response?.data?.error?.message || 'حدث خطأ أثناء إرسال الشكوى');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      description,
      childId: selectedChildId || undefined
    });
  };

  const columns = [
    {
      header: 'عنوان الشكوى / الملاحظة',
      accessorKey: 'title',
      cell: (row) => <span className="font-bold">{row.title}</span>
    },
    {
      header: 'التفاصيل',
      accessorKey: 'description',
      cell: (row) => row.description
    },
    {
      header: 'الحالة',
      accessorKey: 'status',
      cell: (row) => {
        const statusMap = {
          OPEN: <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold">قيد المراجعة 🟡</span>,
          IN_PROGRESS: <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-bold">قيد المعالجة 🔵</span>,
          RESOLVED: <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-bold">تم الحل ✅</span>,
          CLOSED: <span className="text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full text-xs font-bold">مغلقة 🔒</span>
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
        title="الشكاوى والمقترحات"
        description="إرسال ومتابعة الشكاوى والاقتراحات الموجهة للإدارة"
        actionLabel="تقديم شكوى جديدة"
        onAction={() => setIsOpen(true)}
      />

      <DataTable
        data={Array.isArray(complaintsData) ? complaintsData : []}
        columns={columns}
        isLoading={isLoading}
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="تقديم شكوى أو مقترح جديد">
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="عنوان الموضوع"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="أدخل عنواناً مختصراً"
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-text dark:text-text-dark">التفاصيل والوصف</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="اكتب تفاصيل الشكوى أو الاقتراح..."
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" isLoading={createMutation.isPending} className="w-full">
              إرسال للإدارة
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}