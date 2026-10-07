import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Trash2, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { useContentStore } from '../../store/contentStore';

export function GalleryPage() {
  const { t } = useTranslation();
  
  const { galleryImages: images, setGalleryImages: setImages } = useContentStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ imageUrl: '', title: '' });

  const handleOpenModal = () => {
    setFormData({ imageUrl: '', title: '' });
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.imageUrl) return;
    setImages([{ url: formData.imageUrl, title: formData.title, captionAr: formData.title, date: new Date().toISOString().split('T')[0], id: Date.now() }, ...images]); // Add new at top
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if(confirm('هل أنت متأكد من حذف هذه الصورة من المعرض؟')) {
      setImages(images.filter(img => img.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.gallery.title', 'معرض الصور')}
        description="إدارة صور الحضانة والأنشطة والفعاليات"
        actionLabel="رفع صورة جديدة"
        onAction={() => handleOpenModal()}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((item) => (
          <div key={item.id} className="relative group rounded-2xl overflow-hidden aspect-square bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <h3 className="text-white font-bold text-sm truncate">{item.title}</h3>
            </div>
            
            {/* Delete Action */}
            <div className="absolute top-3 end-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button onClick={() => handleDelete(item.id)} className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-surface border border-dashed border-gray-300 rounded-2xl">
          <ImageIcon className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-text-muted font-bold">لا يوجد صور في المعرض حالياً</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="إضافة صورة للمعرض"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text dark:text-text-dark">رفع الصورة</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">اضغط لرفع الصورة</span> أو اسحب الصورة وأفلتها هنا</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, JPEG (الحد الأقصى 5MB)</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
          
          <Input
            label="وصف / عنوان الصورة"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="مثال: نشاط الرسم الحر"
          />

          {formData.imageUrl && (
            <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-50 flex items-center justify-center relative group">
              <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => setFormData({...formData, imageUrl: ''})} 
                className="absolute top-2 end-2 p-1.5 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
              <UploadCloud className="w-4 h-4" /> رفع للصورة
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