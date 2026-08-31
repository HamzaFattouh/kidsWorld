import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  childId: z.string().min(1, 'Required'),
  date: z.string().min(1, 'Required'),
  time: z.string().min(1, 'Required'),
  severity: z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
});

export type IncidentFormValues = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: IncidentFormValues) => void;
  isLoading?: boolean;
}

export function IncidentForm({ onSubmit, isLoading }: Props) {
  const { t } = useTranslation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IncidentFormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-start">

      <Input
        label={t('childId')}
        type="text"
        {...register('childId')}
        error={errors.childId?.message}
      />
      <Input
        label={t('date')}
        type="text"
        {...register('date')}
        error={errors.date?.message}
      />
      <Input
        label={t('time')}
        type="text"
        {...register('time')}
        error={errors.time?.message}
      />
      <Input
        label={t('severity')}
        type="text"
        {...register('severity')}
        error={errors.severity?.message}
      />
      <Input
        label={t('description')}
        type="text"
        {...register('description')}
        error={errors.description?.message}
      />

      <div className="pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('submit', 'Submit')}
        </Button>
      </div>
    </form>
  );
}
