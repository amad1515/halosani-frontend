import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiCheck, FiSend, FiMessageSquare, FiThumbsUp, FiAward, FiUser, FiHeart } from 'react-icons/fi';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';

const Feedback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [feedbackData, setFeedbackData] = useState({
    name: '',
    login_register_rating: null,
    login_register_reason: '',
    event_info_rating: null,
    event_info_reason: '',
    breath_management_rating: null,
    breath_management_reason: '',
    journal_comfort_rating: null,
    journal_comfort_reason: '',
    mentor_ai_rating: null,
    mentor_ai_reason: '',
    blog_content_rating: null,
    blog_content_reason: '',
    youtube_videos_rating: null,
    youtube_videos_reason: '',
    ebook_access_rating: null,
    ebook_access_reason: '',
    feedback_feature_rating: null,
    feedback_feature_reason: '',
    overall_rating: null,
    overall_reason: '',
    additional_feedback: ''
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const featureCategories = [
    {
      id: 'login_register',
      label: 'Proses Login & Pendaftaran',
      description: 'Seberapa mudah proses membuat akun dan login?',
      icon: <FiCheck className="mr-2" />
    },
    {
      id: 'event_info',
      label: 'Informasi Acara',
      description: 'Seberapa berguna informasi acara yang disediakan?',
      icon: <FiAward className="mr-2" />
    },
    {
      id: 'breath_management',
      label: 'Alat Manajemen Pernapasan',
      description: 'Seberapa efektif latihan pernapasan yang disediakan?',
      icon: <FiThumbsUp className="mr-2" />
    },
    {
      id: 'journal_comfort',
      label: 'Kenyamanan Journaling',
      description: 'Seberapa nyaman pengalaman journaling Anda?',
      icon: <FiMessageSquare className="mr-2" />
    },
    {
      id: 'mentor_ai',
      label: 'Asisten Mentor AI',
      description: 'Seberapa membantu fitur mentor AI?',
      icon: <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
    },
    {
      id: 'blog_content',
      label: 'Kualitas Konten Blog',
      description: 'Seberapa berharga artikel blog yang Anda temukan?',
      icon: <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
    },
    {
      id: 'youtube_videos',
      label: 'Sumber Daya Video YouTube',
      description: 'Seberapa berguna video yang disediakan?',
      icon: <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
    },
    {
      id: 'ebook_access',
      label: 'Aksesibilitas Ebook',
      description: 'Seberapa mudah mengakses dan menggunakan ebook?',
      icon: <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
    },
    {
      id: 'feedback_feature',
      label: 'Fitur Feedback Ini',
      description: 'Seberapa mudah proses feedback ini?',
      icon: <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
    }
  ];

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await api.get('/user/feedback');
        
        if (response.data && response.data.status === 'success') {
          setFeedbackData(prev => ({
            ...prev,
            ...(response.data.data || {})
          }));
        }
      } catch (error) {
        console.error('Error details:', error.response?.data);
        toast.error(
          error.response?.data?.message || 
          error.message || 
          'Gagal memuat data feedback'
        );
        
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, []);

  const handleRatingChange = (category, rating) => {
    setFeedbackData(prev => ({
      ...prev,
      [`${category}_rating`]: rating,
      [`${category}_reason`]: rating ? prev[`${category}_reason`] : ''
    }));
  };

  const handleReasonChange = (category, reason) => {
    setFeedbackData(prev => ({
      ...prev,
      [`${category}_reason`]: reason
    }));
  };

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await api.post('/user/feedback', feedbackData);
      
      if (response.data.status === 'success') {
        setShowThankYou(true);
        setTimeout(() => {
          toast.success(response.data.message || 'Terima kasih atas feedback Anda!');
          navigate('/user/dashboard');
        }, 3000);
      } else {
        toast.error(response.data.message || 'Gagal mengirim feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach(err => {
          toast.error(err[0]);
        });
      } else {
        toast.error(error.response?.data?.message || 'Gagal mengirim feedback. Silakan coba lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (showThankYou) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="mb-8"
          >
            <FiHeart className="mx-auto text-red-500 w-24 h-24 fill-current" />
          </motion.div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
            Terima Kasih!
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Kami sangat menghargai masukan Anda. Feedback Anda membantu kami menciptakan pengalaman yang lebih baik untuk semua orang.
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <motion.button
              onClick={() => navigate('/user/dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg"
            >
              Kembali ke Dashboard
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1 
            className="text-5xl font-extrabold text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Kami Menghargai Feedback Anda
          </motion.h1>
          <motion.p
            className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Bantu kami meningkatkan layanan dengan berbagi pengalaman Anda
          </motion.p>
          <motion.div 
            className="mt-6 flex justify-center"
            animate={{ 
              y: [0, -5, 0],
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse",
              duration: 2
            }}
          >
            <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </motion.div>
        </div>

        {/* Bagian Informasi Pengguna */}
        <motion.div
          className="bg-white shadow-xl rounded-2xl p-8 mb-10 backdrop-blur-sm bg-opacity-90"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <FiUser className="text-blue-600 w-6 h-6" />
            </div>
            Informasi Anda
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nama  <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                value={feedbackData.name}
                onChange={handleGeneralChange}
                placeholder="Masukkan nama Anda(Boleh Samaran)"
              />
            </div>
          </div>
        </motion.div>

        {/* Form Feedback */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm bg-opacity-90"
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8 sm:p-12">
            {/* Rating Keseluruhan */}
            <motion.div 
              className="mb-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="p-2 bg-purple-100 rounded-full mr-3 text-purple-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                Pengalaman Keseluruhan
              </h2>
              <p className="text-gray-600 mb-6 text-lg">Bagaimana Anda menilai pengalaman keseluruhan dengan platform kami?</p>
              
              <div className="flex items-center justify-center space-x-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => handleGeneralChange({
                      target: { name: 'overall_rating', value: feedbackData.overall_rating === star ? null : star }
                    })}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-full transition-all ${feedbackData.overall_rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                  >
                    <FiStar className="w-10 h-10 fill-current" />
                  </motion.button>
                ))}
              </div>
              
              <AnimatePresence>
                {feedbackData.overall_rating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    <label htmlFor="overall_reason" className="block text-lg font-medium text-gray-700 mb-3">
                      {feedbackData.overall_rating <= 2 ? 'Apa yang bisa kami perbaiki untuk meningkatkan pengalaman Anda?' : 
                       feedbackData.overall_rating >= 4 ? 'Apa yang paling Anda sukai dari pengalaman Anda?' : 
                       'Bagaimana pengalaman Anda?'}
                    </label>
                    <motion.textarea
                      id="overall_reason"
                      name="overall_reason"
                      rows={4}
                      className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                      value={feedbackData.overall_reason}
                      onChange={handleGeneralChange}
                      placeholder="Bagikan pemikiran Anda (opsional)"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Rating Fitur */}
            <div className="space-y-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Rating Fitur</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featureCategories.map((feature, index) => (
                  <motion.div 
                    key={feature.id}
                    className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-purple-200 transition-all shadow-lg hover:shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (index * 0.05) }}
                    whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                  >
                    <div className="flex items-start mb-6">
                      <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl text-purple-600">
                        {feature.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-gray-800">{feature.label}</h3>
                        <p className="text-gray-500 text-md">{feature.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(feature.id, feedbackData[`${feature.id}_rating`] === star ? null : star)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-1 rounded transition-all ${feedbackData[`${feature.id}_rating`] >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                        >
                          <FiStar className="w-8 h-8 fill-current" />
                        </motion.button>
                      ))}
                      <span className="ml-3 text-md font-medium text-gray-500">
                        {feedbackData[`${feature.id}_rating`] ? `${feedbackData[`${feature.id}_rating`]}/5` : 'Belum dinilai'}
                      </span>
                    </div>
                    
                    <AnimatePresence>
                      {feedbackData[`${feature.id}_rating`] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4"
                        >
                          <label htmlFor={`${feature.id}_reason`} className="block text-md font-medium text-gray-700 mb-2">
                            {feedbackData[`${feature.id}_rating`] <= 2 ? 'Apa yang bisa kami perbaiki dari fitur ini?' : 
                             feedbackData[`${feature.id}_rating`] >= 4 ? 'Apa yang Anda sukai dari fitur ini?' : 
                             'Ada feedback khusus tentang fitur ini?'}
                          </label>
                          <motion.textarea
                            id={`${feature.id}_reason`}
                            name={`${feature.id}_reason`}
                            rows={3}
                            className="w-full px-4 py-3 text-md border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                            value={feedbackData[`${feature.id}_reason`] || ''}
                            onChange={(e) => handleReasonChange(feature.id, e.target.value)}
                            placeholder="Masukan Anda membantu kami meningkatkan..."
                            whileFocus={{ scale: 1.01 }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Feedback Tambahan */}
            <motion.div 
              className="mt-16 p-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="p-2 bg-indigo-100 rounded-full mr-3 text-indigo-600">
                  <FiMessageSquare className="w-6 h-6" />
                </div>
                Komentar Tambahan
              </h2>
              <p className="text-gray-600 mb-6 text-lg">Apakah ada hal lain yang ingin Anda bagikan tentang pengalaman Anda dengan kami?</p>
              <motion.textarea
                name="additional_feedback"
                rows={6}
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                value={feedbackData.additional_feedback}
                onChange={handleGeneralChange}
                placeholder="Saran, ide, atau feedback lain yang ingin Anda bagikan..."
                whileFocus={{ scale: 1.01 }}
              />
            </motion.div>

            {/* Tombol Kirim */}
            <div className="mt-16 flex justify-center">
              <motion.button
                type="submit"
                disabled={submitting || !feedbackData.name}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(124, 58, 237, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden inline-flex items-center px-10 py-5 border border-transparent text-xl font-bold rounded-2xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all ${(submitting || !feedbackData.name) ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-3 w-6 h-6" />
                    <span className="relative z-10">
                      Kirim Feedback Anda
                      <motion.span
                        className="absolute -bottom-1 left-0 w-full h-1 bg-white opacity-30"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </span>
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.form>

        <motion.div 
          className="mt-16 text-center text-gray-600 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="mb-4">Feedback jujur Anda membantu kami menciptakan pengalaman yang lebih baik untuk semua orang.</p>
          <motion.div 
            className="flex justify-center space-x-4"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse",
              duration: 2
            }}
          >
            <span className="text-3xl">🙏</span>
            <span className="text-3xl">💖</span>
            <span className="text-3xl">✨</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Feedback;