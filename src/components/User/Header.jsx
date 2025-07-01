import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiBook, FiUser, FiLogIn, FiLogOut,FiInfo,FiVideo ,FiBookOpen,FiKey} from 'react-icons/fi';
import { FaBrain } from 'react-icons/fa';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check auth status
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]); // Update when location changes

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user_token');
    setIsLoggedIn(false);
    navigate('/user/login');
    if (isOpen) setIsOpen(false); // Close mobile menu if open
  };

  // Nav items
  const navItems = [
    { path: "/user/dashboard", icon: <FiHome />, label: "Home" },
    { path: "/user/blogs", icon: <FiBook />, label: "Blog" },
    { path: "/user/webinfopage", icon: <FiInfo />, label: "Tentang Kami" },
    { path: "/user/videos", icon: <FiVideo />, label: "Video" },
    { path: "/user/ebooks", icon: <FiBookOpen />, label: "Ebooks" },
    { path: "/user/f&q", icon: <FiKey />, label: "FAQ" },

  ];

  // Animation variants
  const menuVariants = {
    open: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    closed: { opacity: 0, y: "-100%" },
  };

  const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -20 },
  };

  return (
    <motion.header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-white/90 backdrop-blur-sm py-4"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo with animation */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="user/dashboard" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                <span className="halo">Halo</span>
                <span className="sani">Sani</span>
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              </motion.div>
            ))}

            {/* Auth buttons */}
            {isLoggedIn ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/user/dashboard"
                    className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 ml-2"
                  >
                    <span className="mr-2"><FiUser /></span>
                    Dashboard
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 ml-2"
                  >
                    <span className="mr-2"><FiLogOut /></span>
                    Logout
                  </button>
                </motion.div>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/user/login"
                  className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 ml-2"
                >
                  <span className="mr-2"><FiLogOut /></span>
                  Logout
                </Link>
              </motion.div>
            )}
          </nav>

          {/* Mobile menu button */}
          <motion.div 
            className="md:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg focus:outline-none"
              aria-label="Menu"
            >
              {!isOpen ? (
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={menuVariants}
          className={`md:hidden mt-4 pb-4 ${isOpen ? "block" : "hidden"}`}
        >
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <motion.div key={item.path} variants={itemVariants}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </motion.div>
            ))}

            {/* Auth buttons */}
            <motion.div variants={itemVariants}>
              {isLoggedIn ? (
                <>
                  <Link
                    to="/user/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <span className="mr-3"><FiUser /></span>
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 mt-2"
                  >
                    <span className="mr-3"><FiLogOut /></span>
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/user/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  <span className="mr-3"><FiLogIn /></span>
                  Login
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;