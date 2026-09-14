import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';

export function ReportsPage() {
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.reports.title', 'Reports')}
        description={t('pages.reports.description', 'Manage Reports settings and records.')}
        actionLabel={t('pages.reports.create', 'Create Reports')}
        onAction={() => setIsCreateModalOpen(true)} />
      
      <Card>
        <CardContent className="py-12 text-center text-text-muted dark:text-text-mutedDark">
          {t('pages.generic.pending', 'This view is under construction. Module backend integration pending.')}
        </CardContent>
      </Card>
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.reports.create', 'Create Reports')}>
        
        <div className="py-8 text-center text-text-muted dark:text-text-mutedDark">
          {t('pages.generic.coming_soon', 'This feature is coming soon.')}
        </div>
      </Modal>
    </div>);

}