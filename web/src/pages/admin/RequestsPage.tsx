
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function RequestsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Requests" description="Manage Requests settings and records." actionLabel="Create Requests" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Requests view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
