import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loading from './Loading';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
