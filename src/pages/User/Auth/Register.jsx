import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiMapPin, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { FaVenusMars } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'male',
    age: '',
    address: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
        background: '#34C759',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(52,199,89,0.2)',
        borderLeft: '4px solid #32D74B',
        padding: '16px 24px',
        fontSize: '14px',
        fontWeight: '500'
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
      transition: toast.flip,
      style: {
        background: '#FF3B30',
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(255,59,48,0.2)',
        borderLeft: '4px solid #FF9500',
        padding: '16px 24px',
        fontSize: '14px',
        fontWeight: '500'
      },
      icon: (
        <div style={{
          background: '#FF9500',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <FiAlertCircle size={14} />
        </div>
      )
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showErrorNotification(
        <div>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>Nama Lengkap Kosong</div>
          <div style={{ opacity: 0.9 }}>
            Harap masukkan nama lengkap Anda untuk melanjutkan
          </div>
        </div>
      );
      return false;
    }

    if (!formData.email.includes('@')) {
      showErrorNotification(
        <div>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>Format Email Tidak Valid</div>
          <div style={{ opacity: 0.9 }}>
            Harap masukkan alamat email yang valid (contoh: nama@domain.com)
          </div>
        </div>
      );
      return false;
    }

    if (formData.age < 13 || formData.age > 100) {
      showErrorNotification(
        <div>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>Usia Tidak Valid</div>
          <div style={{ opacity: 0.9 }}>
            Usia harus antara 13 - 100 tahun untuk mendaftar
          </div>
        </div>
      );
      return false;
    }

    if (formData.password.length < 8) {
      showErrorNotification(
        <div>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>Password Terlalu Pendek</div>
          <div style={{ opacity: 0.9 }}>
            Password harus terdiri dari minimal 8 karakter
            <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>
              Tips: Gunakan kombinasi huruf besar, kecil, angka, dan simbol
            </div>
          </div>
        </div>
      );
      return false;
    }

    if (formData.password !== formData.password_confirmation) {
      showErrorNotification(
        <div>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>Password Tidak Cocok</div>
          <div style={{ opacity: 0.9 }}>
            Password dan konfirmasi password tidak sama. Silakan ketik ulang dengan hati-hati.
          </div>
        </div>
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/register', formData);

      if (!response.data.user_id) {
        throw new Error('Pendaftaran berhasil tetapi ID pengguna tidak diterima');
      }

      showSuccessNotification(
        <div>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>Pendaftaran Berhasil!</div>
          <div style={{ opacity: 0.9 }}>
            Selamat bergabung di komunitas kami ❤️. Silakan verifikasi email Anda.
          </div>
        </div>
      );

      navigate('/user/verify-otp', { 
        state: { 
          userId: response.data.user_id, 
          email: formData.email 
        },
        replace: true
      });
    } catch (error) {
      console.error('Kesalahan saat mendaftar:', error);

      let errorMessage = error.response?.data?.error 
                      || error.response?.data?.message 
                      || 'Pendaftaran gagal. Silakan coba lagi.';

      if (error.message === 'Pendaftaran berhasil tetapi ID pengguna tidak diterima') {
        errorMessage = 'Pendaftaran berhasil, tetapi verifikasi gagal. Silakan hubungi dukungan.';
      }

      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([field, errors]) => {
          let errorMsg = errors[0];
          
          switch(field) {
            case 'email':
              errorMsg = 'Email sudah terdaftar. Gunakan email lain atau <a href="/login" style="text-decoration:underline">masuk disini</a>';
              break;
            case 'password':
              if (errorMsg.includes('confirmation')) {
                errorMsg = 'Password dan konfirmasi password tidak cocok';
              } else {
                errorMsg = 'Password minimal 8 karakter dengan kombinasi huruf dan angka';
              }
              break;
          }
          
          showErrorNotification(
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                {field === 'password_confirmation' ? 'Konfirmasi Password' : 
                 field === 'name' ? 'Nama Lengkap' :
                 field.charAt(0).toUpperCase() + field.slice(1)}
              </div>
              <div style={{ opacity: 0.9 }} dangerouslySetInnerHTML={{ __html: errorMsg }} />
            </div>
          );
        });
      } else {
        showErrorNotification(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4"
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
            Mulailah Perjalanan Anda
          </motion.h1>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-purple-100 mt-2"
          >
          Bergabunglah dengan komunitas pendukung kami hari ini          </motion.p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Nama Lengkap"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Alamat Email"
                  required
                />
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaVenusMars className="text-gray-400" />
                </div>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none appearance-none transition-all"
                  required
                >
                  <option value="male">Pria</option>
                  <option value="female">Wanita</option>
    
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="13"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Umur"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                  <FiMapPin className="text-gray-400" />
                </div>
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Alamat Domisili"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Password (Harus 8 Karakter)"
                  minLength="8"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Konfirmasi Password"
                  minLength="8"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
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
                    <span>Menciptakan Ruang Aman Anda...</span>
                  </div>
                ) : (
                  <span className="font-semibold">Bergabung Sekarang</span>
                )}
              </button>
            </motion.div>
          </form>

          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <p className="text-sm text-gray-600">
              Memiliki Akun?{' '}
              <button 
                onClick={() => navigate('/user/login')}
                className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
              >
                Sign in 
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Register;