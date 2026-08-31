
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

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setApiError(null);
      await api.post('/auth/forgot-password', data);
      setSuccess(true);
    } catch (err: any) {
      setApiError(err.response?.data?.error?.message || t('error_occurred'));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl">{t('forgot_password')}</CardTitle>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="text-center space-y-4">
            <p className="text-green-600 dark:text-green-400">
              {t('reset_link_sent', 'If an account exists, a reset link has been sent.')}
            </p>
            <Button onClick={() => navigate('/auth/login')} variant="outline" className="w-full">
              {t('back_to_login', 'Back to Login')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input 
              label={t('email_label')}
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
            
            {apiError && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
                {apiError}
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              {t('submit')}
            </Button>

            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => navigate('/auth/login')}
                className="text-sm text-primary hover:underline"
              >
                {t('back_to_login', 'Back to Login')}
              </button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
