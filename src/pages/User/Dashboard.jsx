import React from 'react';
import Header from '../../components/User/Header';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="user-dashboard">
      <Header />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;