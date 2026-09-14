import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '../../components/ui/PageHeader';
import { childApi } from '../../api/child';
import { Button } from '../../components/ui/Button';

export function ChildDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['child', id],
    queryFn: async () => {
      // Fetch all and filter, since auto API doesn't have a getOne yet
      const res = await childApi.getMany({ id });
      return res?.data?.[0];
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Child not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 space-x-reverse">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
        <PageHeader
          title={data.name}
          description="Child Details and Overview" />
        
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{data.name}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Class ID</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{data.classId || 'N/A'}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Parent ID</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{data.parentId}</dd>
          </div>
        </dl>
      </div>
    </div>);

}