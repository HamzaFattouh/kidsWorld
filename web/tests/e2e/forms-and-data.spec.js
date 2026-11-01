import { test, expect } from '@playwright/test';
import { setupAdminAuth, setupGuestAuth, loginAsAdmin, setupNetworkAndConsoleMonitor } from './helpers';

test.describe('نماذج الإدخال وتعديل وإضافة البيانات', () => {
  test('نموذج تسجيل الدخول: التحقق من الحقول الفارغة، الإدخال الآلي، معالجة الأخطاء، والولوج بنجاح', async ({ page }) => {
    await setupGuestAuth(page);
    const monitor = setupNetworkAndConsoleMonitor(page);

    await page.goto('/auth/login');
    await expect(page).toHaveURL(/.*\/auth\/login/);

    // 1. اختبار الإرسال الفارغ وظهور رسائل التحقق
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    const emailError = page.locator('text=يرجى إدخال الاسم أو البريد الإلكتروني');
    const passwordError = page.locator('text=كلمة المرور مطلوبة');
    await expect(emailError).toBeVisible();
    await expect(passwordError).toBeVisible();

    // 2. تعبئة بيانات غير صحيحة آلياً
    const emailInput = page.locator('input[placeholder*="الاسم أو البريد الإلكتروني"]');
    const passwordInput = page.locator('input[placeholder*="••••••••"]');

    await emailInput.fill('wrong-user@kidsworld.ps');
    await passwordInput.fill('IncorrectPassword123');

    await page.route('**/api/v1/auth/login', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: { message: 'بيانات الاعتماد غير صحيحة، يرجى المحاولة مجدداً' }
        })
      });
    });

    await submitBtn.click();

    // التأكد من ظهور رسالة الخطأ على الشاشة
    const errorAlert = page.locator('div.bg-red-500\\/20');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('بيانات الاعتماد غير صحيحة');

    // 3. تعبئة بيانات صحيحة وتسجيل الدخول بنجاح
    await page.route('**/api/v1/auth/login', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            user: {
              id: 'admin-101',
              name: 'أحمد الإداري',
              email: 'admin@kidsworld.ps',
              role: 'ADMIN',
              requiresPasswordChange: false
            },
            token: 'valid-jwt-token'
          }
        })
      });
    });

    await emailInput.fill('admin@kidsworld.ps');
    await passwordInput.fill('AdminPassword2026!');
    await submitBtn.click();

    // التأكد من الانتقال إلى لوحة التحكم
    await expect(page).toHaveURL(/.*\/admin/, { timeout: 7000 });
  });

  test('نموذج النشرة البريدية للموقع العام: تعبئة البريد الإلكتروني آلياً والإرسال', async ({ page }) => {
    await setupGuestAuth(page);
    await page.goto('/');

    const newsletterInput = page.locator('input[placeholder="بريدك الإلكتروني"]');
    await expect(newsletterInput).toBeVisible();

    // تعبئة البريد الإلكتروني آلياً
    await newsletterInput.fill('parent.e2e.test@gmail.com');
    await expect(newsletterInput).toHaveValue('parent.e2e.test@gmail.com');

    // إرسال النموذج
    const subscribeBtn = page.locator('button', { hasText: 'اشترك' });
    await expect(subscribeBtn).toBeVisible();
    await subscribeBtn.click();
  });

  test('إدارة البيانات (إضافة): إنشاء إعلان جديد وتعبئة الحقول وتأكيد ظهور العنصر في الواجهة', async ({ page }) => {
    await setupAdminAuth(page);
    const monitor = setupNetworkAndConsoleMonitor(page);

    const announcementsStore = [
      {
        id: 'ann-1',
        titleAr: 'إعلان أسبوع النظافة',
        titleEn: 'Hygiene Week Announcement',
        contentAr: 'يرجى الالتزام بالإرشادات الصحية المتبعة.',
        contentEn: 'Please follow established hygiene standards.',
        priority: 'NORMAL',
        isPublished: true,
        createdAt: '2026-10-18T10:00:00.000Z'
      }
    ];

    await page.route('**/api/v1/auto/announcement**', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: announcementsStore })
        });
      } else {
        route.continue();
      }
    });

    await page.route('**/api/v1/cms/announcements', (route) => {
      const payload = route.request().postDataJSON();
      const newAnnouncement = {
        id: `ann-${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString()
      };
      announcementsStore.unshift(newAnnouncement);
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ data: newAnnouncement })
      });
    });

    await page.goto('/admin/announcements');

    // التأكد من وجود العنصر المبدئي
    await expect(page.locator('text=إعلان أسبوع النظافة')).toBeVisible();

    // 1. فتح نافذة إضافة إعلان جديد
    const addBtn = page.locator('button', { hasText: 'إضافة إعلان جديد' });
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal.locator('text=إضافة إعلان جديد')).toBeVisible();

    // 2. تعبئة الحقول آلياً
    const testTitle = 'رحلة مدرسية استكشافية إلى حديقة الحيوان';
    const testContent = 'يسر إدارة الروضة تنظيم رحلة للأطفال يوم الخميس القادم لتعزيز التعلم التجريبي.';
    const testDate = '2026-10-30';

    await modal.locator('input').first().fill(testTitle);
    await modal.locator('textarea').fill(testContent);
    await modal.locator('select').selectOption('HIGH');
    await modal.locator('input[type="date"]').fill(testDate);

    // 3. حفظ وإرسال البيانات
    const submitBtn = modal.locator('button[type="submit"]');
    await expect(submitBtn).toHaveText('نشر الإعلان');
    await submitBtn.click();

    // 4. تأكيد إغلاق النافذة وظهور العنصر الجديد في الواجهة
    await expect(modal).toBeHidden({ timeout: 5000 });

    const newCard = page.locator('div.rounded-2xl', { hasText: testTitle });
    await expect(newCard).toBeVisible();
    await expect(newCard).toContainText(testContent);
    await expect(newCard.locator('text=هام جداً')).toBeVisible();

    monitor.verifyHealth();
  });

  test('إدارة البيانات (تعديل): تعديل بيانات قسم في الصفحة الرئيسية وتأكيد رسالة النجاح', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await loginAsAdmin(page);

    await page.route('**/api/v1/auto/homepageConfig**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'cfg-hero',
              section: 'hero',
              titleAr: 'الواجهة الرئيسية القديمة',
              bodyAr: 'النص التعريفي القديم'
            }
          ]
        })
      });
    });

    await page.route('**/api/v1/cms/homepage', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    let alertMessage = '';
    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.goto('/admin/homepage');

    // تحديد حقل العنوان العربي وتعديله
    const titleArInput = page.locator('div.space-y-4 input').nth(1);
    await expect(titleArInput).toBeVisible();

    const modifiedTitle = 'عنوان جديد معدّل تم حفظه بنجاح';
    await titleArInput.fill(modifiedTitle);
    await expect(titleArInput).toHaveValue(modifiedTitle);

    // الضغط على زر حفظ التغييرات
    const saveBtn = page.locator('button', { hasText: 'حفظ التغييرات' }).first();
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    // تأكيد ظهور رسالة النجاح
    await expect.poll(() => alertMessage).toContain('تم الحفظ بنجاح');

    monitor.verifyHealth();
  });
});
