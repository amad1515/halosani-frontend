import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../api/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { FiMail, FiClock, FiArrowRight } from 'react-icons/fi';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { userId, email } = location.state || {};

  useEffect(() => {
    if (!userId || !email) {
      toast.error('Session expired. Please register again.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: '#F44336',
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }
      });
      navigate('/user/register', { replace: true });
      return;
    }

    const timer = countdown > 0 && setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, navigate, userId, email]);

  const showSuccessNotification = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      style: {
        background: '#4CAF50',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }
    });
  };

  const showErrorNotification = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      style: {
        background: '#F44336',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }
    });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/verify-otp', {
        user_id: userId,
        otp: otp
      });

      showSuccessNotification('Email verified successfully! Welcome to our community ❤️');
      
      localStorage.setItem('user_token', response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      
      navigate('/user/dashboard', { replace: true });
    } catch (error) {
      console.error('OTP Verification Error:', error);
      
      let errorMessage = 'OTP verification failed. Please try again.';
      if (error.response) {
        errorMessage = error.response.data.message || 
                     error.response.data.error || 
                     errorMessage;
        
        if (error.response.data.message?.includes('expired')) {
          errorMessage = 'OTP has expired. Please request a new one.';
          setCountdown(0);
        } else if (error.response.status === 404) {
          errorMessage = 'User not found. Please register again.';
          setTimeout(() => navigate('/user/register', { replace: true }), 2000);
        }
      }
      
      setError(errorMessage);
      showErrorNotification(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || resendLoading) return;

    setResendLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/resend-otp', {
        user_id: userId
      });
      
      showSuccessNotification('New OTP sent successfully!');
      setCountdown(60);
      
      if (response.data.expires_at) {
        const expiryTime = new Date(response.data.expires_at);
        toast.info(`New OTP will expire at ${expiryTime.toLocaleTimeString()}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: {
            background: '#2196F3',
            color: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }
        });
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      
      let errorMessage = 'Failed to resend OTP. Please try again.';
      if (error.response) {
        errorMessage = error.response.data.message || 
                     error.response.data.error || 
                     errorMessage;
        
        if (error.response.status === 404) {
          errorMessage = 'User not found. Please register again.';
          setTimeout(() => navigate('/user/register', { replace: true }), 2000);
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
      showErrorNotification(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 py-8 px-8 text-center">
          <motion.h1 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white"
          >
            Verifikasi Email Anda
          </motion.h1>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-purple-100 mt-2"
          >
            Kami telah mengirimkan kode verifikasi menuju {email}
          </motion.p>
        </div>
        
        <div className="p-8">
          {error && (
            <motion.div 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleVerify} className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                    setError(null);
                  }}
                  className="w-full pl-10 pr-4 py-3 text-center text-xl font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none"
                  placeholder="6-digit kode"
                  maxLength={6}
                  inputMode="numeric"
                  pattern="\d{6}"
                  required
                  autoFocus
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verivikasi...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-semibold">Verifikasi & Lanjutkan</span>
                    <FiArrowRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            </motion.div>
          </form>

          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-gray-600">
              Tidak menerima kode?{' '}
              <button
                onClick={handleResendOtp}
                disabled={countdown > 0 || resendLoading}
                className={`text-purple-600 font-medium transition-colors ${countdown > 0 || resendLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-purple-800'}`}
              >
                {resendLoading ? (
                  <span className="flex items-center justify-center space-x-1">
                    <svg className="animate-spin h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Mengirim...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-1">
                    <FiClock className="w-4 h-4" />
                    <span>Kirim Ulang OTP {countdown > 0 ? `(${countdown}s)` : ''}</span>
                  </span>
                )}
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OtpVerification;