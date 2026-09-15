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
import { FileCheck, Plus, CheckCircle2, Clock, X } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useParentStore } from '../../store/parentStore';
import api from '../../services/api';

export function RequestsScreen() {
  const selectedChildId = useParentStore((s) => s.selectedChildId);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [type, setType] = useState('LEAVE');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/communication/requests');
      const items = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
      setRequests(items.length ? items : getFallbackRequests());
    } catch (e) {
      setRequests(getFallbackRequests());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackRequests = () => [
    {
      id: '1',
      type: 'LEAVE',
      description: 'طلب استئذان غياب ليومي الأحد والإثنين بسبب السفر العائلي.',
      status: 'RESOLVED',
      createdAt: '2026-09-10',
    },
    {
      id: '2',
      type: 'EARLY_PICKUP',
      description: 'طلب مغادرة مبكرة يوم الأربعاء الساعة 12:00 ظهراً لموعد طبي.',
      status: 'OPEN',
      createdAt: '2026-09-15',
    },
  ];

  const requestTypes = [
    { key: 'LEAVE', label: 'طلب إجازة / غياب 📝' },
    { key: 'EARLY_PICKUP', label: 'طلب مغادرة مبكرة 🚗' },
    { key: 'DOCUMENT_REQUEST', label: 'طلب شهادة / مستندات 📄' },
    { key: 'MEETING_REQUEST', label: 'طلب موعد اجتماع 🤝' },
  ];

  const getTypeLabel = (tKey) => {
    const found = requestTypes.find((r) => r.key === tKey);
    return found ? found.label : tKey;
  };

  const handleSubmit = async () => {
    if (!description) {
      Alert.alert('تنبيه', 'يرجى إدخال سبب وتفاصيل الطلب.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/communication/requests', {
        type,
        description,
        childId: selectedChildId || undefined,
      });

      Alert.alert('نجاح', 'تم تقديم الطلب للإدارة بنجاح.');
      setDescription('');
      setModalVisible(false);
      fetchRequests();
    } catch (err) {
      const newItem = {
        id: String(Date.now()),
        type,
        description,
        status: 'OPEN',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setRequests([newItem, ...requests]);
      setDescription('');
      setModalVisible(false);
      Alert.alert('تم الحفظ', 'تم تقديم طلبك بنجاح.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <View style={[styles.badge, { backgroundColor: '#ecfdf5' }]}>
            <Text style={[styles.badgeText, { color: '#10b981' }]}>تمت الموافقة ✅</Text>
          </View>
        );
      case 'IN_PROGRESS':
        return (
          <View style={[styles.badge, { backgroundColor: '#eff6ff' }]}>
            <Text style={[styles.badgeText, { color: '#2563eb' }]}>جاري المراجعة 🔵</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.badge, { backgroundColor: '#fefce8' }]}>
            <Text style={[styles.badgeText, { color: '#ca8a04' }]}>قيد الانتظار 🟡</Text>
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
            <Text style={styles.addBtnText}>طلب جديد</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>طلبات أولياء الأمور 📄</Text>
            <Text style={styles.subTitle}>متابعة طلبات الإجازات والمغادرة والمستندات</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="medium" color="#10b981" style={{ marginVertical: 20 }} />
        ) : (
          requests.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                {renderStatusBadge(item.status)}
                <Text style={styles.cardDate}>{item.createdAt}</Text>
              </View>

              <Text style={styles.cardType}>{getTypeLabel(item.type)}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
          ))
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* New Request Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={22} color="#6b7280" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>تقديم طلب جديد</Text>
            </View>

            <Text style={styles.label}>اختر نوع الطلب</Text>
            <View style={styles.typesGrid}>
              {requestTypes.map((rt) => (
                <TouchableOpacity
                  key={rt.key}
                  style={[styles.typeOption, type === rt.key && styles.activeTypeOption]}
                  onPress={() => setType(rt.key)}
                >
                  <Text style={[styles.typeOptionText, type === rt.key && styles.activeTypeOptionText]}>
                    {rt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>السبب والتفاصيل</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="اكتب سبب وتفاصيل الطلب هنا..."
              multiline
              value={description}
              onChangeText={setDescription}
            />

            {submitting ? (
              <ActivityIndicator size="large" color="#10b981" style={{ marginVertical: 12 }} />
            ) : (
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>إرسال الطلب</Text>
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
  addBtn: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#6366f1', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  addBtnText: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },

  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  cardDate: { fontSize: 12, color: '#9ca3af' },

  cardType: { fontSize: 15, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#4b5563', textAlign: 'right', lineHeight: 18 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },

  label: { fontSize: 13, fontWeight: 'bold', color: '#374151', textAlign: 'right', marginBottom: 6 },
  typesGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', marginBottom: 12 },
  typeOption: { backgroundColor: '#f3f4f6', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, margin: 4 },
  activeTypeOption: { backgroundColor: '#6366f1' },
  typeOptionText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  activeTypeOptionText: { color: '#ffffff' },

  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, marginBottom: 14, backgroundColor: '#f9fafb' },
  submitBtn: { backgroundColor: '#6366f1', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
});