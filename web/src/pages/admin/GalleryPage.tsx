
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function GalleryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Gallery" description="Manage Gallery settings and records." actionLabel="Create Gallery" onAction={() => console.log('Create')} />
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          This is the Gallery view. Module backend integration pending.
        </CardContent>
      </Card>
    </div>
  );
}
