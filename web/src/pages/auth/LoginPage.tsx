
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

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setApiError(null);
      const response = await api.post('/auth/login', data);
      
      const user = response.data.data;
      setAuth({
        id: user.userId,
        email: user.email,
        role: user.role,
        requiresPasswordChange: user.requiresPasswordChange
      });

      if (user.requiresPasswordChange) {
        navigate('/auth/change-password');
      } else {
        navigate('/dashboard'); // or appropriate home route based on role
      }
    } catch (err: any) {
      setApiError(err.response?.data?.error || t('error_occurred'));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-2xl">{t('login_title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            label={t('email_label')}
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input 
            label={t('password_label')}
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />
          
          {apiError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
              {apiError}
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            {t('login_button')}
          </Button>

          <div className="text-center mt-4">
            <button 
              type="button" 
              onClick={() => navigate('/auth/forgot-password')}
              className="text-sm text-primary hover:underline"
            >
              {t('forgot_password')}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
