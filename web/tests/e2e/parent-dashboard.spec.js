import { test, expect } from '@playwright/test';
import { setupParentAuth, setupNetworkAndConsoleMonitor } from './helpers';

test.describe('لوحة تحكم ولي الأمر (Parent Dashboard) - الفحص الشامل لجميع الصفحات والنماذج', () => {
  test.beforeEach(async ({ page }) => {
    await setupParentAuth(page);
  });

  test('الصفحة الرئيسية لولي الأمر: ملخص المتابعة اليومية وبطاقات الوصول السريع', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/parent');
    await expect(page).toHaveURL(/.*\/parent/);

    // التحقق من ظهور الترحيب بولي الأمر
    await expect(page.locator('text=لوحة متابعة الطفل اليومية والأنشطة والتقارير')).toBeVisible();

    // التحقق من بطاقات المتابعة الأساسية
    await expect(page.locator('text=سجل الحضور')).toBeVisible();
    await expect(page.locator('text=سجل الوجبات')).toBeVisible();
    await expect(page.locator('text=التقييمات')).toBeVisible();
    await expect(page.locator('text=الكاميرات')).toBeVisible();

    monitor.verifyHealth();
  });

  test('صفحة سجل حضور الطفل: استعراض الحضور الشهري ونسبة الالتزام', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/parent/attendance');
    await expect(page).toHaveURL(/.*\/parent\/attendance/);

    await expect(page.locator('text=سجل حضور وغياب الطفل')).toBeVisible();
    await expect(page.locator('text=تفاصيل سجل الحضور الشهري')).toBeVisible();

    monitor.verifyHealth();
  });

  test('صفحة وجبات الطفل: استعراض تقارير الإفطار والغداء ومستوى الإقبال', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/parent/meals');
    await expect(page).toHaveURL(/.*\/parent\/meals/);

    await expect(page.locator('text=سجل وجبات الطفل اليومية')).toBeVisible();

    monitor.verifyHealth();
  });

  test('صفحة التقرير الأسبوعي: قراءة ملخص تطور الطفل وملاحظات المعلمة', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/parent/notes');
    await expect(page).toHaveURL(/.*\/parent\/notes/);

    await expect(page.locator('text=التقرير الأسبوعي وملاحظات المعلمة')).toBeVisible();

    monitor.verifyHealth();
  });

  test('صفحة تقييم المهارات: استعراض محاور التطور ومستوى النجوم', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/parent/evaluations');
    await expect(page).toHaveURL(/.*\/parent\/evaluations/);

    await expect(page.locator('text=تقييم مهارات الطفل وتطوره')).toBeVisible();

    monitor.verifyHealth();
  });

  test('صفحة الإعلانات والتعاميم: قراءة التعاميم الإدارية الموجهة لأولياء الأمور', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/parent/announcements');
    await expect(page).toHaveURL(/.*\/parent\/announcements/);

    await expect(page.locator('text=إعلانات وتعاميم الروضة')).toBeVisible();

    monitor.verifyHealth();
  });

  test('صفحة الفعاليات: استعراض الأنشطة القادمة ومواعيد الرحلات والاحتفالات', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/parent/events');
    await expect(page).toHaveURL(/.*\/parent\/events/);

    await expect(page.locator('text=الفعاليات والأنشطة القادمة')).toBeVisible();

    monitor.verifyHealth();
  });

  test('صفحة الكاميرات المباشرة: التحقق من واجهة البث ومواعيد المشاهدة المعتمدة', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/parent/cameras');
    await expect(page).toHaveURL(/.*\/parent\/cameras/);

    await expect(page.locator('text=البث المباشر')).toBeVisible();

    monitor.verifyHealth();
  });

  test('صفحة الوثائق الرسمية: استعراض المستندات الثبوتية والشهادات', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/parent/documents');
    await expect(page).toHaveURL(/.*\/parent\/documents/);

    await expect(page.locator('text=الوثائق والملفات الرسمية')).toBeVisible();

    monitor.verifyHealth();
  });

  test('صفحة الطلبات الخاصة: فتح نموذج طلب جديد وتعبئة الحقول والإرسال بنجاح', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/parent/requests');
    await expect(page).toHaveURL(/.*\/parent\/requests/);

    await expect(page.locator('text=الطلبات والاستئذان')).toBeVisible();

    // فتح نافذة إرسال طلب جديد
    const newRequestBtn = page.locator('button', { hasText: 'إرسال طلب جديد' });
    await expect(newRequestBtn).toBeVisible();
    await newRequestBtn.click();

    // التحقق من ظهور النافذة وتعبئة تفاصيل الطلب
    const modalTitle = page.locator('text=تقديم طلب جديد');
    await expect(modalTitle).toBeVisible();

    const descInput = page.locator('textarea');
    await descInput.fill('نرجو التكرم بالسماح بمغادرة مبكرة عند الساعة 12:30 لموعد طبي.');

    // إرسال النموذج
    const submitBtn = page.locator('button[type="submit"]', { hasText: 'إرسال الطلب' });
    await submitBtn.click();

    monitor.verifyHealth();
  });

  test('صفحة الشكاوى والمقترحات: تقديم شكوى جديدة وتعبئة العنوان والتفاصيل', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/parent/complaints');
    await expect(page).toHaveURL(/.*\/parent\/complaints/);

    await expect(page.locator('text=الشكاوى والمقترحات')).toBeVisible();

    // فتح نافذة تقديم شكوى جديدة
    const newComplaintBtn = page.locator('button', { hasText: 'تقديم شكوى جديدة' });
    await expect(newComplaintBtn).toBeVisible();
    await newComplaintBtn.click();

    // ملء النموذج
    const titleInput = page.locator('input[placeholder*="عنوان الشكوى"]');
    await titleInput.fill('ملاحظة بخصوص ملابس التربية الرياضية');

    const descInput = page.locator('textarea');
    await descInput.fill('نرجو التنسيق المسبق قبل يوم الحصة لتجهيز الملابس المناسبة.');

    // إرسال الشكوى
    const submitBtn = page.locator('button[type="submit"]', { hasText: 'إرسال الشكوى' });
    await submitBtn.click();

    monitor.verifyHealth();
  });

  test('صفحة المحادثات والإشعارات: التواصل المباشر مع المعلمة وتفقد التنبيهات', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);

    // 1. المحادثات
    await page.goto('/parent/messages');
    await expect(page).toHaveURL(/.*\/parent\/messages/);
    await expect(page.locator('text=المحادثات والرسائل')).toBeVisible();

    // 2. مركز الإشعارات
    await page.goto('/parent/notifications');
    await expect(page).toHaveURL(/.*\/parent\/notifications/);
    await expect(page.locator('text=مركز الإشعارات والتنبيهات')).toBeVisible();

    monitor.verifyHealth();
  });
});

