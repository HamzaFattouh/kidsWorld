
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function CameraSchedulesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="CameraSchedules" description="Manage CameraSchedules settings and records." actionLabel="Create CameraSchedules" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the CameraSchedules view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
