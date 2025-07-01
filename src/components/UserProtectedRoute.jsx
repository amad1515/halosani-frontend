import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from './User/Header';
import Footer from './User/Footer';

const UserProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem('user_token'); // GUNAKAN 'user_token'

  if (!token) {
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserProtectedRoute;
