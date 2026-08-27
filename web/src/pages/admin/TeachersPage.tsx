
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function TeachersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Teachers" description="Manage Teachers settings and records." actionLabel="Create Teachers" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Teachers view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
