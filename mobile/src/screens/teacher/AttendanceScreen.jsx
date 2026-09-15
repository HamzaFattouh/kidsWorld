import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CalendarCheck, CheckCircle2, XCircle, Clock, ShieldCheck, Calculator } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function AttendanceScreen() {
  const [activeTab, setActiveTab] = useState('children'); // 'children' | 'teacher_report'

  const [childrenList, setChildrenList] = useState([
    { id: '1', name: 'عمر أحمد الشكعة', class: 'روضة العصافير', status: 'PRESENT' },
    { id: '2', name: 'ليان أحمد الشكعة', class: 'روضة الأمل', status: 'PRESENT' },
    { id: '3', name: 'سارة مريم المصري', class: 'روضة الزهور', status: 'LATE' },
    { id: '4', name: 'يوسف خالد جودت', class: 'روضة العصافير', status: 'ABSENT' },
  ]);

  // Friday deduction logic for Teacher report
  const currentMonthDays = 30;
  const fridaysCount = 4;
  const netWorkingDays = currentMonthDays - fridaysCount; // 26 days
  const attendedDays = 25;
  const teacherAttendanceRate = ((attendedDays / netWorkingDays) * 100).toFixed(1);

  const toggleStatus = (id, newStatus) => {
    setChildrenList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const saveAttendance = () => {
    Alert.alert('تم الحفظ بنجاح 🟢', 'تم تسجيل حضور وغياب أطفال الشعبة اليوم وتأكيده.');
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>تسجيل الحضور وتقارير الدوام 📅</Text>
          <Text style={styles.subTitle}>إدارة كشوفات الحضور اليومية وتقارير خصم الجمعة</Text>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'children' && styles.activeTabBtn]}
            onPress={() => setActiveTab('children')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'children' && styles.activeTabBtnText]}>
              كشف حضور الأطفال
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'teacher_report' && styles.activeTabBtn]}
            onPress={() => setActiveTab('teacher_report')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'teacher_report' && styles.activeTabBtnText]}>
              تقرير دوام المعلم (خصم الجمعة)
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'children' ? (
          <>
            <View style={styles.sectionHeaderRow}>
              <TouchableOpacity style={styles.saveBtn} onPress={saveAttendance}>
                <Text style={styles.saveBtnText}>حفظ الكشف الان</Text>
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>قائمة أطفال الشعبة اليوم 👶</Text>
            </View>

            {childrenList.map((child) => (
              <View key={child.id} style={styles.childCard}>
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childClass}>{child.class}</Text>
                </View>

                <View style={styles.statusButtons}>
                  <TouchableOpacity
                    style={[styles.statusBtn, child.status === 'PRESENT' && { backgroundColor: '#10b981' }]}
                    onPress={() => toggleStatus(child.id, 'PRESENT')}
                  >
                    <Text style={[styles.statusBtnText, child.status === 'PRESENT' && { color: '#ffffff' }]}>حاضر</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.statusBtn, child.status === 'LATE' && { backgroundColor: '#f59e0b' }]}
                    onPress={() => toggleStatus(child.id, 'LATE')}
                  >
                    <Text style={[styles.statusBtnText, child.status === 'LATE' && { color: '#ffffff' }]}>متأخر</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.statusBtn, child.status === 'ABSENT' && { backgroundColor: '#ef4444' }]}
                    onPress={() => toggleStatus(child.id, 'ABSENT')}
                  >
                    <Text style={[styles.statusBtnText, child.status === 'ABSENT' && { color: '#ffffff' }]}>غائب</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        ) : (
          <>
            {/* Teacher Attendance Calculation Box */}
            <View style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <Calculator size={22} color="#3b82f6" style={{ marginLeft: 8 }} />
                <Text style={styles.reportTitle}>تقرير حضور المعلمة أ. نورة النابلسي</Text>
              </View>

              <View style={styles.deductionNotice}>
                <ShieldCheck size={16} color="#15803d" style={{ marginLeft: 6 }} />
                <Text style={styles.deductionText}>تم تطبيق خصم أيام الجمعة (4 أيام) تلقائياً من المجموع</Text>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>{currentMonthDays} يوم</Text>
                  <Text style={styles.statLbl}>أيام الشهر الكلية</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statVal, { color: '#ef4444' }]}>-{fridaysCount} جمعة</Text>
                  <Text style={styles.statLbl}>الجمعة المخصومة</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statVal, { color: '#3b82f6' }]}>{netWorkingDays} يوم</Text>
                  <Text style={styles.statLbl}>أيام العمل الفعلية</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statVal, { color: '#10b981' }]}>{attendedDays} يوم</Text>
                  <Text style={styles.statLbl}>الأيام المدوّمة</Text>
                </View>
              </View>

              <View style={styles.rateBox}>
                <Text style={styles.rateTitle}>نسبة الحضور الفعلية الدقيقة</Text>
                <Text style={styles.rateValue}>{teacherAttendanceRate}%</Text>
                <Text style={styles.rateSub}>محسوبة بناءً على {attendedDays} يوم من أصل {netWorkingDays} يوم عمل صافي</Text>
              </View>
            </View>
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  subTitle: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 2 },

  tabSelector: { flexDirection: 'row-reverse', backgroundColor: '#e2e8f0', borderRadius: 12, padding: 4, marginBottom: 20 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTabBtn: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  tabBtnText: { fontSize: 12, fontWeight: 'bold', color: '#64748b' },
  activeTabBtnText: { color: '#1e293b' },

  sectionHeaderRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  saveBtn: { backgroundColor: '#10b981', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  saveBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },

  childCard: {
    flexDirection: 'row-reverse',
    justify: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  childInfo: { flex: 1 },
  childName: { fontSize: 15, fontWeight: 'bold', color: '#1f2937', textAlign: 'right' },
  childClass: { fontSize: 12, color: '#6b7280', textAlign: 'right', marginTop: 2 },

  statusButtons: { flexDirection: 'row-reverse' },
  statusBtn: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 4,
  },
  statusBtnText: { fontSize: 12, fontWeight: 'bold', color: '#4b5563' },

  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  reportHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 12 },
  reportTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },

  deductionNotice: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  deductionText: { fontSize: 12, fontWeight: 'bold', color: '#166534' },

  statsGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', marginBottom: 20 },
  statItem: { width: '50%', marginBottom: 12, alignItems: 'center' },
  statVal: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  statLbl: { fontSize: 11, color: '#6b7280', marginTop: 2 },

  rateBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  rateTitle: { fontSize: 13, fontWeight: 'bold', color: '#1e40af', marginBottom: 4 },
  rateValue: { fontSize: 32, fontWeight: 'bold', color: '#2563eb' },
  rateSub: { fontSize: 11, color: '#3b82f6', marginTop: 4, textAlign: 'center' },
});