import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import api from '../../services/api';

export function GalleryScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/auto/galleryImage');
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
    if (!image) {
      Alert.alert('تنبيه', 'يرجى اختيار صورة');
      return;
    }

    setSubmitting(true);
    const data = new FormData();
    data.append('captionAr', caption);
    data.append('captionEn', caption);

    data.append('image', {
      uri: image,
      type: 'image/jpeg',
      name: 'gallery.jpg',
    });

    try {
      await api.post('/cms/gallery', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('نجاح', 'تم إضافة الصورة للمعرض بنجاح');
      setIsFormVisible(false);
      setCaption('');
      setImage(null);
      fetchData();
    } catch (e) {
      Alert.alert('خطأ', 'فشلت إضافة الصورة');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>معرض الصور</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setIsFormVisible(!isFormVisible)}>
          <Text style={styles.addBtnText}>{isFormVisible ? 'إلغاء' : 'إضافة صورة'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {isFormVisible && (
          <View style={styles.formContainer}>
            <TextInput style={styles.input} placeholder="وصف الصورة (اختياري)" value={caption} onChangeText={setCaption} />
            
            <TouchableOpacity style={styles.imgBtn} onPress={pickImage}>
              <Text style={styles.imgBtnText}>اختيار صورة</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.preview} />}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
              <Text style={styles.submitBtnText}>{submitting ? 'جاري الحفظ...' : 'حفظ الصورة'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#10b981" />
        ) : items.length === 0 ? (
          <Text style={styles.emptyText}>لا توجد بيانات حالياً</Text>
        ) : (
          <View style={styles.grid}>
            {items.map((item, idx) => (
              <View key={item.id || idx} style={styles.card}>
                <Image source={{ uri: item.url }} style={styles.img} />
                <Text style={styles.cardTitle} numberOfLines={1}>{item.captionAr || 'بدون وصف'}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { padding: 16, backgroundColor: '#10b981', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  addBtn: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  addBtnText: { color: '#10b981', fontWeight: 'bold' },
  formContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, marginBottom: 12, textAlign: 'right' },
  imgBtn: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 8, marginBottom: 12, alignItems: 'center' },
  imgBtnText: { color: '#374151', fontWeight: 'bold' },
  preview: { width: '100%', height: 150, borderRadius: 8, marginBottom: 12 },
  submitBtn: { backgroundColor: '#10b981', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  submitBtnText: { color: '#fff', fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: '#fff', width: '48%', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb', overflow: 'hidden' },
  img: { width: '100%', height: 120 },
  cardTitle: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', padding: 8 },
  emptyText: { textAlign: 'center', marginTop: 24, color: '#6b7280' }
});
