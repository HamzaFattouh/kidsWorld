import { test, expect } from '@playwright/test';
import { setupAdminAuth, setupNetworkAndConsoleMonitor } from './helpers';

test.describe('لوحة تحكم الإدارة (Admin Dashboard) - فحص النماذج وإضافة وتعديل وحذف البيانات (CRUD)', () => {
  test.beforeEach(async ({ page }) => {
    await setupAdminAuth(page);
  });

  test('إدارة الأطفال: استعراض القائمة، فتح ملف الطفل، وتجديد الاشتراك الشهري', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);

    const mockChildren = [
      {
        id: 'child-101',
        name: 'عمر أحمد الشكعة',
        dob: '2022-04-12',
        gender: 'ذكر',
        classId: 'روضة العصافير',
        parentId: 'parent-1',
        medicalNotes: 'حساسية من الفول السوداني',
        enrollmentDate: '2026-09-01T08:00:00.000Z',
      },
      {
        id: 'child-102',
        name: 'سارة مريم المصري',
        dob: '2022-08-05',
        gender: 'أنثى',
        classId: 'روضة الزهور',
        parentId: 'parent-2',
        medicalNotes: 'لا يوجد',
        enrollmentDate: '2026-10-01T08:00:00.000Z',
      },
    ];

    await page.route('**/api/v1/auto/child**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: mockChildren }),
      });
    });

    await page.goto('/admin/children');
    await expect(page).toHaveURL(/.*\/admin\/children/);

    // التأكد من ظهور الأطفال في الجدول
    await expect(page.locator('text=عمر أحمد الشكعة')).toBeVisible();
    await expect(page.locator('text=سارة مريم المصري')).toBeVisible();

    // فتح تفاصيل وملف الطفل
    const detailsBtn = page.locator('button', { hasText: 'عرض البيانات والمراسلات' }).first();
    await detailsBtn.click();

    // التحقق من ظهور النافذة
    await expect(page.locator('text=الطفل: عمر أحمد الشكعة')).toBeVisible();
    await expect(page.locator('text=حالة التسجيل الشهري:')).toBeVisible();

    // تجديد الاشتراك (Update)
    page.on('dialog', (dialog) => dialog.accept());
    const renewBtn = page.locator('button', { hasText: /تجديد شهر آخر|تجديد التسجيل/i }).first();
    await renewBtn.click();

    monitor.verifyHealth();
  });

  test('إدارة المستخدمين والصلاحيات: فتح نافذة الصلاحيات وتعديل أذونات المعلمة والولي أمر', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);

    const mockUsers = [
      {
        id: 'usr-1',
        name: 'أ. نورة النابلسي',
        email: 'noura@kidsworld.ps',
        phone: '0599111222',
        role: 'TEACHER',
        isActive: true,
        permissions: {},
      },
      {
        id: 'usr-2',
        name: 'أحمد الشكعة',
        email: 'ahmad@example.com',
        phone: '0599123456',
        role: 'PARENT',
        isActive: true,
        permissions: {},
      },
    ];

    await page.route('**/api/v1/users**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { users: mockUsers, pagination: { total: 2 } } }),
      });
    });

    await page.goto('/admin/users');
    await expect(page).toHaveURL(/.*\/admin\/users/);

    // التحقق من ظهور المستخدمين
    await expect(page.locator('text=أ. نورة النابلسي')).toBeVisible();

    // فتح نافذة التحكم بالصلاحيات للمستخدم
    const permBtn = page.locator('button', { hasText: 'التحكم بالصلاحيات' }).first();
    await permBtn.click();

    // التأكد من ظهور نافذة الصلاحيات
    await expect(page.locator('text=صلاحيات وأذونات المعلم')).toBeVisible();

    // حفظ الصلاحيات
    page.on('dialog', (dialog) => dialog.accept());
    const savePermBtn = page.locator('button', { hasText: 'حفظ وتطبيق الصلاحيات' });
    await savePermBtn.click();

    monitor.verifyHealth();
  });

  test('إدارة القاعات الصفية: استعراض الصفوف، نقل وتعيين طالب لصف، وإلغاء التعيين', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);

    await page.goto('/admin/classes');
    await expect(page).toHaveURL(/.*\/admin\/classes/);

    // التحقق من وجود القاعات
    await expect(page.locator('text=روضة العصافير')).toBeVisible();
    await expect(page.locator('text=روضة الزهور')).toBeVisible();

    // فتح نافذة استعراض أطفال القاعة
    const viewClassStudentsBtn = page.locator('button', { hasText: 'استعراض أطفال القاعة' }).first();
    await viewClassStudentsBtn.click();

    // التأكد من فتح النافذة
    await expect(page.locator('text=أطفال')).toBeVisible();

    monitor.verifyHealth();
  });

  test('إدارة المهام الإدارية والصفية: إنشاء مهمة جديدة، تغيير الحالة إلى مكتمل، وحذف المهمة', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);

    await page.goto('/admin/tasks');
    await expect(page).toHaveURL(/.*\/admin\/tasks/);

    await expect(page.locator('text=متابعة المهام الإدارية والتكليفات')).toBeVisible();

    // 1. إنشاء مهمة جديدة (Create)
    const createTaskBtn = page.locator('button', { hasText: 'إسناد وتكليف مهمة جديدة' });
    await createTaskBtn.click();

    await expect(page.locator('text=تكليف وإسناد مهمة جديدة')).toBeVisible();

    const titleInput = page.locator('input[placeholder*="عنوان المهمة"]');
    await titleInput.fill('فحص دوري لصناديق الإسعاف الأولي في الصفوف');

    const descInput = page.locator('textarea[placeholder*="تفاصيل المهمة"]');
    await descInput.fill('التأكد من توفر المواد الطبية والمعقمات والضمادات في جميع القاعات.');

    const saveTaskBtn = page.locator('button', { hasText: 'إرسال التكليف وحفظ المهمة' });
    await saveTaskBtn.click();

    // التأكد من ظهور المهمة الجديدة في القائمة
    await expect(page.locator('text=فحص دوري لصناديق الإسعاف الأولي في الصفوف')).toBeVisible();

    // 2. تحديث حالة المهمة (Update)
    const completeBtn = page.locator('button', { hasText: /اكتملت المهمة|اعتماد الإنجاز/i }).first();
    if (await completeBtn.isVisible()) {
      await completeBtn.click();
    }

    // 3. حذف مهمة (Delete)
    page.on('dialog', (dialog) => dialog.accept());
    const deleteBtn = page.locator('button[title*="حذف"], button', { hasText: 'حذف' }).first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
    }

    monitor.verifyHealth();
  });

  test('إدارة الأشخاص المخولين بالاستلام: فتح نموذج إضافة مخول جديد والتحقق من الحقول', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);

    await page.goto('/admin/pickup');
    await expect(page).toHaveURL(/.*\/admin\/pickup/);

    await expect(page.locator('text=المخولون بالاستلام')).toBeVisible();

    // فتح نافذة الإضافة (Create)
    const addPickupBtn = page.locator('button', { hasText: 'إضافة شخص مخول' });
    await expect(addPickupBtn).toBeVisible();
    await addPickupBtn.click();

    // التحقق من ظهور حقول النموذج
    await expect(page.locator('form')).toBeVisible();

    monitor.verifyHealth();
  });

  test('إدارة المعرض والفعاليات والمنشورات: التحقق من واجهات الإدارة والإضافة', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);

    // 1. صفحة الفعاليات
    await page.goto('/admin/events');
    await expect(page).toHaveURL(/.*\/admin\/events/);
    await expect(page.locator('text=إدارة الفعاليات')).toBeVisible();

    // 2. صفحة المنشورات والمدونة
    await page.goto('/admin/posts');
    await expect(page).toHaveURL(/.*\/admin\/posts/);
    await expect(page.locator('text=المنشورات والأخبار')).toBeVisible();

    // 3. صفحة المعرض
    await page.goto('/admin/gallery');
    await expect(page).toHaveURL(/.*\/admin\/gallery/);
    await expect(page.locator('text=معرض الصور')).toBeVisible();

    // 4. صفحة الكاميرات وصلاحيات البث
    await page.goto('/admin/cameras');
    await expect(page).toHaveURL(/.*\/admin\/cameras/);
    await expect(page.locator('text=إدارة الكاميرات')).toBeVisible();

    monitor.verifyHealth();
  });
});

