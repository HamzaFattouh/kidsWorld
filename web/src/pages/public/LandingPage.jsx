import { Check, Plus, Minus, Calendar, Download, Image as ImageIcon, X, Sparkles, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { homepageConfigApi } from '../../api/homepageConfig';
import { eventApi } from '../../api/event';
import { galleryImageApi } from '../../api/galleryImage';

export function LandingPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar' || !i18n.language;
  const [openProgram, setOpenProgram] = useState(0);

  const [configs, setConfigs] = useState({});
  const [events, setEvents] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    fetchConfigs();
    fetchEvents();
    fetchGallery();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await homepageConfigApi.getMany();
      const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      const configMap = {};
      items.forEach(item => {
        if (item && item.section) configMap[item.section] = item;
      });
      setConfigs(configMap);
    } catch (e) { console.error(e); }
  };

  const fetchEvents = async () => {
    try {
      const res = await eventApi.getMany();
      const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setEvents(items.filter(e => e && e.isPublished));
    } catch (e) { console.error(e); }
  };

  const fetchGallery = async () => {
    try {
      const res = await galleryImageApi.getMany();
      const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setGalleryImages(items);
    } catch (e) { console.error(e); }
  };

  const scrollToAbout = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadImage = (url, filename = 'kids-world-photo.jpg') => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const defaultJournalImages = [
    { id: 'g1', url: '/images/dynamic/value_1.jpg', captionAr: 'أنشطة الرسم والتلوين الجماعية 🎨', date: '2026-09-15' },
    { id: 'g2', url: '/images/dynamic/value_2.jpg', captionAr: 'وجبة الإفطار الصحية مع الأصدقاء 🍎', date: '2026-09-15' },
    { id: 'g3', url: '/images/dynamic/value_3.jpg', captionAr: 'اللعب والتعليم التفاعلي مع المعلمة 🧩', date: '2026-09-14' },
    { id: 'g4', url: '/images/dynamic/hero.jpg', captionAr: 'ابتسامات اليوم وأنشطة الهواء الطلق ☀️', date: '2026-09-14' },
  ];

  const activitiesList = events.length > 0 ? events.map(e => ({
    ...e,
    album: [
      e.imageUrl || '/images/dynamic/value_1.jpg',
      '/images/dynamic/value_2.jpg',
      '/images/dynamic/value_3.jpg',
      '/images/dynamic/welcome.jpg'
    ]
  })) : [
    {
      id: 'act1',
      titleAr: 'اليوم المفتوح للأمهات والأطفال 🎨',
      eventDate: '2026-10-05',
      descriptionAr: 'فعالية تفاعلية ممتعة تدمج الأطفال والأمهات في مسابقات ورسومات حية وأنشطة حركية ممتعة.',
      imageUrl: '/images/dynamic/welcome.jpg',
      album: [
        '/images/dynamic/welcome.jpg',
        '/images/dynamic/value_1.jpg',
        '/images/dynamic/value_2.jpg',
        '/images/dynamic/hero.jpg'
      ]
    },
    {
      id: 'act2',
      titleAr: 'معرض الألوان والإبداع الصغير 🖌️',
      eventDate: '2026-10-15',
      descriptionAr: 'معرض فني سنوي يتم فيه عرض لوحات ومشغولات الأطفال اليدوية وتكريم إبداعاتهم.',
      imageUrl: '/images/dynamic/value_1.jpg',
      album: [
        '/images/dynamic/value_1.jpg',
        '/images/dynamic/value_3.jpg',
        '/images/dynamic/programs.jpg'
      ]
    },
    {
      id: 'act3',
      titleAr: 'يوم التغذية والوجبات الصحية 🍎',
      eventDate: '2026-10-22',
      descriptionAr: 'نشاط تثقيفي مرح يتعرف الأطفال من خلاله على الفواكه والخضروات وتحضير العصائر الفريش.',
      imageUrl: '/images/dynamic/value_2.jpg',
      album: [
        '/images/dynamic/value_2.jpg',
        '/images/dynamic/hero.jpg',
        '/images/dynamic/welcome.jpg'
      ]
    }
  ];

  const displayJournal = galleryImages.length > 0 ? galleryImages : defaultJournalImages;

  const programs = [
    { title: 'برامج الصغار (من سنة إلى 2 سنة)', text: 'أنشطة تفاعلية لأصغر المتعلمين لاكتشاف العالم والتعلم باللعب.' },
    { title: 'برامج الرعاية المبكرة (من 2 إلى 3 سنوات)', text: 'رعاية وتطوير مهارات الأطفال من خلال اللعب المنظم والتفاعل الاجتماعي.' },
    { title: 'أنشطة تنموية وتأسيسية (من 3 إلى 4 سنوات)', text: 'فرص تعليمية مرحة تؤهل الطفل وتضمن تنمية قدراته الحركية والذهنية.' }
  ];

  return (
    <div className="flex flex-col w-full text-brand-dark overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative bg-brand-green pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 rounded-es-[100px] lg:rounded-es-[200px] rounded-ee-[100px] lg:rounded-ee-[300px] overflow-hidden">
        <div className="absolute top-1/2 end-10 w-full h-[150%] border-2 border-dashed border-white/20 rounded-full rounded-ts-none -translate-y-1/2 rtl:-translate-x-1/3 ltr:translate-x-1/3"></div>
        <div className="absolute top-1/4 end-0 w-[80%] h-full border-2 border-dashed border-white/20 rounded-full rounded-ts-none -translate-y-1/2 rtl:-translate-x-1/4 ltr:translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-white space-y-6 text-start">
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight whitespace-pre-wrap">
              {isAr ? (configs.hero?.titleAr || 'طفلك سيحب \n عالم الأطفال!') : (configs.hero?.titleEn || 'Your kid will love \n Kids World!')}
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-yellow rounded-full"></div>
              <div className="w-8 h-2 bg-brand-yellow rounded-full"></div>
            </div>
            <p className="text-lg md:text-xl font-medium max-w-lg leading-relaxed text-white/90 whitespace-pre-wrap">
              {isAr ? (configs.hero?.bodyAr || 'عالم الأطفال هي حضانة متخصصة للأطفال من عمر سنة إلى 4 سنوات، تتميز بنهج حديث في الرعاية والتعليم المبكر.') : (configs.hero?.bodyEn || 'Kids World is a specialized nursery for children 1 to 4 years old.')}
            </p>
            <div className="pt-4">
              <button
                onClick={scrollToAbout}
                className="bg-brand-yellow hover:bg-brand-orange text-white font-display font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:scale-105"
              >
                اكتشف المزيد ⬇️
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -top-10 -end-10 w-32 h-32 bg-brand-blue rounded-full opacity-20 blur-2xl"></div>
            <img
              src="/images/dynamic/hero.jpg"
              alt="Kid playing with cardboard airplane"
              className="w-full max-w-md mx-auto rounded-full border-8 border-white shadow-2xl object-cover aspect-square"
            />
            
            <div className="absolute bottom-10 end-0 w-16 h-16 bg-brand-yellow rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg animate-bounce">
              <span className="text-3xl font-bold">🧩</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-10 end-20 w-10 h-10 bg-brand-green rounded-full"></div>
        <div className="absolute bottom-20 start-10 w-8 h-12 bg-brand-blue rounded-full rounded-te-none rotate-45"></div>

        <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-green">
            قيمنا <span className="text-brand-dark">الأساسية</span>
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-8 h-2 bg-brand-yellow rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
          <p className="max-w-2xl mx-auto text-gray-500 pt-4">
            في عالم الأطفال، نضع دائمًا رعاية الأطفال في المقام الأول، لذا يرجى الاطمئنان عند اختيار حضانتنا.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-2xl overflow-hidden shadow-lg group flex flex-col">
            <div className="h-64 overflow-hidden shrink-0">
              <img src="/images/dynamic/value_1.jpg" alt="Learn and Play" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="bg-brand-blue p-8 text-center text-white space-y-3 flex-1 flex flex-col justify-center">
              <h3 className="text-2xl font-display font-bold">التعلم واللعب</h3>
              <p className="text-sm text-white/90 leading-relaxed">يتعلم طفلك كل شيء وفقًا للبرنامج التعليمي أثناء اللعب.</p>
            </div>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-lg group mt-0 md:-mt-6 flex flex-col">
            <div className="h-64 overflow-hidden shrink-0">
              <img src="/images/dynamic/value_2.jpg" alt="Nutritious Dishes" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="bg-brand-orange p-8 text-center text-white space-y-3 flex-1 flex flex-col justify-center">
              <h3 className="text-2xl font-display font-bold">وجبات مغذية</h3>
              <p className="text-sm text-white/90 leading-relaxed">الأطباق التي نعدها مزودة بجميع العناصر الغذائية اللازمة ليوم نشط.</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg group flex flex-col">
            <div className="h-64 overflow-hidden shrink-0">
              <img src="/images/dynamic/value_3.jpg" alt="Great Teachers" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="bg-brand-yellow p-8 text-center text-white space-y-3 flex-1 flex flex-col justify-center">
              <h3 className="text-2xl font-display font-bold">معلمون رائعون</h3>
              <p className="text-sm text-white/90 leading-relaxed">سيهتم معلمون ذوو خبرة ومحبوبون بأطفالك في عالم الأطفال.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -bottom-6 -start-6 w-32 h-32 bg-brand-yellow rounded-full -z-10"></div>
              <img src="/images/dynamic/welcome.jpg" alt="Welcome to Kidtime" className="w-full h-full object-cover rounded-2xl shadow-xl aspect-square" />
            </div>
            <div className="space-y-6 text-start">
              <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                {isAr ? (configs.about?.titleAr || 'مرحباً بكم في حضانة \n عالم الأطفال') : (configs.about?.titleEn || 'Welcome to \n Kids World')}
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-8 h-2 bg-brand-yellow rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-wrap">
                {isAr ? (configs.about?.bodyAr || 'الأطفال مستعدون لاستكشاف هذا العالم، وهدفنا هو مساعدتهم في ذلك. في عالم الأطفال، نوفر رعاية متكاملة للأطفال من سنة إلى 4 سنوات ونساعدهم على التعلم من خلال اللعب.') : (configs.about?.bodyEn || 'Children are ready to explore the world...')}
              </p>
              <ul className="space-y-3 pt-4">
                <li className="flex items-center gap-3 text-sm font-medium text-brand-dark/80">
                  <div className="w-5 h-5 rounded-full bg-brand-yellow flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>
                  دعم شخصية طفلك وتطوير مهاراته.
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-brand-dark/80">
                  <div className="w-5 h-5 rounded-full bg-brand-yellow flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>
                  ألعاب إبداعية داخلية وخارجية في بيئة آمنة.
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-brand-dark/80">
                  <div className="w-5 h-5 rounded-full bg-brand-yellow flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>
                  كادر تعليمي محترف ومتفرغ.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Journal / Gallery Section (المجلة اليومية للأطفال) */}
      <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-yellow/10 text-brand-orange px-4 py-1.5 rounded-full font-bold text-sm">
            <ImageIcon className="w-4 h-4" />
            تحديثات يومية من المعلمين
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-dark">
            المجلة اليومية <span className="text-brand-green">للأطفال 📸</span>
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-8 h-2 bg-brand-yellow rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
          <p className="max-w-2xl mx-auto text-gray-500 pt-2">
            صور يومية مباشرة يتم رفعها من المعلمين والإدارة لمشاركة أجمل اللحظات والابتسامات مع أولياء الأمور.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayJournal.map((img, idx) => (
            <div key={img.id || idx} className="bg-gray-50 rounded-2xl overflow-hidden shadow-md border border-gray-100 group relative">
              <div className="h-64 overflow-hidden relative">
                <img
                  src={img.url}
                  alt={img.captionAr || 'صورة يومية'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {img.date && (
                  <span className="absolute top-3 end-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                    {img.date}
                  </span>
                )}
              </div>
              <div className="p-4 text-start bg-white flex items-center justify-between">
                <p className="text-sm font-bold text-brand-dark truncate">
                  {img.captionAr || img.captionEn || 'لحظات سعيدة من اليوم'}
                </p>
                <button
                  onClick={() => handleDownloadImage(img.url, `daily-photo-${idx + 1}.jpg`)}
                  className="p-2 text-brand-green hover:bg-brand-green/10 rounded-lg transition-colors"
                  title="حفظ الصورة"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activities Section (قسم الأنشطة والألبومات) */}
      <section id="events" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-dark">
            قسم <span className="text-brand-orange">الأنشطة والفعاليات 🎨</span>
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-8 h-2 bg-brand-yellow rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
          <p className="max-w-2xl mx-auto text-gray-500 pt-2">
            انقر على أي نشاط لمشاهدة التفاصيل الكاملة وألبوم الصور وحفظ الصور على جهازك مباشرة!
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activitiesList.map((act) => (
            <div
              key={act.id}
              onClick={() => setSelectedActivity(act)}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300 cursor-pointer group text-start"
            >
              <div className="h-60 overflow-hidden relative">
                <img
                  src={act.imageUrl || '/images/dynamic/welcome.jpg'}
                  alt={act.titleAr || act.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-bold bg-brand-orange px-3 py-1 rounded-full">
                    {new Date(act.eventDate).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="text-xl font-display font-bold text-brand-dark group-hover:text-brand-green transition-colors">
                  {act.titleAr || act.titleEn}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                  {act.descriptionAr || act.descriptionEn}
                </p>
                <div className="pt-2 flex items-center justify-between text-brand-green font-bold text-sm">
                  <span>مشاهدة ألبوم الصور والتفاصيل 🔥</span>
                  <span className="text-xs bg-brand-green/10 px-2.5 py-1 rounded-md">+{act.album?.length || 3} صور</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Details & Photo Album Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative text-start space-y-6">
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute top-6 end-6 text-gray-400 hover:text-gray-700 dark:hover:text-white p-2 rounded-full bg-gray-100 dark:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div>
              <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
                {new Date(selectedActivity.eventDate).toLocaleDateString('ar-EG')}
              </span>
              <h3 className="text-3xl font-display font-bold text-brand-dark dark:text-white mt-3">
                {selectedActivity.titleAr || selectedActivity.titleEn}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 leading-relaxed">
                {selectedActivity.descriptionAr || selectedActivity.descriptionEn}
              </p>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            <div>
              <h4 className="text-lg font-display font-bold text-brand-dark dark:text-white mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-green" />
                ألبوم صور النشاط (يمكنك تنزيل أي صورة)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {selectedActivity.album?.map((photoUrl, pIdx) => (
                  <div key={pIdx} className="relative group rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 bg-gray-50">
                    <img src={photoUrl} alt="Activity" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleDownloadImage(photoUrl, `activity-photo-${pIdx + 1}.jpg`)}
                        className="bg-brand-yellow hover:bg-brand-orange text-white font-bold text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                      >
                        <Download className="w-4 h-4" />
                        حفظ الصورة
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Programs Section */}
      <section id="programs" className="bg-brand-green relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="h-[400px] lg:h-auto">
            <img src="/images/dynamic/programs.jpg" alt="Programs" className="w-full h-full object-cover" />
          </div>
          <div className="p-12 lg:p-24 text-white text-start">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">برامج عالم الأطفال</h2>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              <div className="w-8 h-2 bg-brand-yellow rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
            <p className="text-white/90 mb-12 max-w-md">
              لقد طورنا برامج مختلفة لمختلف الأعمار ومستويات المهارة. تحقق منها أدناه واتصل بنا لمزيد من التفاصيل.
            </p>
            
            <div className="space-y-4">
              {programs.map((prog, index) => (
                <div key={index} className="border-b border-white/20 pb-4">
                  <button
                    onClick={() => setOpenProgram(openProgram === index ? null : index)}
                    className="w-full flex items-center justify-between text-start font-display font-bold text-xl hover:text-brand-yellow transition-colors"
                  >
                    {prog.title}
                    {openProgram === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                  {openProgram === index && (
                    <p className="pt-4 text-white/80 text-sm pe-8">
                      {prog.text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Address Info Bar */}
      <div className="bg-brand-dark border-t border-white/10 py-6 text-center text-gray-400 text-sm font-semibold">
        📍 نابلس- نابلس الجديدة | جميع الحقوق محفوظة © {new Date().getFullYear()} عالم الأطفال
      </div>
    </div>
  );
}