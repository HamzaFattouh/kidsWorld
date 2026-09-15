import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { ShieldCheck, UserPlus, UserMinus, Eye, Users, ChevronRight, XCircle } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function ClassesScreen() {
  const [classesList, setClassesList] = useState([
    {
      id: 'class-birds-3-4',
      name: 'روضة العصافير 🐥',
      ageGroup: '3 - 4 سنوات',
      capacity: 20,
      teacher: 'أ. نورة النابلسي',
      students: [
        { id: 'child-1', name: 'عمر أحمد الشكعة', parent: 'أحمد الشكعة' },
        { id: 'child-2', name: 'يوسف خالد جودت', parent: 'خالد جودت' },
      ],
    },
    {
      id: 'class-flowers-4-5',
      name: 'روضة الزهور 🌸',
      ageGroup: '4 - 5 سنوات',
      capacity: 22,
      teacher: 'أ. سارة الخالد',
      students: [
        { id: 'child-3', name: 'سارة مريم المصري', parent: 'مريم المصري' },
      ],
    },
    {
      id: 'class-hope-2-3',
      name: 'روضة الأمل 🌟',
      ageGroup: '2 - 3 سنوات',
      capacity: 15,
      teacher: 'أ. منى التميمي',
      students: [
        { id: 'child-4', name: 'ليان أحمد الشكعة', parent: 'أحمد الشكعة' },
      ],
    },
  ]);

  const [availableStudents] = useState([
    { id: 'child-5', name: 'خليل سمير النابلسي', parent: 'سمير النابلسي' },
    { id: 'child-6', name: 'سلمى إبراهيم حامد', parent: 'إبراهيم حامد' },
    { id: 'child-7', name: 'حمزة محمود القاسم', parent: 'محمود القاسم' },
  ]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isRemoveStudentModalOpen, setIsRemoveStudentModalOpen] = useState(false);

  const openStudentsModal = (cls) => {
    setSelectedClass(cls);
    setIsStudentsModalOpen(true);
  };

  const openAddStudentModal = (cls) => {
    setSelectedClass(cls);
    setIsAddStudentModalOpen(true);
  };

  const openRemoveStudentModal = (cls) => {
    setSelectedClass(cls);
    setIsRemoveStudentModalOpen(true);
  };

  const handleAddStudentToClass = (stdObj) => {
    if (!selectedClass || !stdObj) return;

    setClassesList((prev) =>
      prev.map((c) => {
        if (c.id === selectedClass.id) {
          if (c.students.some((s) => s.id === stdObj.id)) return c;
          return { ...c, students: [...c.students, stdObj] };
        }
        return c;
      })
    );

    setIsAddStudentModalOpen(false);
    Alert.alert('تمت الإضافة 🎉', `تمت إضافة الطالب (${stdObj.name}) إلى صف (${selectedClass.name}) بنجاح!`);
  };

  const handleRemoveStudentFromClass = (stdObj) => {
    if (!selectedClass || !stdObj) return;

    setClassesList((prev) =>
      prev.map((c) => {
        if (c.id === selectedClass.id) {
          return { ...c, students: c.students.filter((s) => s.id !== stdObj.id) };
        }
        return c;
      })
    );

    setIsRemoveStudentModalOpen(false);
    Alert.alert('تم الحذف 🗑️', `تم حذف الطالب (${stdObj.name}) من صف (${selectedClass.name}).`);
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>إدارة الصفوف والشعب 🏫</Text>
          <Text style={styles.subTitle}>عرض الصفوف، المعلمين المسؤولين، وإدارة تسجيل الطلاب</Text>
        </View>

        {classesList.map((cls) => (
          <View key={cls.id} style={styles.classCard}>
            <TouchableOpacity style={styles.classTopRow} onPress={() => openStudentsModal(cls)}>
              <View style={styles.classTitleCol}>
                <Text style={styles.className}>{cls.name}</Text>
                <Text style={styles.classSub}>الفئة: {cls.ageGroup}</Text>
              </View>

              <View style={styles.countBadge}>
                <Text style={styles.countText}>
                  {cls.students.length} / {cls.capacity} طالب
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.teacherBox}>
              <ShieldCheck size={16} color="#166534" style={{ marginLeft: 6 }} />
              <Text style={styles.teacherText}>المعلمة المسؤولة عن الصف: {cls.teacher}</Text>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => openAddStudentModal(cls)}
              >
                <UserPlus size={14} color="#ffffff" style={{ marginLeft: 4 }} />
                <Text style={styles.addBtnText}>إضافة طلاب</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => openRemoveStudentModal(cls)}
              >
                <UserMinus size={14} color="#dc2626" style={{ marginLeft: 4 }} />
                <Text style={styles.removeBtnText}>حذف طلاب</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => openStudentsModal(cls)}
              >
                <Eye size={14} color="#374151" style={{ marginLeft: 4 }} />
                <Text style={styles.viewBtnText}>الطلاب ({cls.students.length})</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Modal: View Enrolled Students List */}
        {isStudentsModalOpen && selectedClass && (
          <Modal visible animationType="slide" transparent>
            <View style={styles.modalBg}>
              <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>طلاب صف: {selectedClass.name}</Text>
                  <TouchableOpacity onPress={() => setIsStudentsModalOpen(false)}>
                    <XCircle size={22} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalTeacherSub}>
                  المعلمة المسؤولة: {selectedClass.teacher} | عدد الطلاب: {selectedClass.students.length}
                </Text>

                <ScrollView style={{ maxHeight: 300, marginVertical: 12 }}>
                  {selectedClass.students.map((std, idx) => (
                    <View key={std.id} style={styles.stdModalRow}>
                      <Text style={styles.stdNum}>{idx + 1}</Text>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.stdModalName}>{std.name}</Text>
                        <Text style={styles.stdModalParent}>ولي الأمر: {std.parent}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity style={styles.closeBtn} onPress={() => setIsStudentsModalOpen(false)}>
                  <Text style={styles.closeBtnText}>إغلاق النافذة</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* Modal: Add Student to Class */}
        {isAddStudentModalOpen && selectedClass && (
          <Modal visible animationType="fade" transparent>
            <View style={styles.modalBg}>
              <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>إضافة طالب لـ {selectedClass.name}</Text>
                  <TouchableOpacity onPress={() => setIsAddStudentModalOpen(false)}>
                    <XCircle size={22} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalSubHeader}>اختر طفلاً من الأطفال غير المنسبين لصف:</Text>

                {availableStudents.map((std) => (
                  <TouchableOpacity
                    key={std.id}
                    style={styles.selectStdOption}
                    onPress={() => handleAddStudentToClass(std)}
                  >
                    <UserPlus size={16} color="#2563eb" style={{ marginLeft: 8 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.selectStdName}>{std.name}</Text>
                      <Text style={styles.selectStdParent}>ولي الأمر: {std.parent}</Text>
                    </View>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.closeBtn} onPress={() => setIsAddStudentModalOpen(false)}>
                  <Text style={styles.closeBtnText}>إلغاء</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* Modal: Remove Student from Class */}
        {isRemoveStudentModalOpen && selectedClass && (
          <Modal visible animationType="fade" transparent>
            <View style={styles.modalBg}>
              <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>حذف طالب من {selectedClass.name}</Text>
                  <TouchableOpacity onPress={() => setIsRemoveStudentModalOpen(false)}>
                    <XCircle size={22} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalSubHeader}>اختر الطالب المراد إزالته من هذا الصف:</Text>

                {selectedClass.students.map((std) => (
                  <TouchableOpacity
                    key={std.id}
                    style={[styles.selectStdOption, { borderColor: '#fecdd3' }]}
                    onPress={() => handleRemoveStudentFromClass(std)}
                  >
                    <UserMinus size={16} color="#dc2626" style={{ marginLeft: 8 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.selectStdName}>{std.name}</Text>
                      <Text style={styles.selectStdParent}>ولي الأمر: {std.parent}</Text>
                    </View>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.closeBtn} onPress={() => setIsRemoveStudentModalOpen(false)}>
                  <Text style={styles.closeBtnText}>إلغاء</Text>
                </TouchableOpacity>
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

  classCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  classTopRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  classTitleCol: { flex: 1 },
  className: { fontSize: 17, fontWeight: 'bold', color: '#1f2937', textAlign: 'right' },
  classSub: { fontSize: 12, color: '#6b7280', textAlign: 'right', marginTop: 2 },

  countBadge: { backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  countText: { fontSize: 12, fontWeight: 'bold', color: '#2563eb' },

  teacherBox: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 10, borderRadius: 12, marginBottom: 12 },
  teacherText: { fontSize: 13, fontWeight: 'bold', color: '#166534' },

  actionsRow: { flexDirection: 'row-reverse', gap: 6 },
  addBtn: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563eb', paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },

  removeBtn: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecdd3', paddingVertical: 8, borderRadius: 10 },
  removeBtnText: { color: '#dc2626', fontWeight: 'bold', fontSize: 12 },

  viewBtn: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', paddingVertical: 8, borderRadius: 10 },
  viewBtnText: { color: '#374151', fontWeight: 'bold', fontSize: 12 },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 17, fontWeight: 'bold', color: '#111827' },
  modalTeacherSub: { fontSize: 12, color: '#6b7280', textAlign: 'right', marginBottom: 10 },

  stdModalRow: { flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  stdNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: 'bold', fontSize: 12, textAlign: 'center', lineHeight: 24 },
  stdModalName: { fontSize: 14, fontWeight: 'bold', color: '#1f2937', textAlign: 'right' },
  stdModalParent: { fontSize: 12, color: '#6b7280', textAlign: 'right' },

  modalSubHeader: { fontSize: 13, color: '#374151', textAlign: 'right', marginBottom: 12 },
  selectStdOption: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#f9fafb', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 8 },
  selectStdName: { fontSize: 14, fontWeight: 'bold', color: '#1f2937', textAlign: 'right' },
  selectStdParent: { fontSize: 12, color: '#6b7280', textAlign: 'right' },

  closeBtn: { backgroundColor: '#64748b', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  closeBtnText: { color: '#ffffff', fontWeight: 'bold' },
});
