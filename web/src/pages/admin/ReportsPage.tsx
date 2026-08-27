
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Manage Reports settings and records." actionLabel="Create Reports" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Reports view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
