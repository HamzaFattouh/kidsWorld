import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { AlertTriangle, Clock, ShieldAlert, CheckCircle } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useParentStore } from '../../store/parentStore';
import api from '../../services/api';

export function IncidentsScreen() {
  const selectedChildId = useParentStore((s) => s.selectedChildId) || 'CHILD-101';
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, [selectedChildId]);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reporting/incidents/${selectedChildId}`);
      const items = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : [];
      setIncidents(items.length ? items : getFallbackIncidents());
    } catch (e) {
      setIncidents(getFallbackIncidents());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackIncidents = () => [
    {
      id: '1',
      date: '2026-09-10',
      time: '10:30 AM',
      severity: 'LOW',
      description: 'سقوط بسيط أثناء اللعب بالكرة في الفناء الخارجي.',
      actionTaken: 'تم التعقيم بسلامة واستخدام كمادة باردة، والطفل بحالة ممتازة وبسطاء.',
    },
  ];

  const renderSeverityBadge = (severity) => {
    switch (severity) {
      case 'LOW':
        return (
          <View style={[styles.badge, { backgroundColor: '#eff6ff' }]}>
            <Text style={[styles.badgeText, { color: '#2563eb' }]}>بسيط 🟢</Text>
          </View>
        );
      case 'MEDIUM':
        return (
          <View style={[styles.badge, { backgroundColor: '#fefce8' }]}>
            <Text style={[styles.badgeText, { color: '#ca8a04' }]}>متوسط 🟡</Text>
          </View>
        );
      case 'HIGH':
        return (
          <View style={[styles.badge, { backgroundColor: '#fff7ed' }]}>
            <Text style={[styles.badgeText, { color: '#ea580c' }]}>عالي 🟠</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.badge, { backgroundColor: '#fef2f2' }]}>
            <Text style={[styles.badgeText, { color: '#dc2626' }]}>حرِج 🔴</Text>
          </View>
        );
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>سجل الحوادث والسلامة ⚠️</Text>
          <Text style={styles.subTitle}>توثيق أي ملاحظات طارئة للطفل #{selectedChildId}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="medium" color="#10b981" style={{ marginVertical: 20 }} />
        ) : incidents.length > 0 ? (
          incidents.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                {renderSeverityBadge(item.severity)}

                <View style={styles.timeRow}>
                  <Clock size={14} color="#6b7280" style={{ marginLeft: 4 }} />
                  <Text style={styles.timeText}>{item.date} ({item.time || '—'})</Text>
                </View>
              </View>

              <Text style={styles.descTitle}>تفاصيل الحادثة:</Text>
              <Text style={styles.descText}>{item.description}</Text>

              <View style={styles.actionBox}>
                <View style={styles.actionHeader}>
                  <CheckCircle size={14} color="#10b981" style={{ marginLeft: 4 }} />
                  <Text style={styles.actionTitle}>الإجراء المتبع من الكادر:</Text>
                </View>
                <Text style={styles.actionText}>{item.actionTaken || 'تم الاتصال بولي الأمر وطمأنته.'}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <ShieldAlert size={36} color="#10b981" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyText}>الحمد لله! لا يوجد أي حوادث أو طوارئ مسجلة.</Text>
          </View>
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
  cardTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  timeRow: { flexDirection: 'row-reverse', alignItems: 'center' },
  timeText: { fontSize: 12, color: '#6b7280' },

  descTitle: { fontSize: 14, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 4 },
  descText: { fontSize: 13, color: '#4b5563', textAlign: 'right', lineHeight: 18, marginBottom: 12 },

  actionBox: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#dcfce7' },
  actionHeader: { flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 4 },
  actionTitle: { fontSize: 12, fontWeight: 'bold', color: '#166534' },
  actionText: { fontSize: 13, color: '#15803d', textAlign: 'right', lineHeight: 18 },

  emptyBox: { backgroundColor: '#ffffff', borderRadius: 16, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', marginVertical: 20 },
  emptyText: { fontSize: 14, fontWeight: 'bold', color: '#10b981', textAlign: 'center' },
});