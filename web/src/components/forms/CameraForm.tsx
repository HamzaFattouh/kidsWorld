import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  streamUrl: z.string().min(1, 'Required'),
  classId: z.string().min(1, 'Required'),
});

export type CameraFormValues = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: CameraFormValues) => void;
  isLoading?: boolean;
}

export function CameraForm({ onSubmit, isLoading }: Props) {
  const { t } = useTranslation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CameraFormValues>({
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
        label={t('streamUrl')}
        type="text"
        {...register('streamUrl')}
        error={errors.streamUrl?.message}
      />
      <Input
        label={t('classId')}
        type="text"
        {...register('classId')}
        error={errors.classId?.message}
      />

      <div className="pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('submit', 'Submit')}
        </Button>
      </div>
    </form>
  );
}
