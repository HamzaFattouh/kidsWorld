import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Users,
  CalendarCheck,
  Utensils,
  FileText,
  Award,
  AlertTriangle,
  Camera,
  MessageSquare,
  FileCheck,
  ChevronLeft,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useAuthStore } from '../../store/authStore';
import { useParentStore } from '../../store/parentStore';

export function DashboardScreen({ navigation }) {
  const { role, user } = useAuthStore();
  const selectedChildId = useParentStore((s) => s.selectedChildId);

  const dashboardItems = [
    { id: 'Children', label: 'الأطفال والمستندات', icon: Users, color: '#3b82f6', bg: '#eff6ff', screen: 'Children' },
    { id: 'Attendance', label: 'سجل الحضور والغياب', icon: CalendarCheck, color: '#10b981', bg: '#ecfdf5', screen: 'Attendance' },
    { id: 'Meals', label: 'الوجبات اليومية', icon: Utensils, color: '#f59e0b', bg: '#fefce8', screen: 'Meals' },
    { id: 'WeeklyNotes', label: 'الملاحظات الأسبوعية', icon: FileText, color: '#8b5cf6', bg: '#f5f3ff', screen: 'WeeklyNotes' },
    { id: 'Evaluations', label: 'التقييمات والتطور', icon: Award, color: '#ec4899', bg: '#fdf2f8', screen: 'Evaluations' },
    { id: 'Incidents', label: 'سجل الحوادث والسلامة', icon: AlertTriangle, color: '#ef4444', bg: '#fef2f2', screen: 'Incidents' },
    { id: 'Cameras', label: 'البث المباشر (الكاميرات)', icon: Camera, color: '#06b6d4', bg: '#cffaff', screen: 'Cameras' },
    { id: 'Complaints', label: 'الشكاوى والمقترحات', icon: MessageSquare, color: '#f97316', bg: '#fff7ed', screen: 'Complaints' },
    { id: 'Requests', label: 'الطلبات والاستئذان', icon: FileCheck, color: '#6366f1', bg: '#e0e7ff', screen: 'Requests' },
  ];

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        
        {/* Welcome Header */}
        <View style={styles.headerBox}>
          <Text style={styles.headerTag}>لوحة المتابعة الشاملة</Text>
          <Text style={styles.headerTitle}>أهلاً بك، {user?.firstName || (role === 'TEACHER' ? 'المعلم' : 'ولي الأمر')} 👋</Text>
          <Text style={styles.headerSub}>
            تابع حالة أطفالك والخدمات اليومية بكل يسر وسهولة من مكان واحد.
          </Text>

          {selectedChildId && (
            <View style={styles.childBadge}>
              <Text style={styles.childBadgeText}>الطفل المختار: #{selectedChildId}</Text>
            </View>
          )}
        </View>

        {/* Quick Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>حاضر 🟢</Text>
            <Text style={styles.statLbl}>حالة اليوم</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>ممتاز ⭐</Text>
            <Text style={styles.statLbl}>التقييم الأخير</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>3 وجبات 🍏</Text>
            <Text style={styles.statLbl}>تغذية اليوم</Text>
          </View>
        </View>

        {/* Dashboard Grid */}
        <Text style={styles.sectionTitle}>أقسام اللوحة والخدمات ⚡</Text>

        <View style={styles.grid}>
          {dashboardItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.gridItem, { backgroundColor: item.bg }]}
                activeOpacity={0.7}
                onPress={() => navigation.navigate(item.screen)}
              >
                <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
                  <IconComponent size={22} color="#ffffff" />
                </View>
                <Text style={styles.gridLabel}>{item.label}</Text>
                <ChevronLeft size={16} color="#9ca3af" style={styles.arrow} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  headerBox: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  headerTag: { color: '#38bdf8', fontSize: 12, fontWeight: 'bold', textAlign: 'right', marginBottom: 4 },
  headerTitle: { color: '#ffffff', fontSize: 22, fontWeight: 'bold', textAlign: 'right', marginBottom: 6 },
  headerSub: { color: '#94a3b8', fontSize: 13, textAlign: 'right', lineHeight: 18 },
  childBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 12,
  },
  childBadgeText: { color: '#38bdf8', fontSize: 12, fontWeight: 'bold' },

  statsGrid: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statVal: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 2 },
  statLbl: { fontSize: 11, color: '#64748b' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', textAlign: 'right', marginBottom: 16 },

  grid: { flexDirection: 'column' },
  gridItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  gridLabel: { flex: 1, fontSize: 15, fontWeight: 'bold', color: '#1e293b', textAlign: 'right' },
  arrow: { marginRight: 4 },
});
