import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const loginSchema = z.object({
  email: z.string().min(1, 'يرجى إدخال الاسم أو البريد الإلكتروني'),
  password: z.string().min(1, 'كلمة المرور مطلوبة')
});

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [apiError, setApiError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      setApiError(null);
      const response = await api.post('/auth/login', data);

      const userData = response.data.data.user;
      const tokenData = response.data.data.token;
      setAuth({
        id: userData.id,
        email: userData.email,
        role: userData.role,
        requiresPasswordChange: userData.requiresPasswordChange
      }, tokenData);

      if (userData.requiresPasswordChange) {
        navigate('/auth/change-password');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setApiError(err.response?.data?.error?.message || t('error_occurred'));
    }
  };

  return (
    <div className="w-full bg-white dark:bg-surface-dark rounded-3xl shadow-2xl overflow-hidden relative border border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 min-h-[580px]">
      
      {/* Right Side: Big Logo (الجهة اليمنى) */}
      <div className="p-6 lg:p-10 flex flex-col items-center justify-center text-center bg-white dark:bg-surface-dark relative z-0">
        <div className="w-80 h-72 sm:w-[420px] sm:h-[320px] lg:w-[480px] lg:h-[360px] mb-4 p-2 flex items-center justify-center">
          <img src="/images/logo.png?v=7" alt="Kids World - عالم الأطفال" className="w-full h-full object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300" />
        </div>
        <h2 className="text-3xl font-display font-bold text-brand-dark dark:text-white mb-3">
          مرحباً بكم في عالم الأطفال
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm leading-relaxed">
          بيئة تعليمية وتربوية آمنة وممتعة لأطفالكم. يسعدنا انضمامكم إلينا!
        </p>
      </div>

      {/* Left Side: Form with Turquoise Background (الجهة اليسرى بخلفية تركوازية) */}
      <div className="bg-brand-green p-8 lg:p-12 flex flex-col justify-center text-white relative z-0">
        <div className="max-w-sm mx-auto w-full space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-display font-bold text-white">{t('login_title')}</h3>
            <p className="text-white/80 text-sm">أدخل بيانات الحساب للمتابعة</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-white/90 block">الاسم أو البريد الإلكتروني</label>
              <input
                type="text"
                {...register('email')}
                placeholder="أدخل الاسم أو البريد الإلكتروني"
                className="w-full px-4 py-3.5 rounded-xl bg-white text-brand-dark font-medium border-0 focus:ring-2 focus:ring-brand-yellow outline-none shadow-sm placeholder:text-gray-400"
              />
              {errors.email && <p className="text-xs text-red-200 mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-white/90 block">{t('password_label')}</label>
              <input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl bg-white text-brand-dark font-medium border-0 focus:ring-2 focus:ring-brand-yellow outline-none shadow-sm placeholder:text-gray-400"
              />
              {errors.password && <p className="text-xs text-red-200 mt-1">{errors.password.message}</p>}
            </div>

            {apiError && (
              <div className="p-3 bg-red-500/20 border border-red-200/40 text-white rounded-xl text-sm text-center font-medium">
                {apiError}
              </div>
            )}

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-4 bg-brand-yellow hover:bg-amber-400 text-brand-dark font-display font-bold text-lg rounded-xl shadow-lg transition-transform active:scale-95 border-0 mt-2"
            >
              {t('login_button')}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate('/auth/forgot-password')}
                className="text-sm text-white/90 hover:text-white underline decoration-white/40 underline-offset-4 font-medium transition-colors"
              >
                {t('forgot_password')}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}