import { test, expect } from '@playwright/test';
import { loginAsAdmin, mockBackendApis, setupNetworkAndConsoleMonitor } from './helpers';

test.describe('مراقبة صحة الشبكة وعدم وجود أخطاء في وحدة التحكم (Console)', () => {
  test('الصفحة الرئيسية: التحقق من عدم وجود ملفات مفقودة 404 أو استثناءات برمجية في الجافاسكربت', async ({ page }) => {
    await mockBackendApis(page);
    const monitor = setupNetworkAndConsoleMonitor(page);

    await page.goto('/', { waitUntil: 'networkidle' });

    // التأكد من عدم وجود أخطاء أو 404
    monitor.verifyHealth();
  });

  test('صفحة تسجيل الدخول: التأكد من نظافة وحدة التحكم وخلو التحميل من أخطاء الشبكة', async ({ page }) => {
    await mockBackendApis(page);
    const monitor = setupNetworkAndConsoleMonitor(page);

    await page.goto('/auth/login', { waitUntil: 'networkidle' });

    // التأكد من تحميل النموذج
    await expect(page.locator('form')).toBeVisible();

    monitor.verifyHealth();
  });

  test('صفحات الإدارة: التأكد من خلو المسارات الإدارية من أخطاء الـ 404 أو تعليق الـ API', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await loginAsAdmin(page);

    const routesToTest = ['/admin', '/admin/announcements', '/admin/events', '/admin/settings'];

    for (const route of routesToTest) {
      await page.goto(route, { waitUntil: 'networkidle' });
      await expect(page).toHaveURL(new RegExp(route));
    }

    monitor.verifyHealth();
  });
});
