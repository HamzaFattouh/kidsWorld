import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore, applyTheme } from './store/themeStore';
import { AuthLayout } from './layouts/AuthLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { SetupProfilePage } from './pages/auth/SetupProfilePage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { TeacherLayout } from './layouts/TeacherLayout';
import { ParentLayout } from './layouts/ParentLayout';
import { PublicLayout } from './layouts/PublicLayout';

import { DashboardPage } from './pages/admin/DashboardPage';
import { UsersPage } from './pages/admin/UsersPage';
import { ParentsPage } from './pages/admin/ParentsPage';
import { TeachersPage } from './pages/admin/TeachersPage';
import { ChildrenPage } from './pages/admin/ChildrenPage';
import { ChildDetailsPage } from './pages/admin/ChildDetailsPage';
import { ClassesPage } from './pages/admin/ClassesPage';
import { PickupPage } from './pages/admin/PickupPage';
import { AttendancePage } from './pages/admin/AttendancePage';
import { MealsPage } from './pages/admin/MealsPage';
import { WeeklyNotesPage } from './pages/admin/WeeklyNotesPage';
import { EvaluationsPage } from './pages/admin/EvaluationsPage';
import { IncidentsPage } from './pages/admin/IncidentsPage';
import { ComplaintsPage } from './pages/admin/ComplaintsPage';
import { RequestsPage } from './pages/admin/RequestsPage';
import { MessagesPage } from './pages/admin/MessagesPage';
import { NotificationsPage } from './pages/admin/NotificationsPage';
import { AnnouncementsPage } from './pages/admin/AnnouncementsPage';
import { EventsPage } from './pages/admin/EventsPage';
import { PostsPage } from './pages/admin/PostsPage';
import { GalleryPage } from './pages/admin/GalleryPage';
import { HomepageCMSPage } from './pages/admin/HomepageCMSPage';
import { FormsPage } from './pages/admin/FormsPage';
import { DocumentsPage } from './pages/admin/DocumentsPage';
import { CamerasPage } from './pages/admin/CamerasPage';
import { CameraPermissionsPage } from './pages/admin/CameraPermissionsPage';
import { CameraSchedulesPage } from './pages/admin/CameraSchedulesPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { SettingsPage } from './pages/admin/SettingsPage';

import { TeacherDashboardPage } from './pages/teacher/DashboardPage';
import { TeacherMyChildrenPage } from './pages/teacher/MyChildrenPage';
import { TeacherAttendancePage } from './pages/teacher/AttendancePage';
import { TeacherMealsPage } from './pages/teacher/MealsPage';
import { TeacherDailyActivitiesPage } from './pages/teacher/DailyActivitiesPage';
import { TeacherWeeklyNotesPage } from './pages/teacher/WeeklyNotesPage';
import { TeacherEvaluationsPage } from './pages/teacher/EvaluationsPage';
import { TeacherIncidentsPage } from './pages/teacher/IncidentsPage';
import { TeacherComplaintsPage } from './pages/teacher/ComplaintsPage';
import { TeacherMessagesPage } from './pages/teacher/MessagesPage';
import { TeacherNotificationsPage } from './pages/teacher/NotificationsPage';
import { TeacherCalendarPage } from './pages/teacher/CalendarPage';

import { ParentDashboardPage } from './pages/parent/DashboardPage';
import { ParentAttendancePage } from './pages/parent/AttendancePage';
import { ParentMealsPage } from './pages/parent/MealsPage';
import { ParentWeeklyNotesPage } from './pages/parent/WeeklyNotesPage';
import { ParentEvaluationsPage } from './pages/parent/EvaluationsPage';
import { ParentIncidentsPage } from './pages/parent/IncidentsPage';
import { ParentAnnouncementsPage } from './pages/parent/AnnouncementsPage';
import { ParentEventsPage } from './pages/parent/EventsPage';
import { ParentComplaintsPage } from './pages/parent/ComplaintsPage';
import { ParentRequestsPage } from './pages/parent/RequestsPage';
import { ParentMessagesPage } from './pages/parent/MessagesPage';
import { ParentNotificationsPage } from './pages/parent/NotificationsPage';
import { ParentDocumentsPage } from './pages/parent/DocumentsPage';
import { ParentCamerasPage } from './pages/parent/CamerasPage';

import { LandingPage } from './pages/public/LandingPage';

