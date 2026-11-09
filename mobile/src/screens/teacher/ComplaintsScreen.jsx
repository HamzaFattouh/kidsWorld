import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  User,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function ComplaintsScreen() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  const [tickets, setTickets] = useState([
    {
      id: '1',
      parentName: 'أحمد الشكعة',
      childName: 'عمر أحمد الشكعة',
      subject: 'استفسار عن جرعة بخاخ الربو عند اللعب بالخارج',
      message: 'أرجو التأكد من إعطاء عمر بخاخ الربو قبل الخروج للساحة المفتوحة في الأيام الباردة.',
      status: 'PENDING',
      date: '2026-10-24',
      reply: null,
    },
    {
      id: '2',
      parentName: 'خالد جودت',
      childName: 'يوسف خالد جودت',
      subject: 'ملاحظة بخصوص نسيان سترة يوسف في قاعة الصف',
      message: 'عزيزتي المعلمة، يبدو أن يوسف نسي سترته الزرقاء في درج الصف يوم أمس.',
      status: 'RESOLVED',
      date: '2026-10-22',
      reply: 'أهلاً بك أخي الكريم، تم العثور على السترة ووضعها في خزانته الخاصة لتسليمها اليوم.',
    },
    {
      id: '3',
      parentName: 'مريم المصري',
      childName: 'سارة مريم المصري',
      subject: 'استفسار حول نشاط الرسم الجماعي',
      message: 'هل هناك ملابس خاصة مطلوبة لحصة التلوين بالأصابع يوم الخميس؟',
      status: 'RESOLVED',
      date: '2026-10-20',
      reply: 'أهلاً بك، الروضة توفر مآزر حماية للأطفال، فلا داعي لأي ملابس إضافية.',
    },
  ]);

  const filteredTickets = tickets.filter((t) => {
    if (activeFilter === 'ALL') return true;
    return t.status === activeFilter;
  });

  const handleSendReply = () => {
    if (!replyText.trim()) {
      Alert.alert('تنبيه', 'يرجى كتابة نص الرد أولاً.');
      return;
    }
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? { ...t, status: 'RESOLVED', reply: replyText.trim() }
          : t
      )
    );
    setReplyText('');
    setSelectedTicket(null);
    Alert.alert('تم الإرسال', 'تم إرسال ردك إلى ولي الأمر بنجاح.');
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>استفسارات وشكاوى أولياء الأمور</Text>
          <Text style={styles.subtitle}>متابعة رسائل وملاحظات أولياء أمور روضة العصافير</Text>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {[
            { id: 'ALL', label: 'الكل' },
            { id: 'PENDING', label: 'قيد المراجعة' },
            { id: 'RESOLVED', label: 'تم الرد' },
          ].map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterChip, activeFilter === f.id && styles.filterChipActive]}
              onPress={() => setActiveFilter(f.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === f.id && styles.filterChipTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tickets List */}
        {filteredTickets.map((item) => {
          const isResolved = item.status === 'RESOLVED';
          return (
            <View key={item.id} style={styles.ticketCard}>
              <View style={styles.cardHeader}>
                <View style={styles.parentRow}>
                  <View style={styles.avatar}>
                    <User size={18} color="#059669" />
                  </View>
                  <View>
                    <Text style={styles.parentName}>{item.parentName}</Text>
                    <Text style={styles.childSub}>الطفل: {item.childName}</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    isResolved ? styles.badgeResolved : styles.badgePending,
                  ]}
                >
                  {isResolved ? (
                    <CheckCircle2 size={12} color="#059669" />
                  ) : (
                    <Clock size={12} color="#d97706" />
                  )}
                  <Text
                    style={[
                      styles.statusBadgeText,
                      isResolved ? styles.textResolved : styles.textPending,
                    ]}
                  >
                    {isResolved ? 'تم الرد' : 'قيد المراجعة'}
                  </Text>
                </View>
              </View>

              <Text style={styles.subjectText}>{item.subject}</Text>
              <Text style={styles.messageText}>{item.message}</Text>

              {item.reply ? (
                <View style={styles.replyBox}>
                  <Text style={styles.replyTitle}>ردك كمعلمة:</Text>
                  <Text style={styles.replyContent}>{item.reply}</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.replyBtn}
                  onPress={() => {
                    setSelectedTicket(item);
                    setReplyText('');
                  }}
                >
                  <MessageSquare size={16} color="#059669" />
                  <Text style={styles.replyBtnText}>كتابة رد لولي الأمر</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Reply Modal */}
      <Modal
        visible={!!selectedTicket}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTicket(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>الرد على ولي الأمر</Text>
              <TouchableOpacity onPress={() => setSelectedTicket(null)}>
                <X size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {selectedTicket && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalQueryBox}>
                  <Text style={styles.modalQueryParent}>
                    من: {selectedTicket.parentName} ({selectedTicket.childName})
                  </Text>
                  <Text style={styles.modalQuerySub}>{selectedTicket.subject}</Text>
                  <Text style={styles.modalQueryMsg}>{selectedTicket.message}</Text>
                </View>

                <Text style={styles.replyLabel}>نص الرد والتوضيح *</Text>
                <TextInput
                  style={styles.replyInput}
                  multiline
                  numberOfLines={4}
                  placeholder="اكتبي ردك المباشر لولي الأمر..."
                  placeholderTextColor="#9ca3af"
                  value={replyText}
                  onChangeText={setReplyText}
                />

                <TouchableOpacity style={styles.sendBtn} onPress={handleSendReply}>
                  <Send size={16} color="#ffffff" />
                  <Text style={styles.sendBtnText}>إرسال الرد وتحديث الحالة</Text>
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

  filterRow: {
    flexDirection: 'row-reverse',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  filterChipText: {
    fontSize: 12,
    color: '#4b5563',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },

  ticketCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  parentRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  parentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  childSub: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'right',
  },
  statusBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  badgeResolved: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  badgePending: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  textResolved: { color: '#059669' },
  textPending: { color: '#b45309' },

  subjectText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
    marginBottom: 6,
  },
  messageText: {
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'right',
    lineHeight: 19,
    marginBottom: 12,
  },

  replyBox: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
  },
  replyTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
    textAlign: 'right',
    marginBottom: 4,
  },
  replyContent: {
    fontSize: 12,
    color: '#1f2937',
    textAlign: 'right',
    lineHeight: 18,
  },

  replyBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  replyBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#059669',
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
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalQueryBox: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  modalQueryParent: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
    textAlign: 'right',
  },
  modalQuerySub: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
    marginTop: 4,
  },
  modalQueryMsg: {
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'right',
    marginTop: 4,
    lineHeight: 18,
  },
  replyLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'right',
    marginBottom: 6,
  },
  replyInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#111827',
    textAlign: 'right',
    textAlignVertical: 'top',
    minHeight: 90,
    marginBottom: 14,
  },
  sendBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  sendBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
