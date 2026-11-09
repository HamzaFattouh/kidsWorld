import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  Send,
  User,
  Search,
  CheckCheck,
  Baby,
  Clock
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';

export function TeacherMessagesPage() {
  const { t } = useTranslation();
  const assignedClass = { id: 'class-birds-3-4', name: 'روضة العصافير (3 - 4 سنوات)' };

  const [activeParentId, setActiveParentId] = useState('p1');
  const [inputText, setInputText] = useState('');

  const [conversations, setConversations] = useState([
    {
      parentId: 'p1',
      parentName: 'أحمد الشكعة',
      childName: 'عمر أحمد الشكعة',
      lastMessage: 'شكراً جزيلاً أستاذة نورة على المتابعة الطيبة.',
      time: '11:45 ص',
      unread: 0,
      messages: [
        { id: 'm1', sender: 'teacher', text: 'السلام عليكم أخي أحمد، أود إعلامكم بأن عمر أظهر تقدماً رائعاً في نشاط اليوم.', time: '10:30 ص' },
        { id: 'm2', sender: 'parent', text: 'وعليكم السلام ورحمة الله، بارك الله فيك، هل تناول وجبته كاملة؟', time: '11:15 ص' },
        { id: 'm3', sender: 'teacher', text: 'نعم، تناول وجبة الغداء كاملة بشهية ممتازة.', time: '11:20 ص' },
        { id: 'm4', sender: 'parent', text: 'شكراً جزيلاً أستاذة نورة على المتابعة الطيبة.', time: '11:45 ص' },
      ]
    },
    {
      parentId: 'p2',
      parentName: 'خالد جودت',
      childName: 'يوسف خالد جودت',
      lastMessage: 'سأكون بانتظاره في الموعد المحدد بإذن الله.',
      time: '09:15 ص',
      unread: 1,
      messages: [
        { id: 'm5', sender: 'parent', text: 'مرحباً، هل يحتاج يوسف لأي أغراض إضافية ليوم غد؟', time: '09:00 ص' },
        { id: 'm6', sender: 'teacher', text: 'أهلاً بك، فقط دفتر الرسم المخصص للأنشطة.', time: '09:10 ص' },
        { id: 'm7', sender: 'parent', text: 'سأكون بانتظاره في الموعد المحدد بإذن الله.', time: '09:15 ص' },
      ]
    },
    {
      parentId: 'p3',
      parentName: 'مريم المصري',
      childName: 'سارة مريم المصري',
      lastMessage: 'تم استلام تقرير الأسبوع، شكراً جزيلاً.',
      time: 'أمس',
      unread: 0,
      messages: [
        { id: 'm8', sender: 'teacher', text: 'مرحباً أم سارة، تم رفع التقرير الأسبوعي لسارة على التطبيق.', time: 'أمس' },
        { id: 'm9', sender: 'parent', text: 'تم استلام تقرير الأسبوع، شكراً جزيلاً.', time: 'أمس' },
      ]
    }
  ]);

  const activeConv = conversations.find(c => c.parentId === activeParentId) || conversations[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `m${Date.now()}`,
      sender: 'teacher',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => prev.map(c => {
      if (c.parentId === activeParentId) {
        return {
          ...c,
          lastMessage: newMsg.text,
          time: newMsg.time,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setInputText('');
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title={`الرسائل والمحادثات - ${assignedClass.name}`}
        description="التواصل المباشر مع أولياء أمور أطفال الصف ومتابعة الملاحظات والاستفسارات اليومية"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
        {/* Conversations List */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark flex flex-col h-full">
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="بحث في المحادثات..."
                className="w-full pr-9 pl-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs text-right focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {conversations.map((c) => {
              const isSelected = c.parentId === activeParentId;
              return (
                <button
                  key={c.parentId}
                  onClick={() => setActiveParentId(c.parentId)}
                  className={`w-full p-3.5 text-right transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-primary/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {c.parentName.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{c.parentName}</h4>
                        <span className="text-[10px] text-gray-400">({c.childName})</span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">{c.lastMessage}</p>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <span className="text-[10px] text-gray-400">{c.time}</span>
                    {c.unread > 0 && (
                      <span className="block mt-1 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold text-center leading-4">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Chat Thread */}
        <Card className="md:col-span-2 border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark flex flex-col h-full">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                {activeConv.parentName.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{activeConv.parentName}</h4>
                <p className="text-xs text-text-muted dark:text-text-mutedDark">
                  ولي أمر الطالب: {activeConv.childName}
                </p>
              </div>
            </div>
            <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full font-bold">
              متصل الآن
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {activeConv.messages.map((m) => {
              const isMe = m.sender === 'teacher';
              return (
                <div key={m.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-xs space-y-1 ${
                      isMe
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <p>{m.text}</p>
                    <div className={`text-[10px] flex items-center gap-1 ${isMe ? 'text-white/80' : 'text-gray-400'}`}>
                      <span>{m.time}</span>
                      {isMe && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Composer */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب رسالتك لولي الأمر هنا..."
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
    </div>
  );
}
