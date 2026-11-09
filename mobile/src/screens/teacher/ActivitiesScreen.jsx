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
import {
  Activity,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  X,
  Palette,
  BookOpen,
  Sun,
  Smile,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function ActivitiesScreen() {
  const [activities, setActivities] = useState([
    {
      id: '1',
      title: 'استقبال الأطفال وحلقة الصباح',
      time: '08:00 - 08:45',
      category: 'روتيني',
      completed: true,
      notes: 'ترديد الأناشيد الصباحية وتفقد الحضور مع الأطفال',
    },
    {
      id: '2',
      title: 'استكشاف الأرقام والأشكال',
      time: '08:45 - 09:30',
      category: 'تعليمي',
      completed: true,
      notes: 'تطبيق عملي باستخدام المكعبات الخشبية والبطاقات الملونة',
    },
    {
      id: '3',
      title: 'وجبة الإفطار الجماعية',
      time: '09:30 - 10:15',
      category: 'تغذية',
      completed: true,
      notes: 'تعزيز آداب المائدة وغسل اليدين قبل وبعد الطعام',
    },
    {
      id: '4',
      title: 'نشاط الفنون: الرسم بالأصابع والمعجون',
      time: '10:15 - 11:15',
      category: 'فني',
      completed: false,
      notes: 'صناعة أشكال الحيوانات والأزهار بتوجيه المعلمة',
    },
    {
      id: '5',
      title: 'اللعب الحر في الساحة الخارجية',
      time: '11:15 - 12:00',
      category: 'حركي',
      completed: false,
      notes: 'أنشطة الجري والتوازن في الهواء الطلق',
    },
    {
      id: '6',
      title: 'قراءة قصة ما قبل المغادرة والراحة',
      time: '12:00 - 13:00',
      category: 'استرخاء',
      completed: false,
      notes: 'قصة السلحفاة الذكية واستعداد الأطفال للمغادرة',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newCategory, setNewCategory] = useState('تعليمي');
  const [newNotes, setNewNotes] = useState('');

  const toggleComplete = (id) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, completed: !act.completed } : act))
    );
  };

  const handleAddActivity = () => {
    if (!newTitle.trim()) {
      Alert.alert('تنبيه', 'يرجى كتابة عنوان النشاط أولاً.');
      return;
    }
    const newAct = {
      id: String(Date.now()),
      title: newTitle.trim(),
      time: newTime.trim() || '13:00 - 13:30',
      category: newCategory,
      completed: false,
      notes: newNotes.trim() || 'نشاط إضافي للصف',
    };
    setActivities((prev) => [...prev, newAct]);
    setNewTitle('');
    setNewTime('');
    setNewNotes('');
    setModalVisible(false);
    Alert.alert('نجاح', 'تمت إضافة النشاط بنجاح إلى جدول اليوم.');
  };

  const completedCount = activities.filter((a) => a.completed).length;

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>جدول الأنشطة اليومية</Text>
            <Text style={styles.subtitle}>
              تم إنجاز {completedCount} من {activities.length} أنشطة اليوم
            </Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Plus size={18} color="#ffffff" />
            <Text style={styles.addBtnText}>إضافة نشاط</Text>
          </TouchableOpacity>
        </View>

        {/* Timeline items */}
        {activities.map((act, index) => {
          return (
            <View key={act.id} style={styles.timelineItem}>
              {/* Right indicator column */}
              <View style={styles.indicatorCol}>
                <TouchableOpacity onPress={() => toggleComplete(act.id)}>
                  {act.completed ? (
                    <CheckCircle2 size={24} color="#059669" fill="#ecfdf5" />
                  ) : (
                    <Circle size={24} color="#d1d5db" />
                  )}
                </TouchableOpacity>
                {index < activities.length - 1 && <View style={styles.timelineLine} />}
              </View>

              {/* Content Card */}
              <View
                style={[
                  styles.activityCard,
                  act.completed && styles.activityCardCompleted,
                ]}
              >
                <View style={styles.cardTopRow}>
                  <Text style={[styles.actTitle, act.completed && styles.textCompleted]}>
                    {act.title}
                  </Text>
                  <View style={styles.timeTag}>
                    <Clock size={12} color="#6b7280" />
                    <Text style={styles.timeText}>{act.time}</Text>
                  </View>
                </View>

                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{act.category}</Text>
                </View>

                {act.notes ? <Text style={styles.actNotes}>{act.notes}</Text> : null}

                <TouchableOpacity
                  style={[
                    styles.statusToggleBtn,
                    act.completed ? styles.statusBtnDone : styles.statusBtnPending,
                  ]}
                  onPress={() => toggleComplete(act.id)}
                >
                  <Text
                    style={[
                      styles.statusToggleText,
                      act.completed ? styles.statusTextDone : styles.statusTextPending,
                    ]}
                  >
                    {act.completed ? 'مكتمل بنجاح' : 'تعيين كمكتمل'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Add Activity Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>إضافة نشاط جديد</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>عنوان النشاط *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: ورشة تلوين المجسمات"
                placeholderTextColor="#9ca3af"
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <Text style={styles.inputLabel}>الوقت المقترح</Text>
              <TextInput
                style={styles.textInput}
                placeholder="مثال: 11:30 - 12:15"
                placeholderTextColor="#9ca3af"
                value={newTime}
                onChangeText={setNewTime}
              />

              <Text style={styles.inputLabel}>تصنيف النشاط</Text>
              <View style={styles.categorySelector}>
                {['تعليمي', 'فني', 'حركي', 'تغذية', 'استرخاء'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.catChip,
                      newCategory === cat && styles.catChipActive,
                    ]}
                    onPress={() => setNewCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.catChipText,
                        newCategory === cat && styles.catChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>ملاحظات وتفاصيل النشاط</Text>
              <TextInput
                style={[styles.textInput, { minHeight: 70, textAlignVertical: 'top' }]}
                multiline
                placeholder="اكتب أهداف النشاط أو الأدوات المطلوبة..."
                placeholderTextColor="#9ca3af"
                value={newNotes}
                onChangeText={setNewNotes}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleAddActivity}>
                <Text style={styles.submitBtnText}>حفظ وإدراج النشاط</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  subtitle: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 2 },
  addBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Timeline
  timelineItem: {
    flexDirection: 'row-reverse',
    marginBottom: 16,
    gap: 12,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 28,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e5e7eb',
    marginTop: 6,
  },
  activityCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 14,
  },
  activityCardCompleted: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  cardTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  actTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  timeTag: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
  timeText: {
    fontSize: 11,
    color: '#6b7280',
  },
  categoryBadge: {
    alignSelf: 'flex-end',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: 'bold',
  },
  actNotes: {
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'right',
    lineHeight: 18,
    marginBottom: 10,
  },
  statusToggleBtn: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusBtnDone: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  statusBtnPending: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statusToggleText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusTextDone: {
    color: '#059669',
  },
  statusTextPending: {
    color: '#4b5563',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 16,
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'right',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#111827',
    textAlign: 'right',
    marginBottom: 12,
  },
  categorySelector: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  catChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  catChipText: {
    fontSize: 12,
    color: '#4b5563',
  },
  catChipTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
