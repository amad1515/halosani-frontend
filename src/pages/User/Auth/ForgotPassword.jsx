import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';

// Komponen Alert Modern
const EmailSentAlert = ({ isVisible, onClose, email }) => {
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
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <FiCheck className="h-8 w-8 text-white" />
                </motion.div>
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Email Terkirim!</h2>
              <p className="text-green-100">Link reset password sudah dikirim</p>
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
                  <div className="flex items-center justify-center space-x-2 text-gray-700">
                    <FiMail className="h-5 w-5 text-indigo-600" />
                    <span className="font-medium">{email}</span>
                  </div>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-sm leading-relaxed"
                >
                  Silakan cek email Anda dan klik link yang telah kami kirimkan untuk mereset password Anda.
                </motion.p>
              </div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              >
                <h4 className="font-semibold text-blue-800 mb-2 text-sm">Tips:</h4>
                <ul className="text-blue-700 text-xs space-y-1">
                  <li>• Periksa folder spam/junk jika tidak menemukan email</li>
                  <li>• Link akan kadaluarsa dalam 15 menit</li>
                  <li>• Pastikan menggunakan email yang terdaftar</li>
                </ul>
              </motion.div>

              {/* Actions */}
              <div className="flex space-x-3">
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Mengerti
                </motion.button>
                
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  onClick={() => {
                    window.open('https://gmail.com', '_blank');
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200"
                >
                  Buka Email
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address', {
        position: "top-center",
        autoClose: 3000,
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
      const response = await api.post('/forgot-password', { email });
      
      // Tampilkan alert custom alih-alih toast
      setShowAlert(true);
      
    } catch (error) {
      console.error('Forgot Password Error:', error);
      
      let errorMessage = 'Failed to send reset link';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
        if (error.response.data.errors) {
          errorMessage = Object.values(error.response.data.errors).join(', ');
        }
      } else if (error.request) {
        errorMessage = 'No response from server';
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
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    // Redirect ke login setelah alert ditutup
    setTimeout(() => navigate('/user/login'), 500);
  };

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
                <FiMail className="h-12 w-12 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">Lupa Kata Sandi?</h1>
              <p className="text-indigo-100">Kami akan mengirimi Anda tautan pengaturan ulang</p>
            </div>
            
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="Contoh@email.com"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                      loading ? 'opacity-80 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Mengirim Link...</span>
                      </div>
                    ) : (
                      <span className="block">Kirm Link</span>
                    )}
                  </button>
                </motion.div>
              </form>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-center"
              >
                <button 
                  onClick={() => navigate('/user/login')}
                  className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center space-x-1 mx-auto"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  <span>Kembali Login</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Alert Modern */}
      <EmailSentAlert
        isVisible={showAlert}
        onClose={handleCloseAlert}
        email={email}
      />
    </>
  );
};

export default ForgotPassword;