import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import {
  Sparkles,
  BookOpen,
  Apple,
  Award,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Image as ImageIcon,
  X,
  MapPin,
  ChevronRight,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import api from '../../services/api';

const { width } = Dimensions.get('window');

export function LandingHomeScreen() {
  const scrollViewRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [openProgram, setOpenProgram] = useState(0);

  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchGallery();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/cms/events');
      const data = Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data)
        ? response.data
        : [];
      setEvents(data.filter((e) => e && e.isPublished));
    } catch (error) {
      setEvents(getFallbackActivities());
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await api.get('/auto/galleryImage');
      const data = Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data)
        ? response.data
        : [];
      setGalleryImages(data);
    } catch (e) {
      setGalleryImages(getFallbackJournal());
    }
  };

  const scrollToAbout = () => {
    scrollViewRef.current?.scrollTo({ y: 380, animated: true });
  };

  const handleSavePhoto = (photoUrl) => {
    Alert.alert('حفظ الصورة', 'تم حفظ الصورة بنجاح في معرض جهازك 📥');
  };

  const getFallbackJournal = () => [
    { id: '1', url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500', captionAr: 'أنشطة الرسم والتلوين الجماعية 🎨', date: '2026-09-15' },
    { id: '2', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500', captionAr: 'وجبة الإفطار الصحي مع الأصدقاء 🍎', date: '2026-09-15' },
    { id: '3', url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500', captionAr: 'اللعب والتعليم التفاعلي بالتركيب 🧩', date: '2026-09-14' },
  ];

  const getFallbackActivities = () => [
    {
      id: '1',
      titleAr: 'اليوم المفتوح للأمهات والطفل 🎨',
      eventDate: '2026-10-05',
      descriptionAr: 'فعالية تفاعلية ممتعة تجمع الأمهات والأطفال في أنشطة تفاعلية وألعاب حركية ورسم حي.',
      imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500',
      album: [
        'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500',
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500',
        'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500',
      ],
    },
    {
      id: '2',
      titleAr: 'معرض الألوان والإبداع الصغير 🖌️',
      eventDate: '2026-10-15',
      descriptionAr: 'معرض فني يضم إبداعات ورسومات الأطفال اليدوية في الحضانة وتكريم المتميزين.',
      imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500',
      album: [
        'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500',
        'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500',
      ],
    },
  ];

  const displayJournal = galleryImages.length > 0 ? galleryImages : getFallbackJournal();
  const displayActivities = events.length > 0 ? events.map(e => ({
    ...e,
    album: [
      e.imageUrl || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500',
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500'
    ]
  })) : getFallbackActivities();

  const coreValues = [
    {
      title: 'التعلم واللعب',
      desc: 'يتعلم طفلك كل شيء وفقًا للبرنامج التعليمي أثناء اللعب الإبداعي.',
      bg: '#eff6ff',
      border: '#3b82f6',
      icon: BookOpen,
    },
    {
      title: 'وجبات مغذية',
      desc: 'وجبات طازجة ومجهزة بجميع العناصر الغذائية اللازمة ليوم مفعم بالحيوية.',
      bg: '#fff7ed',
      border: '#f97316',
      icon: Apple,
    },
    {
      title: 'معلمون محترفون',
      desc: 'كادر تعليمي متخصص ذو خبرة ومحبوب يهتم بأطفالكم بكل حب وعناية.',
      bg: '#fefce8',
      border: '#eab308',
      icon: Award,
    },
  ];

  const programs = [
    {
      title: 'برامج الصغار (سنة - سنتين)',
      text: 'أنشطة حركية وحسية تفاعلية مخصصة لأصغر المتعلمين لاكتشاف العالم الخارجي والبيئة المحيطة.',
    },
    {
      title: 'برامج الرعاية المبكرة (سنتين - 3 سنوات)',
      text: 'تطوير المهارات اللغوية والاجتماعية للطفل من خلال التفاعل الجماعي واللعب الموجه.',
    },
    {
      title: 'أنشطة تنموية وتأسيسية (3 - 4 سنوات)',
      text: 'فرص تعليمية مرحة تؤهل الطفل للمرحلة المدرسية وتصقل مهارات التفكير والحل الإبداعي.',
    },
  ];

  return (
    <ScreenWrapper>
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <View style={styles.badgeRow}>
            <Sparkles size={16} color="#f59e0b" />
            <Text style={styles.heroBadgeText}>حضانة عالم الأطفال المتميزة</Text>
          </View>
          <Text style={styles.heroTitle}>طفلك سيحب{"\n"}عالم الأطفال! 🎨</Text>
          <Text style={styles.heroSub}>
            حضانة متخصصة للأطفال من عمر سنة إلى 4 سنوات، تتميز بنهج حديث ومبتكر في الرعاية والتعليم المبكر.
          </Text>

          <TouchableOpacity style={styles.discoverBtn} activeOpacity={0.8} onPress={scrollToAbout}>
            <Text style={styles.discoverBtnText}>اكتشف المزيد ⬇️</Text>
          </TouchableOpacity>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatNumber}>+500</Text>
              <Text style={styles.heroStatLabel}>طفل سعيد</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatNumber}>100%</Text>
              <Text style={styles.heroStatLabel}>بيئة آمنة</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatNumber}>15+</Text>
              <Text style={styles.heroStatLabel}>معلم متمرس</Text>
            </View>
          </View>
        </View>

        {/* Core Values Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTag}>لماذا نحن؟</Text>
          <Text style={styles.sectionTitle}>قيمنا الأساسية ✨</Text>
          <Text style={styles.sectionDesc}>
            في عالم الأطفال نضع سلامة وسعادة طفلك في مقدمة أولوياتنا دائماً.
          </Text>
        </View>

        {coreValues.map((val, idx) => {
          const IconComp = val.icon;
          return (
            <View key={idx} style={[styles.valueCard, { backgroundColor: val.bg, borderColor: val.border }]}>
              <View style={[styles.valueIconCircle, { backgroundColor: val.border }]}>
                <IconComp size={22} color="#ffffff" />
              </View>
              <View style={styles.valueContent}>
                <Text style={styles.valueTitle}>{val.title}</Text>
                <Text style={styles.valueDesc}>{val.desc}</Text>
              </View>
            </View>
          );
        })}

        {/* Welcome & Features */}
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeTitle}>مرحباً بكم في حضانة عالم الأطفال 👋</Text>
          <Text style={styles.welcomeText}>
            نوفر بيئة متكاملة تدمج بين الرعاية الشاملة والتعليم المبكر الممتع، لمساعدة الأطفال على اكتشاف قدراتهم وتنمية شخصيتهم بثقة.
          </Text>

          <View style={styles.featureItem}>
            <CheckCircle size={18} color="#10b981" />
            <Text style={styles.featureText}>رعاية صحية وتغذية متوازنة يومياً</Text>
          </View>
          <View style={styles.featureItem}>
            <CheckCircle size={18} color="#10b981" />
            <Text style={styles.featureText}>ألعاب إبداعية داخلية وخارجية آمنة</Text>
          </View>
          <View style={styles.featureItem}>
            <CheckCircle size={18} color="#10b981" />
            <Text style={styles.featureText}>متابعة يومية دقيقة ومستمرة لولي الأمر</Text>
          </View>
        </View>

        {/* Daily Journal / Gallery Section (المجلة اليومية للأطفال) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTag}>تحديثات يومية</Text>
          <Text style={styles.sectionTitle}>المجلة اليومية للأطفال 📸</Text>
          <Text style={styles.sectionDesc}>صور يومية مباشرة يتم رفعها من المعلمين لمشاركة اللحظات مع أولياء الأمور</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.journalScroll}>
          {displayJournal.map((img, idx) => (
            <View key={img.id || idx} style={styles.journalCard}>
              <Image source={{ uri: img.url }} style={styles.journalImg} />
              <View style={styles.journalInfo}>
                <Text style={styles.journalCaption}>{img.captionAr || img.captionEn || 'لحظات سعيدة من اليوم'}</Text>
                <TouchableOpacity onPress={() => handleSavePhoto(img.url)} style={styles.downloadIconBtn}>
                  <Download size={16} color="#10b981" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Activities Section (قسم الأنشطة والألبومات) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTag}>الأنشطة الممتعة</Text>
          <Text style={styles.sectionTitle}>قسم الأنشطة والفعاليات 🎨</Text>
          <Text style={styles.sectionDesc}>انقر على أي نشاط لمشاهدة التفاصيل وألبوم الصور وحفظها</Text>
        </View>

        {loadingEvents ? (
          <ActivityIndicator size="small" color="#10b981" style={{ marginVertical: 16 }} />
        ) : (
          displayActivities.map((act) => (
            <TouchableOpacity
              key={act.id}
              style={styles.activityCard}
              activeOpacity={0.8}
              onPress={() => setSelectedActivity(act)}
            >
              <Image
                source={{ uri: act.imageUrl || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500' }}
                style={styles.activityImg}
              />
              <View style={styles.activityContent}>
                <View style={styles.activityHeader}>
                  <Calendar size={14} color="#f97316" style={{ marginLeft: 4 }} />
                  <Text style={styles.activityDate}>{act.eventDate}</Text>
                </View>
                <Text style={styles.activityTitle}>{act.titleAr || act.titleEn}</Text>
                <Text style={styles.activityDesc} numberOfLines={2}>{act.descriptionAr || act.descriptionEn}</Text>
                <View style={styles.activityFooter}>
                  <Text style={styles.albumLinkText}>عرض الألبوم والتفاصيل 📸</Text>
                  <ChevronRight size={16} color="#10b981" />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Nursery Programs Accordion */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTag}>المنهج التعليمي</Text>
          <Text style={styles.sectionTitle}>برامج عالم الأطفال 📚</Text>
        </View>

        <View style={styles.programsWrapper}>
          {programs.map((prog, index) => {
            const isOpen = openProgram === index;
            return (
              <View key={index} style={styles.programItem}>
                <TouchableOpacity
                  style={styles.programHeader}
                  activeOpacity={0.7}
                  onPress={() => setOpenProgram(isOpen ? null : index)}
                >
                  <Text style={styles.programTitle}>{prog.title}</Text>
                  {isOpen ? <ChevronUp size={20} color="#10b981" /> : <ChevronDown size={20} color="#6b7280" />}
                </TouchableOpacity>

                {isOpen && <Text style={styles.programText}>{prog.text}</Text>}
              </View>
            );
          })}
        </View>

        {/* Footer Info Address */}
        <View style={styles.footerAddressBox}>
          <MapPin size={18} color="#10b981" style={{ marginLeft: 6 }} />
          <Text style={styles.footerAddressText}>📍 نابلس- نابلس الجديدة</Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Activity Details Modal */}
      {selectedActivity && (
        <Modal visible={true} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSelectedActivity(null)}>
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{selectedActivity.titleAr || selectedActivity.titleEn}</Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                  source={{ uri: selectedActivity.imageUrl || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500' }}
                  style={styles.modalBannerImg}
                />
                <Text style={styles.modalDate}>تاريخ النشاط: {selectedActivity.eventDate}</Text>
                <Text style={styles.modalDesc}>{selectedActivity.descriptionAr || selectedActivity.descriptionEn}</Text>

                <Text style={styles.albumSectionTitle}>ألبوم صور النشاط 📸 (اضغط لحفظ الصورة):</Text>
                <View style={styles.albumGrid}>
                  {selectedActivity.album?.map((photo, pIdx) => (
                    <View key={pIdx} style={styles.albumPhotoCard}>
                      <Image source={{ uri: photo }} style={styles.albumPhotoImg} />
                      <TouchableOpacity
                        style={styles.savePhotoBtn}
                        onPress={() => handleSavePhoto(photo)}
                      >
                        <Download size={14} color="#ffffff" style={{ marginLeft: 4 }} />
                        <Text style={styles.savePhotoText}>حفظ الصورة</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  heroCard: {
    backgroundColor: '#10b981',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  badgeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  heroBadgeText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold', marginRight: 6 },
  heroTitle: { color: '#ffffff', fontSize: 28, fontWeight: 'bold', lineHeight: 36, textAlign: 'right', marginBottom: 12 },
  heroSub: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 14, lineHeight: 22, textAlign: 'right', marginBottom: 16 },

  discoverBtn: {
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  discoverBtnText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },

  heroStatsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  heroStatItem: { alignItems: 'center' },
  heroStatNumber: { color: '#fbbf24', fontSize: 18, fontWeight: 'bold' },
  heroStatLabel: { color: '#ffffff', fontSize: 11, marginTop: 2 },
  heroStatDivider: { width: 1, height: 24, backgroundColor: 'rgba(255, 255, 255, 0.3)' },

  sectionHeader: { marginTop: 12, marginBottom: 16 },
  sectionTag: { fontSize: 12, fontWeight: 'bold', color: '#10b981', textAlign: 'right', marginBottom: 2 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', textAlign: 'right' },
  sectionDesc: { fontSize: 12, color: '#6b7280', textAlign: 'right', marginTop: 4 },

  valueCard: { flexDirection: 'row-reverse', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  valueIconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  valueContent: { flex: 1 },
  valueTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', textAlign: 'right', marginBottom: 4 },
  valueDesc: { fontSize: 13, color: '#4b5563', textAlign: 'right', lineHeight: 18 },

  welcomeBox: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, marginVertical: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  welcomeTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 8 },
  welcomeText: { fontSize: 13, color: '#6b7280', textAlign: 'right', lineHeight: 20, marginBottom: 16 },
  featureItem: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 10 },
  featureText: { fontSize: 13, fontWeight: '600', color: '#374151', marginRight: 8, textAlign: 'right' },

  journalScroll: { marginBottom: 20 },
  journalCard: { width: 220, backgroundColor: '#ffffff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb', marginRight: 12 },
  journalImg: { width: '100%', height: 140 },
  journalInfo: { padding: 10, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  journalCaption: { fontSize: 12, fontWeight: 'bold', color: '#1f2937', flex: 1, textAlign: 'right' },
  downloadIconBtn: { padding: 6, backgroundColor: '#ecfdf5', borderRadius: 8, marginLeft: 6 },

  activityCard: { backgroundColor: '#ffffff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 16 },
  activityImg: { width: '100%', height: 160 },
  activityContent: { padding: 14 },
  activityHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 6 },
  activityDate: { fontSize: 12, fontWeight: 'bold', color: '#f97316' },
  activityTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 4 },
  activityDesc: { fontSize: 13, color: '#6b7280', textAlign: 'right', lineHeight: 18, marginBottom: 10 },
  activityFooter: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 8 },
  albumLinkText: { fontSize: 12, fontWeight: 'bold', color: '#10b981' },

  programsWrapper: { backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 16 },
  programItem: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingVertical: 14 },
  programHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  programTitle: { fontSize: 15, fontWeight: 'bold', color: '#1f2937' },
  programText: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 10, lineHeight: 20 },

  footerAddressBox: { flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 12, padding: 14, marginTop: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  footerAddressText: { fontSize: 13, fontWeight: 'bold', color: '#374151' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 17, fontWeight: 'bold', color: '#111827', flex: 1, textAlign: 'right' },
  modalBannerImg: { width: '100%', height: 180, borderRadius: 14, marginBottom: 12 },
  modalDate: { fontSize: 12, fontWeight: 'bold', color: '#f97316', textAlign: 'right', marginBottom: 6 },
  modalDesc: { fontSize: 13, color: '#4b5563', textAlign: 'right', lineHeight: 20, marginBottom: 16 },

  albumSectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 10 },
  albumGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between' },
  albumPhotoCard: { width: (width - 56) / 2, backgroundColor: '#f9fafb', borderRadius: 12, overflow: 'hidden', marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  albumPhotoImg: { width: '100%', height: 120 },
  savePhotoBtn: { flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', backgroundColor: '#10b981', paddingVertical: 8 },
  savePhotoText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
});
