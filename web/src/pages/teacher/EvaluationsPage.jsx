import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function TeacherEvaluationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Evaluations" description="Manage Evaluations settings and records." actionLabel="Create Evaluations" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Teacher Evaluations view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>);

}