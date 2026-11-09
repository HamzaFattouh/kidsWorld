import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Bell,
  CheckCircle2,
  Utensils,
  AlertCircle,
  Clock,
  Trash2,
  CheckCheck,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function NotificationsScreen() {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'medical',
      title: 'تنبيه طبي: بخاخ الربو',
      body: 'تذكير: يرجى فحص حقيبة عمر الشكعة والتأكد من وجود بخاخ الربو قبل حصة التربية الرياضية.',
      time: 'منذ 20 دقيقة',
      read: false,
    },
    {
      id: '2',
      type: 'meals',
      title: 'اكتمال تسجيل وجبة الإفطار',
      body: 'تم تسجيل وجبة الإفطار لجميع طلاب روضة العصافير بنجاح.',
      time: 'منذ ساعتين',
      read: false,
    },
    {
      id: '3',
      type: 'attendance',
      title: 'حضور الأطفال لليوم',
      body: 'تم تسجيل 16 طفلاً حاضراً وطفلين غائبين في كشف الصباح.',
      time: 'منذ 3 ساعات',
      read: true,
    },
    {
      id: '4',
      type: 'admin',
      title: 'اجتماع الهيئة التدريسية',
      body: 'تذكير باجتماع الكادر التدريسي الأسبوعي يوم الخميس القادم الساعة 02:00 ظهراً.',
      time: 'أمس',
      read: true,
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    Alert.alert('تم التحديث', 'تم تحديد جميع الإشعارات كمقروءة.');
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'medical':
        return <AlertCircle size={20} color="#dc2626" />;
      case 'meals':
        return <Utensils size={20} color="#d97706" />;
      case 'attendance':
        return <CheckCircle2 size={20} color="#059669" />;
      default:
        return <Bell size={20} color="#2563eb" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>الإشعارات والتنبيهات</Text>
            <Text style={styles.subtitle}>
              لديك {unreadCount} إشعار غير مقروء
            </Text>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity style={styles.markReadBtn} onPress={markAllRead}>
              <CheckCheck size={16} color="#059669" />
              <Text style={styles.markReadText}>قراءة الكل</Text>
            </TouchableOpacity>
          )}
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyBox}>
            <Bell size={40} color="#9ca3af" />
            <Text style={styles.emptyTitle}>لا توجد إشعارات حالياً</Text>
            <Text style={styles.emptySub}>سيتم تنبيهك فور ورود أي مستجدات للصف أو الإدارة</Text>
          </View>
        ) : (
          notifications.map((item) => (
            <View
              key={item.id}
              style={[
                styles.notifCard,
                !item.read && styles.notifCardUnread,
              ]}
            >
              <View style={styles.iconCol}>{getIcon(item.type)}</View>

              <View style={styles.contentCol}>
                <View style={styles.topRow}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  <Text style={styles.notifTime}>{item.time}</Text>
                </View>
                <Text style={styles.notifBody}>{item.body}</Text>
              </View>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteNotification(item.id)}
              >
                <Trash2 size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  subtitle: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 2 },
  markReadBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
  },

  notifCard: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  notifCardUnread: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  iconCol: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCol: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  notifTime: {
    fontSize: 11,
    color: '#9ca3af',
  },
  notifBody: {
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'right',
    lineHeight: 18,
  },
  deleteBtn: {
    padding: 4,
  },

  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
