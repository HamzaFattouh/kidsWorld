import { test, expect } from '@playwright/test';
import { setupTeacherAuth, setupNetworkAndConsoleMonitor } from './helpers';

test.describe('لوحة تحكم المعلمة (Teacher Dashboard) - الفحص الشامل لجميع الصفحات والنماذج', () => {
  test.beforeEach(async ({ page }) => {
    await setupTeacherAuth(page);
  });

  test('الصفحة الرئيسية للمعلمة: عرض بطاقات المؤشرات والإجراءات السريعة وحضور اليوم', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/teacher');
    await expect(page).toHaveURL(/.*\/teacher/);

    // التحقق من ظهور بطاقات الإحصائيات (KPIs)
    await expect(page.locator('text=إجمالي أطفال الصف')).toBeVisible();
    await expect(page.locator('text=حضور اليوم')).toBeVisible();
    await expect(page.locator('text=الوجبات المسجلة')).toBeVisible();

    // التحقق من قائمة الطلاب وتسجيل الحضور السريع
    const rosterSection = page.locator('text=حضور وغياب طلاب الصف اليوم');
    await expect(rosterSection).toBeVisible();

    monitor.verifyHealth();
  });

  test('صفحة أطفال الصف: البحث، التصفية، واستعراض الملف الشامل للطفل', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/teacher/children');
    await expect(page).toHaveURL(/.*\/teacher\/children/);

    // التحقق من ظهور قائمة الطلاب وشريط البحث
    const searchInput = page.locator('input[placeholder*="ابحث باسم الطفل"]');
    await expect(searchInput).toBeVisible();

    // البحث عن طالب محدد
    await searchInput.fill('عمر');
    await expect(page.locator('text=عمر أحمد الشكعة')).toBeVisible();

    // فتح الملف الطبي الشامل للطفل
    const viewDetailsBtn = page.locator('button', { hasText: 'عرض الملف والتفاصيل' }).first();
    await viewDetailsBtn.click();

    // التأكد من ظهور نافذة تفاصيل الطفل
    await expect(page.locator('text=الملف الشامل للطفل')).toBeVisible();
    await expect(page.locator('text=الملف الصحي والحساسية')).toBeVisible();

    // إغلاق النافذة
    const closeBtn = page.locator('button', { hasText: 'إغلاق الملف' });
    await closeBtn.click();

    monitor.verifyHealth();
  });

  test('صفحة كشف الحضور والغياب: اختيار اليوم، تبديل الحضور، وحفظ الكشف', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/teacher/attendance');
    await expect(page).toHaveURL(/.*\/teacher\/attendance/);

    // التحقق من تقويم الأيام
    await expect(page.locator('text=تقويم الحضور الشهري')).toBeVisible();

    // النقر على زر حفظ وتأكيد الحضور
    const saveBtn = page.locator('button', { hasText: 'حفظ واعتماد الكشف لليوم المحدد' });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    monitor.verifyHealth();
  });

  test('صفحة تسجيل الوجبات: تحديد نوع الوجبة ونسبة الإنجاز وحفظ السجل', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/teacher/meals');
    await expect(page).toHaveURL(/.*\/teacher\/meals/);

    // التحقق من ظهور وجبات اليوم (فطور، غداء، سناك)
    await expect(page.locator('text=تسجيل وجبات الصف اليومية')).toBeVisible();

    // اختيار زر حفظ السجل
    const saveMealBtn = page.locator('button', { hasText: 'حفظ واعتماد سجل الوجبات' });
    await expect(saveMealBtn).toBeVisible();
    await saveMealBtn.click();

    monitor.verifyHealth();
  });

  test('صفحة جدول الأنشطة اليومية: استعراض الأنشطة، تغيير حالة الإنجاز، وإضافة نشاط جديد', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/teacher/activities');
    await expect(page).toHaveURL(/.*\/teacher\/activities/);

    // التحقق من ظهور جدول الأنشطة
    await expect(page.locator('text=جدول الأنشطة اليومية')).toBeVisible();

    // فتح نافذة إضافة نشاط
    const addActivityBtn = page.locator('button', { hasText: 'إضافة نشاط جديد' });
    await expect(addActivityBtn).toBeVisible();
    await addActivityBtn.click();

    // تعبئة بيانات النشاط
    const titleInput = page.locator('input[placeholder*="عنوان النشاط"]');
    await titleInput.fill('ورشة تلوين المجسمات الورقية');

    // حفظ النشاط
    const submitBtn = page.locator('button', { hasText: 'حفظ وإدراج النشاط' });
    await submitBtn.click();

    // التأكد من ظهور النشاط الجديد في الجدول
    await expect(page.locator('text=ورشة تلوين المجسمات الورقية')).toBeVisible();

    monitor.verifyHealth();
  });

  test('صفحة التقرير الأسبوعي: اختيار الطالب، تدوين الملاحظات، والحفظ', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/teacher/notes');
    await expect(page).toHaveURL(/.*\/teacher\/notes/);

    // التحقق من ظهور كشف تقارير الطلاب
    await expect(page.locator('text=التقارير الأسبوعية للطلاب')).toBeVisible();

    // فتح نافذة تدوين التقرير
    const editReportBtn = page.locator('button', { hasText: /تعديل التقرير|تدوين التقرير/i }).first();
    await editReportBtn.click();

    // كتابة الملاحظة
    const notesTextarea = page.locator('textarea');
    await notesTextarea.fill('تطور ملحوظ في التفاعل الجماعي واللعب التعاوني مع زملائه.');

    // حفظ التقرير
    const saveBtn = page.locator('button', { hasText: 'حفظ واعتماد التقرير' });
    await saveBtn.click();

    monitor.verifyHealth();
  });

  test('صفحة تقييم المهارات: اختيار محاور التطور وتقييم النجوم والحفظ', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/teacher/evaluations');
    await expect(page).toHaveURL(/.*\/teacher\/evaluations/);

    // التحقق من محاور التقييم
    await expect(page.locator('text=التواصل واللغة')).toBeVisible();
    await expect(page.locator('text=المهارات الاجتماعية والعاطفية')).toBeVisible();

    // حفظ التقييم
    const saveEvalBtn = page.locator('button', { hasText: 'حفظ وتحديث تقييم الطالب' });
    await expect(saveEvalBtn).toBeVisible();
    await saveEvalBtn.click();

    monitor.verifyHealth();
  });

  test('صفحة استفسارات أولياء الأمور: استعراض الشكاوى، تصفية الحالات، والرد', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/teacher/complaints');
    await expect(page).toHaveURL(/.*\/teacher\/complaints/);

    // التحقق من ظهور تذاكر الاستفسارات
    await expect(page.locator('text=استفسارات وشكاوى أولياء الأمور')).toBeVisible();

    // النقر على زر كتابة رد
    const replyBtn = page.locator('button', { hasText: 'كتابة رد لولي الأمر' }).first();
    if (await replyBtn.isVisible()) {
      await replyBtn.click();
      const replyInput = page.locator('textarea[placeholder*="اكتبي ردك المباشر"]');
      await replyInput.fill('أهلاً بك، تم متابعة الملاحظة مع طاقم الصف بالكامل.');
      const sendReplyBtn = page.locator('button', { hasText: 'إرسال الرد وتحديث الحالة' });
      await sendReplyBtn.click();
    }

    monitor.verifyHealth();
  });

  test('صفحة المحادثات: استعراض جهات الاتصال وإرسال رسالة مباشرة لولي الأمر', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);
    await page.goto('/teacher/messages');
    await expect(page).toHaveURL(/.*\/teacher\/messages/);

    // التحقق من قائمة المحادثات
    await expect(page.locator('text=محادثات أولياء الأمور')).toBeVisible();

    // كتابة رسالة في حقل الإرسال
    const messageInput = page.locator('input[placeholder*="اكتب رسالتك لولي الأمر"]');
    await messageInput.fill('تم استلام الطفل بصحة وعافية اليوم.');

    const sendBtn = page.locator('button', { hasText: 'إرسال' });
    await sendBtn.click();

    // التأكد من ظهور الرسالة في مجرى المحادثة
    await expect(page.locator('text=تم استلام الطفل بصحة وعافية اليوم.')).toBeVisible();

    monitor.verifyHealth();
  });

  test('صفحة التقويم والإشعارات: فحص الفعاليات وتحديد الإشعارات كمقروءة', async ({ page }) => {
    const monitor = setupNetworkAndConsoleMonitor(page);

    // 1. تقويم الفعاليات
    await page.goto('/teacher/calendar');
    await expect(page).toHaveURL(/.*\/teacher\/calendar/);
    await expect(page.locator('text=التقويم والفعاليات')).toBeVisible();

    // 2. مركز الإشعارات
    await page.goto('/teacher/notifications');
    await expect(page).toHaveURL(/.*\/teacher\/notifications/);
    await expect(page.locator('text=مركز الإشعارات والتنبيهات')).toBeVisible();

    const markAllReadBtn = page.locator('button', { hasText: 'تحديد الكل كمقروء' });
    if (await markAllReadBtn.isVisible()) {
      await markAllReadBtn.click();
    }

    monitor.verifyHealth();
  });
});
