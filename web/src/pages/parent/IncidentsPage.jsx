import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { useParentStore } from '../../store/parentStore';
import { api } from '../../lib/api';

export function ParentIncidentsPage() {
  const { selectedChildId } = useParentStore();

  const { data: incidentsData, isLoading } = useQuery({
    queryKey: ['parent-incidents', selectedChildId],
    queryFn: async () => {
      if (!selectedChildId) return [];
      const res = await api.get(`/reporting/incidents/${selectedChildId}`);
      return res.data?.data || res.data || [];
    },
    enabled: !!selectedChildId
  });

  const columns = [
    {
      header: 'التاريخ والوقت',
      accessorKey: 'date',
      cell: (row) => (
        <span>
          {row.date ? new Date(row.date).toLocaleDateString('ar-EG') : '—'} {row.time ? `(${row.time})` : ''}
        </span>
      )
    },
    {
      header: 'درجة الخطورة',
      accessorKey: 'severity',
      cell: (row) => {
        const sevMap = {
          LOW: <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-bold">بسيط 🟢</span>,
          MEDIUM: <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold">متوسط 🟡</span>,
          HIGH: <span className="text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full text-xs font-bold">عالي 🟠</span>,
          CRITICAL: <span className="text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-bold">حرِج 🔴</span>
        };
        return sevMap[row.severity] || row.severity || '—';
      }
    },
    {
      header: 'تفاصيل الحادثة',
      accessorKey: 'description',
      cell: (row) => row.description || '—'
    },
    {
      header: 'الإجراء المتبع',
      accessorKey: 'actionTaken',
      cell: (row) => row.actionTaken || 'لا يوجد إجراء مسجل'
    }
  ];

  return (
    <div className="space-y-6 text-start">
      <PageHeader
        title="سجل الحوادث والظروف الطارئة"
        description={selectedChildId ? "عرض الملاحظات التوثيقية لأي حادث طارئ" : "يرجى اختيار طفل من القائمة الجانبية لعرض الحوادث"}
      />

      {!selectedChildId ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500 font-medium">
            رجاءً اختر طفلك من القائمة الجانبية لعرض سجل الحوادث والظروف الطارئة الخاص به.
          </CardContent>
        </Card>
      ) : (
        <DataTable
          data={Array.isArray(incidentsData) ? incidentsData : []}
          columns={columns}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}