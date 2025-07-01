import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AdminProtectedRoute = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('admin_token');

  if (!isAuthenticated) {
    // Simpan lokasi yang dituju sebelum redirect ke login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;