import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Users, FileText, CheckCircle, Heart, Shield, Calendar, Award } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useParentStore } from '../../store/parentStore';

export function ChildrenScreen() {
  const { selectedChildId, setSelectedChildId } = useParentStore();

  const childrenList = [
    {
      id: 'CHILD-101',
      name: 'عبدالله محمد علي',
      age: '3 سنوات',
      class: 'قاعة الرواد (أ)',
      birthDate: '2023-04-12',
      bloodType: 'O+',
      allergies: 'لا يوجد',
      documents: [
        { name: 'شهادة الميلاد الرسمية', status: 'موثق ✅' },
        { name: 'الكشف الطبي والتحصينات', status: 'مكتمل ✅' },
        { name: 'نموذج تفويض الاستلام', status: 'معتمد ✅' },
      ],
    },
    {
      id: 'CHILD-102',
      name: 'سارة محمد علي',
      age: 'سنة ونصف',
      class: 'قاعة الصغار (ب)',
      birthDate: '2025-01-20',
      bloodType: 'A+',
      allergies: 'حساسية بسيطة من الفول السوداني',
      documents: [
        { name: 'شهادة الميلاد الرسمية', status: 'موثق ✅' },
        { name: 'التقرير الطبي الأول', status: 'مكتمل ✅' },
      ],
    },
  ];

  const currentChildId = selectedChildId || childrenList[0].id;
  const activeChild = childrenList.find((c) => c.id === currentChildId) || childrenList[0];

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>الأطفال والمستندات 👶</Text>
          <Text style={styles.subTitle}>إدارة وتحديد الطفل المتابع وعرض الملف الطبي والمستندات</Text>
        </View>

        {/* Child Selector Tabs */}
        <Text style={styles.sectionHeader}>اختر الطفل المتابع 👨‍👩‍👧</Text>

        <View style={styles.childrenSelectorRow}>
          {childrenList.map((ch) => {
            const isSelected = ch.id === currentChildId;
            return (
              <TouchableOpacity
                key={ch.id}
                style={[styles.childChip, isSelected && styles.activeChildChip]}
                onPress={() => setSelectedChildId(ch.id)}
                activeOpacity={0.7}
              >
                <Users size={16} color={isSelected ? '#ffffff' : '#3b82f6'} style={{ marginLeft: 6 }} />
                <Text style={[styles.childChipText, isSelected && styles.activeChildChipText]}>{ch.name}</Text>
              </TouchableOpacity>
            );
          })}
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
              <Text style={styles.detailLabel}>الحساسية والطوارئ</Text>
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

  childrenSelectorRow: { flexDirection: 'row-reverse', marginBottom: 20 },
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