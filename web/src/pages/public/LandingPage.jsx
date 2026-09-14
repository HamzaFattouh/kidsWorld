import { Check, Plus, Minus, Palette, Trophy, Brain, Blocks, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { homepageConfigApi } from '../../api/homepageConfig';
import { eventApi } from '../../api/event';

export function LandingPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar' || !i18n.language; // fallback to Arabic
  const [openProgram, setOpenProgram] = useState(0);
  
  const [configs, setConfigs] = useState({});
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchConfigs();
    fetchEvents();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await homepageConfigApi.getMany();
      const configMap = {};
      res.data.forEach(item => {
        configMap[item.section] = item;
      });
      setConfigs(configMap);
    } catch (e) { console.error(e); }
  };

  const fetchEvents = async () => {
    try {
      const res = await eventApi.getMany();
      setEvents(res.data.filter(e => e.isPublished));
    } catch (e) { console.error(e); }
  };

  const programs = [
  { title: 'برامج الصغار', text: 'أنشطة تفاعلية لأصغر المتعلمين لاكتشاف العالم.' },
  { title: 'برامج الرعاية المبكرة', text: 'رعاية وتطوير مهارات الأطفال من خلال اللعب والأنشطة المنظمة.' },
  { title: 'أنشطة تنموية', text: 'فرص تعليمية مرحة تضمن تنمية قدرات الطفل الحركية والذهنية.' }];


  return (
    <div className="flex flex-col w-full text-brand-dark overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative bg-brand-green pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 rounded-es-[100px] lg:rounded-es-[200px] rounded-ee-[100px] lg:rounded-ee-[300px] overflow-hidden">
        {/* Dotted curve background accents */}
        <div className="absolute top-1/2 end-10 w-full h-[150%] border-2 border-dashed border-white/20 rounded-full rounded-ts-none -translate-y-1/2 rtl:-translate-x-1/3 ltr:translate-x-1/3"></div>
        <div className="absolute top-1/4 end-0 w-[80%] h-full border-2 border-dashed border-white/20 rounded-full rounded-ts-none -translate-y-1/2 rtl:-translate-x-1/4 ltr:translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-white space-y-6">
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
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
              <button className="bg-brand-yellow hover:bg-brand-orange text-white font-display font-bold text-lg px-8 py-4 rounded-full transition-colors shadow-xl">
                اكتشف المزيد
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -top-10 -end-10 w-32 h-32 bg-brand-blue rounded-full opacity-20 blur-2xl"></div>
            <img
              src="/images/dynamic/hero.jpg"
              alt="Kid playing with cardboard airplane"
              className="w-full max-w-md mx-auto rounded-full border-8 border-white shadow-2xl object-cover aspect-square" />
            
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
            <div className="space-y-6">
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
                  دعم شخصية طفلك.
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-brand-dark/80">
                  <div className="w-5 h-5 rounded-full bg-brand-yellow flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>
                  ألعاب إبداعية داخلية وخارجية.
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-brand-dark/80">
                  <div className="w-5 h-5 rounded-full bg-brand-yellow flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>
                  معلمون محترفون ومتفانون.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section (Dynamic) */}
      {events.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-dark">
              فعاليات <span className="text-brand-orange">قادمة</span>
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-8 h-2 bg-brand-yellow rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
            <p className="max-w-2xl mx-auto text-gray-500 pt-4">
              تعرف على الفعاليات والأنشطة القادمة في الحضانة!
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
                {event.imageUrl && (
                  <div className="h-56">
                    <img src={event.imageUrl} alt={isAr ? event.titleAr : event.titleEn} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-display font-bold text-brand-dark">
                    {isAr ? event.titleAr : event.titleEn}
                  </h3>
                  <div className="flex items-center gap-2 text-brand-orange font-bold text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.eventDate).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {isAr ? event.descriptionAr : event.descriptionEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Programs Section */}
      <section id="programs" className="bg-brand-green relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="h-[400px] lg:h-auto">
            <img src="/images/dynamic/programs.jpg" alt="Programs" className="w-full h-full object-cover" />
          </div>
          <div className="p-12 lg:p-24 text-white">
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
              {programs.map((prog, index) =>
              <div key={index} className="border-b border-white/20 pb-4">
                  <button
                  onClick={() => setOpenProgram(openProgram === index ? null : index)}
                  className="w-full flex items-center justify-between text-start font-display font-bold text-xl hover:text-brand-yellow transition-colors">
                  
                    {prog.title}
                    {openProgram === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                  {openProgram === index &&
                <p className="pt-4 text-white/80 text-sm pe-8">
                      {prog.text}
                    </p>
                }
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}