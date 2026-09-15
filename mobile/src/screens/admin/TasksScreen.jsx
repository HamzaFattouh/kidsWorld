import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {
  ClipboardList,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  UserCheck,
  Trash2,
  Flame,
  XCircle,
  Send,
  BellRing,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

const TEACHERS_LIST = [
  { id: '1', name: 'أ. نورة النابلسي', class: 'روضة العصافير' },
  { id: '2', name: 'أ. سارة الخالد', class: 'روضة الزهور' },
  { id: '3', name: 'أ. منى التميمي', class: 'روضة الأمل' },
];

export function TasksScreen() {
  const [tasks, setTasks] = useState([
    {
      id: 'task-101',
      title: 'إعداد تقارير التقييم الشهري للطلاب',
      description: 'يرجى كتابة وتحديث تقييم السلوك والتعلم لجميع أطفال الصف وإرسالها.',
      priority: 'HIGH',
      assignedTeachers: ['أ. نورة النابلسي', 'أ. سارة الخالد'],
      dueDate: '2026-09-20',
      createdAt: '2026-09-14T09:00:00.000Z',
      status: 'COMPLETED',
      completedBy: 'أ. نورة النابلسي',
      completedAt: '2026-09-15T10:30:00.000Z',
      teacherNote: 'تم إنجاز كافة تقييمات روضة العصافير بنجاح وإرسالها لأولياء الأمور.',
    },
    {
      id: 'task-102',
      title: 'تجهيز ركن المعرض الفني وتلوين الرسومات',
      description: 'تحضير المواد والأدوات الفنية ومساعدة الأطفال في رسم اللوحات للمعرض.',
      priority: 'URGENT',
      assignedTeachers: ['أ. سارة الخالد', 'أ. منى التميمي'],
      dueDate: '2026-09-17',
      createdAt: '2026-09-15T08:00:00.000Z',
      status: 'PENDING',
      completedBy: null,
      completedAt: null,
      teacherNote: '',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  const toggleTeacher = (name) => {
    if (selectedTeachers.includes(name)) {
      setSelectedTeachers(selectedTeachers.filter((t) => t !== name));
    } else {
      setSelectedTeachers([...selectedTeachers, name]);
    }
  };

  const handleCreateTask = () => {
    if (!taskTitle.trim() || selectedTeachers.length === 0) {
      Alert.alert('تنبيه ⚠️', 'يرجى إدخال عنوان المهمة واختيار معلم واحد على الأقل.');
      return;
    }

    const newTask = {
      id: `task-${Date.now()}`,
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      priority: taskPriority,
      assignedTeachers: selectedTeachers,
      dueDate: '2026-09-22',
      createdAt: new Date().toISOString(),
      status: 'PENDING',
      completedBy: null,
      completedAt: null,
      teacherNote: '',
    };

    setTasks([newTask, ...tasks]);
    setTaskTitle('');
    setTaskDescription('');
    setSelectedTeachers([]);
    setIsModalOpen(false);
    Alert.alert('تم الإرسال 🎉', 'تم إرسال المهمة الجديدة للمعلمين بنجاح!');
  };

  const handleDeleteTask = (id) => {
    Alert.alert('تأكيد الحذف 🗑️', 'هل أنت تأكد من حذف هذه المهمة من السجل؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => setTasks(tasks.filter((t) => t.id !== id)) },
    ]);
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>إدارة وتكليف المهام للمعلمين 📋</Text>
          <Text style={styles.subTitle}>إرسال ومتابعة تنفيذ المهام الموجهة للكادر التعليمي</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.addBtn} onPress={() => setIsModalOpen(true)}>
          <Plus size={18} color="#ffffff" style={{ marginLeft: 6 }} />
          <Text style={styles.addBtnText}>إضافة مهمة جديدة للمعلمين</Text>
        </TouchableOpacity>

        {/* Tasks List */}
        <View style={styles.listSection}>
          {tasks.map((task) => (
            <View
              key={task.id}
              style={[
                styles.taskCard,
                task.status === 'COMPLETED' && styles.completedTaskCard,
              ]}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.priorityBadge}>
                  <Text style={styles.priorityBadgeText}>
                    {task.priority === 'URGENT'
                      ? 'عاجلة جداً 🔴'
                      : task.priority === 'HIGH'
                      ? 'عالية 🟠'
                      : 'متوسطة 🟡'}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => handleDeleteTask(task.id)}>
                  <Trash2 size={18} color="#ef4444" />
                </TouchableOpacity>
              </View>

              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDesc}>{task.description}</Text>

              <View style={styles.teachersRow}>
                <Users size={14} color="#2563eb" style={{ marginLeft: 6 }} />
                <Text style={styles.teachersLabel}>المكلفين: </Text>
                <Text style={styles.teachersList}>{task.assignedTeachers.join('، ')}</Text>
              </View>

              {task.status === 'COMPLETED' ? (
                <View style={styles.completedBox}>
                  <View style={styles.completedRow}>
                    <CheckCircle2 size={16} color="#166534" style={{ marginLeft: 6 }} />
                    <Text style={styles.completedText}>تم الإنجاز بواسطة: {task.completedBy}</Text>
                  </View>
                  {task.teacherNote ? (
                    <Text style={styles.teacherNoteText}>💬 ملاحظة المعلم/ة: {task.teacherNote}</Text>
                  ) : null}
                  <View style={styles.notifyBadge}>
                    <BellRing size={12} color="#15803d" style={{ marginLeft: 4 }} />
                    <Text style={styles.notifyBadgeText}>تم استلام إشعار الإنجاز بنجاح 🔔</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.pendingBadge}>
                  <Clock size={14} color="#b45309" style={{ marginLeft: 6 }} />
                  <Text style={styles.pendingText}>قيد التنفيذ والمتابعة ⏳</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Modal Create Task */}
        {isModalOpen && (
          <Modal visible animationType="slide" transparent>
            <View style={styles.modalBg}>
              <ScrollView style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>إضافة مهمة جديدة للمعلمين 📋</Text>
                  <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                    <XCircle size={22} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>عنوان المهمة:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="أدخل عنوان المهمة..."
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                />

                <Text style={styles.inputLabel}>تفاصيل وتعليمات المهمة:</Text>
                <TextInput
                  style={[styles.textInput, { height: 74, textAlignVertical: 'top' }]}
                  multiline
                  placeholder="أدخل الوصف الكامل للمهمة..."
                  value={taskDescription}
                  onChangeText={setTaskDescription}
                />

                <Text style={styles.inputLabel}>اختر المعلمين المكلفين بالمهمة:</Text>
                {TEACHERS_LIST.map((t) => {
                  const isSelected = selectedTeachers.includes(t.name);
                  return (
                    <TouchableOpacity
                      key={t.id}
                      style={[styles.teacherOption, isSelected && styles.selectedTeacherOption]}
                      onPress={() => toggleTeacher(t.name)}
                    >
                      <Text style={styles.teacherOptName}>{t.name} ({t.class})</Text>
                      <Text style={styles.teacherOptStatus}>{isSelected ? 'محدد ✅' : 'تحديد'}</Text>
                    </TouchableOpacity>
                  );
                })}

                <TouchableOpacity style={styles.submitBtn} onPress={handleCreateTask}>
                  <Text style={styles.submitBtnText}>إرسال المهمة للمعلمين 🚀</Text>
                </TouchableOpacity>

                <View style={{ height: 24 }} />
              </ScrollView>
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
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  subTitle: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 2 },

  addBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justify: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  addBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },

  listSection: { gap: 12 },
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  completedTaskCard: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },

  cardTopRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  priorityBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  priorityBadgeText: { fontSize: 11, fontWeight: 'bold', color: '#92400e' },

  taskTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 4 },
  taskDesc: { fontSize: 13, color: '#4b5563', textAlign: 'right', lineHeight: 18, marginBottom: 10 },

  teachersRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 10 },
  teachersLabel: { fontSize: 12, fontWeight: 'bold', color: '#374151' },
  teachersList: { fontSize: 12, color: '#2563eb', fontWeight: 'bold' },

  completedBox: { backgroundColor: '#ffffff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#86efac' },
  completedRow: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 4 },
  completedText: { fontSize: 13, fontWeight: 'bold', color: '#166534' },
  teacherNoteText: { fontSize: 12, color: '#15803d', textAlign: 'right', marginTop: 4 },
  notifyBadge: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: 6 },
  notifyBadgeText: { fontSize: 11, color: '#166534', fontWeight: 'bold' },

  pendingBadge: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#fef3c7', padding: 8, borderRadius: 10 },
  pendingText: { fontSize: 12, fontWeight: 'bold', color: '#b45309' },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },

  inputLabel: { fontSize: 13, fontWeight: 'bold', color: '#374151', textAlign: 'right', marginTop: 10, marginBottom: 6 },
  textInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 10, textAlign: 'right', fontSize: 13 },

  teacherOption: { flexDirection: 'row-reverse', justifyContent: 'space-between', padding: 12, backgroundColor: '#f3f4f6', borderRadius: 12, marginBottom: 8 },
  selectedTeacherOption: { backgroundColor: '#dbeafe', borderWidth: 1, borderColor: '#93c5fd' },
  teacherOptName: { fontSize: 13, fontWeight: 'bold', color: '#1f2937' },
  teacherOptStatus: { fontSize: 12, fontWeight: 'bold', color: '#2563eb' },

  submitBtn: { backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  submitBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});
