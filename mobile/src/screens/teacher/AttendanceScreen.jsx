import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CalendarCheck, CheckCircle2, ShieldCheck, Calculator, ArrowRight } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function AttendanceScreen() {
  const [activeTab, setActiveTab] = useState('calendar_grid'); // 'calendar_grid' | 'teacher_report'
  const [selectedDay, setSelectedDay] = useState(15);
  const TODAY_DAY = 15;

  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  // Student attendance per day (for assigned class ONLY: 'روضة العصافير')
  // Future dates (day > TODAY_DAY) are NOT pre-filled!
  const [studentAttendanceByDay, setStudentAttendanceByDay] = useState(() => {
    const initial = {};
    for (let day = 1; day <= 30; day++) {
      const isFuture = day > TODAY_DAY;
      initial[day] = [
        { id: '1', name: 'عمر أحمد الشكعة', parent: 'أحمد الشكعة', present: isFuture ? false : day % 2 === 0 },
        { id: '2', name: 'يوسف خالد جودت', parent: 'خالد جودت', present: isFuture ? false : day % 3 === 0 },
        { id: '3', name: 'خليل سمير النابلسي', parent: 'سمير النابلسي', present: isFuture ? false : true },
      ];
    }
    return initial;
  });

  // Friday deduction stats calculation for Teacher Report
  const currentMonthDays = 30;
  const fridaysCount = 4;
  const netWorkingDays = currentMonthDays - fridaysCount; // 26 days
  const attendedDays = 25;
  const teacherAttendanceRate = ((attendedDays / netWorkingDays) * 100).toFixed(1);

  const toggleStudentCheck = (childId) => {
    setStudentAttendanceByDay((prev) => {
      const dayList = prev[selectedDay] || [];
      const updated = dayList.map((c) => (c.id === childId ? { ...c, present: !c.present } : c));
      return { ...prev, [selectedDay]: updated };
    });
  };

  const handleSaveAttendance = () => {
    Alert.alert('تم حفظ الكشف 🎉', `تم تأكيد وتسجيل كشف الحضور ليوم ${selectedDay} سبتمبر بنجاح.`);
  };

  const currentStudentsList = studentAttendanceByDay[selectedDay] || [];

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>تقويم الحضور وخصم الجمعة 📅</Text>
          <Text style={styles.subTitle}>حصر حضور صف (روضة العصافير) وتقارير أيام الدوام</Text>
        </View>

        {/* Main Tab Switcher */}
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'calendar_grid' && styles.activeTabBtn]}
            onPress={() => setActiveTab('calendar_grid')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'calendar_grid' && styles.activeTabBtnText]}>
              تقويم حضور الصف 👶
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'teacher_report' && styles.activeTabBtn]}
            onPress={() => setActiveTab('teacher_report')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'teacher_report' && styles.activeTabBtnText]}>
              تقرير الدوام (خصم الجمعة) 📊
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'calendar_grid' ? (
          <>
            {/* Calendar Date Squares Grid */}
            <Text style={styles.sectionTitle}>اختر مربع التاريخ لليوم المطلوب 📆</Text>
            <View style={styles.gridContainer}>
              {calendarDays.map((d) => {
                const isSelected = selectedDay === d;
                const isFuture = d > TODAY_DAY;
                return (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.daySquare,
                      isSelected && styles.activeDaySquare,
                      isFuture && styles.futureDaySquare,
                    ]}
                    onPress={() => setSelectedDay(d)}
                  >
                    <Text style={[styles.dayNum, isSelected && styles.activeDayNum]}>{d}</Text>
                    <Text style={[styles.daySub, isSelected && styles.activeDaySub]}>
                      {isFuture ? 'قادم' : 'حضور'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Checklist for Selected Day */}
            <View style={styles.checklistCard}>
              <View style={styles.checklistHeader}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveAttendance}>
                  <Text style={styles.saveBtnText}>حفظ الكشف</Text>
                </TouchableOpacity>

                <View>
                  <Text style={styles.checklistTitle}>
                    كشف يوم {selectedDay} سبتمبر {selectedDay > TODAY_DAY ? '(غير معبأ تلقائياً)' : ''}
                  </Text>
                  <Text style={styles.checklistSub}>صف المعلمة: روضة العصافير (أ. نورة النابلسي)</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {currentStudentsList.map((std) => (
                <TouchableOpacity
                  key={std.id}
                  style={styles.stdRow}
                  onPress={() => toggleStudentCheck(std.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.stdLeft}>
                    {std.present ? (
                      <View style={[styles.badge, { backgroundColor: '#ecfdf5' }]}>
                        <CheckCircle2 size={14} color="#10b981" style={{ marginLeft: 4 }} />
                        <Text style={[styles.badgeText, { color: '#15803d' }]}>حاضر 🟢</Text>
                      </View>
                    ) : (
                      <View style={[styles.badge, { backgroundColor: '#fef2f2' }]}>
                        <Text style={[styles.badgeText, { color: '#dc2626' }]}>غائب / لم يسجل 🔴</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.stdRight}>
                    <Text style={styles.stdName}>{std.name}</Text>
                    <Text style={styles.stdParent}>ولي الأمر: {std.parent}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          /* Teacher Attendance Rate Report with Friday Exclusion */
          <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Calculator size={22} color="#3b82f6" style={{ marginLeft: 8 }} />
              <Text style={styles.reportTitle}>تقرير دوام المعلمة أ. نورة النابلسي</Text>
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
  activeTabBtn: { backgroundColor: '#ffffff' },
  tabBtnText: { fontSize: 12, fontWeight: 'bold', color: '#64748b' },
  activeTabBtnText: { color: '#111827' },

  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1f2937', textAlign: 'right', marginBottom: 10 },

  gridContainer: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6, marginBottom: 20 },
  daySquare: {
    width: '18%',
    height: 54,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDaySquare: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  futureDaySquare: { backgroundColor: '#f9fafb' },
  dayNum: { fontSize: 14, fontWeight: 'bold', color: '#1f2937' },
  activeDayNum: { color: '#ffffff' },
  daySub: { fontSize: 9, color: '#6b7280', marginTop: 2 },
  activeDaySub: { color: '#dbeafe' },

  checklistCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  checklistHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  checklistTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  checklistSub: { fontSize: 12, color: '#6b7280', textAlign: 'right', marginTop: 2 },
  saveBtn: { backgroundColor: '#3b82f6', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  saveBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },

  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 12 },

  stdRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  stdRight: { flex: 1 },
  stdName: { fontSize: 14, fontWeight: 'bold', color: '#1f2937', textAlign: 'right' },
  stdParent: { fontSize: 12, color: '#6b7280', textAlign: 'right', marginTop: 2 },

  stdLeft: { marginLeft: 8 },
  badge: { flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },

  reportCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  reportHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 12 },
  reportTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  deductionNotice: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 10, borderRadius: 12, marginBottom: 16 },
  deductionText: { fontSize: 12, fontWeight: 'bold', color: '#166534' },

  statsGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', marginBottom: 20 },
  statItem: { width: '50%', marginBottom: 12, alignItems: 'center' },
  statVal: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  statLbl: { fontSize: 11, color: '#6b7280', marginTop: 2 },

  rateBox: { backgroundColor: '#eff6ff', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#bfdbfe' },
  rateTitle: { fontSize: 13, fontWeight: 'bold', color: '#1e40af', marginBottom: 4 },
  rateValue: { fontSize: 32, fontWeight: 'bold', color: '#2563eb' },
  rateSub: { fontSize: 11, color: '#3b82f6', marginTop: 4, textAlign: 'center' },
});