import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  User,
  CheckCircle2,
  Utensils,
  Camera,
  FileText,
  Star,
  MessageSquare,
  FileCheck,
  Calendar,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  Video,
  ShieldCheck,
  Bell,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function HomeScreen({ navigation }) {
  const [selectedChild, setSelectedChild] = useState({
    id: '1',
    name: 'عمر أحمد الشكعة',
    classroom: 'روضة العصافير (KG1)',
    teacher: 'أ. نور عبد الرحمن',
    checkedIn: true,
    checkInTime: '07:55 ص',
    lastMeal: 'وجبة الغداء (تناول الوجبة كاملة)',
    lastMealTime: '12:30 م',
  });

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingTitle}>أهلاً بك، أ. أحمد الشكعة</Text>
            <Text style={styles.childTag}>
              الطفل: {selectedChild.name} • {selectedChild.classroom}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation?.navigate('Inbox', { screen: 'Notifications' })}
          >
            <Bell size={20} color="#374151" />
            <View style={styles.badgeDot} />
          </TouchableOpacity>
        </View>

        {/* Live Status Card */}
        <View style={styles.liveCard}>
          <View style={styles.liveCardHeader}>
            <View style={styles.liveStatusPill}>
              <View style={styles.greenPulse} />
              <Text style={styles.liveStatusText}>متواجد بالروضة حالياً</Text>
            </View>
            <Text style={styles.checkInTime}>وقت الوصول: {selectedChild.checkInTime}</Text>
          </View>

          <View style={styles.liveDetailsRow}>
            <View style={styles.liveDetailBox}>
              <View style={styles.detailIconBox}>
                <Utensils size={18} color="#d97706" />
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={styles.detailTitle}>آخر وجبة</Text>
                <Text style={styles.detailSub}>{selectedChild.lastMeal}</Text>
              </View>
            </View>

            <View style={styles.liveDetailBox}>
              <View style={styles.detailIconBox}>
                <ShieldCheck size={18} color="#059669" />
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={styles.detailTitle}>المعلمة المشرفة</Text>
                <Text style={styles.detailSub}>{selectedChild.teacher}</Text>
              </View>
            </View>
          </View>

          {/* Camera Streaming Shortcut */}
          <TouchableOpacity
            style={styles.cameraBanner}
            onPress={() => navigation?.navigate('More', { screen: 'Cameras' })}
          >
            <View style={styles.cameraBannerRight}>
              <View style={styles.camIconCircle}>
                <Video size={18} color="#059669" />
              </View>
              <View>
                <Text style={styles.camBannerTitle}>البث المباشر لكاميرات الصف</Text>
                <Text style={styles.camBannerSub}>مشاهدة قاعة روضة العصافير والساحة المفتوحة</Text>
              </View>
            </View>
            <ChevronLeft size={18} color="#059669" />
          </TouchableOpacity>
        </View>

        {/* Quick Services Grid */}
        <Text style={styles.sectionTitle}>الخدمات والمتابعة اليومية</Text>
        <View style={styles.servicesGrid}>
          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => navigation?.navigate('Children', { screen: 'Attendance' })}
          >
            <CheckCircle2 size={22} color="#059669" />
            <Text style={styles.serviceText}>سجل الحضور</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => navigation?.navigate('Children', { screen: 'Meals' })}
          >
            <Utensils size={22} color="#2563eb" />
            <Text style={styles.serviceText}>سجل الوجبات</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => navigation?.navigate('Children', { screen: 'WeeklyNotes' })}
          >
            <FileText size={22} color="#7c3aed" />
            <Text style={styles.serviceText}>التقرير الأسبوعي</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => navigation?.navigate('Children', { screen: 'Evaluations' })}
          >
            <Star size={22} color="#d97706" />
            <Text style={styles.serviceText}>تقييم المهارات</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => navigation?.navigate('Inbox', { screen: 'MessagesHome' })}
          >
            <MessageSquare size={22} color="#0891b2" />
            <Text style={styles.serviceText}>محادثة المعلمة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => navigation?.navigate('More', { screen: 'Documents' })}
          >
            <FileCheck size={22} color="#4b5563" />
            <Text style={styles.serviceText}>الوثائق الرسمية</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => navigation?.navigate('More', { screen: 'Events' })}
          >
            <Calendar size={22} color="#db2777" />
            <Text style={styles.serviceText}>الفعاليات والأنشطة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => navigation?.navigate('More', { screen: 'Requests' })}
          >
            <AlertCircle size={22} color="#ea580c" />
            <Text style={styles.serviceText}>الطلبات الخاصة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => navigation?.navigate('More', { screen: 'Complaints' })}
          >
            <HelpCircle size={22} color="#6366f1" />
            <Text style={styles.serviceText}>الشكاوى والمقترحات</Text>
          </TouchableOpacity>
        </View>

        {/* Nursery Circular / Announcement Banner */}
        <View style={styles.circularCard}>
          <View style={styles.circularHeader}>
            <View style={styles.circularBadge}>
              <Text style={styles.circularBadgeText}>إعلان إداري هام</Text>
            </View>
            <Text style={styles.circularDate}>اليوم</Text>
          </View>
          <Text style={styles.circularTitle}>يوم الصحة والتغذية السليمة القادم</Text>
          <Text style={styles.circularDesc}>
            يسر إدارة الروضة دعوتكم لمشاركة أطفالكم بإعداد وجبة إفطار صحية يوم الخميس القادم لتعزيز العادات الغذائية المفيدة.
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  childTag: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 2,
  },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },

  // Live Card
  liveCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
  },
  liveCardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  liveStatusPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  greenPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
  },
  liveStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
  },
  checkInTime: {
    fontSize: 12,
    color: '#6b7280',
  },

  liveDetailsRow: {
    flexDirection: 'row-reverse',
    gap: 12,
    paddingVertical: 14,
  },
  liveDetailBox: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  detailIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'right',
  },
  detailSub: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
    marginTop: 2,
  },

  // Camera Banner
  cameraBanner: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 14,
    padding: 12,
    marginTop: 4,
  },
  cameraBannerRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  camIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camBannerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#065f46',
    textAlign: 'right',
  },
  camBannerSub: {
    fontSize: 11,
    color: '#047857',
    textAlign: 'right',
  },

  // Services
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
    marginBottom: 12,
  },
  servicesGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  serviceCard: {
    width: '31%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  serviceText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
  },

  // Circular Card
  circularCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
  },
  circularHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  circularBadge: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  circularBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  circularDate: {
    fontSize: 11,
    color: '#9ca3af',
  },
  circularTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
    marginBottom: 4,
  },
  circularDesc: {
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'right',
    lineHeight: 18,
  },
});
