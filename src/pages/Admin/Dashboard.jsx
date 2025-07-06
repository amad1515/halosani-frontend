import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import Sidebar from '../../components/Admin/Sidebar';
import { 
  FiBook, 
  FiCalendar, 
  FiUsers, 
  FiRefreshCw, 
  FiPlus, 
  FiBarChart2,
  FiEdit,
  FiTrendingUp,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    blogs: 0,
    events: 0,
    users: 0,
    updatedBlogs: 0
  });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [updatedBlogs, setUpdatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Tutup menu mobile jika layar cukup besar
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/dashboard/stats');
        setStats({
          blogs: response.data.blogs,
          events: response.data.events,
          users: response.data.users,
          updatedBlogs: response.data.updatedBlogs
        });
        setRecentBlogs(response.data.recentBlogs);
        setUpdatedBlogs(response.data.updatedBlogsList);
        setLoading(false);
      } catch (error) {
        console.error('Gagal memuat data dashboard:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
      localStorage.removeItem('admin_token');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout gagal', error);
    }
  };

  const statCards = [
    { 
      title: "Total Artikel", 
      value: stats.blogs, 
      icon: <FiBook className="text-indigo-500 text-xl" />,
      color: "bg-indigo-50",
      trend: stats.blogs > 0 ? 'up' : 'neutral'
    },
    { 
      title: "Artikel Diupdate", 
      value: stats.updatedBlogs, 
      icon: <FiRefreshCw className="text-blue-500 text-xl" />,
      color: "bg-blue-50",
      trend: stats.updatedBlogs > 0 ? 'up' : 'neutral'
    },
    { 
      title: "Total Acara", 
      value: stats.events, 
      icon: <FiCalendar className="text-emerald-500 text-xl" />,
      color: "bg-emerald-50",
      trend: stats.events > 0 ? 'up' : 'neutral'
    },
    { 
      title: "Pengguna Terdaftar", 
      value: stats.users, 
      icon: <FiUsers className="text-purple-500 text-xl" />,
      color: "bg-purple-50",
      trend: stats.users > 0 ? 'up' : 'neutral'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-gray-800">Dashboard Admin</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <FiX className="h-6 w-6" />
          ) : (
            <FiMenu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar - Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-30 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'tween' }}
              className="fixed inset-y-0 left-0 w-64 z-40 md:hidden"
            >
              <Sidebar 
                onLogout={handleLogout} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                isMobile={true}
                onMobileItemClick={() => setIsMobileMenuOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 fixed h-full">
          <Sidebar 
            onLogout={handleLogout} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isMobile={false}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${windowWidth >= 768 ? 'ml-64' : ''} transition-all duration-300`}>
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Ikhtisar Dashboard</h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">Selamat datang kembali! Ini yang terjadi dengan konten Anda.</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-sm font-medium"
            >
              <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
              <span>Admin</span>
            </motion.button>
          </motion.div>

          {/* Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-6 md:mb-8">
            {statCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -3 }}
                className={`${card.color} p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all`}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">{card.title}</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{card.value}</h3>
                  </div>
                  <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg ${card.color} flex items-center justify-center`}>
                    {card.icon}
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center">
                  <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium ${
                    card.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {card.trend === 'up' ? (
                      <>
                        <FiTrendingUp className="mr-1" />
                        Aktif
                      </>
                    ) : 'Tidak ada aktivitas'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Content Sections - Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-6 md:mb-8">
            {/* Artikel Terbaru */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">Artikel Terbaru</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/admin/blogs')}
                  className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  Lihat Semua <FiPlus className="ml-1" />
                </motion.button>
              </div>
              
              <AnimatePresence>
                {recentBlogs.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 sm:p-6 text-center"
                  >
                    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-3 sm:mb-4">
                      <FiBook className="text-indigo-400 text-xl sm:text-2xl" />
                    </div>
                    <h3 className="mt-1 sm:mt-2 text-base sm:text-lg font-medium text-gray-900">Belum ada artikel</h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">Buat artikel kesehatan mental pertama Anda</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/admin/blogs/create')}
                      className="mt-3 sm:mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1 sm:py-2 px-3 sm:px-4 rounded-lg transition text-xs sm:text-sm"
                    >
                      Buat Artikel
                    </motion.button>
                  </motion.div>
                ) : (
                  <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                    {recentBlogs.map((blog) => (
                      <motion.li 
                        key={blog.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                        className="transition-colors"
                      >
                        <div className="px-4 py-3 sm:px-5 sm:py-4 flex items-start">
                          {blog.image && (
                            <div className="flex-shrink-0 h-12 w-12 sm:h-16 sm:w-16 rounded-md overflow-hidden mr-3 sm:mr-4">
                              <img 
                                src={blog.image_url} 
                                alt={blog.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{blog.title}</h3>
                            <p className="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-2">{blog.description}</p>
                            <div className="mt-2 flex justify-end">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/admin/blogs/${blog.id}/edit`)}
                                className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 border border-gray-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                              >
                                <FiEdit className="mr-1" /> Edit
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Baru Diperbarui */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">Baru Diperbarui</h2>
                <span className="text-xs sm:text-sm text-gray-500">{updatedBlogs.length} diperbarui</span>
              </div>
              
              <AnimatePresence>
                {updatedBlogs.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 sm:p-6 text-center"
                  >
                    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3 sm:mb-4">
                      <FiRefreshCw className="text-blue-400 text-xl sm:text-2xl" />
                    </div>
                    <h3 className="mt-1 sm:mt-2 text-base sm:text-lg font-medium text-gray-900">Belum ada pembaruan</h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">Artikel yang diperbarui akan muncul di sini</p>
                  </motion.div>
                ) : (
                  <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                    {updatedBlogs.map((blog) => (
                      <motion.li 
                        key={blog.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                        className="transition-colors"
                      >
                        <div className="px-4 py-3 sm:px-5 sm:py-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm sm:text-base font-medium text-gray-900">{blog.title}</h3>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Diperbarui
                            </span>
                          </div>
                          <p className="mt-1 text-xs sm:text-sm text-gray-600">
                            Terakhir diperbarui: {format(new Date(blog.updated_at), 'd MMM yyyy, HH:mm')}
                          </p>
                          <div className="mt-2 sm:mt-3 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              Dibuat: {format(new Date(blog.created_at), 'd MMM yyyy')}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Aksi Cepat - Responsive Grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
                  <FiEdit className="text-lg" />
                </div>
                <h3 className="text-sm sm:text-base font-medium">Buat Artikel Baru</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Bagikan pengetahuan kesehatan mental dengan komunitas Anda.</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin/blogs')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1 sm:py-2 px-3 sm:px-4 rounded-lg transition text-xs sm:text-sm"
              >
                Tulis Artikel
              </motion.button>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 mr-3">
                  <FiCalendar className="text-lg" />
                </div>
                <h3 className="text-sm sm:text-base font-medium">Tambah Acara Kesehatan</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Selenggarakan workshop atau webinar kesehatan mental.</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin/event-cms')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-1 sm:py-2 px-3 sm:px-4 rounded-lg transition text-xs sm:text-sm"
              >
                Jadwalkan Acara
              </motion.button>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-all"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
                  <FiBarChart2 className="text-lg" />
                </div>
                <h3 className="text-sm sm:text-base font-medium">Kelola Info Web</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Kelola informasi website kesehatan mental Anda.</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin/webinfo')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-1 sm:py-2 px-3 sm:px-4 rounded-lg transition text-xs sm:text-sm"
              >
                Lihat Info Web
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;