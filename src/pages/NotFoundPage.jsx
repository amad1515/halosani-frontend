// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiFrown, FiMeh, FiSmile } from 'react-icons/fi';

const NotFoundPage = () => {
  // Animasi untuk elemen-elemen halaman
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-6"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-2xl"
      >
        {/* Animasi angka 404 */}
        <motion.div 
          variants={floatingVariants}
          animate="float"
          className="relative mb-8"
        >
          <div className="text-[180px] md:text-[220px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 opacity-20">
            500
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-800">
              500
            </div>
          </div>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
        >
          Terjadi Kesalahan
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-600 mb-8"
        >
          Maaf, sepertinya terjadi kesalahan silahkan kembali.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex justify-center space-x-4 mb-8"
        >
          <FiFrown className="text-3xl text-yellow-500" />
          <FiMeh className="text-3xl text-orange-500" />
          <FiSmile className="text-3xl text-green-500" />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <FiHome className="mr-2" />
            Kembali ke Beranda
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-12 text-sm text-gray-400"
        >
          <p>Atau mungkin Anda ingin:</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/login" className="hover:text-blue-600 transition">Masuk</Link>
            <Link to="/register" className="hover:text-purple-600 transition">Daftar</Link>
            <Link to="/contact" className="hover:text-blue-600 transition">Hubungi Kami</Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Animasi latar belakang */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      />

      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-blue-200 opacity-50"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-purple-200 opacity-30"
        animate={{
          y: [0, -40, 0],
          x: [0, -20, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/3 w-10 h-10 rounded-full bg-indigo-200 opacity-40"
        animate={{
          y: [0, 30, 0],
          x: [0, -30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default NotFoundPage;