import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function TeacherCalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" description="Manage Calendar settings and records." actionLabel="Create Calendar" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Teacher Calendar view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>);

}