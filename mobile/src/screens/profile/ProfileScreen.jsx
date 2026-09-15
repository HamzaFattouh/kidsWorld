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
  ShieldCheck,
  KeyRound,
  LogOut,
  ChevronLeft,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useAuthStore } from '../../store/authStore';

export function ProfileScreen() {
  const { user, role, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const roleText =
    role === 'ADMIN'
      ? 'مشرف النظام (Admin)'
      : role === 'TEACHER'
      ? 'معلم (Teacher)'
      : 'ولي أمر (Parent)';

  const roleColor =
    role === 'ADMIN' ? '#8b5cf6' : role === 'TEACHER' ? '#3b82f6' : '#10b981';

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={[styles.avatarCircle, { backgroundColor: roleColor }]}>
            <User size={40} color="#ffffff" />
          </View>
          <Text style={styles.userName}>
            {user ? `${user.firstName || ''} ${user.lastName || ''}` : 'مستخدم عالم الأطفال'}
          </Text>
          <View style={[styles.roleBadge, { backgroundColor: `${roleColor}20` }]}>
            <ShieldCheck size={14} color={roleColor} style={{ marginLeft: 4 }} />
            <Text style={[styles.roleText, { color: roleColor }]}>{roleText}</Text>
          </View>
        </View>

        {/* User Info Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>معلومات الحساب 👤</Text>

          <View style={styles.infoItem}>
            <View style={styles.infoRight}>
              <Mail size={18} color="#6b7280" style={{ marginLeft: 10 }} />
              <Text style={styles.infoLabel}>البريد الإلكتروني</Text>
            </View>
            <Text style={styles.infoValue}>{user?.email || 'parent@kidsworld.com'}</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoRight}>
              <Phone size={18} color="#6b7280" style={{ marginLeft: 10 }} />
              <Text style={styles.infoLabel}>رقم الهاتف</Text>
            </View>
            <Text style={styles.infoValue}>{user?.phone || '+966 50 123 4567'}</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoRight}>
              <ShieldCheck size={18} color="#6b7280" style={{ marginLeft: 10 }} />
              <Text style={styles.infoLabel}>العنوان الفرعي</Text>
            </View>
            <Text style={styles.infoValue}>نابلس- نابلس الجديدة 📍</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoRight}>
              <ShieldCheck size={18} color="#6b7280" style={{ marginLeft: 10 }} />
              <Text style={styles.infoLabel}>معرف الحساب</Text>
            </View>
            <Text style={styles.infoValue}>#{user?.id || 'KW-9921'}</Text>
          </View>
        </View>

        {/* Security & Password */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>الأمان والخصوصية 🔑</Text>

          <TouchableOpacity
            style={styles.actionRow}
            activeOpacity={0.7}
            onPress={() => Alert.alert('تغيير كلمة المرور', 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.')}
          >
            <View style={styles.actionRight}>
              <KeyRound size={18} color="#4b5563" style={{ marginLeft: 10 }} />
              <Text style={styles.actionText}>تغيير كلمة المرور</Text>
            </View>
            <ChevronLeft size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8} onPress={handleLogout}>
          <LogOut size={20} color="#ffffff" style={{ marginLeft: 8 }} />
          <Text style={styles.logoutBtnText}>تسجيل الخروج</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 6 },
  roleBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: { fontSize: 12, fontWeight: 'bold' },

  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 12 },

  infoItem: {
    flexDirection: 'row-reverse',
    justify: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoRight: { flexDirection: 'row-reverse', alignItems: 'center' },
  infoLabel: { fontSize: 13, color: '#6b7280' },
  infoValue: { fontSize: 13, fontWeight: 'bold', color: '#111827' },

  actionRow: {
    flexDirection: 'row-reverse',
    justify: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionRight: { flexDirection: 'row-reverse', alignItems: 'center' },
  actionText: { fontSize: 14, fontWeight: '600', color: '#374151' },

  logoutBtn: {
    flexDirection: 'row-reverse',
    justify: 'center',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    height: 50,
    borderRadius: 12,
    marginTop: 8,
  },
  logoutBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});
