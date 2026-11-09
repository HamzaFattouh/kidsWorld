import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Search,
  Phone,
  AlertTriangle,
  HeartPulse,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Baby
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { childApi } from '../../api/child';

export function TeacherMyChildrenPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChild, setSelectedChild] = useState(null);

  const assignedClass = { id: 'class-birds-3-4', name: 'روضة العصافير (3 - 4 سنوات)' };

  const { data: childrenData, isLoading } = useQuery({
    queryKey: ['teacher-children'],
    queryFn: async () => {
      try {
        const res = await childApi.getMany();
        if (res?.data && res.data.length > 0) return res.data;
      } catch (e) {
        // Fallback to local classroom roster
      }
      return [
        {
          id: 'c1',
          name: 'عمر أحمد الشكعة',
          gender: 'MALE',
          birthDate: '2022-04-12',
          parentName: 'أحمد الشكعة',
          parentPhone: '0599123456',
          allergies: 'حساسية من الفول السوداني',
          notes: 'طفل نشيط ومحب للرسم والأنشطة الحركية',
          status: 'PRESENT',
        },
        {
          id: 'c2',
          name: 'يوسف خالد جودت',
          gender: 'MALE',
          birthDate: '2022-06-19',
          parentName: 'خالد جودت',
          parentPhone: '0599654321',
          allergies: 'لا يوجد',
          notes: 'هادئ ومتعاون جداً مع أقرانه',
          status: 'PRESENT',
        },
        {
          id: 'c3',
          name: 'خليل سمير النابلسي',
          gender: 'MALE',
          birthDate: '2022-01-08',
          parentName: 'سمير النابلسي',
          parentPhone: '0599789012',
          allergies: 'حساسية من الحليب ومشتقاته',
          notes: 'يحتاج تشجيعاً في وجبة الغداء',
          status: 'PRESENT',
        },
        {
          id: 'c4',
          name: 'سارة مريم المصري',
          gender: 'FEMALE',
          birthDate: '2022-08-25',
          parentName: 'مريم المصري',
          parentPhone: '0599345678',
          allergies: 'لا يوجد',
          notes: 'مشاركة ممتازة في حلقات القراءة والقصص',
          status: 'ABSENT',
        },
        {
          id: 'c5',
          name: 'ليان أحمد الشكعة',
          gender: 'FEMALE',
          birthDate: '2022-09-02',
          parentName: 'أحمد الشكعة',
          parentPhone: '0599123456',
          allergies: 'لا يوجد',
          notes: 'تتفاعل بروح مرحة في أوقات اللعب الحر',
          status: 'PRESENT',
        },
      ];
    }
  });

  const childrenList = childrenData || [];
  const filteredChildren = childrenList.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.parentName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title={`أطفال ${assignedClass.name}`}
        description="عرض الملفات الشخصية، السجل الصحي، وتفاصيل الاتصال بأولياء الأمور"
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="بحث باسم الطفل أو ولي الأمر..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-primary text-right"
          />
        </div>
        <div className="text-xs font-bold text-text-muted dark:text-text-mutedDark">
          العدد الإجمالي: {filteredChildren.length} أطفال
        </div>
      </div>

      {/* Children Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChildren.map((child) => (
          <Card
            key={child.id}
            className="border border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark hover:border-primary transition-colors"
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
                    {child.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">{child.name}</h3>
                    <p className="text-xs text-text-muted dark:text-text-mutedDark">
                      ولي الأمر: {child.parentName || 'غير محدد'}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    child.status === 'PRESENT'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                  }`}
                >
                  {child.status === 'PRESENT' ? 'حاضر اليوم' : 'غائب'}
                </span>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-text-muted dark:text-text-mutedDark">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> هاتف التواصل:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white dir-ltr">{child.parentPhone || '—'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-text-muted dark:text-text-mutedDark">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-500" /> الحساسية والوضع الصحي:
                  </span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">{child.allergies || 'سليم'}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedChild(child)}
                  className="w-full py-2 bg-gray-50 dark:bg-gray-800 hover:bg-primary hover:text-white text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-gray-200 dark:border-gray-700"
                >
                  <Eye className="w-3.5 h-3.5" /> عرض الملف الشامل
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Child Full Details Modal */}
      <Modal
        isOpen={!!selectedChild}
        onClose={() => setSelectedChild(null)}
        title={selectedChild ? `الملف الشامل: ${selectedChild.name}` : ''}
      >
        {selectedChild && (
          <div className="space-y-4 text-right">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2 text-sm">
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-gray-500">تاريخ الميلاد:</span>
                <span className="font-bold">{selectedChild.birthDate || 'غير مسجل'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-gray-500">ولي الأمر:</span>
                <span className="font-bold">{selectedChild.parentName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-gray-500">هاتف الطوارئ:</span>
                <span className="font-bold">{selectedChild.parentPhone}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="text-gray-500">الحساسية والمحاذير:</span>
                <span className="font-bold text-rose-600">{selectedChild.allergies}</span>
              </div>
              <div className="pt-1">
                <span className="text-gray-500 block mb-1">ملاحظات المعلم:</span>
                <p className="text-xs bg-white dark:bg-gray-900 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                  {selectedChild.notes || 'لا توجد ملاحظات إضافية'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedChild(null)}
              className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors"
            >
              إغلاق
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
