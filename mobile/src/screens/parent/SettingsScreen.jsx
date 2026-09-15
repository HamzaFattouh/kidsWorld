import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Settings, MapPin, Bell, Globe, Lock, ShieldCheck, LogOut } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useAuthStore } from '../../store/authStore';

export function SettingsScreen() {
  const { user, logout } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>إعدادات التطبيق والحساب ⚙️</Text>
          <Text style={styles.subTitle}>إدارة التنبيهات والصلاحيات والمعلومات العامة</Text>
        </View>

        {/* Location & Address Banner */}
        <View style={styles.addressCard}>
          <MapPin size={24} color="#0284c7" style={{ marginLeft: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.addressTitle}>عنوان الروضة والفرع الرئيسي</Text>
            <Text style={styles.addressVal}>نابلس- نابلس الجديدة</Text>
          </View>
        </View>

        {/* User Info & Permissions */}
        <Text style={styles.sectionHeader}>معلومات الحساب والصلاحيات 👤</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.valText}>{user?.name || user?.email || 'مستخدم مسجل'}</Text>
            <Text style={styles.lblText}>الاسم الحساب</Text>
          </View>
          <View style={styles.row}>
            <View style={styles.badge}>
              <ShieldCheck size={14} color="#15803d" style={{ marginLeft: 4 }} />
              <Text style={styles.badgeText}>حساب موثق ✅</Text>
            </View>
            <Text style={styles.lblText}>حالة الحساب</Text>
          </View>
        </View>

        {/* Preferences */}
        <Text style={styles.sectionHeader}>تفضيلات التنبيهات والإشعارات 🔔</Text>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#cbd5e1', true: '#38bdf8' }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>إشعارات التطبيق الفورية (Push)</Text>
              <Text style={styles.switchSub}>تنبيهات الحضور، الوجبات، والملاحظات</Text>
            </View>
          </View>

          <View style={[styles.switchRow, { borderBottomWidth: 0 }]}>
            <Switch
              value={emailAlerts}
              onValueChange={setEmailAlerts}
              trackColor={{ false: '#cbd5e1', true: '#38bdf8' }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>التقارير البريدية الأسبوعية</Text>
              <Text style={styles.switchSub}>إرسال ملخص تقييم الطفل بريدياً</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert('تسجيل الخروج', 'هل أنت تأكد من الخروج من حسابك؟', [
              { text: 'إلغاء', style: 'cancel' },
              { text: 'خروج', style: 'destructive', onPress: logout },
            ]);
          }}
        >
          <LogOut size={18} color="#ef4444" style={{ marginLeft: 8 }} />
          <Text style={styles.logoutText}>تسجيل الخروج من التطبيق</Text>
        </TouchableOpacity>

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

  addressCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  addressTitle: { fontSize: 12, fontWeight: 'bold', color: '#0369a1', textAlign: 'right' },
  addressVal: { fontSize: 16, fontWeight: 'bold', color: '#0c4a6e', textAlign: 'right', marginTop: 2 },

  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 12 },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  row: {
    flexDirection: 'row-reverse',
    justify: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lblText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  valText: { fontSize: 14, fontWeight: 'bold', color: '#1f2937' },
  badge: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: '#166534' },

  switchRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  switchTitle: { fontSize: 14, fontWeight: 'bold', color: '#1f2937', textAlign: 'right' },
  switchSub: { fontSize: 12, color: '#6b7280', textAlign: 'right', marginTop: 2 },

  logoutBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    marginTop: 8,
  },
  logoutText: { fontSize: 15, fontWeight: 'bold', color: '#dc2626' },
});