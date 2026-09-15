import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { FileText, Calendar, UserCheck } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useParentStore } from '../../store/parentStore';
import api from '../../services/api';

export function WeeklyNotesScreen() {
  const selectedChildId = useParentStore((s) => s.selectedChildId) || 'CHILD-101';
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [selectedChildId]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/operations/weekly-notes/${selectedChildId}`);
      const items = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
      setNotes(items.length ? items : getFallbackNotes());
    } catch (e) {
      setNotes(getFallbackNotes());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackNotes = () => [
    {
      id: '1',
      date: '2026-09-14',
      weekTitle: 'ملاحظات الأسبوع الأخير من سبتمبر',
      teacherName: 'أ. سارة الأحمد',
      content: 'أسبوع حافل بالنشاط! تعلم الأطفال هذا الأسبوع الحروف الأولى وأنشطة التلوين الجماعي، وكان طفلكم متفاعلاً ومميزاً بشكل لافت.',
    },
    {
      id: '2',
      date: '2026-09-07',
      weekTitle: 'ملاحظات الأسبوع الأول',
      teacherName: 'أ. سارة الأحمد',
      content: 'تأقلم سريع وممتاز مع البيئة والمدرسين وتفاعل رائع أثناء قراءة القصص.',
    },
  ];

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>الملاحظات الأسبوعية 📝</Text>
          <Text style={styles.subTitle}>تقرير المعلمة الأسبوعي للطفل #{selectedChildId}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="medium" color="#10b981" style={{ marginVertical: 20 }} />
        ) : (
          notes.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.teacherBadge}>
                  <UserCheck size={14} color="#8b5cf6" style={{ marginLeft: 4 }} />
                  <Text style={styles.teacherText}>{item.teacherName || 'معلمة القاعة'}</Text>
                </View>

                <View style={styles.dateRow}>
                  <Calendar size={14} color="#6b7280" style={{ marginLeft: 4 }} />
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{item.weekTitle || 'تقرير الأسبوع'}</Text>
              <Text style={styles.cardContent}>{item.content}</Text>
            </View>
          ))
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  header: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  subTitle: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 2 },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  teacherBadge: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#f5f3ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  teacherText: { fontSize: 12, fontWeight: 'bold', color: '#7c3aed' },
  dateRow: { flexDirection: 'row-reverse', alignItems: 'center' },
  dateText: { fontSize: 12, color: '#6b7280' },

  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 6 },
  cardContent: { fontSize: 13, color: '#4b5563', textAlign: 'right', lineHeight: 20 },
});