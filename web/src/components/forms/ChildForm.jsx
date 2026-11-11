import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { usersApi } from '../../api/users';
import { api } from '../../lib/api';

const schema = z.object({
  name: z.string().min(2, 'يرجى إدخال اسم الطفل الرباعي أو الثلاثي'),
  parentId: z.string().min(1, 'يرجى اختيار أو تحديد ولي الأمر'),
  classId: z.string().min(1, 'يرجى اختيار الصف أو القاعة'),
  gender: z.string().optional(),
  dob: z.string().optional(),
  medicalNotes: z.string().optional()
});

const DEFAULT_CLASSES = [
  { id: 'class-hope-2-3', name: 'روضة الأمل (2 - 3 سنوات)' },
  { id: 'class-birds-3-4', name: 'روضة العصافير (3 - 4 سنوات)' },
  { id: 'class-flowers-4-5', name: 'روضة الزهور (4 - 5 سنوات)' },
  { id: 'class-sleep-1', name: 'قسم الرضّع (سنة واحدة)' },
  { id: 'class-sleep-2', name: 'قسم الصغار (سنتين)' }
];

export function ChildForm({ initialData = {}, parentName, onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      parentId: initialData?.parentId || '',
      classId: initialData?.classId || 'class-birds-3-4',
      gender: initialData?.gender || 'ذكر',
      dob: initialData?.dob ? initialData.dob.split('T')[0] : '',
      medicalNotes: initialData?.medicalNotes || ''
    }
  });

  // Keep parentId in sync if initialData changes
  useEffect(() => {
    if (initialData?.parentId) {
      setValue('parentId', initialData.parentId);
    }
  }, [initialData?.parentId, setValue]);

  // Fetch classes dynamically
  const { data: classesResponse } = useQuery({
    queryKey: ['classes-options'],
    queryFn: async () => {
      try {
        const res = await api.get('/auto/class');
        const list = Array.isArray(res?.data?.data) ? res.data.data : [];
        return list.length > 0 ? list : DEFAULT_CLASSES;
      } catch {
        return DEFAULT_CLASSES;
      }
    }
  });

  // Fetch parents if parentId is not pre-set
  const isParentFixed = Boolean(initialData?.parentId);
  const { data: parentsResponse } = useQuery({
    queryKey: ['parents-list-options'],
    queryFn: () => usersApi.getUsers({ role: 'PARENT', limit: 100 }),
    enabled: !isParentFixed
  });

  const classList = classesResponse || DEFAULT_CLASSES;
  const parentList = parentsResponse?.data || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-start" dir="rtl">
      {/* 1. Parent Info or Selector */}
      {isParentFixed ? (
        <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">
              ولي الأمر الذي سيرتبط به الطفل:
            </span>
            <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              {parentName || 'ولي الأمر المختار'}
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-1 rounded-md">
            ربط مباشر
          </span>
          <input type="hidden" {...register('parentId')} />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
            ولي الأمر المسؤول <span className="text-red-500">*</span>
          </label>
          <select
            {...register('parentId')}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:border-gray-700 dark:bg-surface-dark dark:text-text-dark"
          >
            <option value="">-- اختر ولي أمر من القائمة --</option>
            {parentList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.phone || p.email})
              </option>
            ))}
          </select>
          {errors.parentId && (
            <p className="mt-1 text-xs text-red-500">{errors.parentId.message}</p>
          )}
        </div>
      )}

      {/* 2. Child Full Name */}
      <Input
        label="اسم الطفل الكامل"
        placeholder="مثال: يوسف خالد جودت"
        type="text"
        {...register('name')}
        error={errors.name?.message}
      />

      {/* 3. Class and Gender Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
            الصف / القاعة الدراسية <span className="text-red-500">*</span>
          </label>
          <select
            {...register('classId')}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:border-gray-700 dark:bg-surface-dark dark:text-text-dark"
          >
            {classList.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} {cls.ageGroup ? `(${cls.ageGroup})` : ''}
              </option>
            ))}
          </select>
          {errors.classId && (
            <p className="mt-1 text-xs text-red-500">{errors.classId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
            الجنس
          </label>
          <select
            {...register('gender')}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:border-gray-700 dark:bg-surface-dark dark:text-text-dark"
          >
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </select>
        </div>
      </div>

      {/* 4. Date of Birth */}
      <div>
        <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
          تاريخ الميلاد
        </label>
        <input
          type="date"
          {...register('dob')}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:border-gray-700 dark:bg-surface-dark dark:text-text-dark"
        />
      </div>

      {/* 5. Medical Notes */}
      <div>
        <label className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
          ملاحظات طبية أو حساسية غذائية (اختياري)
        </label>
        <textarea
          rows={2}
          placeholder="مثال: حساسية من الحليب، أو استخدام نظارات طبية..."
          {...register('medicalNotes')}
          className="w-full rounded-md border border-gray-300 bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:border-gray-700 dark:bg-surface-dark dark:text-text-dark"
        />
      </div>

      {/* 6. Action Button */}
      <div className="pt-2">
        <Button type="submit" isLoading={isLoading} className="w-full font-bold">
          حفظ وإضافة الطفل
        </Button>
      </div>
    </form>
  );
}
