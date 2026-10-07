import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialEvents = [
  { 
    id: 1, 
    title: 'رحلة حديقة الحيوان', 
    titleAr: 'رحلة حديقة الحيوان', 
    description: 'رحلة ترفيهية وتعليمية لأطفال الروضة إلى حديقة الحيوان للتعرف على الحيوانات وبيئاتها.', 
    descriptionAr: 'رحلة ترفيهية وتعليمية لأطفال الروضة إلى حديقة الحيوان للتعرف على الحيوانات وبيئاتها.', 
    date: '2026-10-20',
    eventDate: '2026-10-20', 
    time: '08:00 AM', 
    location: 'حديقة الحيوان الوطنية', 
    isPublished: true,
    image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=500&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=500&auto=format&fit=crop',
    album: ['https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=500&auto=format&fit=crop']
  },
  { 
    id: 2, 
    title: 'حفل نهاية الفصل', 
    titleAr: 'حفل نهاية الفصل', 
    description: 'حفل لتكريم الأطفال وتوزيع الشهادات والهدايا بحضور أولياء الأمور.', 
    descriptionAr: 'حفل لتكريم الأطفال وتوزيع الشهادات والهدايا بحضور أولياء الأمور.', 
    date: '2026-12-15',
    eventDate: '2026-12-15', 
    time: '10:00 AM', 
    location: 'مسرح الحضانة', 
    isPublished: true,
    image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=500&auto=format&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=500&auto=format&fit=crop',
    album: ['https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=500&auto=format&fit=crop']
  },
];

const initialGallery = [
  { id: 1, url: 'https://images.unsplash.com/photo-1587691592099-24045742c181?q=80&w=500&auto=format&fit=crop', title: 'أنشطة الرسم', captionAr: 'أنشطة الرسم', date: '2026-10-01' },
  { id: 2, url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=500&auto=format&fit=crop', title: 'لعب الأطفال', captionAr: 'لعب الأطفال', date: '2026-10-02' },
  { id: 3, url: 'https://images.unsplash.com/photo-1544626127-148184d08151?q=80&w=500&auto=format&fit=crop', title: 'تعلم الأرقام', captionAr: 'تعلم الأرقام', date: '2026-10-03' },
  { id: 4, url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=500&auto=format&fit=crop', title: 'ألعاب الذكاء', captionAr: 'ألعاب الذكاء', date: '2026-10-04' }
];

export const useContentStore = create(
  persist(
    (set) => ({
      events: initialEvents,
      galleryImages: initialGallery,
      
      setEvents: (newEvents) => set({ events: newEvents }),
      setGalleryImages: (newGallery) => set({ galleryImages: newGallery }),
    }),
    {
      name: 'kids-world-content-storage',
    }
  )
);
