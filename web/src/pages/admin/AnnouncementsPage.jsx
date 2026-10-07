import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Plus, Edit2, Trash2, Megaphone, AlertCircle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementApi } from '../../api/announcement';

export function AnnouncementsPage() {
  const { t } = useTranslation();
  
  const queryClient = useQueryClient();
  const { data: rawAnnouncements = [], isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: announcementApi.getMany
  });
  const announcements = Array.isArray(rawAnnouncements?.data) ? rawAnnouncements.data : Array.isArray(rawAnnouncements) ? rawAnnouncements : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ titleEn: '', titleAr: '', contentEn: '', contentAr: '', priority: 'NORMAL' });

  const createMutation = useMutation({
    mutationFn: announcementApi.createOne,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setIsModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: announcementApi.deleteOne,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    }
  });

  const handleOpenModal = (announcement = null) => {
    if (announcement) {
      setEditingId(announcement.id);
      setFormData({
        titleEn: announcement.titleEn || '',
        titleAr: announcement.titleAr || '',
        contentEn: announcement.contentEn || '',
        contentAr: announcement.contentAr || '',
        priority: announcement.priority || 'NORMAL'
      });
    } else {
      setEditingId(null);
      setFormData({ titleEn: '', titleAr: '', contentEn: '', contentAr: '', priority: 'NORMAL' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      titleAr: formData.titleAr,
      titleEn: formData.titleEn || formData.titleAr,
      contentAr: formData.contentAr,
      contentEn: formData.contentEn || formData.contentAr,
      priority: formData.priority,
      isPublished: true
    });
  };

  const handleDelete = (id) => {
    if(confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.announcements.title', 'الإعلانات')}
        description="إدارة ونشر الإعلانات الهامة لأولياء الأمور والمعلمين"
        actionLabel="إضافة إعلان جديد"
        onAction={() => handleOpenModal()}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((item) => (
          <div key={item.id} className="bg-surface dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/50 transition-colors group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "p-2 rounded-xl flex items-center justify-center",
                  item.priority === 'HIGH' || item.priority === 'URGENT' ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"
                )}>
                  {item.priority === 'HIGH' || item.priority === 'URGENT' ? <AlertCircle className="w-5 h-5" /> : <Megaphone className="w-5 h-5" />}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(item)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-text dark:text-text-dark mb-2">{item.titleAr}</h3>
              <p className="text-sm text-text-muted dark:text-text-mutedDark leading-relaxed">{item.contentAr}</p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs font-semibold">
              <span className={cn(
                "px-2.5 py-1 rounded-md",
                item.priority === 'HIGH' || item.priority === 'URGENT' ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"
              )}>
                {item.priority === 'HIGH' || item.priority === 'URGENT' ? 'هام جداً' : 'عادي'}
              </span>
              <span className="text-gray-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.date}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="عنوان الإعلان"
            required
            value={formData.titleAr}
            onChange={(e) => setFormData({...formData, titleAr: e.target.value})}
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text dark:text-text-dark">محتوى الإعلان</label>
            <textarea
              required
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-800 dark:bg-surface-dark"
              value={formData.contentAr}
              onChange={(e) => setFormData({...formData, contentAr: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text dark:text-text-dark">الأهمية</label>
              <select
                className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-800 dark:bg-surface-dark"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="Normal">عادي</option>
                <option value="High">هام جداً</option>
              </select>
            </div>
            
            <Input
              label="تاريخ النشر"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="submit" className="flex-1">
              {editingId ? 'حفظ التعديلات' : 'نشر الإعلان'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              إلغاء
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}