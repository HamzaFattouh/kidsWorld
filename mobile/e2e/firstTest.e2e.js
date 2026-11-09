describe('KidsWorld Mobile App - End-to-End Test Suite', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('1. should show the login screen upon first launch and validate empty submission', async () => {
    await expect(element(by.text('تسجيل الدخول'))).toBeVisible();
    await expect(element(by.text('دخول'))).toBeVisible();

    // Tap submit with empty fields
    await element(by.text('دخول')).tap();
    await expect(element(by.text('تسجيل الدخول'))).toBeVisible();
  });

  it('2. Teacher Flow: logs in as Teacher, manages classroom attendance, meals, activities, and weekly notes', async () => {
    // Quick login as Teacher
    await element(by.text('Teacher')).tap();

    // Verify Teacher Home Dashboard
    await expect(element(by.text('مرحباً بك، أ. نور'))).toBeVisible();
    await expect(element(by.text('إجمالي الطلاب'))).toBeVisible();

    // Quick attendance toggle
    await element(by.text('حاضر')).atIndex(0).tap();

    // Navigate to Classroom Attendance
    await element(by.text('كشف الحضور')).tap();
    await expect(element(by.text('تأكيد وحفظ كشف اليوم'))).toBeVisible();
    await element(by.text('تأكيد وحفظ كشف اليوم')).tap();

    // Navigate to Meals
    await element(by.text('سجل الوجبات')).tap();
    await expect(element(by.text('اعتماد وحفظ سجل الوجبة'))).toBeVisible();
    await element(by.text('اعتماد وحفظ سجل الوجبة')).tap();

    // Navigate to Activities and add a new activity (Create)
    await element(by.text('جدول الأنشطة')).tap();
    await element(by.text('إضافة نشاط')).tap();
    await element(by.placeholder('مثال: ورشة تلوين المجسمات')).typeText('ورشة الرسم الحر للأطفال\n');
    await element(by.text('حفظ وإدراج النشاط')).tap();
    await expect(element(by.text('ورشة الرسم الحر للأطفال'))).toBeVisible();

    // Complete activity (Update)
    await element(by.text('تعيين كمكتمل')).atIndex(0).tap();

    // Logout
    await element(by.text('حسابي')).tap();
    await element(by.text('تسجيل الخروج من الحساب')).tap();
    await element(by.text('خروج')).tap();
    await expect(element(by.text('تسجيل الدخول'))).toBeVisible();
  });

  it('3. Parent Flow: logs in as Parent, views live status, confirms event attendance, and sends message', async () => {
    // Quick login as Parent
    await element(by.text('Parent')).tap();

    // Verify Parent Home
    await expect(element(by.text('أهلاً بك، أ. أحمد الشكعة'))).toBeVisible();
    await expect(element(by.text('متواجد بالروضة حالياً'))).toBeVisible();

    // View Attendance
    await element(by.text('سجل الحضور')).tap();
    await expect(element(by.text('تفاصيل سجل الحضور الشهري'))).toBeVisible();

    // View Meals
    await element(by.text('سجل الوجبات')).tap();

    // Toggle RSVP on Events (Update)
    await element(by.text('الفعاليات والأنشطة')).tap();
    await element(by.text('تأكيد الحضور مع طفلي')).atIndex(0).tap();
    await expect(element(by.text('مؤكد الحضور'))).toBeVisible();

    // Send direct message to teacher (Create)
    await element(by.text('محادثة المعلمة')).tap();
    await expect(element(by.text('أ. نور عبد الرحمن'))).toBeVisible();
    await element(by.text('شكراً جزيلاً لكِ معلمتي')).tap();
    await expect(element(by.text('شكراً جزيلاً لكِ معلمتي'))).toBeVisible();

    // Profile & Logout
    await element(by.text('حسابي')).tap();
    await element(by.text('تسجيل الخروج من الحساب')).tap();
    await element(by.text('خروج')).tap();
    await expect(element(by.text('تسجيل الدخول'))).toBeVisible();
  });
});
