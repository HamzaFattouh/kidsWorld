import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  titleEn: z.string().min(1, 'Required'),
  titleAr: z.string().min(1, 'Required'),
  descriptionEn: z.string().min(1, 'Required'),
  descriptionAr: z.string().min(1, 'Required'),
  eventDate: z.string().min(1, 'Required'),
  isPublished: z.boolean().optional(),
  image: z.any().optional()
});








export function EventForm({ onSubmit, isLoading }) {
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
        label={t('titleAr')}
        type="text"
        {...register('titleAr')}
        error={errors.titleAr?.message} />
      
      <Input
        label={t('eventDate', 'Event Date')}
        type="datetime-local"
        {...register('eventDate')}
        error={errors.eventDate?.message} />

      <Input
        label={t('descriptionEn', 'Description (English)')}
        type="textarea"
        {...register('descriptionEn')}
        error={errors.descriptionEn?.message} />
      
      <Input
        label={t('descriptionAr', 'Description (Arabic)')}
        type="textarea"
        {...register('descriptionAr')}
        error={errors.descriptionAr?.message} />

      <Input
        label={t('image', 'Event Image')}
        type="file"
        accept="image/*"
        {...register('image')}
        error={errors.image?.message} />

      <div className="flex items-center gap-2">
        <input type="checkbox" id="isPublished" {...register('isPublished')} />
        <label htmlFor="isPublished">{t('isPublished', 'Publish immediately')}</label>
      </div>
      

      <div className="pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('submit', 'Submit')}
        </Button>
      </div>
    </form>);

}