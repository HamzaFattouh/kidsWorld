
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function DocumentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Documents" description="Manage Documents settings and records." actionLabel="Create Documents" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Documents view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
