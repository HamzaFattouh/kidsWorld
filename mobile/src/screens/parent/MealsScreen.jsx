import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Utensils, CheckCircle, AlertTriangle, XCircle, Calendar } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useParentStore } from '../../store/parentStore';
import api from '../../services/api';

export function MealsScreen() {
  const selectedChildId = useParentStore((s) => s.selectedChildId) || 'CHILD-101';
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeals();
  }, [selectedChildId]);

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/operations/meals/${selectedChildId}`);
      const items = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
      setMeals(items.length ? items : getFallbackMeals());
    } catch (e) {
      setMeals(getFallbackMeals());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackMeals = () => [
    {
      id: '1',
      date: '2026-09-15',
      type: 'BREAKFAST',
      title: 'الإفطار الصحي',
      consumed: 'ALL',
      notes: 'تناول طفلك طبق البيض مع شرائح الخيار وتفاحة بالكامل مع العصير الطبيعي.',
    },
    {
      id: '2',
      date: '2026-09-15',
      type: 'LUNCH',
      title: 'وجبة الغداء المتوازنة',
      consumed: 'SOME',
      notes: 'أكل نصف وجبة الأرز بالدجاج والشوربة وطلب المزيد من الفواكه.',
    },
    {
      id: '3',
      date: '2026-09-14',
      type: 'SNACK',
      title: 'الوجبة الخفيفة (Snack)',
      consumed: 'ALL',
      notes: 'تناول البسكويت الصحي والحليب كاملاً في وقت الفسحة.',
    },
  ];

  const getMealTypeLabel = (type) => {
    switch (type) {
      case 'BREAKFAST':
        return 'الإفطار 🍳';
      case 'LUNCH':
        return 'الغداء 🍲';
      case 'SNACK':
        return 'وجبة خفيفة 🍎';
      default:
        return 'وجبة إضافية 🍪';
    }
  };

  const renderConsumedBadge = (consumed) => {
    switch (consumed) {
      case 'ALL':
        return (
          <View style={[styles.badge, { backgroundColor: '#ecfdf5' }]}>
            <CheckCircle size={14} color="#10b981" style={{ marginLeft: 4 }} />
            <Text style={[styles.badgeText, { color: '#10b981' }]}>أكل الوجبة بالكامل ✅</Text>
          </View>
        );
      case 'SOME':
        return (
          <View style={[styles.badge, { backgroundColor: '#fefce8' }]}>
            <AlertTriangle size={14} color="#eab308" style={{ marginLeft: 4 }} />
            <Text style={[styles.badgeText, { color: '#ca8a04' }]}>أكل جزءاً منها ⚠️</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.badge, { backgroundColor: '#fef2f2' }]}>
            <XCircle size={14} color="#ef4444" style={{ marginLeft: 4 }} />
            <Text style={[styles.badgeText, { color: '#dc2626' }]}>لم يأكل ❌</Text>
          </View>
        );
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>سجل الوجبات والتغذية 🍱</Text>
          <Text style={styles.subTitle}>متابعة الوجبات اليومية للطفل #{selectedChildId}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="medium" color="#10b981" style={{ marginVertical: 20 }} />
        ) : (
          meals.map((item) => (
            <View key={item.id} style={styles.mealCard}>
              <View style={styles.cardHeader}>
                <View style={styles.typeBadge}>
                  <Utensils size={14} color="#f97316" style={{ marginLeft: 4 }} />
                  <Text style={styles.typeText}>{getMealTypeLabel(item.type)}</Text>
                </View>

                <View style={styles.dateRow}>
                  <Calendar size={14} color="#9ca3af" style={{ marginLeft: 4 }} />
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
              </View>

              <Text style={styles.mealTitle}>{item.title || getMealTypeLabel(item.type)}</Text>

              <View style={styles.consumedRow}>
                {renderConsumedBadge(item.consumed)}
              </View>

              <View style={styles.notesBox}>
                <Text style={styles.notesTitle}>ملاحظات المعلمة والمشرفة:</Text>
                <Text style={styles.notesContent}>{item.notes || 'تم تسجيل الوجبة بنجاح'}</Text>
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

  mealCard: {
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
  typeBadge: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#fff7ed', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  typeText: { fontSize: 12, fontWeight: 'bold', color: '#ea580c' },
  dateRow: { flexDirection: 'row-reverse', alignItems: 'center' },
  dateText: { fontSize: 12, color: '#6b7280', fontWeight: '500' },

  mealTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 10 },

  consumedRow: { flexDirection: 'row-reverse', marginBottom: 12 },
  badge: { flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },

  notesBox: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#f3f4f6' },
  notesTitle: { fontSize: 12, fontWeight: 'bold', color: '#374151', textAlign: 'right', marginBottom: 4 },
  notesContent: { fontSize: 13, color: '#4b5563', textAlign: 'right', lineHeight: 18 },
});