// src/components/Admin/MobileSidebarToggle.jsx
import { useState } from 'react';
import Sidebar from './Sidebar';

const MobileSidebarToggle = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button 
          className={`p-4 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 
            'bg-gradient-to-br from-rose-600 to-pink-600 rotate-90' : 
            'bg-gradient-to-br from-indigo-600 to-purple-600'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
      <div className="md:hidden fixed inset-0 z-40">
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
        <div className="relative z-50 w-80 h-full bg-gradient-to-b from-indigo-900 to-purple-900 text-white p-6 shadow-2xl transform transition-transform duration-300">
          <Sidebar onLogout={onLogout} isMobile={true} />
        </div>
      </div>
    )}

    </>
  );
};

export default MobileSidebarToggle;