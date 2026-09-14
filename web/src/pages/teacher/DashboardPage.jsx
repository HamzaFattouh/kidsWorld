import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Manage Dashboard settings and records." actionLabel="Create Dashboard" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Teacher Dashboard view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>);

}