
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: Array<'ADMIN' | 'TEACHER' | 'PARENT'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // If user requires password change, trap them on that route
  if (user.requiresPasswordChange && window.location.pathname !== '/auth/change-password') {
    return <Navigate to="/auth/change-password" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, fallback to dashboard root
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
