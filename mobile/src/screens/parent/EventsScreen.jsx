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
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  ChevronLeft,
  Sparkles,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function EventsScreen() {
  const [events, setEvents] = useState([
    {
      id: '1',
      day: '15',
      month: 'أكتوبر',
      title: 'يوم الصحة والتغذية السليمة',
      time: '09:00 ص - 12:00 م',
      location: 'الساحة المركزية لروضة عالم الأطفال',
      target: 'الأطفال وأولياء الأمور',
      desc: 'إعداد وجبات صحية مشتركة لتعليم الأطفال أهمية الغذاء الطازج والمتوازن.',
      attending: true,
    },
    {
      id: '2',
      day: '22',
      month: 'أكتوبر',
      title: 'اللقاء الفصلي المفتوح مع الكادر التعليمي',
      time: '03:00 م - 05:00 م',
      location: 'قاعة الندوات الرئيسية',
      target: 'أولياء الأمور والمعلمات',
      desc: 'فرصة مباشرة للاطلاع على ملفات تطور المهارات ومناقشة احتياجات الأطفال الفردية.',
      attending: false,
    },
    {
      id: '3',
      day: '05',
      month: 'نوفمبر',
      title: 'الرحلة الخريفية السنوية: استكشاف الطبيعة',
      time: '08:30 ص - 01:30 م',
      location: 'حديقة نابلس العامة والمحمية الطبيعية',
      target: 'جميع صفوف الروضة',
      desc: 'نشاط ترفيهي واستكشافي في الهواء الطلق يشمل ألعاب حركية ومسابقات شيقة.',
      attending: true,
    },
  ]);

  const toggleAttending = (id) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === id) {
          const nextState = !ev.attending;
          Alert.alert(
            'تأكيد الحضور',
            nextState
              ? `تم تأكيد حضورك لفعالية (${ev.title}) بنجاح.`
              : `تم تسجيل اعتذارك عن فعالية (${ev.title}).`
          );
          return { ...ev, attending: nextState };
        }
        return ev;
      })
    );
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>الفعاليات والأنشطة القادمة</Text>
          <Text style={styles.subtitle}>جدول المواعيد والمناسبات التفاعلية لروضة عالم الأطفال</Text>
        </View>

        {events.map((ev) => (
          <View key={ev.id} style={styles.eventCard}>
            <View style={styles.topRow}>
              <View style={styles.dateBox}>
                <Text style={styles.dateDay}>{ev.day}</Text>
                <Text style={styles.dateMonth}>{ev.month}</Text>
              </View>

              <View style={styles.titleCol}>
                <View style={styles.targetBadge}>
                  <Text style={styles.targetText}>{ev.target}</Text>
                </View>
                <Text style={styles.eventTitle}>{ev.title}</Text>
              </View>
            </View>

            <Text style={styles.eventDesc}>{ev.desc}</Text>

            <View style={styles.infoMeta}>
              <View style={styles.metaItem}>
                <Clock size={13} color="#6b7280" />
                <Text style={styles.metaText}>{ev.time}</Text>
              </View>
              <View style={styles.metaItem}>
                <MapPin size={13} color="#6b7280" />
                <Text style={styles.metaText}>{ev.location}</Text>
              </View>
            </View>

            {/* RSVP Button */}
            <View style={styles.cardFooter}>
              <TouchableOpacity
                testID={`event-rsvp-btn-${ev.id}`}
                style={[
                  styles.rsvpBtn,
                  ev.attending ? styles.rsvpAttending : styles.rsvpNotAttending,
                ]}
                onPress={() => toggleAttending(ev.id)}
              >
                <CheckCircle2 size={16} color={ev.attending ? '#059669' : '#6b7280'} />
                <Text
                  style={[
                    styles.rsvpText,
                    ev.attending ? styles.rsvpTextAttending : styles.rsvpTextNotAttending,
                  ]}
                >
                  {ev.attending ? 'مؤكد الحضور' : 'تأكيد الحضور مع طفلي'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  header: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  subtitle: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 2 },

  eventCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginBottom: 10,
  },
  dateBox: {
    width: 56,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  dateMonth: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#065f46',
  },
  titleCol: {
    flex: 1,
  },
  targetBadge: {
    alignSelf: 'flex-end',
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  targetText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },

  eventDesc: {
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'right',
    lineHeight: 18,
    marginBottom: 12,
  },

  infoMeta: {
    flexDirection: 'row-reverse',
    gap: 14,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  metaItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#6b7280',
  },

  cardFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
  },
  rsvpBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  rsvpAttending: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  rsvpNotAttending: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  rsvpText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  rsvpTextAttending: {
    color: '#059669',
  },
  rsvpTextNotAttending: {
    color: '#6b7280',
  },
});
