import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Award, Star, Check, Calendar, Brain } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useParentStore } from '../../store/parentStore';
import api from '../../services/api';

export function EvaluationsScreen() {
  const selectedChildId = useParentStore((s) => s.selectedChildId) || 'CHILD-101';
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvaluations();
  }, [selectedChildId]);

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/operations/evaluations/${selectedChildId}`);
      const items = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
      setEvaluations(items.length ? items : getFallbackEvaluations());
    } catch (e) {
      setEvaluations(getFallbackEvaluations());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackEvaluations = () => [
    {
      id: '1',
      date: '2026-09-12',
      period: 'تقييم الأسبوع الحالي',
      rating: 'EXCELLENT',
      score: '95/100',
      skills: [
        { name: 'المهارات الحركية والتفاعل', level: 'ممتاز' },
        { name: 'المهارات اللغوية والتعبير', level: 'جيد جداً' },
        { name: 'الانضباط والمشاركة الجماعية', level: 'ممتاز' },
      ],
      notes: 'يظهر طفلك تطوراً ملاحوظاً في المشاركة مع زملائه في أنشطة الرسم والتركيب.',
    },
    {
      id: '2',
      date: '2026-09-05',
      period: 'تقييم الأسبوع الماضي',
      rating: 'VERY_GOOD',
      score: '88/100',
      skills: [
        { name: 'الاستجابة للتعليمات', level: 'جيد جداً' },
        { name: 'التركيز والانتباه', level: 'جيد جداً' },
      ],
      notes: 'تفاعل إيجابي مستمر وحضور مبهج في القاعة.',
    },
  ];

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>التقييمات وتطور الطفل 🏆</Text>
          <Text style={styles.subTitle}>تقارير التقييم الدورية والمهارات للطفل #{selectedChildId}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="medium" color="#10b981" style={{ marginVertical: 20 }} />
        ) : (
          evaluations.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.badgeContainer}>
                  <Award size={16} color="#ec4899" style={{ marginLeft: 4 }} />
                  <Text style={styles.badgeText}>{item.score || 'تقييم ممتاز'}</Text>
                </View>

                <View style={styles.dateRow}>
                  <Calendar size={14} color="#6b7280" style={{ marginLeft: 4 }} />
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
              </View>

              <Text style={styles.periodTitle}>{item.period || 'تقييم الأسبوع'}</Text>

              {/* Skills List */}
              <View style={styles.skillsBox}>
                <Text style={styles.skillsHeader}>المهارات المقيمة:</Text>
                {item.skills?.map((sk, idx) => (
                  <View key={idx} style={styles.skillRow}>
                    <View style={styles.skillLeft}>
                      <Star size={14} color="#f59e0b" style={{ marginLeft: 4 }} />
                      <Text style={styles.skillLevel}>{sk.level}</Text>
                    </View>
                    <Text style={styles.skillName}>{sk.name}</Text>
                  </View>
                ))}
              </View>

              {/* Notes */}
              <View style={styles.notesBox}>
                <Text style={styles.notesTitle}>ملاحظات وتوصيات المعلمة:</Text>
                <Text style={styles.notesContent}>{item.notes}</Text>
              </View>
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
  cardTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badgeContainer: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#fdf2f8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: '#db2777' },
  dateRow: { flexDirection: 'row-reverse', alignItems: 'center' },
  dateText: { fontSize: 12, color: '#6b7280' },

  periodTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 12 },

  skillsBox: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, marginBottom: 12 },
  skillsHeader: { fontSize: 13, fontWeight: 'bold', color: '#374151', textAlign: 'right', marginBottom: 8 },
  skillRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  skillName: { fontSize: 13, color: '#4b5563' },
  skillLeft: { flexDirection: 'row-reverse', alignItems: 'center' },
  skillLevel: { fontSize: 12, fontWeight: 'bold', color: '#d97706' },

  notesBox: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#dcfce7' },
  notesTitle: { fontSize: 12, fontWeight: 'bold', color: '#166534', textAlign: 'right', marginBottom: 4 },
  notesContent: { fontSize: 13, color: '#15803d', textAlign: 'right', lineHeight: 18 },
});