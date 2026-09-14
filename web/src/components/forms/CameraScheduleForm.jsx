import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  cameraId: z.string().min(1, 'Required'),
  dayOfWeek: z.number(),
  startTime: z.string().min(1, 'Required'),
  endTime: z.string().min(1, 'Required')
});








export function CameraScheduleForm({ onSubmit, isLoading }) {
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
        label={t('cameraId')}
        type="text"
        {...register('cameraId')}
        error={errors.cameraId?.message} />
      
      <Input
        label={t('dayOfWeek')}
        type="number"
        {...register('dayOfWeek', { valueAsNumber: true })}
        error={errors.dayOfWeek?.message} />
      
      <Input
        label={t('startTime')}
        type="text"
        {...register('startTime')}
        error={errors.startTime?.message} />
      
      <Input
        label={t('endTime')}
        type="text"
        {...register('endTime')}
        error={errors.endTime?.message} />
      

      <div className="pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('submit', 'Submit')}
        </Button>
      </div>
    </form>);

}