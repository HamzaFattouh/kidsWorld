import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  phone: z.string().min(1, 'Required'),
  childId: z.string().min(1, 'Required'),
});

export type PickupFormValues = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: PickupFormValues) => void;
  isLoading?: boolean;
}

export function PickupForm({ onSubmit, isLoading }: Props) {
  const { t } = useTranslation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PickupFormValues>({
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
        label={t('phone')}
        type="text"
        {...register('phone')}
        error={errors.phone?.message}
      />
      <Input
        label={t('childId')}
        type="text"
        {...register('childId')}
        error={errors.childId?.message}
      />

      <div className="pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('submit', 'Submit')}
        </Button>
      </div>
    </form>
  );
}
