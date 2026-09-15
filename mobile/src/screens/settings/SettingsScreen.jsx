import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {
  Sun,
  Moon,
  Globe,
  Bell,
  Shield,
  Smartphone,
  Check,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useThemeStore, getActiveTheme } from '../../store/themeStore';
import { useTranslation } from 'react-i18next';

export function SettingsScreen() {
  const { theme, setTheme } = useThemeStore();
  const activeTheme = getActiveTheme(theme);
  const { i18n } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const currentLang = i18n.language || 'ar';

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        
        <Text style={styles.pageTitle}>الإعدادات ⚙️</Text>
        <Text style={styles.pageSub}>خصص تجربة استخدام التطبيق حسب تفضيلاتك.</Text>

        {/* Theme Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>المظهر والثيم 🎨</Text>
          
          <TouchableOpacity
            style={[styles.rowItem, theme === 'light' && styles.activeRow]}
            onPress={() => setTheme('light')}
          >
            <View style={styles.rowRight}>
              <Sun size={20} color="#f59e0b" style={{ marginLeft: 10 }} />
              <Text style={styles.rowText}>المظهر الفاتح (Light Mode)</Text>
            </View>
            {theme === 'light' && <Check size={18} color="#10b981" />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rowItem, theme === 'dark' && styles.activeRow]}
            onPress={() => setTheme('dark')}
          >
            <View style={styles.rowRight}>
              <Moon size={20} color="#8b5cf6" style={{ marginLeft: 10 }} />
              <Text style={styles.rowText}>المظهر الداكن (Dark Mode)</Text>
            </View>
            {theme === 'dark' && <Check size={18} color="#10b981" />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rowItem, theme === 'system' && styles.activeRow]}
            onPress={() => setTheme('system')}
          >
            <View style={styles.rowRight}>
              <Smartphone size={20} color="#3b82f6" style={{ marginLeft: 10 }} />
              <Text style={styles.rowText}>تلقائي حسب نظام الجهاز</Text>
            </View>
            {theme === 'system' && <Check size={18} color="#10b981" />}
          </TouchableOpacity>
        </View>

        {/* Language Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>اللغة (Language) 🌐</Text>

          <TouchableOpacity
            style={[styles.rowItem, currentLang === 'ar' && styles.activeRow]}
            onPress={() => handleLanguageChange('ar')}
          >
            <View style={styles.rowRight}>
              <Globe size={20} color="#10b981" style={{ marginLeft: 10 }} />
              <Text style={styles.rowText}>العربية (Arabic)</Text>
            </View>
            {currentLang === 'ar' && <Check size={18} color="#10b981" />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rowItem, currentLang === 'en' && styles.activeRow]}
            onPress={() => handleLanguageChange('en')}
          >
            <View style={styles.rowRight}>
              <Globe size={20} color="#3b82f6" style={{ marginLeft: 10 }} />
              <Text style={styles.rowText}>English (الانجليزية)</Text>
            </View>
            {currentLang === 'en' && <Check size={18} color="#10b981" />}
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>الإشعارات والتنبيهات 🔔</Text>

          <View style={styles.rowItem}>
            <View style={styles.rowRight}>
              <Bell size={20} color="#f97316" style={{ marginLeft: 10 }} />
              <Text style={styles.rowText}>إشعارات الحضور والوجبات الفورية</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#d1d5db', true: '#a7f3d0' }}
              thumbColor={notificationsEnabled ? '#10b981' : '#9ca3af'}
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>عن التطبيق ℹ️</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>إصدار التطبيق</Text>
            <Text style={styles.infoVal}>v1.0.0 (Build 2026)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>الحالة والحماية</Text>
            <Text style={styles.infoVal}>مشفر ومحمي 🔒</Text>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 4 },
  pageSub: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginBottom: 20 },

  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#111827', textAlign: 'right', marginBottom: 12 },

  rowItem: {
    flexDirection: 'row-reverse',
    justify: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  activeRow: { backgroundColor: '#f0fdf4' },
  rowRight: { flexDirection: 'row-reverse', alignItems: 'center' },
  rowText: { fontSize: 14, fontWeight: '600', color: '#374151' },

  infoRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: { fontSize: 13, color: '#6b7280' },
  infoVal: { fontSize: 13, fontWeight: 'bold', color: '#111827' },
});
