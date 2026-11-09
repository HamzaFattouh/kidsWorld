import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Megaphone,
  Calendar,
  AlertCircle,
  Clock,
  Eye,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { announcementApi } from '../../api/announcement';

export function ParentAnnouncementsPage() {
  const { t } = useTranslation();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const { data: announcementsData, isLoading } = useQuery({
    queryKey: ['parent-announcements'],
    queryFn: async () => {
      try {
        const res = await announcementApi.getMany();
        if (res?.data && res.data.length > 0) return res.data;
      } catch (e) {
        // Fallback
      }
      return [
        {
          id: 'an1',
          titleAr: 'تحديث خطة الأنشطة الشتوية وتعديل مواعيد الدوام',
          titleEn: 'Winter Schedule & Activity Updates',
          contentAr: 'أولياء الأمور الكرام، نحيطكم علماً بأنه سيتم تطبيق الجدول الشتوي بدءاً من الأسبوع القادم، وسيبدأ استقبال الأطفال من الساعة 07:30 صباحاً وحتى الساعة 03:00 مساءً. نرجو الحرص على تجهيز ملابس دافئة إضافية للأطفال.',
          contentEn: 'Dear parents, please note that the winter schedule will take effect starting next week...',
          priority: 'HIGH',
          createdAt: '2026-09-14'
        },
        {
          id: 'an2',
          titleAr: 'فعالية يوم الصحة والتغذية السليمة',
          titleEn: 'Healthy Nutrition Day',
          contentAr: 'يسر حضانة عالم الأطفال دعوتكم للمشاركة في يوم التغذية الصحية، حيث سيتعرف الأطفال على الهرم الغذائي وسيقومون بإعداد طبق سلطة الفواكه المشتركة في القاعة المركزية.',
          contentEn: 'We are pleased to invite you to the Healthy Nutrition Day...',
          priority: 'NORMAL',
          createdAt: '2026-09-11'
        },
        {
          id: 'an3',
          titleAr: 'عطلة رسمية بمناسبة المولد النبوي الشريف',
          titleEn: 'Official Holiday Announcement',
          contentAr: 'تهنئكم إدارة حضانة عالم الأطفال بحلول ذكرى المولد النبوي الشريف، ونحيطكم علماً بأن الحضانة ستعطل أعمالها يوم الأحد الموافق 27 سبتمبر 2026، وكل عام وأنتم بخير.',
          contentEn: 'KidsWorld administration congratulates you on the Prophet Birthday...',
          priority: 'NORMAL',
          createdAt: '2026-09-08'
        }
      ];
    }
  });

  const announcements = announcementsData || [];

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
      case 'HIGH':
        return <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">هام جداً</span>;
      default:
        return <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">إعلان عام</span>;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="الإعلانات والتعاميم المدرسية"
        description="الاطلاع على أحدث إعلانات إدارة الحضانة والقرارات والفعاليات الرسمية"
      />

      <div className="space-y-3">
        {announcements.map((item) => (
          <Card
            key={item.id}
            className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark hover:border-primary transition-colors"
          >
            <CardContent className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">{item.titleAr || item.titleEn}</h3>
                    <span className="text-xs text-text-muted dark:text-text-mutedDark flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5" /> تاريخ النشر: {item.createdAt}
                    </span>
                  </div>
                </div>
                {getPriorityBadge(item.priority)}
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                {item.contentAr || item.contentEn}
              </p>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setSelectedAnnouncement(item)}
                  className="px-3.5 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-primary hover:text-white text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg transition-colors border border-gray-200 dark:border-gray-700 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> قراءة الإعلان كاملاً
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Read Announcement Modal */}
      <Modal
        isOpen={!!selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        title={selectedAnnouncement?.titleAr || selectedAnnouncement?.titleEn || ''}
      >
        {selectedAnnouncement && (
          <div className="space-y-4 text-right">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 text-xs text-text-muted dark:text-text-mutedDark">
              <span>تاريخ الإعلان: {selectedAnnouncement.createdAt}</span>
              {getPriorityBadge(selectedAnnouncement.priority)}
            </div>

            <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
              {selectedAnnouncement.contentAr || selectedAnnouncement.contentEn}
            </p>

            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors"
            >
              إغلاق
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
