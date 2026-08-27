import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { useParentStore } from '../../store/parentStore';

export function ParentMessagesPage() {
  const { selectedChildId } = useParentStore();

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description={"Viewing records for child ID: " + (selectedChildId || "None")} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Parent Messages view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
