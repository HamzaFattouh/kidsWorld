import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Search, User, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function MessagesPage() {
  const { t } = useTranslation();
  const [selectedThread, setSelectedThread] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const threads = [
    {
      id: 1,
      parent: { id: '1', name: 'أحمد محمود' },
      teacher: { id: '1', name: 'سارة محمد' },
      lastMessage: 'الحمد لله، شكراً لك.',
      time: '10:20 AM',
      unread: 0,
      messages: [
        { id: 1, sender: 'parent', text: 'السلام عليكم، كيف حال ابني اليوم؟', time: '10:00 AM' },
        { id: 2, sender: 'teacher', text: 'وعليكم السلام، هو بخير والحمد لله. شارك في الأنشطة بشكل ممتاز.', time: '10:15 AM' },
        { id: 3, sender: 'parent', text: 'الحمد لله، شكراً لك.', time: '10:20 AM' },
      ]
    },
    {
      id: 2,
      parent: { id: '2', name: 'فاطمة علي' },
      teacher: { id: '2', name: 'منى أحمد' },
      lastMessage: 'حسناً، سأقوم بإرسالها.',
      time: 'الأمس',
      unread: 0,
      messages: [
        { id: 1, sender: 'teacher', text: 'يرجى إرسال أدوات الرسم غداً.', time: '09:00 AM' },
        { id: 2, sender: 'parent', text: 'حسناً، سأقوم بإرسالها.', time: '09:30 AM' },
      ]
    }
  ];

  const filteredThreads = threads.filter(thread => 
    thread.parent.name.includes(searchQuery) || thread.teacher.name.includes(searchQuery)
  );

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-10rem)]">
      <PageHeader
        title={t('pages.messages.title', 'الرسائل')}
        description="مراقبة الرسائل المتبادلة بين أولياء الأمور والمعلمين."
      />
      
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Threads List Sidebar */}
        <Card className="w-full md:w-1/3 flex flex-col overflow-hidden border-gray-200 dark:border-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted dark:text-text-mutedDark" />
              <input
                type="text"
                placeholder="بحث بالاسم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-md border border-gray-200 bg-surface dark:border-gray-800 dark:bg-surface-dark focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                style={{ direction: 'rtl' }}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.map(thread => (
              <button
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                className={cn(
                  "w-full text-start p-4 border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                  selectedThread?.id === thread.id && "bg-primary/5 dark:bg-primary/10 border-s-4 border-s-primary"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm text-text dark:text-text-dark">
                    {thread.parent.name} <span className="text-xs font-normal text-text-muted mx-1">-</span> {thread.teacher.name}
                  </span>
                  <span className="text-xs text-text-muted dark:text-text-mutedDark">{thread.time}</span>
                </div>
                <p className="text-xs text-text-muted dark:text-text-mutedDark truncate">
                  {thread.lastMessage}
                </p>
              </button>
            ))}
            {filteredThreads.length === 0 && (
              <div className="p-8 text-center text-text-muted dark:text-text-mutedDark text-sm">
                لا توجد رسائل مطابقة
              </div>
            )}
          </div>
        </Card>

        {/* Message Details */}
        <Card className="hidden md:flex flex-1 flex-col overflow-hidden border-gray-200 dark:border-gray-800">
          {selectedThread ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                <div>
                  <h3 className="font-semibold text-text dark:text-text-dark flex items-center gap-2 flex-wrap">
                    المحادثة بين: 
                    <Link to={`/admin/parents`} className="text-primary hover:underline flex items-center gap-1 mx-1">
                      <User className="h-4 w-4" /> {selectedThread.parent.name} (ولي أمر)
                    </Link>
                    <span className="text-text-muted">و</span>
                    <span className="text-brand-green flex items-center gap-1 mx-1">
                      <User className="h-4 w-4" /> {selectedThread.teacher.name} (معلم)
                    </span>
                  </h3>
                </div>
              </div>
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface dark:bg-surface-dark">
                {selectedThread.messages.map(msg => {
                  const isParent = msg.sender === 'parent';
                  return (
                    <div key={msg.id} className={cn("flex max-w-[80%]", isParent ? "ms-auto justify-end" : "me-auto justify-start")}>
                      <div className={cn(
                        "rounded-2xl p-4",
                        isParent 
                          ? "bg-primary text-white rounded-tr-sm" 
                          : "bg-gray-100 dark:bg-gray-800 text-text dark:text-text-dark rounded-tl-sm"
                      )}>
                        <div className="text-xs mb-1 opacity-75 flex items-center gap-1 font-medium">
                          {isParent ? selectedThread.parent.name : selectedThread.teacher.name}
                        </div>
                        <p className="text-sm">{msg.text}</p>
                        <div className="text-[10px] mt-2 opacity-70 text-end">
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted dark:text-text-mutedDark">
              <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
              <p>اختر محادثة لعرض التفاصيل</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}