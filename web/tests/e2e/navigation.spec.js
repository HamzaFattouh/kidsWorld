import { test, expect } from '@playwright/test';
import { loginAsAdmin, mockBackendApis, setupNetworkAndConsoleMonitor } from './helpers';

test.describe('قوائم التنقل والتنقل المتجاوب (سطح المكتب والهاتف)', () => {
  test('التنقل في الموقع الرئيسي: روابط شريط التنقل، التمرير السلس، وزر تسجيل الدخول', async ({ page, isMobile }) => {
    await mockBackendApis(page);
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/');

    // التحقق من ظهور الهيدر ورابط الشعار
    const logoLink = page.getByRole('link', { name: /عالم الأطفال/i }).first();
    await expect(logoLink).toBeVisible();

    const navButtons = [
      { name: 'من نحن', sectionId: '#about' },
      { name: 'برامجنا', sectionId: '#programs' },
      { name: 'المعرض', sectionId: '#gallery' },
      { name: 'الفعاليات', sectionId: '#events' },
      { name: 'اتصل بنا', sectionId: '#contact' },
    ];

    if (isMobile) {
      // شاشة الهاتف: فتح القائمة الجانبية وفحص الروابط
      const hamburgerBtn = page.locator('header div.flex.items-center.lg\\:hidden button');
      await expect(hamburgerBtn).toBeVisible();
      await hamburgerBtn.click();

      const mobileMenu = page.locator('div.lg\\:hidden.bg-white, div.lg\\:hidden.dark\\:bg-slate-900').first();
      await expect(mobileMenu).toBeVisible();

      for (const nav of navButtons) {
        const button = mobileMenu.locator('button', { hasText: nav.name });
        await expect(button).toBeVisible();
      }

      const mobileLogin = mobileMenu.locator('a[href="/auth/login"]');
      await expect(mobileLogin).toBeVisible();
      await mobileLogin.click();
    } else {
      // شاشة الحاسوب: فحص أزرار شريط التنقل العلوي والتمرير السلس
      for (const nav of navButtons) {
        const button = page.locator('nav.hidden.lg\\:flex button', { hasText: nav.name });
        await expect(button).toBeVisible();
        await button.click();
        const section = page.locator(nav.sectionId);
        await expect(section).toBeAttached();
      }

      const loginBtn = page.locator('header a[href="/auth/login"]').first();
      await expect(loginBtn).toBeVisible();
      await loginBtn.click();
    }

    await expect(page).toHaveURL(/.*\/auth\/login/);
    monitor.verifyHealth();
  });

  test('قائمة الهاتف المحمول: فتح وإغلاق القائمة الجانبية (Hamburger Drawer) والتنقل عبر الروابط', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await mockBackendApis(page);
    const monitor = setupNetworkAndConsoleMonitor(page);

    await page.goto('/');

    // التأكد من إخفاء قائمة سطح المكتب في شاشات الجوال
    await expect(page.locator('nav.hidden.lg\\:flex')).toBeHidden();

    // العثور على زر الهامبرغر والضغط عليه
    const hamburgerBtn = page.locator('header div.flex.items-center.lg\\:hidden button');
    await expect(hamburgerBtn).toBeVisible();
    await hamburgerBtn.click();

    // التحقق من ظهور القائمة المنبثقة
    const mobileMenu = page.locator('div.lg\\:hidden.bg-white, div.lg\\:hidden.dark\\:bg-slate-900').first();
    await expect(mobileMenu).toBeVisible();

    // التحقق من جميع عناصر القائمة
    const mobileLinks = ['من نحن', 'برامجنا', 'المعرض', 'الفعاليات', 'اتصل بنا'];
    for (const linkText of mobileLinks) {
      const linkBtn = mobileMenu.locator('button', { hasText: linkText });
      await expect(linkBtn).toBeVisible();
    }

    // الضغط على رابط والتأكد من إغلاق القائمة تلقائياً
    await mobileMenu.locator('button', { hasText: 'برامجنا' }).click();
    await expect(mobileMenu).toBeHidden({ timeout: 3000 });

    // إعادة فتح القائمة وتجربة زر الإغلاق X
    await hamburgerBtn.click();
    await expect(mobileMenu).toBeVisible();
    await hamburgerBtn.click();
    await expect(mobileMenu).toBeHidden({ timeout: 3000 });

    monitor.verifyHealth();
  });

  test('لوحة تحكم الإدارة: التنقل عبر القائمة الجانبية وقائمة الإشعارات المنسدلة', async ({ page, isMobile }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await loginAsAdmin(page);

    await expect(page).toHaveURL(/.*\/admin/);

    if (isMobile) {
      // شاشة الجوال: فتح القائمة الجانبية
      const mobileHeaderBtn = page.locator('div.md\\:hidden button', { has: page.locator('svg.lucide-menu') });
      await expect(mobileHeaderBtn).toBeVisible();
      await mobileHeaderBtn.click();

      const drawer = page.locator('div.md\\:hidden.fixed.inset-0.z-50');
      await expect(drawer).toBeVisible();

      const announcementsLink = drawer.locator('a[href="/admin/announcements"]');
      await expect(announcementsLink).toBeVisible();
      await announcementsLink.click();
      await expect(page).toHaveURL(/.*\/admin\/announcements/);
    } else {
      // شاشة الحاسوب: استخدام الشريط الجانبي
      const sidebar = page.locator('div.hidden.md\\:block');
      await expect(sidebar).toBeVisible();

      const announcementsLink = sidebar.locator('a[href="/admin/announcements"]');
      await expect(announcementsLink).toBeVisible();
      await announcementsLink.click();
      await expect(page).toHaveURL(/.*\/admin\/announcements/);

      const settingsLink = sidebar.locator('a[href="/admin/settings"]');
      await expect(settingsLink).toBeVisible();
      await settingsLink.click();
      await expect(page).toHaveURL(/.*\/admin\/settings/);
    }

    // فحص القائمة المنسدلة للإشعارات
    const bellBtn = page.locator('header button', { has: page.locator('svg.lucide-bell') }).first();
    await expect(bellBtn).toBeVisible();
    await bellBtn.click();

    const dropdownMenu = page.locator('div.absolute', { hasText: 'تسجيل حضور وغياب' });
    await expect(dropdownMenu).toBeVisible();

    await page.locator('main').click({ position: { x: 50, y: 50 } });
    await expect(dropdownMenu).toBeHidden();

    monitor.verifyHealth();
  });

  test('لوحة تحكم الإدارة على الهاتف: فتح وإغلاق القائمة الجانبية والتنقل', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const monitor = setupNetworkAndConsoleMonitor(page);
    await loginAsAdmin(page);

    await expect(page).toHaveURL(/.*\/admin/);

    // زر القائمة في الهيدر
    const mobileHeaderBtn = page.locator('div.md\\:hidden button', { has: page.locator('svg.lucide-menu') });
    await expect(mobileHeaderBtn).toBeVisible();
    await mobileHeaderBtn.click();

    // التأكد من ظهور القائمة الجانبية
    const drawer = page.locator('div.md\\:hidden.fixed.inset-0.z-50');
    await expect(drawer).toBeVisible();

    // الضغط على صفحة الإعلانات
    const announcementsLink = drawer.locator('a[href="/admin/announcements"]');
    await expect(announcementsLink).toBeVisible();
    await announcementsLink.click();

    await expect(page).toHaveURL(/.*\/admin\/announcements/);
    await expect(drawer).toBeHidden({ timeout: 3000 });

    monitor.verifyHealth();
  });
});
