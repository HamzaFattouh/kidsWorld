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
  CheckCheck,
  ShieldCheck,
  Phone,
} from 'lucide-react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function MessagesScreen() {
  const [inputText, setInputText] = useState('');

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'teacher',
      text: 'السلام عليكم أ. أحمد، عمر اليوم أظهر تفاعلاً رائعاً في حصة الأشكال وحفظ أنشودة الصباح.',
      time: '09:30 ص',
    },
    {
      id: '2',
      sender: 'parent',
      text: 'وعليكم السلام ورحمة الله، أسعدكِ الله معلمتي. هل تناول وجبة الإفطار كاملة؟',
      time: '10:15 ص',
    },
    {
      id: '3',
      sender: 'teacher',
      text: 'نعم بحمد الله، أكل شطيرته كاملة وشرب عصير البرتقال الطازج، وهو الآن يلعب مع أصدقائه.',
      time: '10:20 ص',
    },
  ]);

  const quickReplies = [
    'شكراً جزيلاً لكِ معلمتي',
    'سأحضر لاستلامه مبكراً اليوم',
    'أرجو الانتباه لبخاخ الربو',
  ];

  const handleSend = (textToSend) => {
    const content = textToSend || inputText;
    if (!content.trim()) return;

    const newMsg = {
      id: String(Date.now()),
      sender: 'parent',
      text: content.trim(),
      time: 'الآن',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Header Bar */}
        <View style={styles.header}>
          <View style={styles.headerRight}>
            <View style={styles.avatar}>
              <User size={20} color="#059669" />
            </View>
            <View>
              <Text style={styles.teacherName}>أ. نور عبد الرحمن</Text>
              <Text style={styles.subText}>معلمة روضة العصافير (KG1)</Text>
            </View>
          </View>
          <View style={styles.activePill}>
            <View style={styles.greenDot} />
            <Text style={styles.activeText}>متصلة بالصف</Text>
          </View>
        </View>

        {/* Message Stream */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.stream}
        >
          {messages.map((msg) => {
            const isParent = msg.sender === 'parent';
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  isParent ? styles.rowParent : styles.rowTeacher,
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    isParent ? styles.bubbleParent : styles.bubbleTeacher,
                  ]}
                >
                  <Text
                    style={[
                      styles.msgText,
                      isParent ? styles.textParent : styles.textTeacher,
                    ]}
                  >
                    {msg.text}
                  </Text>
                  <View style={styles.timeRow}>
                    <Text
                      style={[
                        styles.timeText,
                        isParent ? styles.timeParent : styles.timeTeacher,
                      ]}
                    >
                      {msg.time}
                    </Text>
                    {isParent && <CheckCheck size={12} color="#a7f3d0" />}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Quick Replies */}
        <View style={styles.quickReplyRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickReplies.map((qr, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickChip}
                onPress={() => handleSend(qr)}
              >
                <Text style={styles.quickText}>{qr}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Composer */}
        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            placeholder="اكتب رسالتك للمعلمة..."
            placeholderTextColor="#9ca3af"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSend(inputText)}
            disabled={!inputText.trim()}
          >
            <Send size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 8,
  },
  headerRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teacherName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
  subText: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'right',
  },
  activePill: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  activeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
  },

  stream: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  messageRow: {
    flexDirection: 'row-reverse',
    marginBottom: 10,
  },
  rowParent: {
    justifyContent: 'flex-start',
  },
  rowTeacher: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: 16,
  },
  bubbleParent: {
    backgroundColor: '#059669',
    borderBottomRightRadius: 4,
  },
  bubbleTeacher: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'right',
  },
  textParent: {
    color: '#ffffff',
  },
  textTeacher: {
    color: '#111827',
  },
  timeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  timeText: {
    fontSize: 10,
  },
  timeParent: {
    color: '#d1fae5',
  },
  timeTeacher: {
    color: '#9ca3af',
  },

  quickReplyRow: {
    paddingVertical: 6,
  },
  quickChip: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
  },
  quickText: {
    fontSize: 11,
    color: '#4b5563',
  },

  composer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 8,
    marginTop: 6,
  },
  input: {
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
