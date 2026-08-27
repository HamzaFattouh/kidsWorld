
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function EventsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Events" description="Manage Events settings and records." actionLabel="Create Events" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Events view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
