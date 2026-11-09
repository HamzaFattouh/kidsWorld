import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  Send,
  User,
  CheckCheck,
  Clock,
  Baby
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function ParentMessagesPage() {
  const { t } = useTranslation();

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'teacher',
      senderName: 'أ. نورة النابلسي (معلمة الصف)',
      text: 'السلام عليكم ورحمة الله، مرحباً بكم في قناة التواصل المباشرة مع الحضانة.',
      time: '09:00 ص'
    },
    {
      id: 'm2',
      sender: 'parent',
      senderName: 'ولي الأمر',
      text: 'وعليكم السلام ورحمة الله، أود التأكد من وقت تناول وجبة الغداء وموعد القيلولة اليوم.',
      time: '09:45 ص'
    },
    {
      id: 'm3',
      sender: 'teacher',
      senderName: 'أ. نورة النابلسي (معلمة الصف)',
      text: 'وجبة الغداء تبدأ عند الساعة 12:00 ظهراً، والقيلولة من 1:30 حتى 2:30 ظهراً.',
      time: '10:00 ص'
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `m${Date.now()}`,
      sender: 'parent',
      senderName: 'ولي الأمر',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="الرسائل والتواصل مع المعلمة"
        description="قناة محادثة فورية ومباشرة مع مربية الفصل وإدارة الحضانة"
      />

      <Card className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              ن
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">أ. نورة النابلسي</h4>
              <p className="text-xs text-text-muted dark:text-text-mutedDark">معلمة روضة العصافير (3 - 4 سنوات)</p>
            </div>
          </div>
          <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full font-bold">
            متاح للرد
          </span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m) => {
            const isMe = m.sender === 'parent';
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs space-y-1 ${
                    isMe
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                  <div className={`text-[10px] flex items-center gap-1 ${isMe ? 'text-white/80' : 'text-gray-400'}`}>
                    <span>{m.time}</span>
                    {isMe && <CheckCheck className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب استفسارك أو ملاحظتك للمعلمة..."
            className="flex-1 p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs text-right focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>
      </Card>
    </div>
  );
}
