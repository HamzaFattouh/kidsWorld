
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function PickupPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pickup" description="Manage Pickup settings and records." actionLabel="Create Pickup" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Pickup view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
