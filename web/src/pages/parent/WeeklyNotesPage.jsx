import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { useParentStore } from '../../store/parentStore';
import { api } from '../../lib/api';

export function ParentWeeklyNotesPage() {
  const { selectedChildId } = useParentStore();

  const { data: notesData, isLoading } = useQuery({
    queryKey: ['parent-weekly-notes', selectedChildId],
    queryFn: async () => {
      if (!selectedChildId) return [];
      const res = await api.get(`/reporting/notes/${selectedChildId}`);
      return res.data?.data || res.data || [];
    },
    enabled: !!selectedChildId
  });

  const columns = [
    {
      header: 'بداية الأسبوع',
      accessorKey: 'weekStartDate',
      cell: (row) => row.weekStartDate ? new Date(row.weekStartDate).toLocaleDateString('ar-EG') : '—'
    },
    {
      header: 'السلوك والمشاركة',
      accessorKey: 'behavior',
      cell: (row) => row.behavior || '—'
    },
    {
      header: 'المهارات الاجتماعية',
      accessorKey: 'socialSkills',
      cell: (row) => row.socialSkills || '—'
    },
    {
      header: 'ملاحظات عامة',
      accessorKey: 'generalNotes',
      cell: (row) => row.generalNotes || 'لا توجد ملاحظات'
    }
  ];

  return (
    <div className="space-y-6 text-start">
      <PageHeader
        title="الملاحظات الأسبوعية"
        description={selectedChildId ? "عرض الملاحظات والتقارير الأسبوعية للطفل" : "يرجى اختيار طفل من القائمة الجانبية لعرض الملاحظات"}
      />

      {!selectedChildId ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500 font-medium">
            رجاءً اختر طفلك من القائمة الجانبية لعرض الملاحظات الأسبوعية الخاصة به.
          </CardContent>
        </Card>
      ) : (
        <DataTable
          data={Array.isArray(notesData) ? notesData : []}
          columns={columns}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}