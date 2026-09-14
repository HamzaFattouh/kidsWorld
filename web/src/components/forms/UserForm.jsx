import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const userSchema = z.object({
  name: z.string().min(2, 'الاسم الكامل مطلوب (حرفين على الأقل)'),
  password: z.string().min(8, 'كلمة المرور يجب أن لا تقل عن 8 خانات'),
  role: z.enum(['ADMIN', 'TEACHER', 'PARENT']),
  email: z.string().email('عنوان بريد إلكتروني غير صحيح').optional().or(z.literal('')),
  phone: z.string().optional(),
  nationalId: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean()
});

export function UserForm({ onSubmit, isLoading }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar' || !i18n.language;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'PARENT',
      phone: '',
      nationalId: '',
      address: '',
      isActive: true
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-start">
      <Input
        label={isAr ? 'الاسم الكامل (يُستخدم لتسجيل الدخول)' : 'Full Name (Used for Login)'}
        type="text"
        placeholder={isAr ? 'مثال: أحمد محمود' : 'e.g. Ahmed Mahmoud'}
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label={isAr ? 'كلمة المرور المؤقتة' : 'Temporary Password'}
        type="password"
        placeholder="••••••••"
        {...register('password')}
        error={errors.password?.message}
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-text dark:text-text-dark">
          {isAr ? 'دور المستخدم (الصلاحيات)' : 'User Role'}
        </label>
        <select
          {...register('role')}
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="ADMIN">{isAr ? 'مدير نظام (Admin)' : 'Admin'}</option>
          <option value="TEACHER">{isAr ? 'معلم / معلمة (Teacher)' : 'Teacher'}</option>
          <option value="PARENT">{isAr ? 'ولي أمر (Parent)' : 'Parent'}</option>
        </select>
        {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
      </div>

      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
        <span>🔒</span>
        <span>
          {isAr 
            ? 'سيُطلب من المستخدم إلزامياً تغيير كلمة المرور هذه واستكمال بياناته فور تسجيل دخوله لأول مرة.' 
            : 'The user will be required to change this password on their first login.'}
        </span>
      </div>

      <hr className="border-gray-100 dark:border-gray-700 my-2" />
      <p className="text-xs font-bold text-gray-400 dark:text-gray-500">
        {isAr ? 'بيانات اختيارية إضافة (يمكن إكمالها لاحقاً):' : 'Optional Additional Info:'}
      </p>

      <Input
        label={isAr ? 'البريد الإلكتروني (اختياري)' : 'Email Address (Optional)'}
        type="email"
        placeholder="name@example.com"
        {...register('email')}
        error={errors.email?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={isAr ? 'رقم الهاتف' : 'Phone Number'}
          type="tel"
          placeholder="05xxxxxxx"
          {...register('phone')}
          error={errors.phone?.message}
        />

        <Input
          label={isAr ? 'رقم الهوية' : 'National ID'}
          type="text"
          placeholder={isAr ? 'أدخل رقم الهوية' : 'National ID'}
          {...register('nationalId')}
          error={errors.nationalId?.message}
        />
      </div>

      <Input
        label={isAr ? 'العنوان' : 'Address'}
        type="text"
        placeholder={isAr ? 'أدخل عنوان السكن' : 'Home address'}
        {...register('address')}
        error={errors.address?.message}
      />

      <div className="flex items-center space-x-2 space-x-reverse pt-2">
        <input
          type="checkbox"
          id="isActive"
          {...register('isActive')}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="isActive" className="text-sm text-text dark:text-text-dark font-medium">
          {isAr ? 'تفعيل الحساب مباشرة' : 'Active Account'}
        </label>
      </div>

      <div className="pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full">
          {isAr ? 'حفظ وإنشاء الحساب' : t('submit')}
        </Button>
      </div>
    </form>
  );
}