import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function TeacherIncidentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Incidents" description="Manage Incidents settings and records." actionLabel="Create Incidents" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Teacher Incidents view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>);

}