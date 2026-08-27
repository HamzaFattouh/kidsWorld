
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function ParentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Parents" description="Manage Parents settings and records." actionLabel="Create Parents" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Parents view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
