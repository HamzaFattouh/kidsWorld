import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Edit2, Trash2, Calendar, User, FileText } from 'lucide-react';
import { Input } from '../../components/ui/Input';

export function PostsPage() {
  const { t } = useTranslation();
  
  const [posts, setPosts] = useState([
    { 
      id: 1, 
      title: 'أهمية القراءة المبكرة للأطفال', 
      content: 'تعتبر القراءة المبكرة من أهم الركائز في تطور لغة الطفل وتنمية خياله. ننصح بتخصيص 15 دقيقة يومياً للقراءة مع طفلك لتعزيز الروابط وتقوية مهاراته اللغوية والاستيعابية...', 
      date: '2026-10-01',
      author: 'أ. نورة النابلسي',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=500&auto=format&fit=crop'
    },
    { 
      id: 2, 
      title: 'نصائح لغذاء صحي ومتوازن', 
      content: 'تغذية الطفل السليمة تنعكس على نشاطه وتركيزه في الروضة. احرصي على توفير وجبات متكاملة تحتوي على الخضار والفواكه الطازجة، وتجنبي الحلويات المصنعة...', 
      date: '2026-09-25',
      author: 'قسم التغذية',
      image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=500&auto=format&fit=crop'
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ title: '', content: '', author: '', image: '', date: '' });

  const handleOpenModal = (post = null) => {
    if (post) {
      setEditingId(post.id);
      setFormData(post);
    } else {
      setEditingId(null);
      setFormData({ title: '', content: '', author: 'الإدارة', image: '', date: new Date().toISOString().split('T')[0] });
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
      image: formData.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=500&auto=format&fit=crop' // placeholder
    };
    if (editingId) {
      setPosts(posts.map(p => p.id === editingId ? { ...updatedData, id: editingId } : p));
    } else {
      setPosts([{ ...updatedData, id: Date.now() }, ...posts]); // Add new at top
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if(confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.posts.title', 'المنشورات (المقالات)')}
        description="إدارة ونشر المقالات والنصائح التربوية"
        actionLabel="كتابة منشور جديد"
        onAction={() => handleOpenModal()}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {posts.map((item) => (
          <div key={item.id} className="bg-surface dark:bg-surface-dark border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden group flex flex-col sm:flex-row">
            <div className="w-full sm:w-2/5 h-48 sm:h-auto relative bg-gray-100 dark:bg-gray-800">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-text dark:text-text-dark">{item.title}</h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(item)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-text-muted dark:text-text-mutedDark line-clamp-3 mb-4 leading-relaxed">{item.content}</p>
              </div>
              
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" /> {item.author}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> {item.date}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'تعديل المنشور' : 'كتابة منشور جديد'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="عنوان المنشور"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text dark:text-text-dark">محتوى المنشور (المقالة)</label>
            <textarea
              required
              rows={6}
              className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-800 dark:bg-surface-dark"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="الكاتب"
              required
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
            />
            <Input
              label="التاريخ"
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text dark:text-text-dark">الصورة البارزة (اختياري)</label>
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

          <div className="pt-4 flex gap-3">
            <Button type="submit" className="flex-1 flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              {editingId ? 'حفظ التعديلات' : 'نشر المقالة'}
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