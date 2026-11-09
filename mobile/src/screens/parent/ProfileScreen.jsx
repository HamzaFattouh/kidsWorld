import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  ShieldCheck,
  LogOut,
  UserCheck,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useAuthStore } from '../../store/authStore';

export function ProfileScreen() {
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من رغبتك في تسجيل الخروج من حساب ولي الأمر؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'خروج',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Parent Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <User size={36} color="#059669" />
          </View>
          <Text style={styles.parentName}>{user?.name || 'أحمد الشكعة'}</Text>
          <Text style={styles.parentSub}>ولي أمر مسجل ومعتمد</Text>
        </View>

        {/* Contact Info Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>بيانات الاتصال والعنوان</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>{user?.email || 'parent.ahmad@example.com'}</Text>
            <View style={styles.infoKeyRow}>
              <Mail size={16} color="#6b7280" />
              <Text style={styles.infoLabel}>البريد الإلكتروني:</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>0599123456</Text>
            <View style={styles.infoKeyRow}>
              <Phone size={16} color="#6b7280" />
              <Text style={styles.infoLabel}>رقم الجوال:</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoValue}>نابلس - رفيديا، بالقرب من المستشفى التخصصي</Text>
            <View style={styles.infoKeyRow}>
              <MapPin size={16} color="#6b7280" />
              <Text style={styles.infoLabel}>العنوان السكني:</Text>
            </View>
          </View>
        </View>

        {/* Enrolled Children Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>الأطفال المسجلون في الروضة</Text>

          <View style={styles.childBox}>
            <View style={styles.childAvatar}>
              <Text style={styles.childAvatarText}>ع</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.childName}>عمر أحمد الشكعة</Text>
              <Text style={styles.childClass}>روضة العصافير (KG1) • المعلمة: أ. نور</Text>
            </View>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>منتظم</Text>
            </View>
          </View>

          <View style={[styles.childBox, { marginTop: 8 }]}>
            <View style={[styles.childAvatar, { backgroundColor: '#fdf2f8' }]}>
              <Text style={[styles.childAvatarText, { color: '#db2777' }]}>ل</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.childName}>ليان أحمد الشكعة</Text>
              <Text style={styles.childClass}>روضة الأمل (حضانة) • المعلمة: أ. منى</Text>
            </View>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>منتظمة</Text>
            </View>
          </View>
        </View>

        {/* Pickup Authorization */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>المخولون بالاستلام والتوصيل</Text>
          <View style={styles.pickupRow}>
            <UserCheck size={16} color="#059669" />
            <Text style={styles.pickupName}>أحمد الشكعة (الأب) - 0599123456</Text>
          </View>
          <View style={styles.pickupRow}>
            <UserCheck size={16} color="#059669" />
            <Text style={styles.pickupName}>هبة العمد (الأم) - 0599123450</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#dc2626" />
          <Text style={styles.logoutText}>تسجيل الخروج من الحساب</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  profileCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  parentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  parentSub: {
    fontSize: 12,
    color: '#059669',
    marginTop: 4,
    fontWeight: 'bold',
  },

  sectionCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoKeyRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },

  childBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  childAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  childName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  childClass: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 2,
  },
  activePill: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  activePillText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
  },

  pickupRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  pickupName: {
    fontSize: 12,
    color: '#374151',
  },

  logoutBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginTop: 6,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
  },
});
