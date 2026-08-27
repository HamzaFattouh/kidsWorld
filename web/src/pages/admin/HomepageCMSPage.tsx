
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function HomepageCMSPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="HomepageCMS" description="Manage HomepageCMS settings and records." actionLabel="Create HomepageCMS" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the HomepageCMS view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
