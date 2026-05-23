import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStoredToken } from '../lib/token';

interface ProtectedRouteProps {
  agentOnly?: boolean;
}

export function ProtectedRoute({ agentOnly = false }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, isAgent } = useAuth();

  if (isLoading) {
    return <p className="loading">Loading...</p>;
  }

  if (!isAuthenticated || !getStoredToken()) {
    return <Navigate to="/login" replace state={{ message: 'Please login to continue.' }} />;
  }

  if (agentOnly && !isAgent) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
