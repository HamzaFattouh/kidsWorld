import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'TEACHER', 'PARENT']),
  isActive: z.boolean()
});








export function UserForm({ onSubmit, isLoading }) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'PARENT',
      isActive: true
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-start">
      <Input
        label={t('email_label')}
        type="email"
        {...register('email')}
        error={errors.email?.message} />
      
      <Input
        label={t('password_label')}
        type="password"
        {...register('password')}
        error={errors.password?.message} />
      
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-text dark:text-text-dark">Role</label>
        <select
          {...register('role')}
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white">
          
          <option value="ADMIN">Admin</option>
          <option value="TEACHER">Teacher</option>
          <option value="PARENT">Parent</option>
        </select>
        {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
      </div>

      <div className="flex items-center space-x-2 space-x-reverse pt-2">
        <input
          type="checkbox"
          id="isActive"
          {...register('isActive')}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
        
        <label htmlFor="isActive" className="text-sm text-text dark:text-text-dark">
          Active Account
        </label>
      </div>

      <div className="pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {t('submit')}
        </Button>
      </div>
    </form>);

}