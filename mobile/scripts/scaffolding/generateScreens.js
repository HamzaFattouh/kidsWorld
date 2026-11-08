const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, 'src', 'screens', 'admin');

const boilerplate = (name, title) => `import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import api from '../../services/api';

export function ${name}Screen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const endpoint = '${name}' === 'Gallery' ? '/gallery' : '/${name.toLowerCase()}';
      const response = await api.get('/cms' + endpoint);
      setItems(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>${title}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#10b981" />
        ) : items.length === 0 ? (
          <Text style={styles.emptyText}>لا توجد بيانات حالياً</Text>
        ) : (
          items.map((item, idx) => (
            <View key={item.id || idx} style={styles.card}>
              <Text style={styles.cardTitle}>{item.titleAr || item.captionAr || 'عنصر'}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{item.descriptionAr || item.contentAr || ''}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { padding: 16, backgroundColor: '#10b981', alignItems: 'center', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#6b7280', textAlign: 'right' },
  emptyText: { textAlign: 'center', marginTop: 24, color: '#6b7280' }
});
`;

fs.writeFileSync(path.join(screensDir, 'EventsScreen.jsx'), boilerplate('Events', 'إدارة الفعاليات'));
fs.writeFileSync(path.join(screensDir, 'PostsScreen.jsx'), boilerplate('Posts', 'إدارة المنشورات'));
fs.writeFileSync(path.join(screensDir, 'AnnouncementsScreen.jsx'), boilerplate('Announcements', 'إدارة الإعلانات'));
fs.writeFileSync(path.join(screensDir, 'GalleryScreen.jsx'), boilerplate('Gallery', 'معرض الصور'));
console.log('Screens created');
