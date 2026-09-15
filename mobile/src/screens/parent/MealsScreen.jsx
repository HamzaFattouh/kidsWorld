import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Utensils, CheckCircle, Calendar, ShieldCheck } from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function MealsScreen() {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'weekly_menu'

  const dailyMeals = [
    {
      id: '1',
      date: 'اليوم (2026-09-15)',
      type: 'BREAKFAST',
      title: 'وجبة الإفطار',
      statusText: 'أكل وجبته اليومية بنجاح 🍏',
      notes: 'تناول الطفل طعامه بحيوية ونشاط كبير.',
    },
    {
      id: '2',
      date: 'اليوم (2026-09-15)',
      type: 'SNACK',
      title: 'سناك الفواكه',
      statusText: 'أكل الوجبة بالكامل ✅',
      notes: 'تفاح وموز وطبق سلطة فواكه.',
    },
  ];

  const weeklyMenu = [
    { day: 'الأحد', breakfast: 'جبنة بيضاء ومناقيش زعتر بلدي + خيار', lunch: 'أرز بدجاج ومكسرات وخضار مشكلة', snack: 'فواكه طازجة (تفاح وموز)' },
    { day: 'الإثنين', breakfast: 'بيض مسلوق وزيت وزعتر + حليب دافئ', lunch: 'صينية خضار بالفرن ومعكرونة', snack: 'بسكويت شوفان وعصير طازج' },
    { day: 'الثلاثاء', breakfast: 'لبنة بلدية وزيتون أسود وخُبز أسمر', lunch: 'شوربة عدس مغذية + كبسة دجاج', snack: 'برتقال وشرائح جزر' },
    { day: 'الأربعاء', breakfast: 'فول مدمس خفيف وجبنة شيدر', lunch: 'مقلوبة زهرة ودجاج مع لبن رائب', snack: 'سلطة فواكه مشكلة' },
    { day: 'الخميس', breakfast: 'فطائر سبانخ وجبنة + عصير برتقال', lunch: 'كفتة بالطحينية وأرز أبيض', snack: 'كيك بيتي بالفواكه' },
  ];

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>سجل الوجبات وجدول التغذية 🍱</Text>
          <Text style={styles.subTitle}>متابعة الوجبات اليومية للطفل وتصفح برنامج الأسبوع</Text>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'daily' && styles.activeTabBtn]}
            onPress={() => setActiveTab('daily')}
          >
            <Text style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}>
              الوجبات اليومية 🍏
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

        {activeTab === 'daily' ? (
          dailyMeals.map((item) => (
            <View key={item.id} style={styles.mealCard}>
              <View style={styles.cardHeader}>
                <View style={styles.typeBadge}>
                  <Utensils size={14} color="#ea580c" style={{ marginLeft: 4 }} />
                  <Text style={styles.typeText}>{item.title}</Text>
                </View>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>

              <View style={styles.statusBox}>
                <CheckCircle size={16} color="#10b981" style={{ marginLeft: 6 }} />
                <Text style={styles.statusText}>{item.statusText}</Text>
              </View>

              <View style={styles.notesBox}>
                <Text style={styles.notesTitle}>ملاحظات المربية:</Text>
                <Text style={styles.notesContent}>{item.notes}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.menuContainer}>
            <Text style={styles.menuHeader}>جدول الوجبات المعتمد للأسبوع الحالي 🥗</Text>
            {weeklyMenu.map((item, idx) => (
              <View key={idx} style={styles.menuCard}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayText}>{item.day}</Text>
                </View>
                <View style={styles.mealDetailRow}>
                  <Text style={styles.mealLabel}>🍳 الإفطار:</Text>
                  <Text style={styles.mealVal}>{item.breakfast}</Text>
                </View>
                <View style={styles.mealDetailRow}>
                  <Text style={styles.mealLabel}>🍲 الغداء:</Text>
                  <Text style={styles.mealVal}>{item.lunch}</Text>
                </View>
                <View style={styles.mealDetailRow}>
                  <Text style={styles.mealLabel}>🍎 سناك / فواكه:</Text>
                  <Text style={styles.mealVal}>{item.snack}</Text>
                </View>
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
  activeTabText: { color: '#1e293b' },

  mealCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  typeBadge: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#fff7ed', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  typeText: { fontSize: 12, fontWeight: 'bold', color: '#ea580c' },
  dateText: { fontSize: 12, color: '#6b7280', fontWeight: '500' },

  statusBox: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: '#ecfdf5', padding: 10, borderRadius: 12, marginBottom: 10 },
  statusText: { fontSize: 13, fontWeight: 'bold', color: '#15803d' },

  notesBox: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#f3f4f6' },
  notesTitle: { fontSize: 11, fontWeight: 'bold', color: '#374151', textAlign: 'right', marginBottom: 2 },
  notesContent: { fontSize: 13, color: '#4b5563', textAlign: 'right' },

  menuContainer: { spaceBetween: 12 },
  menuHeader: { fontSize: 15, fontWeight: 'bold', color: '#1f2937', textAlign: 'right', marginBottom: 12 },
  menuCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  dayBadge: { backgroundColor: '#eff6ff', alignSelf: 'flex-end', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginBottom: 10 },
  dayText: { fontSize: 13, fontWeight: 'bold', color: '#1d4ed8' },
  mealDetailRow: { flexDirection: 'row-reverse', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingVertical: 6 },
  mealLabel: { fontSize: 13, fontWeight: 'bold', color: '#374151', width: 110, textAlign: 'right' },
  mealVal: { flex: 1, fontSize: 13, color: '#4b5563', textAlign: 'right' },
});