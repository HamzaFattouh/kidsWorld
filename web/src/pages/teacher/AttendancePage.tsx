import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function TeacherAttendancePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Manage Attendance settings and records." actionLabel="Create Attendance" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Teacher Attendance view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
