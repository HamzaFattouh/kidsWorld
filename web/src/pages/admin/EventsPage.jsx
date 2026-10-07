import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Edit2, Trash2, Calendar as CalendarIcon, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventApi } from '../../api/event';

export function EventsPage() {
  const { t } = useTranslation();
  
  const queryClient = useQueryClient();
  
  const { data: rawEvents = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: eventApi.getMany
  });
  const events = Array.isArray(rawEvents?.data) ? rawEvents.data : Array.isArray(rawEvents) ? rawEvents : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [albumFiles, setAlbumFiles] = useState([]);
  
  const [formData, setFormData] = useState({ 
    titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', 
    date: '', time: '', location: '', isPublished: true, image: '' 
  });

  const createMutation = useMutation({
    mutationFn: eventApi.createOne,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setIsModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: eventApi.deleteOne,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  const handleOpenModal = (event = null) => {
    if (event) {
      setEditingId(event.id);
      setFormData({
        titleEn: event.titleEn || '',
        titleAr: event.titleAr || '',
        descriptionEn: event.descriptionEn || '',
        descriptionAr: event.descriptionAr || '',
        date: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '',
        time: event.time || '10:00',
        location: event.location || 'الحضانة',
        isPublished: event.isPublished,
        image: event.imageUrl || ''
      });
    } else {
      setEditingId(null);
      setFormData({ 
        titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', 
        date: '', time: '', location: '', isPublished: true, image: '' 
      });
    }
    setFileToUpload(null);
    setAlbumFiles([]);
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToUpload(file);
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, image: url });
    }
  };

  const handleAlbumChange = (e) => {
    if (e.target.files) {
      setAlbumFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('titleAr', formData.titleAr);
    data.append('titleEn', formData.titleEn || formData.titleAr);
    data.append('descriptionAr', formData.descriptionAr);
    data.append('descriptionEn', formData.descriptionEn || formData.descriptionAr);
    data.append('eventDate', formData.date);
    data.append('isPublished', formData.isPublished);
    if (fileToUpload) {
      data.append('image', fileToUpload);
    }
    albumFiles.forEach(file => {
      data.append('album', file);
    });

    createMutation.mutate(data);
  };

  const handleDelete = (id) => {
    if(confirm('هل أنت متأكد من حذف هذه الفعالية؟')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.events.title', 'الفعاليات')}
        description="إدارة فعاليات وأنشطة الحضانة"
        actionLabel="إضافة فعالية جديدة"
        onAction={() => handleOpenModal()}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((item) => (
          <div key={item.id} className="bg-surface dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden group">
            <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800">
              <img src={item.imageUrl || item.image || 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=500&auto=format&fit=crop'} alt={item.titleAr} className="w-full h-full object-cover" />
              
              <div className="absolute top-4 end-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(item)} className="p-2 bg-white/90 dark:bg-gray-800/90 text-blue-600 hover:bg-white rounded-lg backdrop-blur-sm transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/90 dark:bg-gray-800/90 text-rose-600 hover:bg-white rounded-lg backdrop-blur-sm transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute top-4 start-4">
                {item.isPublished ? (
                  <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-md flex items-center gap-1 shadow-none">
                    <CheckCircle className="w-3 h-3" /> منشور
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-gray-800 text-white text-xs font-bold rounded-md flex items-center gap-1 shadow-none">
                    <XCircle className="w-3 h-3" /> مسودة
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="text-lg font-bold text-text dark:text-text-dark mb-2">{item.titleAr}</h3>
              <p className="text-sm text-text-muted dark:text-text-mutedDark line-clamp-2 mb-4">{item.descriptionAr}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="w-4 h-4 text-primary" /> {item.eventDate ? new Date(item.eventDate).toLocaleDateString() : item.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 text-primary" /> {item.time || '10:00 AM'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 text-primary" /> {item.location || 'الحضانة'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'تعديل الفعالية' : 'إضافة فعالية جديدة'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="اسم الفعالية"
            required
            value={formData.titleAr}
            onChange={(e) => setFormData({...formData, titleAr: e.target.value})}
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text dark:text-text-dark">الوصف</label>
            <textarea
              required
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-800 dark:bg-surface-dark"
              value={formData.descriptionAr}
              onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="التاريخ"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
            <Input
              label="الوقت"
              type="time"
              required
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
            />
          </div>

          <Input
            label="الموقع (المكان)"
            required
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text dark:text-text-dark">صورة الفعالية (اختياري)</label>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">اضغط لرفع الصورة</span></p>
                <p className="text-xs text-gray-500">PNG, JPG</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            {formData.image && (
              <div className="mt-2 h-24 rounded-xl overflow-hidden border border-gray-200 aspect-video relative group">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, image: ''})} 
                  className="absolute top-1 end-1 p-1 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text dark:text-text-dark">الصور الفرعية للألبوم (اختياري)</label>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">اضغط لرفع الصور</span></p>
                <p className="text-xs text-gray-500">اختر عدة صور</p>
              </div>
              <input type="file" className="hidden" accept="image/*" multiple onChange={handleAlbumChange} />
            </label>
            {albumFiles.length > 0 && (
              <div className="text-sm text-gray-500 mt-2">تم اختيار {albumFiles.length} صور</div>
            )}
          </div>

          <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-900/50">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
              className="w-5 h-5 text-primary rounded focus:ring-primary accent-primary"
            />
            <div>
              <p className="text-sm font-bold text-text dark:text-text-dark">نشر الفعالية فوراً</p>
              <p className="text-xs text-text-muted dark:text-text-mutedDark">ستظهر الفعالية للأهالي إذا قمت بتحديد هذا الخيار.</p>
            </div>
          </label>

          <div className="pt-4 flex gap-3">
            <Button type="submit" className="flex-1">
              {editingId ? 'حفظ التعديلات' : 'إضافة الفعالية'}
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