export default function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') applyTheme('system');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Site */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Public Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/auth/setup-profile" element={<SetupProfilePage />} />
          </Route>
        </Route>

        {/* Protected Dashboard Routes (Admin) */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/parents" element={<ParentsPage />} />
            <Route path="/admin/teachers" element={<TeachersPage />} />
            <Route path="/admin/children" element={<ChildrenPage />} />
            <Route path="/admin/children/:id" element={<ChildDetailsPage />} />
            <Route path="/admin/classes" element={<ClassesPage />} />
            <Route path="/admin/pickup" element={<PickupPage />} />
            <Route path="/admin/attendance" element={<AttendancePage />} />
            <Route path="/admin/meals" element={<MealsPage />} />
            <Route path="/admin/notes" element={<WeeklyNotesPage />} />
            <Route path="/admin/evaluations" element={<EvaluationsPage />} />
            <Route path="/admin/incidents" element={<IncidentsPage />} />
            <Route path="/admin/complaints" element={<ComplaintsPage />} />
            <Route path="/admin/requests" element={<RequestsPage />} />
            <Route path="/admin/messages" element={<MessagesPage />} />
            <Route path="/admin/notifications" element={<NotificationsPage />} />
            <Route path="/admin/announcements" element={<AnnouncementsPage />} />
            <Route path="/admin/events" element={<EventsPage />} />
            <Route path="/admin/posts" element={<PostsPage />} />
            <Route path="/admin/gallery" element={<GalleryPage />} />
            <Route path="/admin/homepage" element={<HomepageCMSPage />} />
            <Route path="/admin/forms" element={<FormsPage />} />
            <Route path="/admin/documents" element={<DocumentsPage />} />
            <Route path="/admin/cameras" element={<CamerasPage />} />
            <Route path="/admin/camera-permissions" element={<CameraPermissionsPage />} />
            <Route path="/admin/camera-schedules" element={<CameraSchedulesPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/audit" element={<AuditLogsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Protected Teacher Routes */}
        <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
          <Route element={<TeacherLayout />}>
            <Route path="/teacher" element={<TeacherDashboardPage />} />
            <Route path="/teacher/children" element={<TeacherMyChildrenPage />} />
            <Route path="/teacher/attendance" element={<TeacherAttendancePage />} />
            <Route path="/teacher/meals" element={<TeacherMealsPage />} />
            <Route path="/teacher/activities" element={<TeacherDailyActivitiesPage />} />
            <Route path="/teacher/notes" element={<TeacherWeeklyNotesPage />} />
            <Route path="/teacher/evaluations" element={<TeacherEvaluationsPage />} />
            <Route path="/teacher/incidents" element={<TeacherIncidentsPage />} />
            <Route path="/teacher/complaints" element={<TeacherComplaintsPage />} />
            <Route path="/teacher/messages" element={<TeacherMessagesPage />} />
            <Route path="/teacher/notifications" element={<TeacherNotificationsPage />} />
            <Route path="/teacher/calendar" element={<TeacherCalendarPage />} />
          </Route>
        </Route>

        {/* Protected Parent Routes */}
        <Route element={<ProtectedRoute allowedRoles={['PARENT']} />}>
          <Route element={<ParentLayout />}>
            <Route path="/parent" element={<ParentDashboardPage />} />
            <Route path="/parent/attendance" element={<ParentAttendancePage />} />
            <Route path="/parent/meals" element={<ParentMealsPage />} />
            <Route path="/parent/notes" element={<ParentWeeklyNotesPage />} />
            <Route path="/parent/evaluations" element={<ParentEvaluationsPage />} />
            <Route path="/parent/incidents" element={<ParentIncidentsPage />} />
            <Route path="/parent/announcements" element={<ParentAnnouncementsPage />} />
            <Route path="/parent/events" element={<ParentEventsPage />} />
            <Route path="/parent/complaints" element={<ParentComplaintsPage />} />
            <Route path="/parent/requests" element={<ParentRequestsPage />} />
            <Route path="/parent/messages" element={<ParentMessagesPage />} />
            <Route path="/parent/notifications" element={<ParentNotificationsPage />} />
            <Route path="/parent/documents" element={<ParentDocumentsPage />} />
            <Route path="/parent/cameras" element={<ParentCamerasPage />} />
          </Route>
        </Route>

        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>);

}