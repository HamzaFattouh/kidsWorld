import { Check, Plus, Minus, Palette, Trophy, Brain, Blocks } from 'lucide-react';
import { useState } from 'react';

export function LandingPage() {
  const [openProgram, setOpenProgram] = useState<number | null>(0);

  const programs = [
    { title: 'برامج الصغار', text: 'أنشطة تفاعلية لأصغر المتعلمين لاكتشاف العالم.' },
    { title: 'برامج الرعاية المبكرة', text: 'رعاية وتطوير مهارات الأطفال من خلال اللعب والأنشطة المنظمة.' },
    { title: 'أنشطة تنموية', text: 'فرص تعليمية مرحة تضمن تنمية قدرات الطفل الحركية والذهنية.' }
  ];

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
              طفلك سيحب <br /> عالم الأطفال!
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-brand-yellow rounded-full"></div>
              <div className="w-8 h-2 bg-brand-yellow rounded-full"></div>
            </div>
            <p className="text-lg md:text-xl font-medium max-w-lg leading-relaxed text-white/90">
              عالم الأطفال هي حضانة متخصصة للأطفال من عمر سنة إلى 4 سنوات، تتميز بنهج حديث في الرعاية والتعليم المبكر.
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
        {/* Floating shape accents */}
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
          <div className="rounded-2xl overflow-hidden shadow-lg group">
            <div className="h-64 overflow-hidden">
              <img src="/images/dynamic/value_1.jpg" alt="Learn and Play" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="bg-brand-blue p-8 text-center text-white space-y-3">
              <h3 className="text-2xl font-display font-bold">التعلم واللعب</h3>
              <p className="text-sm text-white/90 leading-relaxed">يتعلم طفلك كل شيء وفقًا للبرنامج التعليمي أثناء اللعب.</p>
            </div>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-lg group mt-0 md:-mt-6">
            <div className="h-64 overflow-hidden">
              <img src="/images/dynamic/value_2.jpg" alt="Nutritious Dishes" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="bg-brand-orange p-8 text-center text-white space-y-3">
              <h3 className="text-2xl font-display font-bold">وجبات مغذية</h3>
              <p className="text-sm text-white/90 leading-relaxed">الأطباق التي نعدها مزودة بجميع العناصر الغذائية اللازمة ليوم نشط.</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg group">
            <div className="h-64 overflow-hidden">
              <img src="/images/dynamic/value_3.jpg" alt="Great Teachers" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="bg-brand-yellow p-8 text-center text-white space-y-3">
              <h3 className="text-2xl font-display font-bold">معلمون رائعون</h3>
              <p className="text-sm text-white/90 leading-relaxed">سيهتم معلمون ذوو خبرة ومحبوبون بأطفالك في عالم الأطفال.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="relative">
              <div className="absolute -bottom-6 -start-6 w-32 h-32 bg-brand-yellow rounded-full -z-10"></div>
              <img src="/images/dynamic/welcome.jpg" alt="Welcome to Kidtime" className="w-full h-full object-cover rounded-2xl shadow-xl aspect-square" />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                مرحباً بكم في حضانة <br />
                <span className="text-brand-green">عالم الأطفال</span>
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-8 h-2 bg-brand-yellow rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
              <p className="text-brand-dark/70 font-medium">
                هل تبحث عن بيئة آمنة ومرحة لطفلك؟ كل شيء سيكون رائعاً مع حضانة عالم الأطفال!
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                الأطفال مستعدون لاستكشاف هذا العالم، وهدفنا هو مساعدتهم في ذلك. في عالم الأطفال، نوفر رعاية متكاملة للأطفال من سنة إلى 4 سنوات ونساعدهم على التعلم من خلال اللعب.
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-green flex items-center justify-center text-white shadow-lg">
                <Palette className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-display font-bold">دروس الفنون</h4>
              <p className="text-gray-500 text-sm">سنكتشف مواهب طفلك في الوقت المناسب في دروس الفنون لدينا.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-blue flex items-center justify-center text-white shadow-lg">
                <Trophy className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-display font-bold">أنشطة رياضية</h4>
              <p className="text-gray-500 text-sm">لدينا الجمباز، السباحة، التنس، وغيرها للأطفال.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-orange flex items-center justify-center text-white shadow-lg">
                <Brain className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-display font-bold">ألعاب العقل</h4>
              <p className="text-gray-500 text-sm">ألعاب تطور التفكير المنطقي لطفلك.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-yellow flex items-center justify-center text-white shadow-lg">
                <Blocks className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-display font-bold">ألعاب الطاولة والأرضية</h4>
              <p className="text-gray-500 text-sm">لدينا جميع ألعاب طفلك المفضلة! كلها آمنة تمامًا.</p>
            </div>
          </div>
        </div>
      </section>

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

      {/* Additional Classes Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 relative">
        {/* Floating shapes */}
        <div className="absolute top-10 end-1/4 w-8 h-8 bg-brand-blue rounded-full rounded-es-none -rotate-12"></div>
        <div className="absolute top-20 end-20 w-12 h-12 bg-brand-orange rounded-full"></div>
        <div className="absolute bottom-20 start-10 w-10 h-10 bg-brand-yellow rounded-full"></div>

        <div className="max-w-7xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-dark">
            فصول <span className="text-brand-green">إضافية</span>
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-8 h-2 bg-brand-yellow rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
          <p className="max-w-2xl mx-auto text-gray-500 pt-4">
            بالإضافة إلى روضة الأطفال، لدينا أيضًا برامج وأنشطة تعليمية حصرية لأطفالك تساعد في إعدادهم للمدرسة.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="h-56">
              <img src="/images/dynamic/class_1.jpg" alt="Music for Imagination" className="w-full h-full object-cover" />
            </div>
            <div className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-display font-bold">الموسيقى للخيال</h3>
              <p className="text-sm text-gray-500 leading-relaxed pb-6 border-b border-gray-100">
                الموسيقى تطور الخيال وتكتشف مواهب جديدة لدى طفلك. هل طفلك نجم روك جديد أم مغني أوبرا؟ دعونا نكتشف ذلك معًا!
              </p>
              <div className="flex justify-between text-xs font-bold text-gray-400">
                <div className="flex flex-col gap-1">
                  <span>العمر</span>
                  <span className="text-brand-orange">3-5 سنوات</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span>السعر</span>
                  <span className="text-brand-orange">14$ / للحصة</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span>المدة</span>
                  <span className="text-brand-orange">ساعة واحدة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="h-56">
              <img src="/images/dynamic/class_2.jpg" alt="Magic Color" className="w-full h-full object-cover" />
            </div>
            <div className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-display font-bold">الألوان السحرية</h3>
              <p className="text-sm text-gray-500 leading-relaxed pb-6 border-b border-gray-100">
                دروس الرسم لأطفالك تحسن المهارات الحركية الدقيقة بشكل كبير وتكتشف المواهب الفنية لدى أطفالك في الوقت المناسب.
              </p>
              <div className="flex justify-between text-xs font-bold text-gray-400">
                <div className="flex flex-col gap-1">
                  <span>العمر</span>
                  <span className="text-brand-orange">2-3 سنوات</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span>السعر</span>
                  <span className="text-brand-orange">12$ / للحصة</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span>المدة</span>
                  <span className="text-brand-orange">45 دقيقة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="h-56">
              <img src="/images/dynamic/class_3.jpg" alt="Number Matching" className="w-full h-full object-cover" />
            </div>
            <div className="p-8 text-center space-y-4">
              <h3 className="text-2xl font-display font-bold">تطابق الأرقام</h3>
              <p className="text-sm text-gray-500 leading-relaxed pb-6 border-b border-gray-100">
                تطابق الأرقام هو أحد المهارات الأساسية لأي طفل. مع معلمينا، ستسير عملية التعلم والحفظ بشكل أسرع بكثير!
              </p>
              <div className="flex justify-between text-xs font-bold text-gray-400">
                <div className="flex flex-col gap-1">
                  <span>العمر</span>
                  <span className="text-brand-orange">1-2 سنوات</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span>السعر</span>
                  <span className="text-brand-orange">14$ / للحصة</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span>المدة</span>
                  <span className="text-brand-orange">30 دقيقة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
