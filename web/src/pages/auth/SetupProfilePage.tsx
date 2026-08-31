import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../lib/api';

export const SetupProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    nationalId: user?.nationalId || '',
    phone: user?.phone || '',
    alternatePhone: user?.alternatePhone || '',
    address: user?.address || '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If user is not logged in or doesn't need setup, redirect
  React.useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    } else if (!user.requiresPasswordChange && user.name) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (user?.requiresPasswordChange && formData.password !== formData.confirmPassword) {
      setError(i18n.language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.put('/users/setup-profile', {
        name: formData.name,
        nationalId: formData.nationalId,
        phone: formData.phone,
        alternatePhone: formData.alternatePhone,
        address: formData.address,
        password: formData.password || undefined,
      });

      const data = res.data;
      
      setAuth(data.data);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 dark:border-gray-700 mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {i18n.language === 'ar' ? 'إكمال بيانات الحساب' : 'Setup Your Profile'}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {i18n.language === 'ar' 
            ? 'يرجى إكمال بياناتك وتعيين كلمة مرور جديدة للمتابعة.'
            : 'Please complete your profile details and set a new password to continue.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm text-center font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={i18n.language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder={i18n.language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
          />
          <Input
            label={i18n.language === 'ar' ? 'رقم الهوية' : 'National ID'}
            type="text"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            required
            placeholder={i18n.language === 'ar' ? 'أدخل رقم الهوية' : 'Enter your national ID'}
          />
          <Input
            label={i18n.language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder={i18n.language === 'ar' ? 'أدخل رقم الهاتف' : 'Enter your phone number'}
          />
          <Input
            label={i18n.language === 'ar' ? 'رقم هاتف بديل' : 'Alternate Phone'}
            type="tel"
            name="alternatePhone"
            value={formData.alternatePhone}
            onChange={handleChange}
            placeholder={i18n.language === 'ar' ? 'رقم إضافي للطوارئ' : 'Emergency contact number'}
          />
          <div className="md:col-span-2">
            <Input
              label={i18n.language === 'ar' ? 'العنوان' : 'Address'}
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder={i18n.language === 'ar' ? 'أدخل عنوان السكن' : 'Enter your home address'}
            />
          </div>
        </div>

        {user?.requiresPasswordChange && (
          <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label={t('new_password', 'New Password')}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
            <Input
              label={t('confirm_password', 'Confirm Password')}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>
        )}

        <Button 
          type="submit" 
          isLoading={isLoading}
          className="w-full mt-8"
        >
          {t('save', 'Save & Continue')}
        </Button>
      </form>
    </div>
  );
};
