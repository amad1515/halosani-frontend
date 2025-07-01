import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../api/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiCheck, FiArrowLeft, FiAlertTriangle, FiX, FiShield, FiLogIn } from 'react-icons/fi';

// Komponen Alert Modern untuk Password Reset Berhasil
const PasswordResetSuccessAlert = ({ isVisible, onClose, email }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header dengan gradient */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center relative">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all duration-200"
              >
                <FiX className="h-5 w-5" />
              </button>
              
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <FiShield className="h-8 w-8 text-white" />
                </motion.div>
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Password Berhasil Diubah!</h2>
              <p className="text-green-100">Keamanan akun Anda telah diperbarui</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-50 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center justify-center space-x-2 text-gray-700 mb-2">
                    <FiLock className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-sm">Password baru telah aktif untuk:</span>
                  </div>
                  <div className="text-indigo-600 font-semibold">{email}</div>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-sm leading-relaxed mb-4"
                >
                  Password Anda telah berhasil diubah. Silakan login kembali menggunakan password baru Anda.
                </motion.p>

                {/* Security Tips */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <FiShield className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold text-green-800 text-sm">Tips Keamanan:</h4>
                  </div>
                  <ul className="text-green-700 text-xs space-y-1">
                    <li>• Jangan bagikan password Anda kepada siapa pun</li>
                    <li>• Gunakan password yang unik untuk setiap akun</li>
                    <li>• Logout dari perangkat yang tidak dikenal</li>
                  </ul>
                </motion.div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <FiLogIn className="h-4 w-4" />
                  <span>Login Sekarang</span>
                </motion.button>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center"
                >
                  <p className="text-xs text-gray-500">
                    Anda akan diarahkan ke halaman login dalam 3 detik...
                  </p>
                </motion.div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute top-4 left-4 w-2 h-2 bg-white bg-opacity-30 rounded-full"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="absolute top-8 left-8 w-1 h-1 bg-white bg-opacity-20 rounded-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      toast.error('Password confirmation does not match', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        token: token,
        email: email,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      };

      const response = await api.post('/reset-password', payload);
      
      // Tampilkan alert modern alih-alih toast
      setShowSuccessAlert(true);
      
    } catch (error) {
      console.error('Password reset error:', error);

      let errorMessage = 'Gagal Memperbarui';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessage = errorMessages.join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      
      if (error.response?.status === 400 || error.response?.status === 404) {
        setTimeout(() => {
          navigate('/user/forgot-password');
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
    // Redirect ke login setelah alert ditutup
    navigate('/user/login');
  };

  // Auto close alert dan redirect setelah 3 detik
  React.useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        handleCloseSuccessAlert();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert]);

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1.1, 1]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-red-500 mb-6 inline-block"
          >
            <FiAlertTriangle className="h-16 w-16" />
          </motion.div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Link tida valid</h2>
          <p className="text-gray-600 mb-6">Tautan pengaturan ulang kata sandi tidak valid atau telah kedaluwarsa. Silakan minta yang baru.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/user/forgot-password')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Meminta link baru
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-8 px-8 text-center">
              <motion.div 
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1.1, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="inline-block mb-4"
              >
                <FiLock className="h-12 w-12 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">Perbarui Kata Sandi</h1>
              <p className="text-indigo-100">Buat kata sandi baru</p>
            </div>
            
            <div className="p-8">
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Email:</span> {email}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      required
                      minLength="8"
                      placeholder="Harus 8 Karakter"
                    />
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCheck className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password_confirmation"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      required
                      minLength="8"
                      placeholder="Konfirmasi"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    type="submit"
                    disabled={loading || !formData.password || !formData.password_confirmation}
                    className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg transition-all duration-300 shadow-md ${
                      loading || !formData.password || !formData.password_confirmation 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Memproses Pembaruan...</span>
                      </div>
                    ) : (
                      <span className="block">Ubah Sekarang</span>
                    )}
                  </button>
                </motion.div>
              </form>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center"
              >
                <button
                  type="button"
                  onClick={() => navigate('/user/login')}
                  className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center space-x-1 mx-auto"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  <span>Kembali ke login</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Alert Modern untuk Password Reset Berhasil */}
      <PasswordResetSuccessAlert
        isVisible={showSuccessAlert}
        onClose={handleCloseSuccessAlert}
        email={email}
      />
    </>
  );
};

export default ResetPassword;