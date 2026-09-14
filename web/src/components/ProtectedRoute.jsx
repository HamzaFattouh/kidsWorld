
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';





export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user || !user.role) {
    return <Navigate to="/auth/login" replace />;
  }

  // If user requires password change, trap them on setup-profile route
  if (user.requiresPasswordChange && !['/auth/setup-profile', '/auth/change-password'].includes(window.location.pathname)) {
    return <Navigate to="/auth/setup-profile" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, fallback to user's corresponding dashboard
    const roleRoutes = {
      ADMIN: '/admin',
      TEACHER: '/teacher',
      PARENT: '/parent'
    };
    return <Navigate to={roleRoutes[user.role] || '/auth/login'} replace />;
  }

  return <Outlet />;
};