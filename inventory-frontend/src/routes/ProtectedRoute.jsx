import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');

  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
}
