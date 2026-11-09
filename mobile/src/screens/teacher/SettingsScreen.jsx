import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {
  Globe,
  Moon,
  Bell,
  Shield,
  HelpCircle,
  ChevronLeft,
  Check,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useThemeStore } from '../../store/themeStore';

export function SettingsScreen() {
  const { theme, setTheme } = useThemeStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentLang, setCurrentLang] = useState('ar');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLangSelect = (lang) => {
    setCurrentLang(lang);
    Alert.alert('اللغة', lang === 'ar' ? 'تم اختيار اللغة العربية' : 'English selected');
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>إعدادات التطبيق</Text>
          <Text style={styles.subtitle}>تخصيص تفضيلات الحساب والمظهر والإشعارات</Text>
        </View>

        {/* Appearance & Language */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>المظهر واللغة</Text>

          <View style={styles.row}>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#e5e7eb', true: '#a7f3d0' }}
              thumbColor={theme === 'dark' ? '#059669' : '#ffffff'}
            />
            <View style={styles.rowLabelGroup}>
              <Moon size={18} color="#6b7280" />
              <View>
                <Text style={styles.rowTitle}>الوضع الليلي (Dark Mode)</Text>
                <Text style={styles.rowSub}>تفعيل المظهر الداكن لراحة العين</Text>
              </View>
            </View>
          </View>

          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <View style={styles.langSelector}>
              <TouchableOpacity
                style={[styles.langChip, currentLang === 'ar' && styles.langChipActive]}
                onPress={() => handleLangSelect('ar')}
              >
                <Text style={[styles.langText, currentLang === 'ar' && styles.langTextActive]}>
                  العربية
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="lang-chip-en"
                style={[styles.langChip, currentLang === 'en' && styles.langChipActive]}
                onPress={() => handleLangSelect('en')}
              >
                <Text style={[styles.langText, currentLang === 'en' && styles.langTextActive]}>
                  English
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rowLabelGroup}>
              <Globe size={18} color="#6b7280" />
              <View>
                <Text style={styles.rowTitle}>لغة التطبيق</Text>
                <Text style={styles.rowSub}>العربية كلغة افتراضية</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>التنبيهات الفورية</Text>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e5e7eb', true: '#a7f3d0' }}
              thumbColor={notificationsEnabled ? '#059669' : '#ffffff'}
            />
            <View style={styles.rowLabelGroup}>
              <Bell size={18} color="#6b7280" />
              <View>
                <Text style={styles.rowTitle}>استلام إشعارات الأنشطة والرسائل</Text>
                <Text style={styles.rowSub}>إشعارات فورية عند استلام استفسار أو تنبيه طبي</Text>
              </View>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>حول النظام</Text>
          <View style={styles.row}>
            <Text style={styles.appVersion}>الإصدار 2.4.0</Text>
            <View style={styles.rowLabelGroup}>
              <Shield size={18} color="#6b7280" />
              <Text style={styles.rowTitle}>تطبيق روضة عالم الأطفال (KidsWorld)</Text>
            </View>
          </View>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.appVersion}>آمن ومشفر</Text>
            <View style={styles.rowLabelGroup}>
              <HelpCircle size={18} color="#6b7280" />
              <Text style={styles.rowTitle}>سياسة الخصوصية وحماية بيانات الأطفال</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  header: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  subtitle: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 2 },

  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  rowLabelGroup: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  rowSub: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 2,
  },

  langSelector: {
    flexDirection: 'row-reverse',
    gap: 6,
  },
  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  langChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  langText: {
    fontSize: 12,
    color: '#4b5563',
  },
  langTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  appVersion: {
    fontSize: 12,
    color: '#059669',
    fontWeight: 'bold',
  },
});
