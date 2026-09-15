import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Users, FileText, Calendar, RefreshCw, AlertTriangle, ShieldCheck, Heart } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useParentStore } from '../../store/parentStore';

export function ChildrenScreen() {
  const { selectedChildId, setSelectedChildId } = useParentStore();

  const [childrenList, setChildrenList] = useState([
    {
      id: 'child-omar-shakaa',
      name: 'عمر أحمد الشكعة',
      age: '4 سنوات',
      class: 'روضة العصافير (أ)',
      birthDate: '2022-04-15',
      bloodType: 'O+',
      allergies: 'حساسية خفيفة من السمسم',
      enrollmentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      parentName: 'أحمد الشكعة (0599888777)',
      teacherName: 'أ. نورة النابلسي',
      documents: [
        { name: 'شهادة الميلاد الرسمية', status: 'موثق ✅' },
        { name: 'الكشف الطبي والتحصينات', status: 'مكتمل ✅' },
        { name: 'نموذج تفويض الاستلام', status: 'معتمد ✅' },
      ],
    },
    {
      id: 'child-sara-masri',
      name: 'سارة مريم المصري',
      age: '5 سنوات',
      class: 'روضة الزهور (ب)',
      birthDate: '2021-11-20',
      bloodType: 'A+',
      allergies: 'تضع نظارات طبية للأنشطة',
      enrollmentDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days ago (Expired!)
      parentName: 'مريم المصري (0599555666)',
      teacherName: 'أ. سارة الخالد',
      documents: [
        { name: 'شهادة الميلاد الرسمية', status: 'موثق ✅' },
        { name: 'التقرير الطبي الأول', status: 'مكتمل ✅' },
      ],
    },
  ]);

  const currentChildId = selectedChildId || childrenList[0].id;
  const activeChild = childrenList.find((c) => c.id === currentChildId) || childrenList[0];

  // Expiration logic calculation (30 days threshold)
  const getEnrollmentStatus = (enrollDateStr) => {
    if (!enrollDateStr) return { expired: false, days: 0, text: 'غير محدد' };
    const days = Math.floor((new Date() - new Date(enrollDateStr)) / (1000 * 60 * 60 * 24));
    if (days >= 30) {
      return {
        expired: true,
        days,
        text: 'انتهى تسجيله (يتطلب تجديد) ⚠️',
        color: '#ef4444',
        bg: '#fef2f2',
      };
    }
    const remaining = 30 - days;
    return {
      expired: false,
      days,
      text: `نشط (باقي ${remaining} يوماً على التجديد) 🟢`,
      color: '#10b981',
      bg: '#ecfdf5',
    };
  };

  const handleRenewRegistration = (childId) => {
    setChildrenList((prev) =>
      prev.map((c) =>
        c.id === childId ? { ...c, enrollmentDate: new Date().toISOString() } : c
      )
    );
    Alert.alert('تم تجديد الاشتراك 🎉', 'تم تمديد تسجيل الطفل لمدة 30 يوماً بنجاح!');
  };

  const currentStatus = getEnrollmentStatus(activeChild.enrollmentDate);

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>الأطفال وتجديد التسجيل 👶</Text>
          <Text style={styles.subTitle}>متابعة حالة التسجيل والملف الطبي والمستندات الرسمية</Text>
        </View>

        {/* Child Selector Tabs */}
        <Text style={styles.sectionHeader}>اختر الطفل المتابع 👨‍👩‍👧</Text>

        <View style={styles.childrenSelectorRow}>
          {childrenList.map((ch) => {
            const isSelected = ch.id === currentChildId;
            const st = getEnrollmentStatus(ch.enrollmentDate);
            return (
              <TouchableOpacity
                key={ch.id}
                style={[styles.childChip, isSelected && styles.activeChildChip]}
                onPress={() => setSelectedChildId(ch.id)}
                activeOpacity={0.7}
              >
                <Users size={16} color={isSelected ? '#ffffff' : '#3b82f6'} style={{ marginLeft: 6 }} />
                <Text style={[styles.childChipText, isSelected && styles.activeChildChipText]}>
                  {ch.name} {st.expired ? '⚠️' : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Expiration Banner */}
        <View style={[styles.expirationBanner, { backgroundColor: currentStatus.bg, borderColor: currentStatus.color }]}>
          <View style={styles.expirationContent}>
            {currentStatus.expired ? (
              <AlertTriangle size={22} color={currentStatus.color} style={{ marginLeft: 10 }} />
            ) : (
              <ShieldCheck size={22} color={currentStatus.color} style={{ marginLeft: 10 }} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={[styles.expirationTitle, { color: currentStatus.color }]}>حالة الاشتراك الشهري</Text>
              <Text style={styles.expirationSub}>{currentStatus.text}</Text>
            </View>
          </View>

          {currentStatus.expired && (
            <TouchableOpacity
              style={styles.renewBtn}
              activeOpacity={0.8}
              onPress={() => handleRenewRegistration(activeChild.id)}
            >
              <RefreshCw size={16} color="#ffffff" style={{ marginLeft: 6 }} />
              <Text style={styles.renewBtnText}>تجديد الاشتراك الان</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Selected Child Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.classBadge}>
              <Text style={styles.classBadgeText}>{activeChild.class}</Text>
            </View>
            <Text style={styles.childName}>{activeChild.name}</Text>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>العمر الحالي</Text>
              <Text style={styles.detailVal}>{activeChild.age}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>تاريخ الميلاد</Text>
              <Text style={styles.detailVal}>{activeChild.birthDate}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>فصيلة الدم</Text>
              <Text style={styles.detailVal}>{activeChild.bloodType}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>المعلم المسؤول</Text>
              <Text style={styles.detailVal}>{activeChild.teacherName}</Text>
            </View>
            <View style={[styles.detailItem, { width: '100%' }]}>
              <Text style={styles.detailLabel}>الحساسية والملاحظات الطبية</Text>
              <Text style={[styles.detailVal, { color: '#ef4444' }]}>{activeChild.allergies}</Text>
            </View>
          </View>
        </View>

        {/* Documents & Files */}
        <Text style={styles.sectionHeader}>المستندات المرفقة 📄</Text>

        <View style={styles.docsList}>
          {activeChild.documents.map((doc, idx) => (
            <View key={idx} style={styles.docRow}>
              <Text style={styles.docStatus}>{doc.status}</Text>
              <View style={styles.docRight}>
                <FileText size={18} color="#3b82f6" style={{ marginLeft: 10 }} />
                <Text style={styles.docName}>{doc.name}</Text>
              </View>
            </View>
          ))}
        </View>

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

  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 12 },

  childrenSelectorRow: { flexDirection: 'row-reverse', marginBottom: 16 },
  childChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  activeChildChip: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  childChipText: { fontSize: 13, fontWeight: 'bold', color: '#1e40af' },
  activeChildChipText: { color: '#ffffff' },

  expirationBanner: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
  },
  expirationContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  expirationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  expirationSub: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'right',
    marginTop: 2,
    fontWeight: '600',
  },
  renewBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justify: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  renewBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  childName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  classBadge: { backgroundColor: '#f0fdf4', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  classBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#166534' },

  detailsGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 14 },
  detailItem: { width: '50%', marginBottom: 12, paddingLeft: 8 },
  detailLabel: { fontSize: 12, color: '#6b7280', textAlign: 'right', marginBottom: 2 },
  detailVal: { fontSize: 14, fontWeight: 'bold', color: '#1f2937', textAlign: 'right' },

  docsList: { backgroundColor: '#ffffff', borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 16 },
  docRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  docRight: { flexDirection: 'row-reverse', alignItems: 'center' },
  docName: { fontSize: 14, fontWeight: '600', color: '#374151' },
  docStatus: { fontSize: 12, fontWeight: 'bold', color: '#10b981' },
});