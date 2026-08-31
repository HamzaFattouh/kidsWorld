
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: Array<'ADMIN' | 'TEACHER' | 'PARENT'>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user || !user.role) {
    return <Navigate to="/auth/login" replace />;
  }

  // If user requires password change or hasn't setup profile, trap them on that route
  if ((user.requiresPasswordChange || !user.name) && window.location.pathname !== '/auth/setup-profile') {
    return <Navigate to="/auth/setup-profile" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, fallback to dashboard root
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
