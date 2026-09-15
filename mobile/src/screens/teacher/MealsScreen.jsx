import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Utensils, CheckCircle2, Calendar, Bell, RefreshCw } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function MealsScreen() {
  const [activeTab, setActiveTab] = useState('checklist'); // 'checklist' | 'weekly_menu'
  const [selectedClass, setSelectedClass] = useState('class-birds-3-4');

  const classesList = [
    { id: 'class-birds-3-4', name: 'روضة العصافير' },
    { id: 'class-flowers-4-5', name: 'روضة الزهور' },
    { id: 'class-hope-2-3', name: 'روضة الأمل' },
  ];

  const [dailyMeals, setDailyMeals] = useState({
    'class-birds-3-4': [
      { id: '1', name: 'عمر أحمد الشكعة', parent: 'أحمد الشكعة', ate: true, time: '09:30 ص' },
      { id: '2', name: 'يوسف خالد جودت', parent: 'خالد جودت', ate: false, time: '—' },
      { id: '3', name: 'خليل سمير النابلسي', parent: 'سمير النابلسي', ate: true, time: '09:40 ص' },
    ],
    'class-flowers-4-5': [
      { id: '4', name: 'سارة مريم المصري', parent: 'مريم المصري', ate: true, time: '09:15 ص' },
    ],
    'class-hope-2-3': [
      { id: '5', name: 'ليان أحمد الشكعة', parent: 'أحمد الشكعة', ate: true, time: '09:20 ص' },
    ],
  });

  const weeklyMenu = [
    { day: 'الأحد', breakfast: 'جبنة بيضاء ومناقيش زعتر بلدي + خيار', lunch: 'أرز بدجاج ومكسرات وخضار مشكلة', snack: 'فواكه طازجة (تفاح وموز)' },
    { day: 'الإثنين', breakfast: 'بيض مسلوق وزيت وزعتر + حليب دافئ', lunch: 'صينية خضار بالفرن ومعكرونة', snack: 'بسكويت شوفان وعصير طازج' },
    { day: 'الثلاثاء', breakfast: 'لبنة بلدية وزيتون أسود وخُبز أسمر', lunch: 'شوربة عدس مغذية + كبسة دجاج', snack: 'برتقال وشرائح جزر' },
    { day: 'الأربعاء', breakfast: 'فول مدمس خفيف وجبنة شيدر', lunch: 'مقلوبة زهرة ودجاج مع لبن رائب', snack: 'سلطة فواكه مشكلة' },
    { day: 'الخميس', breakfast: 'فطائر سبانخ وجبنة + عصير برتقال', lunch: 'كفتة بالطحينية وأرز أبيض', snack: 'كيك بيتي بالفواكه' },
  ];

  const toggleMealCheck = (childId, childName, parentName) => {
    setDailyMeals((prev) => {
      const list = prev[selectedClass] || [];
      const updated = list.map((c) => {
        if (c.id === childId) {
          const newAte = !c.ate;
          if (newAte) {
            Alert.alert(
              'تم التنبيه 🔔',
              `تم إرسال إشعار فوري لولي الأمر (${parentName}): "الطفل ${childName} أكل وجبته اليومية بنجاح 🍏"`
            );
          }
          return {
            ...c,
            ate: newAte,
            time: newAte ? new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '—',
          };
        }
        return c;
      });
      return { ...prev, [selectedClass]: updated };
    });
  };

  const currentList = dailyMeals[selectedClass] || [];

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>إدارة التغذية والوجبات 🍏</Text>
          <Text style={styles.subTitle}>تسجيل الوجبات وتنبيه أولياء الأمور فكلياً وجدول الأسبوع</Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'checklist' && styles.activeTabBtn]}
            onPress={() => setActiveTab('checklist')}
          >
            <Text style={[styles.tabText, activeTab === 'checklist' && styles.activeTabText]}>
              كشف الوجبة اليومي 🍏
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'weekly_menu' && styles.activeTabBtn]}
            onPress={() => setActiveTab('weekly_menu')}
          >
            <Text style={[styles.tabText, activeTab === 'weekly_menu' && styles.activeTabText]}>
              جدول الوجبات الأسبوعي 📋
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'checklist' ? (
          <>
            {/* Class Selector Bar */}
            <Text style={styles.sectionHeader}>اختر الصف لمتابعة وجبات أطفاله 🏫</Text>
            <View style={styles.classChipsRow}>
              {classesList.map((cls) => {
                const isSelected = cls.id === selectedClass;
                return (
                  <TouchableOpacity
                    key={cls.id}
                    style={[styles.classChip, isSelected && styles.activeClassChip]}
                    onPress={() => setSelectedClass(cls.id)}
                  >
                    <Text style={[styles.classChipText, isSelected && styles.activeClassChipText]}>
                      {cls.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.sectionHeader}>كشف الوجبات وتنبيه أولياء الأمور 📋</Text>

            {currentList.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.card}
                onPress={() => toggleMealCheck(c.id, c.name, c.parent)}
                activeOpacity={0.7}
              >
                <View style={styles.cardInfo}>
                  <Text style={styles.childName}>{c.name}</Text>
                  <Text style={styles.parentName}>ولي الأمر: {c.parent}</Text>
                  <Text style={styles.timeText}>وقت التناول: {c.time}</Text>
                </View>

                {c.ate ? (
                  <View style={[styles.badge, { backgroundColor: '#ecfdf5' }]}>
                    <CheckCircle2 size={16} color="#10b981" style={{ marginLeft: 4 }} />
                    <Text style={[styles.badgeText, { color: '#15803d' }]}>أكل وجبته 🍏 (مُنبَّه)</Text>
                  </View>
                ) : (
                  <View style={[styles.badge, { backgroundColor: '#fefce8' }]}>
                    <Text style={[styles.badgeText, { color: '#a16207' }]}>لم يأكل بعد ⏳</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>جدول الوجبات الأسبوعي المعتمد 🥗</Text>
            {weeklyMenu.map((item, idx) => (
              <View key={idx} style={styles.menuCard}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayText}>{item.day}</Text>
                </View>
                <Text style={styles.menuLine}>🍳 الإفطار: {item.breakfast}</Text>
                <Text style={styles.menuLine}>🍲 الغداء: {item.lunch}</Text>
                <Text style={styles.menuLine}>🍎 السناك: {item.snack}</Text>
              </View>
            ))}
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

  tabRow: { flexDirection: 'row-reverse', backgroundColor: '#e2e8f0', borderRadius: 12, padding: 4, marginBottom: 20 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTabBtn: { backgroundColor: '#ffffff' },
  tabText: { fontSize: 12, fontWeight: 'bold', color: '#64748b' },
  activeTabText: { color: '#111827' },

  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#1f2937', textAlign: 'right', marginBottom: 10 },

  classChipsRow: { flexDirection: 'row-reverse', marginBottom: 20 },
  classChip: { backgroundColor: '#f3f4f6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 8 },
  activeClassChip: { backgroundColor: '#10b981' },
  classChipText: { fontSize: 13, fontWeight: 'bold', color: '#4b5563' },
  activeClassChipText: { color: '#ffffff' },

  card: {
    flexDirection: 'row-reverse',
    justify: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardInfo: { flex: 1 },
  childName: { fontSize: 15, fontWeight: 'bold', color: '#1f2937', textAlign: 'right' },
  parentName: { fontSize: 12, color: '#6b7280', textAlign: 'right', marginTop: 2 },
  timeText: { fontSize: 11, color: '#9ca3af', textAlign: 'right', marginTop: 2 },

  badge: { flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },

  menuContainer: { spaceBetween: 12 },
  menuTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937', textAlign: 'right', marginBottom: 12 },
  menuCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  dayBadge: { backgroundColor: '#eff6ff', alignSelf: 'flex-end', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginBottom: 8 },
  dayText: { fontSize: 13, fontWeight: 'bold', color: '#1d4ed8' },
  menuLine: { fontSize: 13, color: '#374151', textAlign: 'right', marginBottom: 4, lineHeight: 18 },
});