import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { useParentStore } from '../../store/parentStore';
import { api } from '../../lib/api';

export function ParentAttendancePage() {
  const { selectedChildId } = useParentStore();

  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['parent-attendance', selectedChildId],
    queryFn: async () => {
      if (!selectedChildId) return [];
      const res = await api.get(`/operations/attendance/${selectedChildId}`);
      return res.data?.data || res.data || [];
    },
    enabled: !!selectedChildId
  });

  const columns = [
    {
      header: 'التاريخ',
      accessorKey: 'date',
      cell: (row) => row.date ? new Date(row.date).toLocaleDateString('ar-EG') : '—'
    },
    {
      header: 'حالة الحضور',
      accessorKey: 'status',
      cell: (row) => {
        const statusMap = {
          PRESENT: <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-bold">حاضر 🟢</span>,
          ABSENT: <span className="text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-bold">غائب 🔴</span>,
          LATE: <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold">متأخر 🟡</span>,
          EXCUSED: <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-bold">بعذر 🔵</span>
        };
        return statusMap[row.status] || row.status || '—';
      }
    },
    {
      header: 'ملاحظات',
      accessorKey: 'notes',
      cell: (row) => row.notes || 'لا توجد ملاحظات'
    }
  ];

  return (
    <div className="space-y-6 text-start">
      <PageHeader
        title="سجل الحضور والغياب"
        description={selectedChildId ? "عرض تفاصيل حضور وغياب الطفل" : "يرجى اختيار طفل من القائمة الجانبية لعرض السجل"}
      />

      {!selectedChildId ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500 font-medium">
            رجاءً اختر طفلك من القائمة الجانبية لعرض سجل الحضور والغياب الخاص به.
          </CardContent>
        </Card>
      ) : (
        <DataTable
          data={Array.isArray(attendanceData) ? attendanceData : []}
          columns={columns}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}