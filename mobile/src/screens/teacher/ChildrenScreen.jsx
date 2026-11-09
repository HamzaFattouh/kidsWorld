import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import {
  Search,
  Phone,
  AlertTriangle,
  HeartPulse,
  UserCheck,
  X,
  ShieldCheck,
  Calendar,
  User,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function ChildrenScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChild, setSelectedChild] = useState(null);

  const [childrenList] = useState([
    {
      id: '1',
      name: 'عمر أحمد الشكعة',
      gender: 'MALE',
      birthDate: '2022-04-12',
      age: '4 سنوات',
      parentName: 'أحمد الشكعة',
      phone: '0599123456',
      bloodType: 'O+',
      allergies: 'حساسية من الفول السوداني ومشتقات الحليب',
      medicalNotes: 'يحمل بخاخ ربو عند اللزوم في الحقيبة المدرسية',
      emergencyContact: '0599123450 (الأم)',
      pickupAuthorized: 'أحمد الشكعة (الأب)، هبة العمد (الأم)',
    },
    {
      id: '2',
      name: 'يوسف خالد جودت',
      gender: 'MALE',
      birthDate: '2022-06-20',
      age: '3.8 سنوات',
      parentName: 'خالد جودت',
      phone: '0599765432',
      bloodType: 'A+',
      allergies: 'لا يوجد',
      medicalNotes: 'سليم، فحص النظر سليم',
      emergencyContact: '0599765430 (الأب)',
      pickupAuthorized: 'خالد جودت (الأب)',
    },
    {
      id: '3',
      name: 'خليل سمير النابلسي',
      gender: 'MALE',
      birthDate: '2022-01-15',
      age: '4.2 سنوات',
      parentName: 'سمير النابلسي',
      phone: '0598888777',
      bloodType: 'B+',
      allergies: 'حساسية من البيض',
      medicalNotes: 'لا يوجد أمراض مزمنة',
      emergencyContact: '0598888770 (الأب)',
      pickupAuthorized: 'سمير النابلسي (الأب)',
    },
    {
      id: '4',
      name: 'سارة مريم المصري',
      gender: 'FEMALE',
      birthDate: '2022-08-05',
      age: '3.6 سنوات',
      parentName: 'مريم المصري',
      phone: '0597112233',
      bloodType: 'O-',
      allergies: 'لا يوجد',
      medicalNotes: 'تحتاج متابعة في شرب السوائل بشكل دوري',
      emergencyContact: '0597112230 (الأم)',
      pickupAuthorized: 'مريم المصري (الأم)، جهاد المصري (الخال)',
    },
    {
      id: '5',
      name: 'ليان أحمد الشكعة',
      gender: 'FEMALE',
      birthDate: '2023-02-10',
      age: '3.2 سنوات',
      parentName: 'أحمد الشكعة',
      phone: '0599123456',
      bloodType: 'O+',
      allergies: 'لا يوجد',
      medicalNotes: 'سليمة ومعافاة بالكامل',
      emergencyContact: '0599123450 (الأم)',
      pickupAuthorized: 'أحمد الشكعة (الأب)',
    },
  ]);

  const filteredChildren = childrenList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.parentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCallParent = (phone) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('تعذر الاتصال', `رقم الهاتف: ${phone}`);
    });
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>قائمة أطفال الصف</Text>
          <Text style={styles.subtitle}>
            إجمالي الأطفال: {filteredChildren.length} في روضة العصافير
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={18} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن طفل أو ولي أمر..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#9ca3af" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Children Cards List */}
        {filteredChildren.map((child) => (
          <TouchableOpacity
            key={child.id}
            testID={`child-card-${child.id}`}
            style={styles.childCard}
            activeOpacity={0.8}
            onPress={() => setSelectedChild(child)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.childMainInfo}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: child.gender === 'FEMALE' ? '#fdf2f8' : '#eff6ff' },
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarText,
                      { color: child.gender === 'FEMALE' ? '#db2777' : '#2563eb' },
                    ]}
                  >
                    {child.name.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.childName}>{child.name}</Text>
                  <Text style={styles.childSub}>
                    {child.age} • ولي الأمر: {child.parentName}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => handleCallParent(child.phone)}
              >
                <Phone size={16} color="#059669" />
              </TouchableOpacity>
            </View>

            {/* Medical / Allergy Badge */}
            {child.allergies !== 'لا يوجد' && (
              <View style={styles.allergyPill}>
                <AlertTriangle size={13} color="#d97706" />
                <Text style={styles.allergyText}>{child.allergies}</Text>
              </View>
            )}

            <View style={styles.cardFooter}>
              <View style={styles.footerItem}>
                <ShieldCheck size={14} color="#059669" />
                <Text style={styles.footerText}>فصيلة الدم: {child.bloodType}</Text>
              </View>
              <Text style={styles.detailsPrompt}>اضغط لعرض الملف الكامل</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Child Full Details Modal */}
      <Modal
        visible={!!selectedChild}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedChild(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>الملف الشامل للطفل</Text>
              <TouchableOpacity onPress={() => setSelectedChild(null)}>
                <X size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {selectedChild && (
              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalContent}>
                <View style={styles.modalAvatarRow}>
                  <View
                    style={[
                      styles.modalAvatar,
                      { backgroundColor: selectedChild.gender === 'FEMALE' ? '#fdf2f8' : '#eff6ff' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalAvatarText,
                        { color: selectedChild.gender === 'FEMALE' ? '#db2777' : '#2563eb' },
                      ]}
                    >
                      {selectedChild.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.modalName}>{selectedChild.name}</Text>
                    <Text style={styles.modalAge}>
                      {selectedChild.age} (مواليد: {selectedChild.birthDate})
                    </Text>
                  </View>
                </View>

                {/* Info sections */}
                <View style={styles.infoGroup}>
                  <Text style={styles.groupLabel}>بيانات الاتصال والطوارئ</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoVal}>{selectedChild.parentName}</Text>
                    <Text style={styles.infoKey}>ولي الأمر:</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <TouchableOpacity onPress={() => handleCallParent(selectedChild.phone)}>
                      <Text style={[styles.infoVal, { color: '#059669', textDecorationLine: 'underline' }]}>
                        {selectedChild.phone}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.infoKey}>رقم الهاتف:</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoVal}>{selectedChild.emergencyContact}</Text>
                    <Text style={styles.infoKey}>طوارئ بديل:</Text>
                  </View>
                </View>

                <View style={styles.infoGroup}>
                  <Text style={styles.groupLabel}>الملف الصحي والحساسية</Text>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoVal}>{selectedChild.bloodType}</Text>
                    <Text style={styles.infoKey}>فصيلة الدم:</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoVal, { color: selectedChild.allergies !== 'لا يوجد' ? '#d97706' : '#111827' }]}>
                      {selectedChild.allergies}
                    </Text>
                    <Text style={styles.infoKey}>الحساسية:</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoVal}>{selectedChild.medicalNotes}</Text>
                    <Text style={styles.infoKey}>ملاحظات طبية:</Text>
                  </View>
                </View>

                <View style={styles.infoGroup}>
                  <Text style={styles.groupLabel}>المخولون بالاستلام والتوصيل</Text>
                  <Text style={styles.pickupText}>{selectedChild.pickupAuthorized}</Text>
                </View>

                <TouchableOpacity
                  testID="close-child-modal-btn"
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedChild(null)}
                >
                  <Text style={styles.modalCloseBtnText}>إغلاق الملف</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  header: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  subtitle: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 2 },

  // Search
  searchBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    color: '#111827',
  },

  // Child Card
  childCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  childMainInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  childName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  childSub: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 2,
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  allergyPill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    gap: 6,
  },
  allergyText: {
    fontSize: 11,
    color: '#b45309',
    fontWeight: 'bold',
  },

  cardFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  footerItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#374151',
  },
  detailsPrompt: {
    fontSize: 11,
    color: '#059669',
    fontWeight: 'bold',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 16,
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalContent: {
    marginTop: 12,
  },
  modalAvatarRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  modalAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalAge: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  infoGroup: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#059669',
    textAlign: 'right',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoKey: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  pickupText: {
    fontSize: 12,
    color: '#1f2937',
    textAlign: 'right',
    lineHeight: 18,
  },
  modalCloseBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  modalCloseBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
