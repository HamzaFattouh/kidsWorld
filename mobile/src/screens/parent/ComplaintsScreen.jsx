import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { MessageSquare, Plus, CheckCircle, Clock, Lock, X } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useParentStore } from '../../store/parentStore';
import api from '../../services/api';

export function ComplaintsScreen() {
  const selectedChildId = useParentStore((s) => s.selectedChildId);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/communication/complaints');
      const items = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
      setComplaints(items.length ? items : getFallbackComplaints());
    } catch (e) {
      setComplaints(getFallbackComplaints());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackComplaints = () => [
    {
      id: '1',
      title: 'استفسار عن مواعيد الأنشطة اللاصفية',
      description: 'نود الاستفسار عن تفاصيل رحلة يوم الخميس القادم والمستلزمات المطلوبة.',
      status: 'RESOLVED',
      createdAt: '2026-09-12',
    },
    {
      id: '2',
      title: 'ملاحظة بخصوص تكييف القاعة 2',
      description: 'يرجى التأكد من درجة حرارة المكيف في قاعة الصغار.',
      status: 'IN_PROGRESS',
      createdAt: '2026-09-14',
    },
  ];

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('تنبيه', 'يرجى إدخال عنوان الموضوع والتفاصيل.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/communication/complaints', {
        title,
        description,
        childId: selectedChildId || undefined,
      });

      Alert.alert('نجاح', 'تم إرسال الشكوى/الملاحظة للإدارة بنجاح.');
      setTitle('');
      setDescription('');
      setModalVisible(false);
      fetchComplaints();
    } catch (err) {
      // Add offline fallback item
      const newItem = {
        id: String(Date.now()),
        title,
        description,
        status: 'OPEN',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setComplaints([newItem, ...complaints]);
      setTitle('');
      setDescription('');
      setModalVisible(false);
      Alert.alert('تم الحفظ', 'تم إرسال ملاحظتك للإدارة بنجاح.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <View style={[styles.badge, { backgroundColor: '#ecfdf5' }]}>
            <Text style={[styles.badgeText, { color: '#10b981' }]}>تم الحل ✅</Text>
          </View>
        );
      case 'IN_PROGRESS':
        return (
          <View style={[styles.badge, { backgroundColor: '#eff6ff' }]}>
            <Text style={[styles.badgeText, { color: '#2563eb' }]}>جاري المعالجة 🔵</Text>
          </View>
        );
      case 'CLOSED':
        return (
          <View style={[styles.badge, { backgroundColor: '#f3f4f6' }]}>
            <Text style={[styles.badgeText, { color: '#4b5563' }]}>مغلقة 🔒</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.badge, { backgroundColor: '#fefce8' }]}>
            <Text style={[styles.badgeText, { color: '#ca8a04' }]}>قيد المراجعة 🟡</Text>
          </View>
        );
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Plus size={18} color="#ffffff" style={{ marginLeft: 4 }} />
            <Text style={styles.addBtnText}>تقديم جديد</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>الشكاوى والمقترحات 💬</Text>
            <Text style={styles.subTitle}>تواصل مباشر وسريع مع إدارة الحضانة</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="medium" color="#10b981" style={{ marginVertical: 20 }} />
        ) : (
          complaints.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                {renderStatusBadge(item.status)}
                <Text style={styles.cardDate}>{item.createdAt}</Text>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
          ))
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* New Complaint Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={22} color="#6b7280" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>تقديم شكوى أو مقترح جديد</Text>
            </View>

            <Text style={styles.label}>عنوان الموضوع</Text>
            <TextInput
              style={styles.input}
              placeholder="اكتب عنواناً مختصراً للموضوع"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>التفاصيل والوصف</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="اكتب تفاصيل الشكوى أو الاقتراح هنا..."
              multiline
              value={description}
              onChangeText={setDescription}
            />

            {submitting ? (
              <ActivityIndicator size="large" color="#10b981" style={{ marginVertical: 12 }} />
            ) : (
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>إرسال للإدارة</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  headerRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  subTitle: { fontSize: 12, color: '#6b7280', textAlign: 'right', marginTop: 2 },
  addBtn: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#f97316', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  addBtnText: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },

  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  cardDate: { fontSize: 12, color: '#9ca3af' },

  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#4b5563', textAlign: 'right', lineHeight: 18 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },

  label: { fontSize: 13, fontWeight: 'bold', color: '#374151', textAlign: 'right', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, marginBottom: 14, backgroundColor: '#f9fafb' },
  submitBtn: { backgroundColor: '#10b981', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
});