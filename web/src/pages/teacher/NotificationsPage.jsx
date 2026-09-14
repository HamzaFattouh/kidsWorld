import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function TeacherNotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Manage Notifications settings and records." actionLabel="Create Notifications" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Teacher Notifications view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>);

}