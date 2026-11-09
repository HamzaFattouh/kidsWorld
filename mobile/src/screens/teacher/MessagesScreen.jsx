import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  MessageSquare,
  Send,
  User,
  ArrowRight,
  CheckCheck,
  Search,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function MessagesScreen() {
  const [activeThread, setActiveThread] = useState(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [threads, setThreads] = useState([
    {
      id: '1',
      parentName: 'أحمد الشكعة',
      childName: 'عمر أحمد الشكعة',
      lastMessage: 'شكراً جزيلاً معلمتي، سنقوم بإرسال الدواء مع عمر غداً.',
      time: '11:45 ص',
      unread: 1,
      messages: [
        { id: 'm1', sender: 'parent', text: 'السلام عليكم ورحمة الله، كيف حال عمر اليوم؟', time: '11:20 ص' },
        { id: 'm2', sender: 'teacher', text: 'وعليكم السلام، عمر بأفضل حال وتناول وجبة الغداء كاملة.', time: '11:32 ص' },
        { id: 'm3', sender: 'parent', text: 'شكراً جزيلاً معلمتي، سنقوم بإرسال الدواء مع عمر غداً.', time: '11:45 ص' },
      ],
    },
    {
      id: '2',
      parentName: 'خالد جودت',
      childName: 'يوسف خالد جودت',
      lastMessage: 'تم العثور على سترة يوسف في خزانة الصف.',
      time: 'أمس',
      unread: 0,
      messages: [
        { id: 'm1', sender: 'parent', text: 'مرحبا، هل وجدتم سترة يوسف؟', time: '02:15 م' },
        { id: 'm2', sender: 'teacher', text: 'تم العثور على سترة يوسف في خزانة الصف.', time: '02:30 م' },
      ],
    },
    {
      id: '3',
      parentName: 'مريم المصري',
      childName: 'سارة مريم المصري',
      lastMessage: 'أهلاً بك، الروضة توفر مآزر الحماية لحصة الرسم.',
      time: '20 أكتوبر',
      unread: 0,
      messages: [
        { id: 'm1', sender: 'parent', text: 'هل تحتاج سارة ملابس خاصة للتلوين؟', time: '09:00 ص' },
        { id: 'm2', sender: 'teacher', text: 'أهلاً بك، الروضة توفر مآزر الحماية لحصة الرسم.', time: '09:15 ص' },
      ],
    },
  ]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeThread) return;
    const newMsg = {
      id: `m_${Date.now()}`,
      sender: 'teacher',
      text: inputText.trim(),
      time: 'الآن',
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThread.id) {
          const updatedMsgs = [...t.messages, newMsg];
          return {
            ...t,
            lastMessage: newMsg.text,
            time: 'الآن',
            unread: 0,
            messages: updatedMsgs,
          };
        }
        return t;
      })
    );

    setActiveThread((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));

    setInputText('');
  };

  const filteredThreads = threads.filter(
    (t) =>
      t.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.childName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScreenWrapper>
      {activeThread ? (
        /* Conversation Detail View */
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.chatContainer}
        >
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setActiveThread(null)}
            >
              <ArrowRight size={20} color="#111827" />
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatParentName}>{activeThread.parentName}</Text>
              <Text style={styles.chatChildSub}>الطفل: {activeThread.childName}</Text>
            </View>
            <View style={styles.avatarMini}>
              <User size={16} color="#059669" />
            </View>
          </View>

          {/* Message Stream */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messageStream}
          >
            {activeThread.messages.map((msg) => {
              const isTeacher = msg.sender === 'teacher';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageRow,
                    isTeacher ? styles.msgTeacherRow : styles.msgParentRow,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isTeacher ? styles.bubbleTeacher : styles.bubbleParent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isTeacher ? styles.textTeacher : styles.textParent,
                      ]}
                    >
                      {msg.text}
                    </Text>
                    <View style={styles.msgFooter}>
                      <Text
                        style={[
                          styles.msgTime,
                          isTeacher ? styles.timeTeacher : styles.timeParent,
                        ]}
                      >
                        {msg.time}
                      </Text>
                      {isTeacher && <CheckCheck size={12} color="#a7f3d0" />}
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Composer */}
          <View style={styles.composerBox}>
            <TextInput
              style={styles.composerInput}
              placeholder="اكتب ردك للمعلمة أو ولي الأمر..."
              placeholderTextColor="#9ca3af"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Send size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : (
        /* Threads List View */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>المحادثات والرسائل</Text>
            <Text style={styles.subtitle}>تواصل مباشر وآمن مع أولياء أمور روضة العصافير</Text>
          </View>

          {/* Search */}
          <View style={styles.searchBar}>
            <Search size={18} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="بحث في المحادثات..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Threads */}
          {filteredThreads.map((thread) => (
            <TouchableOpacity
              key={thread.id}
              style={styles.threadCard}
              onPress={() => {
                setActiveThread(thread);
                setThreads((prev) =>
                  prev.map((t) => (t.id === thread.id ? { ...t, unread: 0 } : t))
                );
              }}
            >
              <View style={styles.avatar}>
                <User size={20} color="#059669" />
              </View>

              <View style={styles.threadContent}>
                <View style={styles.threadTopRow}>
                  <Text style={styles.threadParentName}>{thread.parentName}</Text>
                  <Text style={styles.threadTime}>{thread.time}</Text>
                </View>
                <Text style={styles.threadChildSub}>الطفل: {thread.childName}</Text>
                <Text style={styles.threadLastMsg} numberOfLines={1}>
                  {thread.lastMessage}
                </Text>
              </View>

              {thread.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{thread.unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  header: { marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textAlign: 'right' },
  subtitle: { fontSize: 13, color: '#6b7280', textAlign: 'right', marginTop: 2 },

  searchBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    color: '#111827',
  },

  threadCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  threadContent: {
    flex: 1,
  },
  threadTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  threadParentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  threadTime: {
    fontSize: 11,
    color: '#9ca3af',
  },
  threadChildSub: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 1,
  },
  threadLastMsg: {
    fontSize: 12,
    color: '#4b5563',
    textAlign: 'right',
    marginTop: 4,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Chat View
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 12,
    gap: 12,
  },
  backBtn: {
    padding: 6,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatParentName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  chatChildSub: {
    fontSize: 11,
    color: '#059669',
    textAlign: 'right',
  },
  avatarMini: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  messageStream: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  messageRow: {
    flexDirection: 'row-reverse',
    marginBottom: 12,
  },
  msgTeacherRow: {
    justifyContent: 'flex-start',
  },
  msgParentRow: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  bubbleTeacher: {
    backgroundColor: '#059669',
    borderBottomRightRadius: 4,
  },
  bubbleParent: {
    backgroundColor: '#f3f4f6',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'right',
  },
  textTeacher: {
    color: '#ffffff',
  },
  textParent: {
    color: '#111827',
  },
  msgFooter: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  msgTime: {
    fontSize: 10,
  },
  timeTeacher: {
    color: '#d1fae5',
  },
  timeParent: {
    color: '#9ca3af',
  },

  composerBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 8,
    marginTop: 8,
  },
  composerInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
    textAlign: 'right',
    maxHeight: 80,
    paddingHorizontal: 8,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#9ca3af',
  },
});
