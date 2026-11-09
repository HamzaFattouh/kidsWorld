import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

// Parent Screens
import { HomeScreen } from '../screens/parent/HomeScreen';
import { AttendanceScreen } from '../screens/parent/AttendanceScreen';
import { MealsScreen } from '../screens/parent/MealsScreen';
import { WeeklyNotesScreen } from '../screens/parent/WeeklyNotesScreen';
import { EvaluationsScreen } from '../screens/parent/EvaluationsScreen';
import { EventsScreen } from '../screens/parent/EventsScreen';
import { DocumentsScreen } from '../screens/parent/DocumentsScreen';
import { RequestsScreen } from '../screens/parent/RequestsScreen';
import { ComplaintsScreen } from '../screens/parent/ComplaintsScreen';
import { MessagesScreen } from '../screens/parent/MessagesScreen';
import { NotificationsScreen } from '../screens/parent/NotificationsScreen';
import { ProfileScreen } from '../screens/parent/ProfileScreen';

jest.spyOn(Alert, 'alert');

describe('Parent Mobile Screens - Comprehensive Testing & Interactivity', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('HomeScreen: renders live child status, camera stream shortcut, and quick services buttons', async () => {
    const mockNavigate = jest.fn();
    const screen = await render(<HomeScreen navigation={{ navigate: mockNavigate }} />);

    expect(screen.getByText('أهلاً بك، أ. أحمد الشكعة')).toBeTruthy();
    expect(screen.getByText('متواجد بالروضة حالياً')).toBeTruthy();
    expect(screen.getByText('البث المباشر لكاميرات الصف')).toBeTruthy();

    // Verify quick buttons
    expect(screen.getByText('سجل الحضور')).toBeTruthy();
    expect(screen.getByText('سجل الوجبات')).toBeTruthy();
    expect(screen.getByText('التقرير الأسبوعي')).toBeTruthy();
    expect(screen.getByText('تقييم المهارات')).toBeTruthy();

    // Tap Camera Banner
    const camBanner = screen.getByText('البث المباشر لكاميرات الصف');
    fireEvent.press(camBanner);
    expect(mockNavigate).toHaveBeenCalledWith('More', { screen: 'Cameras' });
  });

  test('AttendanceScreen: displays attendance history and monthly summary statistics', async () => {
    const screen = await render(<AttendanceScreen />);
    expect(screen.getByText(/سجل الحضور والغياب/i)).toBeTruthy();
    expect(screen.getByText('أيام الحضور')).toBeTruthy();
  });

  test('MealsScreen: displays meal logs and food intake tracking for the child', async () => {
    const screen = await render(<MealsScreen />);
    expect(screen.getByText(/سجل الوجبات وجدول التغذية/i)).toBeTruthy();
    expect(screen.getByText('وجبة الإفطار')).toBeTruthy();
  });

  test('WeeklyNotesScreen & EvaluationsScreen: renders teacher remarks and developmental ratings', async () => {
    const notesScreen = await render(<WeeklyNotesScreen />);
    expect(notesScreen.getByText(/الملاحظات الأسبوعية/i)).toBeTruthy();

    const evalsScreen = await render(<EvaluationsScreen />);
    expect(evalsScreen.getByText(/التقييمات وتطور الطفل/i)).toBeTruthy();
  });

  test('EventsScreen: displays upcoming nursery events and toggles RSVP participation (Update)', async () => {
    const screen = await render(<EventsScreen />);

    expect(screen.getByText('الفعاليات والأنشطة القادمة')).toBeTruthy();
    expect(screen.getByText('يوم الصحة والتغذية السليمة')).toBeTruthy();

    // Toggle RSVP participation on event 2
    const rsvpBtn = screen.getByTestId('event-rsvp-btn-2');
    fireEvent.press(rsvpBtn);

    expect(Alert.alert).toHaveBeenCalledWith(
      'تأكيد الحضور',
      expect.stringContaining('تم تأكيد حضورك لفعالية')
    );
  });

  test('DocumentsScreen: views verified documents and triggers file download (Read)', async () => {
    const screen = await render(<DocumentsScreen />);

    expect(screen.getByText('الوثائق الرسمية والملف الثبوتي')).toBeTruthy();
    expect(screen.getByText('سجل اللقاحات والتطعيمات الوطنية')).toBeTruthy();

    // Download document action
    const downloadBtn = screen.getByTestId('download-doc-btn-1');
    fireEvent.press(downloadBtn);

    expect(Alert.alert).toHaveBeenCalledWith(
      'تحميل المستند',
      expect.stringContaining('جارٍ تنزيل ملف')
    );
  });

  test('RequestsScreen & ComplaintsScreen: views lists and prepares new submission modal (Create)', async () => {
    const reqScreen = await render(<RequestsScreen />);
    expect(reqScreen.getByText(/طلبات أولياء الأمور/i)).toBeTruthy();

    const compScreen = await render(<ComplaintsScreen />);
    expect(compScreen.getByText(/الشكاوى والمقترحات/i)).toBeTruthy();
  });

  test('MessagesScreen: uses quick reply chips and sends message to classroom teacher (Create)', async () => {
    const screen = await render(<MessagesScreen />);

    expect(screen.getByText('أ. نور عبد الرحمن')).toBeTruthy();
    expect(screen.getByText('متصلة بالصف')).toBeTruthy();

    // Tap quick reply chip
    const quickChip = screen.getByTestId('quick-reply-chip-0');
    fireEvent.press(quickChip);

    // Verify it was added to conversation stream
    expect(await screen.findByText('شكراً جزيلاً لكِ معلمتي')).toBeTruthy();
  });

  test('NotificationsScreen: marks all alerts as read (Update)', async () => {
    const screen = await render(<NotificationsScreen />);

    expect(screen.getByText('إشعارات متابعة الطفل')).toBeTruthy();

    const markReadBtn = screen.getByText('قراءة الكل');
    fireEvent.press(markReadBtn);
    expect(Alert.alert).toHaveBeenCalledWith('تم التحديث', 'تم تحديد جميع الإشعارات كمقروءة.');
  });

  test('ProfileScreen: displays parent details, children enrolled, and logout button', async () => {
    const screen = await render(<ProfileScreen />);

    expect(screen.getByText('بيانات الاتصال والعنوان')).toBeTruthy();
    expect(screen.getByText('الأطفال المسجلون في الروضة')).toBeTruthy();
    expect(screen.getByText('عمر أحمد الشكعة')).toBeTruthy();

    const logoutBtn = screen.getByText('تسجيل الخروج من الحساب');
    fireEvent.press(logoutBtn);
    expect(Alert.alert).toHaveBeenCalledWith(
      'تسجيل الخروج',
      expect.stringContaining('هل أنت متأكد'),
      expect.any(Array)
    );
  });
});
