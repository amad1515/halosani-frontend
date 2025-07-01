import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiCalendar, FiDownload, FiMessageSquare, FiUser } from 'react-icons/fi';

const UserNavbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/user/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/user/blogs', icon: <FiBook />, label: 'Blogs' },
    { path: '/user/events', icon: <FiCalendar />, label: 'Events' },
    { path: '/user/ebooks', icon: <FiDownload />, label: 'Ebooks' },
    { path: '/user/chat', icon: <FiMessageSquare />, label: 'Chat' },
    { path: '/user/profile', icon: <FiUser />, label: 'Profile' }
  ];

  return (
    <nav className="user-navbar">
      <div className="navbar-brand">
        <span className="halo">Halo</span>
        <span className="sani">Sani</span>
      </div>
      
      <div className="nav-items">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <div className="nav-icon">{item.icon}</div>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
      
      <div className="nav-footer">
        <button className="logout-btn">
          <FiUser className="logout-icon" />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default UserNavbar;