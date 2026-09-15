import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { FileText, CheckCircle2, AlertCircle, Edit, UserCheck, Save } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function WeeklyNotesScreen() {
  const [selectedClass, setSelectedClass] = useState('class-birds-3-4');

  const classesList = [
    { id: 'class-birds-3-4', name: 'روضة العصافير' },
    { id: 'class-flowers-4-5', name: 'روضة الزهور' },
    { id: 'class-hope-2-3', name: 'روضة الأمل' },
  ];

  const [studentsReports, setStudentsReports] = useState({
    'class-birds-3-4': [
      {
        id: '1',
        name: 'عمر أحمد الشكعة',
        written: true,
        date: '2026-09-14',
        content: 'أداء ممتاز وهادئ، تفاعل عالي في حصص الرسم والقراءة.',
      },
      {
        id: '2',
        name: 'يوسف خالد جودت',
        written: false,
        date: null,
        content: '',
      },
    ],
    'class-flowers-4-5': [
      {
        id: '3',
        name: 'سارة مريم المصري',
        written: true,
        date: '2026-09-14',
        content: 'مشاركة ممتازة ولطيفة جداً مع زملائها.',
      },
    ],
    'class-hope-2-3': [
      {
        id: '4',
        name: 'ليان أحمد الشكعة',
        written: false,
        date: null,
        content: '',
      },
    ],
  });

  const [activeModalStudent, setActiveModalStudent] = useState(null);
  const [reportText, setReportText] = useState('');

  const openReportModal = (std) => {
    setActiveModalStudent(std);
    setReportText(std.content || 'طفل ممتاز وتأقلم رائع في القاعة مع زملائه ورغبة عالية في التعلم.');
  };

  const handleSaveReport = () => {
    if (!activeModalStudent) return;

    setStudentsReports((prev) => {
      const list = prev[selectedClass] || [];
      const updated = list.map((s) =>
        s.id === activeModalStudent.id
          ? { ...s, written: true, date: new Date().toISOString().split('T')[0], content: reportText }
          : s
      );
      return { ...prev, [selectedClass]: updated };
    });

    setActiveModalStudent(null);
    Alert.alert('تم الحفظ 🎉', `تم حفظ وتحديث التقرير الأسبوعي للطالب (${activeModalStudent.name}) بنجاح.`);
  };

  const currentList = studentsReports[selectedClass] || [];

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>الملاحظات الأسبوعية 📝</Text>
          <Text style={styles.subTitle}>كتابة ومراجعة التقارير الأسبوعية للطلاب</Text>
        </View>

        {/* Class Selector Bar */}
        <Text style={styles.sectionHeader}>اختر الصف لمتابعة الطلاب 🏫</Text>
        <View style={styles.classChipsRow}>
          {classesList.map((cls) => {
            const isSelected = cls.id === selectedClass;
            return (
              <TouchableOpacity
                key={cls.id}
                style={[styles.classChip, isSelected && styles.activeClassChip]}
                onPress={() => setSelectedClass(cls.id)}
              >
                <Text style={[styles.classChipText, isSelected && styles.activeClassChipText]}>
                  {cls.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Students Completion List */}
        <Text style={styles.sectionHeader}>كشف اكتمال التقارير 📋</Text>
        {currentList.map((std) => (
          <TouchableOpacity
            key={std.id}
            style={styles.stdCard}
            onPress={() => openReportModal(std)}
            activeOpacity={0.7}
          >
            <View style={styles.stdInfo}>
              <Text style={styles.stdName}>{std.name}</Text>
              <Text style={styles.stdSub}>
                {std.written ? `تاريخ الإرسال: ${std.date}` : 'لم يتم كتابة التقرير بعد'}
              </Text>
            </View>

            {std.written ? (
              <View style={[styles.badge, { backgroundColor: '#ecfdf5' }]}>
                <CheckCircle2 size={14} color="#10b981" style={{ marginLeft: 4 }} />
                <Text style={[styles.badgeText, { color: '#15803d' }]}>كُتب التقرير ✅</Text>
              </View>
            ) : (
              <View style={[styles.badge, { backgroundColor: '#fefce8' }]}>
                <AlertCircle size={14} color="#eab308" style={{ marginLeft: 4 }} />
                <Text style={[styles.badgeText, { color: '#a16207' }]}>لم يُكتب بعد ⚠️</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Report Editor Modal */}
        {activeModalStudent && (
          <Modal visible animationType="slide" transparent>
            <View style={styles.modalBg}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>التقرير الأسبوعي: {activeModalStudent.name}</Text>

                <Text style={styles.label}>اكتب الملاحظات والتوصيات الأسبوعية:</Text>
                <TextInput
                  style={styles.textInput}
                  multiline
                  numberOfLines={4}
                  value={reportText}
                  onChangeText={setReportText}
                  placeholder="أدخل ملاحظات السلوك والمشاركة..."
                />

                <View style={styles.modalBtnRow}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setActiveModalStudent(null)}>
                    <Text style={styles.cancelBtnText}>إلغاء</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.saveBtn} onPress={handleSaveReport}>
                    <Text style={styles.saveBtnText}>حفظ وتأكيد التقرير</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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

  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#1f2937', textAlign: 'right', marginBottom: 10 },

  classChipsRow: { flexDirection: 'row-reverse', marginBottom: 20 },
  classChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  activeClassChip: { backgroundColor: '#8b5cf6' },
  classChipText: { fontSize: 13, fontWeight: 'bold', color: '#4b5563' },
  activeClassChipText: { color: '#ffffff' },

  stdCard: {
    flexDirection: 'row-reverse',
    justify: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  stdInfo: { flex: 1 },
  stdName: { fontSize: 15, fontWeight: 'bold', color: '#1f2937', textAlign: 'right' },
  stdSub: { fontSize: 12, color: '#6b7280', textAlign: 'right', marginTop: 2 },

  badge: { flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 12 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#374151', textAlign: 'right', marginBottom: 6 },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    textAlign: 'right',
    textAlignVertical: 'top',
    marginBottom: 16,
    fontSize: 13,
  },
  modalBtnRow: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#f3f4f6' },
  cancelBtnText: { color: '#4b5563', fontWeight: 'bold' },
  saveBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#8b5cf6' },
  saveBtnText: { color: '#ffffff', fontWeight: 'bold' },
});