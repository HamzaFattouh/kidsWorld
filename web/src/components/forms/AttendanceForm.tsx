import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  childId: z.string().min(1, 'Required'),
  date: z.string().min(1, 'Required'),
  status: z.string().min(1, 'Required'),
  notes: z.string().min(1, 'Required'),
});

export type AttendanceFormValues = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: AttendanceFormValues) => void;
  isLoading?: boolean;
}

export function AttendanceForm({ onSubmit, isLoading }: Props) {
  const { t } = useTranslation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AttendanceFormValues>({
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
        label={t('status')}
        type="text"
        {...register('status')}
        error={errors.status?.message}
      />
      <Input
        label={t('notes')}
        type="text"
        {...register('notes')}
        error={errors.notes?.message}
      />

      <div className="pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('submit', 'Submit')}
        </Button>
      </div>
    </form>
  );
}
