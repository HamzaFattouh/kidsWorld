import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  titleEn: z.string().min(1, 'Required'),
  contentEn: z.string().min(1, 'Required')
});








export function PostForm({ onSubmit, isLoading }) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-start">

      <Input
        label={t('titleEn')}
        type="text"
        {...register('titleEn')}
        error={errors.titleEn?.message} />
      
      <Input
        label={t('contentEn')}
        type="text"
        {...register('contentEn')}
        error={errors.contentEn?.message} />
      

      <div className="pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('submit', 'Submit')}
        </Button>
      </div>
    </form>);

}