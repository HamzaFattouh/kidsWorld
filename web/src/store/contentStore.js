import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set as idbSet, del } from 'idb-keyval';

const idbStorage = {
  getItem: async (name) => {
    return (await get(name)) || null;
  },
  setItem: async (name, value) => {
    await idbSet(name, value);
  },
  removeItem: async (name) => {
    await del(name);
  },
};

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

const initialPosts = [
  { 
    id: 1, 
    title: 'أهمية القراءة المبكرة للأطفال', 
    content: 'تعتبر القراءة المبكرة من أهم الركائز في تطور لغة الطفل وتنمية خياله. ننصح بتخصيص 15 دقيقة يومياً للقراءة مع طفلك لتعزيز الروابط وتقوية مهاراته اللغوية والاستيعابية...', 
    date: '2026-10-01',
    author: 'أ. نورة النابلسي',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=500&auto=format&fit=crop'
  },
  { 
    id: 2, 
    title: 'نصائح لغذاء صحي متوازن', 
    content: 'يعد الغذاء الصحي أمراً بالغ الأهمية لنمو الأطفال الجسدي والعقلي. ركزوا على إعطائهم الفواكه والخضروات الطازجة وقللوا من السكريات المصنعة...', 
    date: '2026-09-28',
    author: 'القسم الطبي',
    image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=500&auto=format&fit=crop'
  }
];

const initialAnnouncements = [
  { id: 1, title: 'عطلة رسمية', content: 'نود إعلامكم بأن يوم الخميس القادم سيكون عطلة رسمية بمناسبة العيد الوطني.', priority: 'High', date: '2026-10-10' },
  { id: 2, title: 'اجتماع أولياء الأمور', content: 'يرجى العلم بأن اجتماع أولياء الأمور سيعقد يوم الثلاثاء في تمام الساعة 5 مساءً.', priority: 'Normal', date: '2026-10-12' },
];

export const useContentStore = create(
  persist(
    (set) => ({
      events: initialEvents,
      galleryImages: initialGallery,
      posts: initialPosts,
      announcements: initialAnnouncements,
      
      setEvents: (newEvents) => set({ events: newEvents }),
      setGalleryImages: (newGallery) => set({ galleryImages: newGallery }),
      setPosts: (newPosts) => set({ posts: newPosts }),
      setAnnouncements: (newAnnouncements) => set({ announcements: newAnnouncements }),
    }),
    {
      name: 'kids-world-content-storage',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
