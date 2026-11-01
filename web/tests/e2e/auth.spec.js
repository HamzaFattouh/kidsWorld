import { test, expect } from '@playwright/test';
import { setupGuestSession, mockBackendApis } from './helpers';

test.describe('فحص مسارات الدخول والتحقق من الحقول الإلزامية', () => {
  test('الانتقال إلى صفحة الدخول من الصفحة الرئيسية وفحص رسائل إلزامية الحقول', async ({ page, isMobile }) => {
    await mockBackendApis(page);
    await setupGuestSession(page);

    await page.goto('/');

    if (isMobile) {
      // شاشة الجوال: فتح القائمة والضغط على زر الدخول
      const hamburgerBtn = page.locator('header div.flex.items-center.lg\\:hidden button');
      await expect(hamburgerBtn).toBeVisible();
      await hamburgerBtn.click();

      const mobileLogin = page.locator('div.lg\\:hidden a[href="/auth/login"]');
      await expect(mobileLogin).toBeVisible();
      await mobileLogin.click();
    } else {
      // شاشة الحاسوب: الضغط على زر الدخول في شريط الرأس
      const loginLink = page.locator('header nav + div a[href="/auth/login"], header div.hidden.lg\\:flex a[href="/auth/login"]').first();
      await expect(loginLink).toBeVisible();
      await loginLink.click();
    }

    await expect(page).toHaveURL(/.*\/auth\/login/);

    // محاولة إرسال الحقول فارغة
    await page.locator('button[type="submit"]').click();

    // التأكد من ظهور رسائل التنبيه باللغة العربية
    await expect(page.locator('text=يرجى إدخال الاسم أو البريد الإلكتروني')).toBeVisible();
    await expect(page.locator('text=كلمة المرور مطلوبة')).toBeVisible();
  });
});