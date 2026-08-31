import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  titleEn: z.string().min(1, 'Required'),
  titleAr: z.string().min(1, 'Required'),
  eventDate: z.string().min(1, 'Required'),
});

export type EventFormValues = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: EventFormValues) => void;
  isLoading?: boolean;
}

export function EventForm({ onSubmit, isLoading }: Props) {
  const { t } = useTranslation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-start">

      <Input
        label={t('titleEn')}
        type="text"
        {...register('titleEn')}
        error={errors.titleEn?.message}
      />
      <Input
        label={t('titleAr')}
        type="text"
        {...register('titleAr')}
        error={errors.titleAr?.message}
      />
      <Input
        label={t('eventDate')}
        type="text"
        {...register('eventDate')}
        error={errors.eventDate?.message}
      />

      <div className="pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('submit', 'Submit')}
        </Button>
      </div>
    </form>
  );
}
