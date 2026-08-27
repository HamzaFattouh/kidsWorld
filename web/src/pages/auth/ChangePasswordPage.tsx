
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const changePasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export function ChangePasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema)
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      setApiError(null);
      await api.post('/auth/change-password', { newPassword: data.newPassword });
      
      if (user) {
        setAuth({ ...user, requiresPasswordChange: false });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setApiError(err.response?.data?.error || t('error_occurred'));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl">{t('change_temp_password')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            label={t('new_password')}
            type="password"
            {...register('newPassword')}
            error={errors.newPassword?.message}
          />
          <Input 
            label={t('confirm_password')}
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          
          {apiError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
              {apiError}
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            {t('save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
