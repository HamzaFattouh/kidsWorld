import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, TextInput } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import api from '../../services/api';

export function AnnouncementsScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({ titleAr: '', contentAr: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/cms/announcements');
      setItems(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.titleAr || !formData.contentAr) {
      Alert.alert('تنبيه', 'يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/cms/announcements', {
        titleAr: formData.titleAr,
        titleEn: formData.titleAr,
        contentAr: formData.contentAr,
        contentEn: formData.contentAr,
        isPublished: true,
      });
      Alert.alert('نجاح', 'تم إضافة الإعلان بنجاح');
      setIsFormVisible(false);
      setFormData({ titleAr: '', contentAr: '' });
      fetchData();
    } catch (e) {
      Alert.alert('خطأ', 'فشلت إضافة الإعلان');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>إدارة الإعلانات</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setIsFormVisible(!isFormVisible)}>
          <Text style={styles.addBtnText}>{isFormVisible ? 'إلغاء' : 'إضافة إعلان'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {isFormVisible && (
          <View style={styles.formContainer}>
            <TextInput style={styles.input} placeholder="عنوان الإعلان" value={formData.titleAr} onChangeText={t => setFormData({...formData, titleAr: t})} />
            <TextInput style={styles.input} placeholder="محتوى الإعلان" multiline numberOfLines={4} value={formData.contentAr} onChangeText={t => setFormData({...formData, contentAr: t})} />
            
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
              <Text style={styles.submitBtnText}>{submitting ? 'جاري الحفظ...' : 'حفظ الإعلان'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#10b981" />
        ) : items.length === 0 ? (
          <Text style={styles.emptyText}>لا توجد بيانات حالياً</Text>
        ) : (
          items.map((item, idx) => (
            <View key={item.id || idx} style={styles.card}>
              <Text style={styles.cardTitle}>{item.titleAr}</Text>
              <Text style={styles.cardDesc} numberOfLines={3}>{item.contentAr}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { padding: 16, backgroundColor: '#ef4444', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  addBtn: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  addBtnText: { color: '#ef4444', fontWeight: 'bold' },
  formContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, marginBottom: 12, textAlign: 'right' },
  submitBtn: { backgroundColor: '#ef4444', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  submitBtnText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#6b7280', textAlign: 'right' },
  emptyText: { textAlign: 'center', marginTop: 24, color: '#6b7280' }
});
