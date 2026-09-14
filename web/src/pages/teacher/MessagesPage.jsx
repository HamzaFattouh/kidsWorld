import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function TeacherMessagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description="Manage Messages settings and records." actionLabel="Create Messages" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Teacher Messages view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>);

}