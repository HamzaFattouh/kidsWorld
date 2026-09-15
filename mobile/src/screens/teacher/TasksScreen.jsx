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
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
  Send,
  XCircle,
  BellRing,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

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
      assignedTeachers: ['أ. نورة النابلسي', 'أ. منى التميمي'],
      dueDate: '2026-09-17',
      createdAt: '2026-09-15T08:00:00.000Z',
      status: 'PENDING',
      completedBy: null,
      completedAt: null,
      teacherNote: '',
    },
  ]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  const openCompletionModal = (task) => {
    setSelectedTask(task);
    setNoteText('');
    setIsModalOpen(true);
  };

  const handleConfirmCompletion = () => {
    if (!selectedTask) return;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === selectedTask.id) {
          return {
            ...t,
            status: 'COMPLETED',
            completedBy: 'أ. نورة النابلسي',
            completedAt: new Date().toISOString(),
            teacherNote: noteText.trim(),
          };
        }
        return t;
      })
    );

    setIsModalOpen(false);
    Alert.alert('تم الإنجاز 🎉', 'تم تسجيل إنجاز المهمة وإرسال إشعار فوري للمدير مع ملاحظتك 🔔');
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>مهامي والواجبات المطلوبة 📋</Text>
          <Text style={styles.subTitle}>متابعة وإنجاز المهام المسندة من إدارك الروضة</Text>
        </View>

        {tasks.map((task) => (
          <View
            key={task.id}
            style={[
              styles.taskCard,
              task.status === 'COMPLETED' && styles.completedCard,
            ]}
          >
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>
                {task.priority === 'URGENT'
                  ? 'عاجلة جداً 🔴'
                  : task.priority === 'HIGH'
                  ? 'عالية 🟠'
                  : 'متوسطة 🟡'}
              </Text>
            </View>

            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskDesc}>{task.description}</Text>

            {task.status === 'PENDING' ? (
              <TouchableOpacity
                style={styles.completeActionBtn}
                onPress={() => openCompletionModal(task)}
              >
                <CheckCircle2 size={16} color="#ffffff" style={{ marginLeft: 6 }} />
                <Text style={styles.completeActionText}>إنجاز المهمة وإرسال إشعار للمدير 🔔</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.doneBox}>
                <View style={styles.doneHeader}>
                  <CheckCircle2 size={16} color="#166534" style={{ marginLeft: 6 }} />
                  <Text style={styles.doneTitle}>تم الإنجاز وإرسال الإشعار للمدير ✅</Text>
                </View>
                {task.teacherNote ? (
                  <Text style={styles.doneNote}>💬 ملاحظتك: {task.teacherNote}</Text>
                ) : null}
              </View>
            )}
          </View>
        ))}

        {/* Modal completion */}
        {isModalOpen && (
          <Modal visible animationType="fade" transparent>
            <View style={styles.modalBg}>
              <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>إنجاز المهمة وإرسال الإشعار 🔔</Text>
                  <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                    <XCircle size={22} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.taskLabel}>المهمة: {selectedTask?.title}</Text>

                <Text style={styles.inputLabel}>ملاحظات المعلم/ة للمدير (اختياري):</Text>
                <TextInput
                  style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
                  multiline
                  placeholder="اكتب أية ملاحظات توضيحية..."
                  value={noteText}
                  onChangeText={setNoteText}
                />

                <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmCompletion}>
                  <Send size={16} color="#ffffff" style={{ marginLeft: 6 }} />
                  <Text style={styles.confirmBtnText}>تأكيد الإنجاز وإرسال الإشعار للمدير 🚀</Text>
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
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  subTitle: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 2 },

  taskCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  completedCard: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },

  priorityBadge: { alignSelf: 'flex-start', backgroundColor: '#fef3c7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginBottom: 8 },
  priorityText: { fontSize: 11, fontWeight: 'bold', color: '#92400e' },

  taskTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 4 },
  taskDesc: { fontSize: 13, color: '#4b5563', textAlign: 'right', lineHeight: 18, marginBottom: 12 },

  completeActionBtn: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', backgroundColor: '#16a34a', paddingVertical: 10, borderRadius: 12 },
  completeActionText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },

  doneBox: { backgroundColor: '#ffffff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#86efac' },
  doneHeader: { flexDirection: 'row-reverse', alignItems: 'center' },
  doneTitle: { fontSize: 13, fontWeight: 'bold', color: '#166534' },
  doneNote: { fontSize: 12, color: '#15803d', textAlign: 'right', marginTop: 4 },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  taskLabel: { fontSize: 13, fontWeight: 'bold', color: '#2563eb', textAlign: 'right', marginBottom: 10 },

  inputLabel: { fontSize: 13, fontWeight: 'bold', color: '#374151', textAlign: 'right', marginBottom: 6 },
  textInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 10, textAlign: 'right', fontSize: 13, marginBottom: 16 },

  confirmBtn: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', backgroundColor: '#16a34a', paddingVertical: 12, borderRadius: 12 },
  confirmBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});
