import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function TeacherMyChildrenPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="MyChildren" description="Manage MyChildren settings and records." actionLabel="Create MyChildren" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Teacher MyChildren view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
