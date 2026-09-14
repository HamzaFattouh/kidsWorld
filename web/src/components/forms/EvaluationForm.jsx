import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  childId: z.string().min(1, 'Required'),
  term: z.string().min(1, 'Required'),
  learning: z.string().min(1, 'Required'),
  behavior: z.string().min(1, 'Required')
});








export function EvaluationForm({ onSubmit, isLoading }) {
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
        label={t('term')}
        type="text"
        {...register('term')}
        error={errors.term?.message} />
      
      <Input
        label={t('learning')}
        type="text"
        {...register('learning')}
        error={errors.learning?.message} />
      
      <Input
        label={t('behavior')}
        type="text"
        {...register('behavior')}
        error={errors.behavior?.message} />
      

      <div className="pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('submit', 'Submit')}
        </Button>
      </div>
    </form>);

}