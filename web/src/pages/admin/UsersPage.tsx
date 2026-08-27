
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manage Users settings and records." actionLabel="Create Users" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Users view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
