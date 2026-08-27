
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function ChildrenPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Children" description="Manage Children settings and records." actionLabel="Create Children" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Children view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
