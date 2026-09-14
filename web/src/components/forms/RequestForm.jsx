import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  parentId: z.string().min(1, 'Required'),
  type: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required')
});








export function RequestForm({ onSubmit, isLoading }) {
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
        label={t('parentId')}
        type="text"
        {...register('parentId')}
        error={errors.parentId?.message} />
      
      <Input
        label={t('type')}
        type="text"
        {...register('type')}
        error={errors.type?.message} />
      
      <Input
        label={t('description')}
        type="text"
        {...register('description')}
        error={errors.description?.message} />
      

      <div className="pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('submit', 'Submit')}
        </Button>
      </div>
    </form>);

}