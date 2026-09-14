
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';
import { Loader2 } from 'lucide-react';

export function VerifyEmailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg(t('missing_token', 'Invalid or missing verification token.'));
      return;
    }

    const verifyToken = async () => {
      try {
        await api.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMsg(err.response?.data?.error?.message || t('error_occurred'));
      }
    };

    verifyToken();
  }, [token, t]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-xl">{t('verify_email', 'Email Verification')}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {status === 'loading' &&
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-text-muted dark:text-text-mutedDark">
              {t('verifying', 'Verifying your email address...')}
            </p>
          </div>
        }

        {status === 'success' &&
        <div className="space-y-4 py-4">
            <p className="text-green-600 dark:text-green-400 font-medium">
              {t('verify_success', 'Your email has been verified successfully!')}
            </p>
            <Button onClick={() => navigate('/auth/login')} className="w-full">
              {t('login_button')}
            </Button>
          </div>
        }

        {status === 'error' &&
        <div className="space-y-4 py-4">
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {errorMsg}
            </div>
            <Button onClick={() => navigate('/auth/login')} variant="outline" className="w-full">
              {t('back_to_login', 'Back to Login')}
            </Button>
          </div>
        }
      </CardContent>
    </Card>);

}