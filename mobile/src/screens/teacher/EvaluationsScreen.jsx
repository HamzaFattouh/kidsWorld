import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {
  Star,
  Save,
  CheckCircle2,
  Award,
  Sparkles,
  TrendingUp,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function EvaluationsScreen() {
  const [selectedChildId, setSelectedChildId] = useState('1');

  const children = [
    { id: '1', name: 'عمر أحمد الشكعة' },
    { id: '2', name: 'يوسف خالد جودت' },
    { id: '3', name: 'خليل سمير النابلسي' },
    { id: '4', name: 'سارة مريم المصري' },
    { id: '5', name: 'ليان أحمد الشكعة' },
  ];

  const domains = [
    { key: 'linguistic', title: 'التواصل واللغة', desc: 'المفردات، التعبير الشفهي، والتفاعل الصوتي' },
    { key: 'social', title: 'المهارات الاجتماعية والعاطفية', desc: 'المشاركة مع الأقران والتعاطف وضبط المشاعر' },
    { key: 'motor', title: 'المهارات الحركية الدقيقة والكبيرة', desc: 'التحكم بالأقلام، القص، والتوازن الحركي' },
    { key: 'cognitive', title: 'الإدراك والتفكير المنطقي', desc: 'الألوان، الأشكال، والقدرة على حل المشكلات' },
    { key: 'independence', title: 'الاعتماد على النفس', desc: 'ارتداء السترة، تناول الوجبة بمفرده، والنظافة' },
    { key: 'creativity', title: 'الابتكار والتعبير الفني', desc: 'التلوين، التشكيل بالمعجون، والغناء' },
  ];

  // Ratings store per child
  const [evaluations, setEvaluations] = useState({
    '1': {
      ratings: { linguistic: 5, social: 4, motor: 5, cognitive: 5, independence: 4, creativity: 5 },
      notes: 'عمر يبدي تميزاً لافتاً في استخدام الكلمات والتعبير عن أفكاره.',
    },
    '2': {
      ratings: { linguistic: 4, social: 4, motor: 3, cognitive: 4, independence: 3, creativity: 4 },
      notes: 'يحتاج تشجيعاً مستمراً في الأنشطة الحركية الجماعية.',
    },
    '3': {
      ratings: { linguistic: 5, social: 5, motor: 4, cognitive: 4, independence: 5, creativity: 4 },
      notes: 'متعاون جداً ويحب مساعدة أصدقائه.',
    },
    '4': {
      ratings: { linguistic: 4, social: 5, motor: 4, cognitive: 5, independence: 4, creativity: 5 },
      notes: 'موهوبة في الرسم والألوان وتفاعلها هادئ ومريح.',
    },
    '5': {
      ratings: { linguistic: 4, social: 4, motor: 4, cognitive: 4, independence: 4, creativity: 4 },
      notes: 'تأقلم رائع وتطور مستمر.',
    },
  });

  const currentEval = evaluations[selectedChildId] || {
    ratings: { linguistic: 4, social: 4, motor: 4, cognitive: 4, independence: 4, creativity: 4 },
    notes: '',
  };

  const setRating = (domainKey, value) => {
    setEvaluations((prev) => ({
      ...prev,
      [selectedChildId]: {
        ...prev[selectedChildId],
        ratings: {
          ...currentEval.ratings,
          [domainKey]: value,
        },
      },
    }));
  };

  const setNotes = (text) => {
    setEvaluations((prev) => ({
      ...prev,
      [selectedChildId]: {
        ...prev[selectedChildId],
        notes: text,
      },
    }));
  };

  const handleSave = () => {
    const child = children.find((c) => c.id === selectedChildId);
    Alert.alert('تم حفظ التقييم', `تم تسجيل تقييم المهارات للطفل (${child?.name}) بنجاح.`);
  };

  const selectedChild = children.find((c) => c.id === selectedChildId);

  // Compute average score
  const totalStars = Object.values(currentEval.ratings).reduce((a, b) => a + b, 0);
  const avgStars = (totalStars / domains.length).toFixed(1);

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>تقييم المهارات التنموية</Text>
          <Text style={styles.subtitle}>تقييم محاور التطور الشامل للأطفال في روضة العصافير</Text>
        </View>

        {/* Children selector chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {children.map((child) => {
            const isSelected = child.id === selectedChildId;
            return (
              <TouchableOpacity
                key={child.id}
                style={[styles.childChip, isSelected && styles.childChipActive]}
                onPress={() => setSelectedChildId(child.id)}
              >
                <Text style={[styles.childChipText, isSelected && styles.childChipTextActive]}>
                  {child.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Score Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTextCol}>
            <Text style={styles.summaryTitle}>ملخص أداء {selectedChild?.name}</Text>
            <Text style={styles.summarySub}>المعدل العام للمهارات: {avgStars} من 5 نجوم</Text>
          </View>
          <View style={styles.badgeBox}>
            <Award size={26} color="#059669" />
          </View>
        </View>

        {/* Evaluation Domains List */}
        {domains.map((domain) => {
          const rating = currentEval.ratings[domain.key] || 0;
          return (
            <View key={domain.key} style={styles.domainCard}>
              <View style={styles.domainHeader}>
                <Text style={styles.domainTitle}>{domain.title}</Text>
                <Text style={styles.domainDesc}>{domain.desc}</Text>
              </View>

              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isActive = starVal <= rating;
                  return (
                    <TouchableOpacity
                      key={starVal}
                      style={styles.starBtn}
                      onPress={() => setRating(domain.key, starVal)}
                    >
                      <Star
                        size={28}
                        color={isActive ? '#f59e0b' : '#d1d5db'}
                        fill={isActive ? '#f59e0b' : 'transparent'}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* Notes input */}
        <View style={styles.notesCard}>
          <Text style={styles.notesLabel}>ملاحظات وتوصيات المعلمة للطفل:</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={4}
            value={currentEval.notes}
            onChangeText={setNotes}
            placeholder="اكتبي ملخصاً لتطور مهارات الطفل وتوصياتك للأهل..."
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Save button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Save size={18} color="#ffffff" />
          <Text style={styles.saveBtnText}>حفظ وتحديث التقييم</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  header: { marginBottom: 14 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  subtitle: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 2 },

  chipRow: {
    flexDirection: 'row-reverse',
    gap: 8,
    paddingVertical: 8,
    marginBottom: 14,
  },
  childChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  childChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  childChipText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#374151',
  },
  childChipTextActive: {
    color: '#ffffff',
  },

  summaryCard: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  summaryTextCol: {
    flex: 1,
    alignItems: 'flex-end',
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#065f46',
    textAlign: 'right',
  },
  summarySub: {
    fontSize: 12,
    color: '#047857',
    textAlign: 'right',
    marginTop: 2,
  },
  badgeBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },

  domainCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  domainHeader: {
    marginBottom: 12,
  },
  domainTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  domainDesc: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 3,
  },
  starRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 12,
  },
  starBtn: {
    padding: 4,
  },

  notesCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#111827',
    textAlign: 'right',
    textAlignVertical: 'top',
    minHeight: 80,
  },

  saveBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
