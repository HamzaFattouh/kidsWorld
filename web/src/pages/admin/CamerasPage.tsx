
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function CamerasPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Cameras" description="Manage Cameras settings and records." actionLabel="Create Cameras" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Cameras view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
