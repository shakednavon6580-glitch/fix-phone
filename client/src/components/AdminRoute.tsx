import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthContext } from '../contexts/AuthContext';

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, user } = useAuthContext();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      setLocation('/login');
    } else if (user?.role !== 'admin') {
      // Redirect to user dashboard if not admin
      setLocation('/dashboard/user');
    }
  }, [isAuthenticated, user, setLocation]);

  // Don't render children if not authenticated or not admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
