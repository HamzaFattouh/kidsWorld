import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Download,
  Eye,
  FileCheck,
  ShieldCheck,
  Clock,
  Baby,
  FileBox
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { useParentStore } from '../../store/parentStore';

export function ParentDocumentsPage() {
  const { t } = useTranslation();
  const { selectedChildId } = useParentStore();

  const [documents, setDocuments] = useState([
    {
      id: 'doc1',
      title: 'شهادة التسجيل والقبول السنوي',
      category: 'ENROLLMENT',
      date: '2026-08-20',
      size: '1.2 MB',
      type: 'PDF',
      verified: true
    },
    {
      id: 'doc2',
      title: 'سجل اللقاحات والتطعيمات الرسمية',
      category: 'HEALTH',
      date: '2026-08-22',
      size: '850 KB',
      type: 'PDF',
      verified: true
    },
    {
      id: 'doc3',
      title: 'نموذج الأشخاص المخولين بالاستلام',
      category: 'SAFETY',
      date: '2026-08-25',
      size: '420 KB',
      type: 'PDF',
      verified: true
    },
    {
      id: 'doc4',
      title: 'التقرير الطبي السنوي واستمارة الحساسية',
      category: 'MEDICAL',
      date: '2026-09-01',
      size: '950 KB',
      type: 'PDF',
      verified: true
    }
  ]);

  const handleDownload = (doc) => {
    alert(`جاري تجهيز وتنزيل الملف: ${doc.title}`);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="ملفات ووثائق الطفل الرسمية"
        description="استعراض وتنزيل المستندات الرسمية، السجل الصحي، ونماذج التفويض المعتمدة"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark"
          >
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{doc.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-text-muted dark:text-text-mutedDark mt-1">
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>تاريخ الرفع: {doc.date}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownload(doc)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-primary hover:text-white text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg transition-colors border border-gray-200 dark:border-gray-700 flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5" /> تنزيل
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
