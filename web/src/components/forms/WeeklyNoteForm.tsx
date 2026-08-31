import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  childId: z.string().min(1, 'Required'),
  weekStartDate: z.string().min(1, 'Required'),
  generalNotes: z.string().min(1, 'Required'),
});

export type WeeklyNoteFormValues = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: WeeklyNoteFormValues) => void;
  isLoading?: boolean;
}

export function WeeklyNoteForm({ onSubmit, isLoading }: Props) {
  const { t } = useTranslation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WeeklyNoteFormValues>({
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
        label={t('weekStartDate')}
        type="text"
        {...register('weekStartDate')}
        error={errors.weekStartDate?.message}
      />
      <Input
        label={t('generalNotes')}
        type="text"
        {...register('generalNotes')}
        error={errors.generalNotes?.message}
      />

      <div className="pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('submit', 'Submit')}
        </Button>
      </div>
    </form>
  );
}
