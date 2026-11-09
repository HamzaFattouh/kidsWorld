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
  GraduationCap,
  Calendar,
  ShieldCheck,
  LogOut,
  Award,
  ChevronLeft,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useAuthStore } from '../../store/authStore';

export function ProfileScreen() {
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنتِ متأكدة من رغبتك في تسجيل الخروج من حساب المعلمة؟',
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
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <User size={36} color="#059669" />
          </View>
          <Text style={styles.name}>{user?.name || 'أ. نور عبد الرحمن'}</Text>
          <Text style={styles.roleTitle}>معلمة مرحلة الروضة الأولى (KG1)</Text>
          <View style={styles.classTag}>
            <Text style={styles.classTagText}>الصف المخصص: روضة العصافير</Text>
          </View>
        </View>

        {/* Info Rows */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>البيانات الشخصية والمهنية</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.infoValue}>{user?.email || 'nour.teacher@kidsworld.ps'}</Text>
            </View>
            <View style={styles.infoRight}>
              <Mail size={16} color="#6b7280" />
              <Text style={styles.infoLabel}>البريد الإلكتروني:</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.infoValue}>0599112244</Text>
            </View>
            <View style={styles.infoRight}>
              <Phone size={16} color="#6b7280" />
              <Text style={styles.infoLabel}>رقم التواصل:</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Text style={styles.infoValue}>بكالوريوس تربية طفل - جامعة النجاح</Text>
            </View>
            <View style={styles.infoRight}>
              <GraduationCap size={16} color="#6b7280" />
              <Text style={styles.infoLabel}>المؤهل العلمي:</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <View style={styles.infoLeft}>
              <Text style={styles.infoValue}>1 سبتمبر 2024</Text>
            </View>
            <View style={styles.infoRight}>
              <Calendar size={16} color="#6b7280" />
              <Text style={styles.infoLabel}>تاريخ الانضمام:</Text>
            </View>
          </View>
        </View>

        {/* Security & Credentials */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>الأمان والاعتماد</Text>
          <View style={styles.infoRow}>
            <View style={styles.badgeSuccess}>
              <ShieldCheck size={14} color="#059669" />
              <Text style={styles.badgeSuccessText}>مفعل ومعتمد</Text>
            </View>
            <Text style={styles.infoLabel}>حالة الحساب في النظام:</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoValue}>صلاحيات كاملة لإدارة الصف والطلاب</Text>
            <Text style={styles.infoLabel}>مستوى الصلاحية:</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity testID="teacher-logout-btn" style={styles.logoutBtn} onPress={handleLogout}>
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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  roleTitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  classTag: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 10,
  },
  classTagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
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
  infoRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  badgeSuccess: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  badgeSuccessText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
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
