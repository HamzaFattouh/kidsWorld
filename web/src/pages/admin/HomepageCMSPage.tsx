import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Upload, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';

const sections = [
  { id: 'hero', name: 'صورة الواجهة الرئيسية (البطل)' },
  { id: 'welcome', name: 'صورة قسم الترحيب' },
  { id: 'programs', name: 'صورة البرامج' },
  { id: 'value_1', name: 'صورة القيمة 1 (التعلم واللعب)' },
  { id: 'value_2', name: 'صورة القيمة 2 (وجبات مغذية)' },
  { id: 'value_3', name: 'صورة القيمة 3 (معلمون رائعون)' },
  { id: 'class_1', name: 'صورة نشاط 1 (الموسيقى)' },
  { id: 'class_2', name: 'صورة نشاط 2 (الألوان)' },
  { id: 'class_3', name: 'صورة نشاط 3 (الأرقام)' }
];

export function HomepageCMSPage() {
  const [uploading, setUploading] = useState<string | null>(null);
  const [status, setStatus] = useState<{ [key: string]: 'success' | 'error' | null }>({});
  const [previewImages, setPreviewImages] = useState<{ [key: string]: string }>({});

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, section: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(section);
    setStatus(prev => ({ ...prev, [section]: null }));

    const formData = new FormData();
    formData.append('image', file);
    formData.append('section', section);

    try {
      // Assuming Vite dev server proxies /api to backend
      const response = await fetch('http://localhost:3000/api/v1/cms/upload-image', {
        method: 'POST',
        headers: {
          'x-app-client': 'web'
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setStatus(prev => ({ ...prev, [section]: 'success' }));
      // Update preview with cache buster
      setPreviewImages(prev => ({ ...prev, [section]: `${data.path}?t=${Date.now()}` }));
    } catch (error) {
      console.error(error);
      setStatus(prev => ({ ...prev, [section]: 'error' }));
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader 
        title="إدارة صور الصفحة الرئيسية" 
        description="يمكنك من هنا تغيير وتحديث الصور التي تظهر في الصفحة الرئيسية للموقع مباشرة." 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Card key={section.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
              <CardTitle className="text-lg font-display text-brand-dark flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-green" />
                {section.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={previewImages[section.id] || `/images/dynamic/${section.id}.jpg`} 
                    alt={section.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image doesn't exist yet
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                    }}
                  />
                  {uploading === section.id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="relative overflow-hidden inline-block">
                    <button className="bg-brand-blue hover:bg-brand-blue/90 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
                      <Upload className="w-4 h-4" />
                      اختر صورة جديدة
                    </button>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, section.id)}
                      disabled={uploading === section.id}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  {status[section.id] === 'success' && (
                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      تم التحديث
                    </div>
                  )}
                  {status[section.id] === 'error' && (
                    <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                      <AlertCircle className="w-4 h-4" />
                      فشل الرفع
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
