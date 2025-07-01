// src/components/Admin/Sidebar.jsx
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// Navigation items array - moved outside component to avoid re-creation on renders
const navItems = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    name: 'Blogs',
    path: '/admin/blogs',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  {
    name: 'Events',
    path: '/admin/event-cms',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    name: 'Ebook',
    path: '/admin/ebook',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    name: 'Web Info',
    path: '/admin/webinfo',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3C7.029 3 3 7.029 3 12s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9zM2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12z" />
      </svg>
    )
  },
  {
    name: 'Youtube Video',
    path: '/admin/video',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 10.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-4.5l4 4v-11l-4 4z" />
      </svg>
    )
  },
  {
    name: 'Notifications',
    path: '/admin/notifications',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )
  },
  {
    name: 'Feedback',
    path: '/admin/feedback',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    )
  },
{
  name: 'Psikolog Info',
  path: '/admin/psikolog',
  icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" />
    </svg>
  )
}

];

// Main sidebar component
const Sidebar = ({ onLogout }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState(false);

  // Handle window resize to determine mobile or desktop view
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-close mobile sidebar when resizing to desktop
      if (!mobile && isExpanded) {
        setIsExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  // Animation effect when component mounts
  useEffect(() => {
    setActiveAnimation(true);
    const timer = setTimeout(() => setActiveAnimation(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Toggle sidebar visibility in mobile view
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // Render either mobile or desktop sidebar
  return (
    <>
      {isMobile ? (
        <MobileSidebar 
          isExpanded={isExpanded} 
          toggleSidebar={toggleSidebar} 
          activeAnimation={activeAnimation}
          onLogout={onLogout}
          setIsExpanded={setIsExpanded}
        />
      ) : (
        <DesktopSidebar 
          activeAnimation={activeAnimation} 
          onLogout={onLogout} 
        />
      )}
      
      {/* Global styles */}
      <style jsx global>{`
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes sidebar-entrance {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
};

// Desktop sidebar component
const DesktopSidebar = ({ activeAnimation, onLogout }) => {
  const location = useLocation();
  
  return (
    <div
      className={`
        fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white
        flex flex-col shadow-2xl h-screen z-40 transition-all duration-300 ease-in-out
        ${activeAnimation ? 'animate-sidebar-entrance' : ''}
      `}
    >
      {/* Logo/Brand */}
      <SidebarHeader />

      {/* Divider */}
      <SidebarDivider />

      {/* Navigation Items */}
      <SidebarNavigation 
        location={location} 
        activeAnimation={activeAnimation} 
      />

      {/* System Status */}
      <SystemStatus />

      {/* Logout Button */}
      <LogoutButton onLogout={onLogout} />
    </div>
  );
};

// Mobile sidebar component
const MobileSidebar = ({ isExpanded, toggleSidebar, activeAnimation, onLogout, setIsExpanded }) => {
  const location = useLocation();
  
  return (
    <>
      {/* Mobile Menu Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Pojok Kiri Atas - Super Minimalist */}
     <button
  onClick={toggleSidebar}
  className={`
    fixed z-50 md:hidden flex items-center justify-center 
    p-2 rounded-r-md text-white
    bg-gradient-to-r from-purple-600 to-indigo-600
    hover:from-purple-700 hover:to-indigo-700
    border-r border-y border-indigo-400/30
    shadow-lg shadow-indigo-500/20
    transition-all duration-300 left-0 top-3
    ${isExpanded ? 'ml-72' : 'ml-0'}
    transform hover:scale-105
  `}
  aria-label={isExpanded ? "Close menu" : "Open menu"}
>
  <div className="relative">
    {/* Chevron Icon */}
    {isExpanded ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 transform transition-transform duration-300 rotate-180"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 transform transition-transform duration-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    )}
    
    {/* Subtle Glow Effect */}
    <span className="absolute inset-0 rounded-r-md bg-white/0 hover:bg-white/10 transition-all duration-300"></span>
  </div>
</button>

      {/* Mobile Sidebar */}
      <div
        className={`
          fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white
          flex flex-col shadow-2xl h-screen z-40 transition-all duration-300 ease-in-out
          ${isExpanded ? 'translate-x-0' : '-translate-x-full'}
          ${activeAnimation ? 'animate-sidebar-entrance' : ''}
        `}
      >
        {/* Logo/Brand */}
        <SidebarHeader />

        {/* Divider */}
        <SidebarDivider />

        {/* Navigation Items */}
        <SidebarNavigation 
          location={location} 
          activeAnimation={activeAnimation} 
          closeSidebar={() => setIsExpanded(false)} 
          isMobile={true}
        />

        {/* System Status */}
        <SystemStatus />

        {/* Logout Button */}
        <LogoutButton onLogout={onLogout} />
      </div>
    </>
  );
};

// Reusable components

const SidebarHeader = () => (
  <div className="flex items-center p-6 justify-start group cursor-pointer">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/30 transition-all duration-500 group-hover:scale-110">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div className="ml-3 overflow-hidden transition-all duration-300">
      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
        Admin Panel
      </h2>
      <p className="text-xs text-cyan-200/70">Kelola Konten</p>
    </div>
  </div>
);

const SidebarDivider = () => (
  <div className="px-6 py-6">
    <div className="h-px bg-gradient-to-r from-transparent via-indigo-300/20 to-transparent"></div>
  </div>
);

const SidebarNavigation = ({ location, activeAnimation, closeSidebar, isMobile = false }) => (
  <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
    {navItems.map((item, index) => (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={isMobile && closeSidebar ? closeSidebar : undefined}
        className={({ isActive }) => `
          flex items-center justify-start px-4 py-3 rounded-xl transition-all duration-500 relative
          ${isActive ? 
            'bg-gradient-to-r from-indigo-600/80 to-purple-600/80 shadow-lg shadow-indigo-900/30' : 
            'hover:bg-white/10'}
          group
        `}
        style={{
          animationDelay: `${index * 100}ms`,
          animation: activeAnimation ? 'fadeInRight 0.5s ease forwards' : 'none',
          opacity: activeAnimation ? 0 : 1
        }}
      >
        {/* Active Indicator */}
        {location.pathname === item.path && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r-full"></span>
        )}

        {/* Icon */}
        <span className={`
          flex items-center justify-center mr-3
          ${location.pathname === item.path ? 'text-cyan-300' : 'text-white/70'} 
          group-hover:text-white transition-colors duration-300
        `}>
          {item.icon}
        </span>

        {/* Name */}
        <span className={`
          whitespace-nowrap ${location.pathname === item.path ? 'text-white font-medium' : 'text-white/80'} 
          group-hover:text-white transition-colors duration-300
        `}>
          {item.name}
        </span>

        {/* Active Indicator Dot */}
        {location.pathname === item.path && (
          <span className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-500/50"></span>
        )}
      </NavLink>
    ))}
  </nav>
);

const SystemStatus = () => (
  <div className="px-6 py-4">
    <div className="bg-indigo-800/50 rounded-xl p-3 border border-indigo-700/50">
      <div className="flex items-center">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
        <p className="text-xs text-indigo-200">Status: Online</p>
      </div>
    </div>
  </div>
);

const LogoutButton = ({ onLogout }) => (
  <div className="p-4 px-6">
    <button
      onClick={onLogout}
      className={`
        w-full flex items-center justify-start px-4
        py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 
        transition-all duration-300 shadow-lg hover:shadow-pink-600/20 transform hover:-translate-y-1
      `}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span className="font-medium">Logout</span>
    </button>
  </div>
);

export default Sidebar;