
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function WeeklyNotesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="WeeklyNotes" description="Manage WeeklyNotes settings and records." actionLabel="Create WeeklyNotes" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the WeeklyNotes view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
