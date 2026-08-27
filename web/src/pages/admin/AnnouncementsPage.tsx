
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Manage Announcements settings and records." actionLabel="Create Announcements" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Announcements view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
