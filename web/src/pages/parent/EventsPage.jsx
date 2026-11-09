import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { eventApi } from '../../api/event';

export function ParentEventsPage() {
  const { t } = useTranslation();

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['parent-events'],
    queryFn: async () => {
      try {
        const res = await eventApi.getMany();
        if (res?.data && res.data.length > 0) return res.data;
      } catch (e) {
        // Fallback
      }
      return [
        {
          id: 'ev1',
          titleAr: 'مهرجان الخريف والأنشطة الزراعية للأطفال',
          titleEn: 'Autumn Festival & Planting Activity',
          eventDate: '2026-09-22',
          time: '09:30 ص - 12:00 م',
          location: 'الحديقة الخارجية لحضانة عالم الأطفال',
          descriptionAr: 'نشاط بيئي ترفيهي يتعلم فيه الأطفال غرس الشتلات الصغيرة والتعرف على دورة حياة النباتات.',
          descriptionEn: 'A hands-on environmental activity where children learn about plant life cycles...',
          imageUrl: '/images/dynamic/value_1.jpg'
        },
        {
          id: 'ev2',
          titleAr: 'المعرض الفني الأول لإبداعات الصغار',
          titleEn: 'Little Artists Exhibition',
          eventDate: '2026-10-05',
          time: '10:00 ص - 01:00 م',
          location: 'القاعة الرئيسية للحضانة',
          descriptionAr: 'معرض فني يضم رسومات وأشغال يدوية من إنجاز أطفال الروضة مع إمكانية حضور أولياء الأمور.',
          descriptionEn: 'Art exhibition showcasing children drawings and handicrafts...',
          imageUrl: '/images/dynamic/class_1.jpg'
        },
        {
          id: 'ev3',
          titleAr: 'رحلة استكشافية إلى حديقة الطيور والحيوانات الأليفة',
          titleEn: 'Field Trip to Pet Zoo',
          eventDate: '2026-10-18',
          time: '08:30 ص - 01:30 م',
          location: 'منتزه وحديقة الحيوانات الأليفة',
          descriptionAr: 'رحلة ترفيهية وتعليمية بإشراف كامل من المعلمات والكادر الطبي المرافق.',
          descriptionEn: 'Educational and fun field trip under full supervision...',
          imageUrl: '/images/dynamic/class_2.jpg'
        }
      ];
    }
  });

  const events = eventsData || [];

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="الفعاليات والأنشطة القادمة"
        description="الاطلاع على جدول الرحلات والمهرجانات والمعارض الفنية الخاصة بالحضانة"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((ev) => (
          <Card
            key={ev.id}
            className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="h-44 w-full bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                <img
                  src={ev.imageUrl || '/images/dynamic/class_1.jpg'}
                  alt={ev.titleAr}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/dynamic/class_1.jpg';
                  }}
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-primary flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {ev.eventDate}
                </div>
              </div>

              <CardContent className="p-4 space-y-2.5">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                  {ev.titleAr || ev.titleEn}
                </h3>

                <p className="text-xs text-text-muted dark:text-text-mutedDark line-clamp-3 leading-relaxed">
                  {ev.descriptionAr || ev.descriptionEn}
                </p>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{ev.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
