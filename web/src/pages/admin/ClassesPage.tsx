
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function ClassesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Classes" description="Manage Classes settings and records." actionLabel="Create Classes" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Classes view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
