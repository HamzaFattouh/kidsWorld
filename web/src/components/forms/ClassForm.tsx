import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  capacity: z.number(),
  ageGroup: z.string().min(1, 'Required'),
});

export type ClassFormValues = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: ClassFormValues) => void;
  isLoading?: boolean;
}

export function ClassForm({ onSubmit, isLoading }: Props) {
  const { t } = useTranslation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-start">

      <Input
        label={t('name')}
        type="text"
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        label={t('capacity')}
        type="number"
        {...register('capacity', { valueAsNumber: true })}
        error={errors.capacity?.message}
      />
      <Input
        label={t('ageGroup')}
        type="text"
        {...register('ageGroup')}
        error={errors.ageGroup?.message}
      />

      <div className="pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('submit', 'Submit')}
        </Button>
      </div>
    </form>
  );
}
