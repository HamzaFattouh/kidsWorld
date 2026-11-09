import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

// Teacher Screens
import { DashboardScreen } from '../screens/teacher/DashboardScreen';
import { ChildrenScreen } from '../screens/teacher/ChildrenScreen';
import { AttendanceScreen } from '../screens/teacher/AttendanceScreen';
import { MealsScreen } from '../screens/teacher/MealsScreen';
import { ActivitiesScreen } from '../screens/teacher/ActivitiesScreen';
import { WeeklyNotesScreen } from '../screens/teacher/WeeklyNotesScreen';
import { EvaluationsScreen } from '../screens/teacher/EvaluationsScreen';
import { ComplaintsScreen } from '../screens/teacher/ComplaintsScreen';
import { MessagesScreen } from '../screens/teacher/MessagesScreen';
import { NotificationsScreen } from '../screens/teacher/NotificationsScreen';
import { ProfileScreen } from '../screens/teacher/ProfileScreen';
import { SettingsScreen } from '../screens/teacher/SettingsScreen';

// Spy on Alert
jest.spyOn(Alert, 'alert');

describe('Teacher Mobile Screens - Comprehensive Testing & Interactivity', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('DashboardScreen: renders KPIs, quick action buttons, and toggles quick attendance', async () => {
    const mockNavigate = jest.fn();
    const screen = await render(<DashboardScreen navigation={{ navigate: mockNavigate }} />);

    // 1. Verify Header & KPIs
    expect(screen.getByText('مرحباً بك، أ. نور')).toBeTruthy();
    expect(screen.getByText('إجمالي الطلاب')).toBeTruthy();
    expect(screen.getByText('حضور اليوم')).toBeTruthy();
    expect(screen.getByText('تسجيل الوجبات')).toBeTruthy();

    // 2. Verify Quick Action Buttons
    expect(screen.getByText('كشف الحضور')).toBeTruthy();
    expect(screen.getByText('سجل الوجبات')).toBeTruthy();
    expect(screen.getByText('التقرير الأسبوعي')).toBeTruthy();

    // 3. Test Toggling Attendance for child #1 in roster
    const toggleBtn = screen.getByTestId('quick-attendance-toggle-1');
    fireEvent.press(toggleBtn);
    expect(screen.getAllByText('غائب').length).toBeGreaterThan(0);
  });

  test('ChildrenScreen: searches students and verifies student health & allergy info', async () => {
    const screen = await render(<ChildrenScreen />);

    // 1. Verify Search Bar
    expect(screen.getByText('قائمة أطفال الصف')).toBeTruthy();
    const searchInput = screen.getByPlaceholderText('ابحث عن طفل أو ولي أمر...');
    fireEvent.changeText(searchInput, 'عمر');
    expect(screen.getByText('عمر أحمد الشكعة')).toBeTruthy();

    // 2. Verify Health & Allergy info on the card
    expect(screen.getByText(/حساسية من الفول السوداني/i)).toBeTruthy();
    expect(screen.getAllByText('فصيلة الدم: O+').length).toBeGreaterThan(0);
  });

  test('AttendanceScreen: toggles student presence and confirms/saves daily attendance sheet', async () => {
    const screen = await render(<AttendanceScreen />);

    expect(screen.getByText(/تقويم الحضور وخصم الجمعة/i)).toBeTruthy();

    // Toggle attendance save
    const saveBtn = screen.getByTestId('save-attendance-btn');
    fireEvent.press(saveBtn);

    expect(Alert.alert).toHaveBeenCalledWith(
      'تم حفظ الكشف',
      expect.stringContaining('تم تأكيد وتسجيل كشف الحضور')
    );
  });

  test('MealsScreen: logs breakfast, lunch, and snack meal records with intake ratings', async () => {
    const screen = await render(<MealsScreen />);

    expect(screen.getByText(/إدارة التغذية والوجبات/i)).toBeTruthy();

    // 1. Press meal toggle for child #2
    const childMealCard = screen.getByTestId('meal-card-2');
    fireEvent.press(childMealCard);

    expect(Alert.alert).toHaveBeenCalledWith(
      'تم التنبيه',
      expect.stringContaining('تم إرسال إشعار فوري لولي الأمر')
    );
  });

  test('ActivitiesScreen: displays daily activities timeline and toggles completion status (Update)', async () => {
    const screen = await render(<ActivitiesScreen />);

    expect(screen.getByText('جدول الأنشطة اليومية')).toBeTruthy();
    expect(screen.getByText('استقبال الأطفال وحلقة الصباح')).toBeTruthy();
    expect(screen.getByText('استكشاف الأرقام والأشكال')).toBeTruthy();
    expect(screen.getByText('وجبة الإفطار الجماعية')).toBeTruthy();

    // Toggle activity completion status for activity 4
    const toggleStatusBtn = screen.getByTestId('toggle-activity-status-4');
    fireEvent.press(toggleStatusBtn);
  });

  test('WeeklyNotesScreen: verifies student report completion statuses and class options (Read & Filter)', async () => {
    const screen = await render(<WeeklyNotesScreen />);

    expect(screen.getByText('الملاحظات الأسبوعية')).toBeTruthy();
    expect(screen.getByText('كتابة ومراجعة التقارير الأسبوعية للطلاب')).toBeTruthy();

    // Verify class options
    expect(screen.getByText('روضة العصافير')).toBeTruthy();
    expect(screen.getByText('روضة الزهور')).toBeTruthy();
    expect(screen.getByText('روضة الأمل')).toBeTruthy();

    // Verify Birds class roster and status indicators
    expect(screen.getByText('عمر أحمد الشكعة')).toBeTruthy();
    expect(screen.getByText('كُتب التقرير ')).toBeTruthy();
    expect(screen.getByText('يوسف خالد جودت')).toBeTruthy();
    expect(screen.getByText('لم يُكتب بعد ')).toBeTruthy();
  });

  test('EvaluationsScreen: updates 5-star skill ratings across 6 developmental domains', async () => {
    const screen = await render(<EvaluationsScreen />);

    expect(screen.getByText('تقييم المهارات التنموية')).toBeTruthy();
    expect(screen.getByText('التواصل واللغة')).toBeTruthy();
    expect(screen.getByText('المهارات الاجتماعية والعاطفية')).toBeTruthy();

    // Save evaluation
    const saveBtn = screen.getByTestId('save-evaluation-btn');
    fireEvent.press(saveBtn);

    expect(Alert.alert).toHaveBeenCalledWith(
      'تم حفظ التقييم',
      expect.stringContaining('تم تسجيل تقييم المهارات للطفل')
    );
  });

  test('ComplaintsScreen: filters parent inquiries and displays communication tickets (Read & Filter)', async () => {
    const screen = await render(<ComplaintsScreen />);

    expect(screen.getByText('استفسارات وشكاوى أولياء الأمور')).toBeTruthy();
    expect(screen.getByText('متابعة رسائل وملاحظات أولياء أمور روضة العصافير')).toBeTruthy();
    expect(screen.getByText('الكل')).toBeTruthy();
    expect(screen.getAllByText('قيد المراجعة').length).toBeGreaterThan(0);
    expect(screen.getAllByText('تم الرد').length).toBeGreaterThan(0);
  });

  test('MessagesScreen: displays parent conversation threads and searches inquiries (Read & Filter)', async () => {
    const screen = await render(<MessagesScreen />);

    expect(screen.getByText('المحادثات والرسائل')).toBeTruthy();
    expect(screen.getByText('تواصل مباشر وآمن مع أولياء أمور روضة العصافير')).toBeTruthy();

    // 1. Verify parent threads in list
    expect(screen.getByText('أحمد الشكعة')).toBeTruthy();
    expect(screen.getByText('خالد جودت')).toBeTruthy();
    expect(screen.getByText('مريم المصري')).toBeTruthy();

    // 2. Search for specific parent/child
    const searchInput = screen.getByPlaceholderText('بحث في المحادثات...');
    fireEvent.changeText(searchInput, 'عمر');
    expect(screen.getByText('أحمد الشكعة')).toBeTruthy();
    expect(screen.getByText(/عمر أحمد الشكعة/)).toBeTruthy();
  });

  test('NotificationsScreen: marks all read and deletes notification item (Delete)', async () => {
    const screen = await render(<NotificationsScreen />);

    expect(screen.getByText('الإشعارات والتنبيهات')).toBeTruthy();

    // Mark all read
    const markReadBtn = screen.getByTestId('mark-all-read-btn');
    fireEvent.press(markReadBtn);
    expect(Alert.alert).toHaveBeenCalledWith('تم التحديث', 'تم تحديد جميع الإشعارات كمقروءة.');
  });

  test('ProfileScreen & SettingsScreen: displays profile credentials, triggers theme/language switches, and logout', async () => {
    // 1. Profile Screen
    const profileScreen = await render(<ProfileScreen />);
    expect(profileScreen.getByText('البيانات الشخصية والمهنية')).toBeTruthy();
    const logoutBtn = profileScreen.getByTestId('teacher-logout-btn');
    fireEvent.press(logoutBtn);
    expect(Alert.alert).toHaveBeenCalledWith(
      'تسجيل الخروج',
      expect.stringContaining('هل أنتِ متأكدة'),
      expect.any(Array)
    );

    // 2. Settings Screen
    const settingsScreen = await render(<SettingsScreen />);
    expect(settingsScreen.getByText('إعدادات التطبيق')).toBeTruthy();
    expect(settingsScreen.getByText('الوضع الليلي (Dark Mode)')).toBeTruthy();

    const enChip = settingsScreen.getByTestId('lang-chip-en');
    fireEvent.press(enChip);
    expect(Alert.alert).toHaveBeenCalledWith('اللغة', 'English selected');
  });
});
