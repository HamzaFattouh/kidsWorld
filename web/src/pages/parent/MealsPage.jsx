import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { useParentStore } from '../../store/parentStore';
import { api } from '../../lib/api';

export function ParentMealsPage() {
  const { t } = useTranslation();
  const { selectedChildId } = useParentStore();

  const { data: mealsData, isLoading } = useQuery({
    queryKey: ['parent-meals', selectedChildId],
    queryFn: async () => {
      if (!selectedChildId) return [];
      const res = await api.get(`/operations/meals/${selectedChildId}`);
      return res.data?.data || res.data || [];
    },
    enabled: !!selectedChildId
  });

  const columns = [
    {
      header: 'نوع الوجبة',
      accessorKey: 'type',
      cell: (row) => {
        const types = {
          BREAKFAST: 'الإفطار 🍳',
          LUNCH: 'الغداء 🍲',
          SNACK: 'وجبة خفيفة 🍎',
          AFTERNOON_SNACK: 'وجبة المساء 🍪'
        };
        return <span className="font-semibold">{types[row.type] || row.type}</span>;
      }
    },
    {
      header: 'تاريخ الوجبة',
      accessorKey: 'date',
      cell: (row) => row.date ? new Date(row.date).toLocaleDateString('ar-EG') : '—'
    },
    {
      header: 'نسبة التناول',
      accessorKey: 'consumed',
      cell: (row) => {
        const consumedMap = {
          ALL: <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-bold">أكل الوجبة بالكامل ✅</span>,
          SOME: <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold">أكل جزءاً منها ⚠️</span>,
          NONE: <span className="text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-bold">لم يأكل ❌</span>
        };
        return consumedMap[row.consumed] || row.consumed || '—';
      }
    },
    {
      header: 'ملاحظات المعلمة',
      accessorKey: 'notes',
      cell: (row) => row.notes || 'لا توجد ملاحظات'
    }
  ];

  return (
    <div className="space-y-6 text-start">
      <PageHeader
        title="سجل الوجبات الغذائية"
        description={selectedChildId ? "عرض تفاصيل ووجبات الطفل اليومية" : "يرجى اختيار طفل من القائمة الجانبية لعرض الوجبات"}
      />

      {!selectedChildId ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500 font-medium">
            رجاءً اختر طفلك من القائمة الجانبية لعرض سجل الوجبات الغذائية الخاص به.
          </CardContent>
        </Card>
      ) : (
        <DataTable
          data={Array.isArray(mealsData) ? mealsData : []}
          columns={columns}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}