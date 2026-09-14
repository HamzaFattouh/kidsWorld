import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Layout } from 'lucide-react';
import { homepageConfigApi } from '../../api/homepageConfig';

const textSections = [
  { id: 'hero', name: 'الواجهة الرئيسية (Hero)' },
  { id: 'about', name: 'عن الحضانة' },
  { id: 'contact', name: 'معلومات التواصل' }
];

export function HomepageCMSPage() {
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await homepageConfigApi.getMany();
      const configMap = {};
      res.data.forEach(item => {
        configMap[item.section] = item;
      });
      setConfigs(configMap);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (sectionId) => {
    try {
      setLoading(true);
      const data = configs[sectionId] || { section: sectionId };
      await homepageConfigApi.updateSection(data);
      alert('تم الحفظ بنجاح');
      fetchConfigs();
    } catch (error) {
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (sectionId, field, value) => {
    setConfigs(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        section: sectionId,
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="إدارة نصوص وعناصر الصفحة الرئيسية"
        description="تغيير النصوص والعناوين الخاصة بالصفحة الرئيسية" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {textSections.map((section) => (
          <Card key={section.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
              <CardTitle className="text-lg font-display text-brand-dark flex items-center gap-2">
                <Layout className="w-5 h-5 text-brand-green" />
                {section.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Input
                label="العنوان (انجليزي)"
                value={configs[section.id]?.titleEn || ''}
                onChange={(e) => handleChange(section.id, 'titleEn', e.target.value)}
              />
              <Input
                label="العنوان (عربي)"
                value={configs[section.id]?.titleAr || ''}
                onChange={(e) => handleChange(section.id, 'titleAr', e.target.value)}
              />
              <Input
                type="textarea"
                label="النص (انجليزي)"
                value={configs[section.id]?.bodyEn || ''}
                onChange={(e) => handleChange(section.id, 'bodyEn', e.target.value)}
              />
              <Input
                type="textarea"
                label="النص (عربي)"
                value={configs[section.id]?.bodyAr || ''}
                onChange={(e) => handleChange(section.id, 'bodyAr', e.target.value)}
              />
              <Button 
                onClick={() => handleUpdate(section.id)}
                isLoading={loading}
                className="w-full mt-4"
              >
                حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}