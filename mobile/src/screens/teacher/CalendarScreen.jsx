import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function CalendarScreen() {
  const [selectedMonth, setSelectedMonth] = useState('أكتوبر 2026');

  const [events] = useState([
    {
      id: '1',
      day: '15',
      month: 'أكتوبر',
      title: 'يوم الصحة والتغذية السليمة',
      time: '09:00 ص - 12:00 م',
      location: 'الساحة الرئيسية للروضة',
      type: 'نشاط صفي',
      desc: 'إعداد وجبات صحية بمشاركة الأطفال لتعلم أهمية الخضار والفواكه الطازجة.',
    },
    {
      id: '2',
      day: '22',
      month: 'أكتوبر',
      title: 'اجتماع أولياء الأمور الفصلي',
      time: '03:00 م - 05:00 م',
      location: 'قاعة الاجتماعات المركزية',
      type: 'أولياء أمور',
      desc: 'مناقشة تطور الأطفال وتقارير المهارات والخطط التعليمية القادمة.',
    },
    {
      id: '3',
      day: '28',
      month: 'أكتوبر',
      title: 'عيد ميلاد الطالب عمر أحمد الشكعة',
      time: '11:00 ص - 12:00 م',
      location: 'قاعة روضة العصافير',
      type: 'احتفال صفي',
      desc: 'مشاركة الهدايا والحلوى الصحية مع زملاء الصف ومعلمتهم.',
    },
    {
      id: '4',
      day: '05',
      month: 'نوفمبر',
      title: 'رحلة استكشاف الطبيعة والحديقة النباتية',
      time: '08:30 ص - 01:30 م',
      location: 'حديقة نابلس العامة',
      type: 'رحلة خارجية',
      desc: 'نشاط ميداني في الهواء الطلق للتعرف على النباتات والأشجار.',
    },
  ]);

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>التقويم والفعاليات</Text>
          <Text style={styles.subtitle}>جدول الأنشطة والمناسبات الخاصة بالصف والروضة</Text>
        </View>

        {/* Month Selector Bar */}
        <View style={styles.monthBar}>
          <TouchableOpacity style={styles.navBtn}>
            <ChevronRight size={20} color="#374151" />
          </TouchableOpacity>
          <View style={styles.monthTextRow}>
            <CalendarIcon size={18} color="#059669" />
            <Text style={styles.monthTitle}>{selectedMonth}</Text>
          </View>
          <TouchableOpacity style={styles.navBtn}>
            <ChevronLeft size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Events List */}
        {events.map((ev) => (
          <View key={ev.id} style={styles.eventCard}>
            <View style={styles.dateCol}>
              <Text style={styles.dayNum}>{ev.day}</Text>
              <Text style={styles.monthName}>{ev.month}</Text>
            </View>

            <View style={styles.detailsCol}>
              <View style={styles.typeTag}>
                <Text style={styles.typeText}>{ev.type}</Text>
              </View>

              <Text style={styles.eventTitle}>{ev.title}</Text>
              <Text style={styles.eventDesc}>{ev.desc}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Clock size={12} color="#6b7280" />
                  <Text style={styles.metaText}>{ev.time}</Text>
                </View>
                <View style={styles.metaItem}>
                  <MapPin size={12} color="#6b7280" />
                  <Text style={styles.metaText}>{ev.location}</Text>
                </View>
              </View>
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

  monthBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  monthTextRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },
  navBtn: {
    padding: 6,
  },

  eventCard: {
    flexDirection: 'row-reverse',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  dateCol: {
    width: 60,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNum: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#059669',
  },
  monthName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#065f46',
    marginTop: 2,
  },
  detailsCol: {
    flex: 1,
  },
  typeTag: {
    alignSelf: 'flex-end',
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
    marginBottom: 4,
  },
  eventDesc: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    lineHeight: 18,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row-reverse',
    gap: 12,
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
});
