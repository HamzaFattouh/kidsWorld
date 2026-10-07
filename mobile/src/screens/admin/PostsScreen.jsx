import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import api from '../../services/api';

export function PostsScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({ titleAr: '', contentAr: '' });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/cms/posts');
      setItems(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!formData.titleAr || !formData.contentAr) {
      Alert.alert('تنبيه', 'يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    setSubmitting(true);
    const data = new FormData();
    data.append('titleAr', formData.titleAr);
    data.append('titleEn', formData.titleAr);
    data.append('contentAr', formData.contentAr);
    data.append('contentEn', formData.contentAr);
    data.append('isPublished', 'true');

    if (image) {
      data.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
    }

    try {
      await api.post('/cms/posts', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('نجاح', 'تم إضافة المنشور بنجاح');
      setIsFormVisible(false);
      setFormData({ titleAr: '', contentAr: '' });
      setImage(null);
      fetchData();
    } catch (e) {
      Alert.alert('خطأ', 'فشلت إضافة المنشور');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>إدارة المنشورات</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setIsFormVisible(!isFormVisible)}>
          <Text style={styles.addBtnText}>{isFormVisible ? 'إلغاء' : 'إضافة منشور'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {isFormVisible && (
          <View style={styles.formContainer}>
            <TextInput style={styles.input} placeholder="عنوان المنشور" value={formData.titleAr} onChangeText={t => setFormData({...formData, titleAr: t})} />
            <TextInput style={styles.input} placeholder="المحتوى" multiline numberOfLines={4} value={formData.contentAr} onChangeText={t => setFormData({...formData, contentAr: t})} />
            
            <TouchableOpacity style={styles.imgBtn} onPress={pickImage}>
              <Text style={styles.imgBtnText}>اختيار صورة</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.preview} />}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
              <Text style={styles.submitBtnText}>{submitting ? 'جاري الحفظ...' : 'حفظ المنشور'}</Text>
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
              <Text style={styles.cardDesc} numberOfLines={2}>{item.contentAr}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { padding: 16, backgroundColor: '#8b5cf6', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  addBtn: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  addBtnText: { color: '#8b5cf6', fontWeight: 'bold' },
  formContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, marginBottom: 12, textAlign: 'right' },
  imgBtn: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
  imgBtnText: { color: '#374151', fontWeight: 'bold' },
  preview: { width: '100%', height: 150, borderRadius: 8, marginBottom: 12 },
  submitBtn: { backgroundColor: '#8b5cf6', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  submitBtnText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#6b7280', textAlign: 'right' },
  emptyText: { textAlign: 'center', marginTop: 24, color: '#6b7280' }
});
