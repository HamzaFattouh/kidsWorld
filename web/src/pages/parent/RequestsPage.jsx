import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { useParentStore } from '../../store/parentStore';

export function ParentRequestsPage() {
  const { selectedChildId } = useParentStore();

  return (
    <div className="space-y-6">
      <PageHeader title="Requests" description={"Viewing records for child ID: " + (selectedChildId || "None")} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Parent Requests view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>);

}