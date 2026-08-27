
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function FormsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Forms" description="Manage Forms settings and records." actionLabel="Create Forms" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Forms view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
