import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import api from '../../services/api';

export function EventsScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({ titleAr: '', descriptionAr: '', date: '' });
  const [image, setImage] = useState(null);
  const [album, setAlbum] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/cms/events');
      setItems(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (isAlbum = false) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: !isAlbum,
      allowsMultipleSelection: isAlbum,
      quality: 0.8,
    });

    if (!result.canceled) {
      if (isAlbum) {
        setAlbum([...album, ...result.assets.map(a => a.uri)]);
      } else {
        setImage(result.assets[0].uri);
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.titleAr || !formData.descriptionAr || !formData.date) {
      Alert.alert('تنبيه', 'يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    setSubmitting(true);
    const data = new FormData();
    data.append('titleAr', formData.titleAr);
    data.append('titleEn', formData.titleAr);
    data.append('descriptionAr', formData.descriptionAr);
    data.append('descriptionEn', formData.descriptionAr);
    data.append('eventDate', formData.date);
    data.append('isPublished', 'true');

    if (image) {
      data.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
    }

    album.forEach((uri, index) => {
      data.append('album', {
        uri: uri,
        type: 'image/jpeg',
        name: `album_${index}.jpg`,
      });
    });

    try {
      await api.post('/cms/events', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('نجاح', 'تم إضافة الفعالية بنجاح');
      setIsFormVisible(false);
      setFormData({ titleAr: '', descriptionAr: '', date: '' });
      setImage(null);
      setAlbum([]);
      fetchData();
    } catch (e) {
      Alert.alert('خطأ', 'فشلت إضافة الفعالية');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>إدارة الفعاليات</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setIsFormVisible(!isFormVisible)}>
          <Text style={styles.addBtnText}>{isFormVisible ? 'إلغاء' : 'إضافة فعالية'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {isFormVisible && (
          <View style={styles.formContainer}>
            <TextInput style={styles.input} placeholder="عنوان الفعالية" value={formData.titleAr} onChangeText={t => setFormData({...formData, titleAr: t})} />
            <TextInput style={styles.input} placeholder="الوصف" multiline numberOfLines={3} value={formData.descriptionAr} onChangeText={t => setFormData({...formData, descriptionAr: t})} />
            <TextInput style={styles.input} placeholder="التاريخ (مثال: 2026-10-15)" value={formData.date} onChangeText={t => setFormData({...formData, date: t})} />
            
            <TouchableOpacity style={styles.imgBtn} onPress={() => pickImage(false)}>
              <Text style={styles.imgBtnText}>اختيار صورة رئيسية</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.preview} />}

            <TouchableOpacity style={styles.imgBtn} onPress={() => pickImage(true)}>
              <Text style={styles.imgBtnText}>اختيار صور الألبوم الفرعية</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {album.map((uri, idx) => (
                <Image key={idx} source={{ uri }} style={styles.previewSmall} />
              ))}
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
              <Text style={styles.submitBtnText}>{submitting ? 'جاري الحفظ...' : 'حفظ الفعالية'}</Text>
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
              <Text style={styles.cardTitle}>{item.titleAr || 'عنصر'}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{item.descriptionAr || ''}</Text>
            </View>
          ))
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
  imgBtn: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 8, marginBottom: 8, alignItems: 'center' },
  imgBtnText: { color: '#374151', fontWeight: 'bold' },
  preview: { width: '100%', height: 150, borderRadius: 8, marginBottom: 12 },
  previewSmall: { width: 60, height: 60, borderRadius: 8, margin: 4 },
  submitBtn: { backgroundColor: '#10b981', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  submitBtnText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#6b7280', textAlign: 'right' },
  emptyText: { textAlign: 'center', marginTop: 24, color: '#6b7280' }
});
