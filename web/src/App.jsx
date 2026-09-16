import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore, applyTheme } from './store/themeStore';
import { AuthLayout } from './layouts/AuthLayout';
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const SetupProfilePage = lazy(() => import('./pages/auth/SetupProfilePage').then(m => ({ default: m.SetupProfilePage })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { TeacherLayout } from './layouts/TeacherLayout';
import { ParentLayout } from './layouts/ParentLayout';
import { PublicLayout } from './layouts/PublicLayout';

const DashboardPage = lazy(() => import('./pages/admin/DashboardPage').then(m => ({ default: m.DashboardPage })));
const UsersPage = lazy(() => import('./pages/admin/UsersPage').then(m => ({ default: m.UsersPage })));
const ParentsPage = lazy(() => import('./pages/admin/ParentsPage').then(m => ({ default: m.ParentsPage })));
const TeachersPage = lazy(() => import('./pages/admin/TeachersPage').then(m => ({ default: m.TeachersPage })));
const ChildrenPage = lazy(() => import('./pages/admin/ChildrenPage').then(m => ({ default: m.ChildrenPage })));
const ChildDetailsPage = lazy(() => import('./pages/admin/ChildDetailsPage').then(m => ({ default: m.ChildDetailsPage })));
const ClassesPage = lazy(() => import('./pages/admin/ClassesPage').then(m => ({ default: m.ClassesPage })));
const PickupPage = lazy(() => import('./pages/admin/PickupPage').then(m => ({ default: m.PickupPage })));
const AttendancePage = lazy(() => import('./pages/admin/AttendancePage').then(m => ({ default: m.AttendancePage })));
const MealsPage = lazy(() => import('./pages/admin/MealsPage').then(m => ({ default: m.MealsPage })));
const WeeklyNotesPage = lazy(() => import('./pages/admin/WeeklyNotesPage').then(m => ({ default: m.WeeklyNotesPage })));
const EvaluationsPage = lazy(() => import('./pages/admin/EvaluationsPage').then(m => ({ default: m.EvaluationsPage })));
const TasksPage = lazy(() => import('./pages/admin/TasksPage').then(m => ({ default: m.TasksPage })));
const ComplaintsPage = lazy(() => import('./pages/admin/ComplaintsPage').then(m => ({ default: m.ComplaintsPage })));
const RequestsPage = lazy(() => import('./pages/admin/RequestsPage').then(m => ({ default: m.RequestsPage })));
const MessagesPage = lazy(() => import('./pages/admin/MessagesPage').then(m => ({ default: m.MessagesPage })));
const NotificationsPage = lazy(() => import('./pages/admin/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const AnnouncementsPage = lazy(() => import('./pages/admin/AnnouncementsPage').then(m => ({ default: m.AnnouncementsPage })));
const EventsPage = lazy(() => import('./pages/admin/EventsPage').then(m => ({ default: m.EventsPage })));
const PostsPage = lazy(() => import('./pages/admin/PostsPage').then(m => ({ default: m.PostsPage })));
const GalleryPage = lazy(() => import('./pages/admin/GalleryPage').then(m => ({ default: m.GalleryPage })));
const HomepageCMSPage = lazy(() => import('./pages/admin/HomepageCMSPage').then(m => ({ default: m.HomepageCMSPage })));
const FormsPage = lazy(() => import('./pages/admin/FormsPage').then(m => ({ default: m.FormsPage })));
const DocumentsPage = lazy(() => import('./pages/admin/DocumentsPage').then(m => ({ default: m.DocumentsPage })));
const CamerasPage = lazy(() => import('./pages/admin/CamerasPage').then(m => ({ default: m.CamerasPage })));
const CameraPermissionsPage = lazy(() => import('./pages/admin/CameraPermissionsPage').then(m => ({ default: m.CameraPermissionsPage })));
const CameraSchedulesPage = lazy(() => import('./pages/admin/CameraSchedulesPage').then(m => ({ default: m.CameraSchedulesPage })));
const ReportsPage = lazy(() => import('./pages/admin/ReportsPage').then(m => ({ default: m.ReportsPage })));
const AuditLogsPage = lazy(() => import('./pages/admin/AuditLogsPage').then(m => ({ default: m.AuditLogsPage })));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage').then(m => ({ default: m.SettingsPage })));

const TeacherDashboardPage = lazy(() => import('./pages/teacher/DashboardPage').then(m => ({ default: m.TeacherDashboardPage })));
const TeacherMyChildrenPage = lazy(() => import('./pages/teacher/MyChildrenPage').then(m => ({ default: m.TeacherMyChildrenPage })));
const TeacherAttendancePage = lazy(() => import('./pages/teacher/AttendancePage').then(m => ({ default: m.TeacherAttendancePage })));
const TeacherMealsPage = lazy(() => import('./pages/teacher/MealsPage').then(m => ({ default: m.TeacherMealsPage })));
const TeacherDailyActivitiesPage = lazy(() => import('./pages/teacher/DailyActivitiesPage').then(m => ({ default: m.TeacherDailyActivitiesPage })));
const TeacherWeeklyNotesPage = lazy(() => import('./pages/teacher/WeeklyNotesPage').then(m => ({ default: m.TeacherWeeklyNotesPage })));
const TeacherEvaluationsPage = lazy(() => import('./pages/teacher/EvaluationsPage').then(m => ({ default: m.TeacherEvaluationsPage })));
const TeacherTasksPage = lazy(() => import('./pages/teacher/TasksPage').then(m => ({ default: m.TeacherTasksPage })));
const TeacherComplaintsPage = lazy(() => import('./pages/teacher/ComplaintsPage').then(m => ({ default: m.TeacherComplaintsPage })));
const TeacherMessagesPage = lazy(() => import('./pages/teacher/MessagesPage').then(m => ({ default: m.TeacherMessagesPage })));
const TeacherNotificationsPage = lazy(() => import('./pages/teacher/NotificationsPage').then(m => ({ default: m.TeacherNotificationsPage })));
const TeacherCalendarPage = lazy(() => import('./pages/teacher/CalendarPage').then(m => ({ default: m.TeacherCalendarPage })));

const ParentDashboardPage = lazy(() => import('./pages/parent/DashboardPage').then(m => ({ default: m.ParentDashboardPage })));
const ParentAttendancePage = lazy(() => import('./pages/parent/AttendancePage').then(m => ({ default: m.ParentAttendancePage })));
const ParentMealsPage = lazy(() => import('./pages/parent/MealsPage').then(m => ({ default: m.ParentMealsPage })));
const ParentWeeklyNotesPage = lazy(() => import('./pages/parent/WeeklyNotesPage').then(m => ({ default: m.ParentWeeklyNotesPage })));
const ParentEvaluationsPage = lazy(() => import('./pages/parent/EvaluationsPage').then(m => ({ default: m.ParentEvaluationsPage })));
const ParentAnnouncementsPage = lazy(() => import('./pages/parent/AnnouncementsPage').then(m => ({ default: m.ParentAnnouncementsPage })));
const ParentEventsPage = lazy(() => import('./pages/parent/EventsPage').then(m => ({ default: m.ParentEventsPage })));
const ParentComplaintsPage = lazy(() => import('./pages/parent/ComplaintsPage').then(m => ({ default: m.ParentComplaintsPage })));
const ParentRequestsPage = lazy(() => import('./pages/parent/RequestsPage').then(m => ({ default: m.ParentRequestsPage })));
const ParentMessagesPage = lazy(() => import('./pages/parent/MessagesPage').then(m => ({ default: m.ParentMessagesPage })));
const ParentNotificationsPage = lazy(() => import('./pages/parent/NotificationsPage').then(m => ({ default: m.ParentNotificationsPage })));
const ParentDocumentsPage = lazy(() => import('./pages/parent/DocumentsPage').then(m => ({ default: m.ParentDocumentsPage })));
const ParentCamerasPage = lazy(() => import('./pages/parent/CamerasPage').then(m => ({ default: m.ParentCamerasPage })));

const LandingPage = lazy(() => import('./pages/public/LandingPage').then(m => ({ default: m.LandingPage })));

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
      <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div></div>}>
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
            <Route path="/auth/change-password" element={<SetupProfilePage />} />
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
            <Route path="/admin/tasks" element={<TasksPage />} />
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
            <Route path="/teacher/tasks" element={<TeacherTasksPage />} />
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
      </Suspense>
    </BrowserRouter>);

}