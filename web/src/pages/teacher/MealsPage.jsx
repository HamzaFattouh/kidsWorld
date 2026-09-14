import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function TeacherMealsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Meals" description="Manage Meals settings and records." actionLabel="Create Meals" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Teacher Meals view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>);

}