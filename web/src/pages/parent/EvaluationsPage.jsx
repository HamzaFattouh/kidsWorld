import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { useParentStore } from '../../store/parentStore';
import { api } from '../../lib/api';

export function ParentEvaluationsPage() {
  const { selectedChildId } = useParentStore();

  const { data: evaluationsData, isLoading } = useQuery({
    queryKey: ['parent-evaluations', selectedChildId],
    queryFn: async () => {
      if (!selectedChildId) return [];
      const res = await api.get(`/reporting/evaluations/${selectedChildId}`);
      return res.data?.data || res.data || [];
    },
    enabled: !!selectedChildId
  });

  const renderStars = (score) => {
    const stars = '⭐'.repeat(Math.min(5, Math.max(1, score || 1)));
    return <span className="text-amber-500 font-bold">{stars} ({score || 0}/5)</span>;
  };

  const columns = [
    {
      header: 'الفصل الدراسي',
      accessorKey: 'term',
      cell: (row) => <span className="font-bold">{row.term || 'التقييم الدوري'}</span>
    },
    {
      header: 'التعلم والاستيعاب',
      accessorKey: 'learning',
      cell: (row) => renderStars(row.learning)
    },
    {
      header: 'التواصل واللغة',
      accessorKey: 'communication',
      cell: (row) => renderStars(row.communication)
    },
    {
      header: 'المهارات الاجتماعية',
      accessorKey: 'socialSkills',
      cell: (row) => renderStars(row.socialSkills)
    },
    {
      header: 'السلوك والالتزام',
      accessorKey: 'behavior',
      cell: (row) => renderStars(row.behavior)
    }
  ];

  return (
    <div className="space-y-6 text-start">
      <PageHeader
        title="تقييمات الأداء والنمو"
        description={selectedChildId ? "عرض النماذج والتقييمات المعتمدة للطفل" : "يرجى اختيار طفل من القائمة الجانبية لعرض التقييمات"}
      />

      {!selectedChildId ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500 font-medium">
            رجاءً اختر طفلك من القائمة الجانبية لعرض تقييماته التنموية والتربوية.
          </CardContent>
        </Card>
      ) : (
        <DataTable
          data={Array.isArray(evaluationsData) ? evaluationsData : []}
          columns={columns}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}