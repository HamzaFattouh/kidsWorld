import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  childId: z.string().min(1, 'Required'),
  type: z.string().min(1, 'Required'),
  consumed: z.string().min(1, 'Required')
});








export function MealForm({ onSubmit, isLoading }) {
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
        label={t('childId')}
        type="text"
        {...register('childId')}
        error={errors.childId?.message} />
      
      <Input
        label={t('type')}
        type="text"
        {...register('type')}
        error={errors.type?.message} />
      
      <Input
        label={t('consumed')}
        type="text"
        {...register('consumed')}
        error={errors.consumed?.message} />
      

      <div className="pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('submit', 'Submit')}
        </Button>
      </div>
    </form>);

}