
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setApiError(t('missing_token', 'Invalid or missing reset token.'));
      return;
    }
    
    try {
      setApiError(null);
      await api.post('/auth/reset-password', { token, newPassword: data.newPassword });
      setSuccess(true);
    } catch (err: any) {
      setApiError(err.response?.data?.error || t('error_occurred'));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl">{t('reset_password', 'Reset Password')}</CardTitle>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="text-center space-y-4">
            <p className="text-green-600 dark:text-green-400">
              {t('password_reset_success', 'Your password has been successfully reset.')}
            </p>
            <Button onClick={() => navigate('/auth/login')} className="w-full">
              {t('back_to_login', 'Back to Login')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!token && (
               <div className="p-3 bg-yellow-100 text-yellow-800 rounded-md text-sm text-center mb-4">
                 {t('missing_token_warning', 'No reset token provided in URL.')}
               </div>
            )}
            
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

            <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={!token}>
              {t('save')}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
