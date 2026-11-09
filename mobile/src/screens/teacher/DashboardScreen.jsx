import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Users,
  CheckCircle2,
  Utensils,
  FileText,
  Star,
  Calendar,
  Clock,
  Bell,
  ChevronLeft,
  Activity,
  CheckSquare,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function DashboardScreen({ navigation }) {
  const [students, setStudents] = useState([
    { id: '1', name: 'عمر أحمد الشكعة', present: true, mealsDone: true },
    { id: '2', name: 'يوسف خالد جودت', present: true, mealsDone: false },
    { id: '3', name: 'خليل سمير النابلسي', present: true, mealsDone: true },
    { id: '4', name: 'سارة مريم المصري', present: false, mealsDone: false },
    { id: '5', name: 'ليان أحمد الشكعة', present: true, mealsDone: true },
  ]);

  const presentCount = students.filter((s) => s.present).length;
  const attendanceRate = Math.round((presentCount / students.length) * 100);

  const toggleAttendance = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, present: !s.present } : s))
    );
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeTitle}>مرحباً بك، أ. نور</Text>
            <Text style={styles.classroomSubtitle}>الصف: روضة العصافير (3 - 4 سنوات)</Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation?.navigate('Inbox', { screen: 'Notifications' })}
          >
            <Bell size={20} color="#374151" />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>

        {/* KPI Stats Grid */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#ecfdf5' }]}>
              <Users size={20} color="#059669" />
            </View>
            <Text style={styles.kpiValue}>{students.length}</Text>
            <Text style={styles.kpiLabel}>إجمالي الطلاب</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#eff6ff' }]}>
              <CheckCircle2 size={20} color="#2563eb" />
            </View>
            <Text style={styles.kpiValue}>{presentCount} ({attendanceRate}%)</Text>
            <Text style={styles.kpiLabel}>حضور اليوم</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#fffbeb' }]}>
              <Utensils size={20} color="#d97706" />
            </View>
            <Text style={styles.kpiValue}>3 / 3</Text>
            <Text style={styles.kpiLabel}>تسجيل الوجبات</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#fdf2f8' }]}>
              <Star size={20} color="#db2777" />
            </View>
            <Text style={styles.kpiValue}>85%</Text>
            <Text style={styles.kpiLabel}>إنجاز التقييم</Text>
          </View>
        </View>

        {/* Quick Actions Shortcuts */}
        <Text style={styles.sectionTitle}>الإجراءات السريعة</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation?.navigate('Classroom', { screen: 'Attendance' })}
          >
            <CheckCircle2 size={22} color="#059669" />
            <Text style={styles.actionBtnText}>كشف الحضور</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation?.navigate('Classroom', { screen: 'Meals' })}
          >
            <Utensils size={22} color="#2563eb" />
            <Text style={styles.actionBtnText}>سجل الوجبات</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation?.navigate('Classroom', { screen: 'WeeklyNotes' })}
          >
            <FileText size={22} color="#7c3aed" />
            <Text style={styles.actionBtnText}>التقرير الأسبوعي</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation?.navigate('Classroom', { screen: 'Evaluations' })}
          >
            <Star size={22} color="#d97706" />
            <Text style={styles.actionBtnText}>التقييمات</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation?.navigate('Classroom', { screen: 'Activities' })}
          >
            <Activity size={22} color="#0891b2" />
            <Text style={styles.actionBtnText}>جدول الأنشطة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation?.navigate('Classroom', { screen: 'Tasks' })}
          >
            <CheckSquare size={22} color="#4b5563" />
            <Text style={styles.actionBtnText}>المهام اليومية</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Attendance Check */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>حضور طلاب الصف لليوم</Text>
          <TouchableOpacity
            onPress={() => navigation?.navigate('Classroom', { screen: 'Attendance' })}
            style={styles.seeAllBtn}
          >
            <Text style={styles.seeAllText}>عرض التقويم</Text>
            <ChevronLeft size={16} color="#059669" />
          </TouchableOpacity>
        </View>

        <View style={styles.rosterCard}>
          {students.map((std) => (
            <View key={std.id} style={styles.studentRow}>
              <View style={styles.stdNameBox}>
                <View style={[styles.avatarCircle, { backgroundColor: std.present ? '#ecfdf5' : '#fef2f2' }]}>
                  <Text style={[styles.avatarText, { color: std.present ? '#059669' : '#dc2626' }]}>
                    {std.name.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.stdName}>{std.name}</Text>
                  <Text style={styles.stdStatusSub}>
                    {std.present ? 'حاضر اليوم' : 'غائب'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                testID={`quick-attendance-toggle-${std.id}`}
                style={[
                  styles.toggleBadge,
                  std.present ? styles.presentBadge : styles.absentBadge,
                ]}
                onPress={() => toggleAttendance(std.id)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    std.present ? styles.presentText : styles.absentText,
                  ]}
                >
                  {std.present ? 'حاضر' : 'غائب'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
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
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  classroomSubtitle: {
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
  notifBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },

  // KPI Grid
  kpiGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 14,
    alignItems: 'flex-end',
  },
  kpiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  kpiLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },

  // Actions
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  seeAllBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: 'bold',
  },
  actionGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  actionBtn: {
    width: '31%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
  },

  // Roster
  rosterCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 12,
  },
  studentRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  stdNameBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  stdName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  stdStatusSub: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'right',
  },
  toggleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  presentBadge: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  absentBadge: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  presentText: {
    color: '#059669',
  },
  absentText: {
    color: '#dc2626',
  },
});
