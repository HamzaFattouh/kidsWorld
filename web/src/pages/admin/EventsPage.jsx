import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Edit2, Trash2, Calendar as CalendarIcon, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { cn } from '../../lib/utils';
import { useContentStore } from '../../store/contentStore';

export function EventsPage() {
  const { t } = useTranslation();
  
  const { events, setEvents } = useContentStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '', location: '', isPublished: false, image: '' });

  const handleOpenModal = (eventItem = null) => {
    if (eventItem) {
      setEditingId(eventItem.id);
      setFormData(eventItem);
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', date: '', time: '', location: '', isPublished: false, image: '' });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      titleAr: formData.title,
      descriptionAr: formData.description,
      eventDate: formData.date,
      imageUrl: formData.image || 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=500&auto=format&fit=crop',
      image: formData.image || 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=500&auto=format&fit=crop' // placeholder if empty
    };
    if (editingId) {
      setEvents(events.map(ev => ev.id === editingId ? { ...updatedData, id: editingId } : ev));
    } else {
      setEvents([{ ...updatedData, id: Date.now() }, ...events]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if(confirm('هل أنت متأكد من حذف هذه الفعالية؟')) {
      setEvents(events.filter(e => e.id !== id));
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
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              
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
              <h3 className="text-lg font-bold text-text dark:text-text-dark mb-2">{item.title}</h3>
              <p className="text-sm text-text-muted dark:text-text-mutedDark line-clamp-2 mb-4">{item.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <CalendarIcon className="w-4 h-4 text-primary" /> {item.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 text-primary" /> {item.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4 text-primary" /> {item.location}
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
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text dark:text-text-dark">الوصف</label>
            <textarea
              required
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-800 dark:bg-surface-dark"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
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