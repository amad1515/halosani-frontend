import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';

// Import team member images
import AchmadFauzy from '../../assets/fauzy.jpg';
import GagahPutra from '../../assets/gagah.jpg';

const OurTeam = () => {
  const mentors = [
    {
      name: 'Ibu Ratna Shofiati, S.Kom., M.Kom',
      role: 'Dosen Pembimbing',
      description: 'Memberikan bimbingan akademik Software Engineering dalam pengembangan HaloSani.',
      email: 'ratna@trisakti.ac.id',
      color: 'bg-purple-600'
    },
    {
      name: 'Ibu Dian Pratiwi, S.T., MTI',
      role: 'Dosen Pembimbing',
      description: 'Memberikan bimbingan akademik Software Engineering dalam pengembangan HaloSani.',
      email: 'dian.pratiwi@trisakti.ac.id',
      color: 'bg-pink-600'
    },
    {
      name: 'Bapa Anung B. Ariwibowo, S.Kom, M.Kom',
      role: 'Dosen Pembimbing',
      description: 'Memberi wawasan dalam pengembangan sistem Kecerdasan Buatan, Algoritma, aplikasi.',
      email: 'anung@trisakti.ac.id',
      color: 'bg-blue-600'
    },
    {
      name: 'Bapa Abdul Rochman, S.Kom., M.Kom',
      role: 'Dosen Pembimbing',
      description: 'Memberikan masukan berharga tentang Software Engineering dan Sistem Cerdas.',
      email: 'abdul.rochman@trisakti.ac.id',
      color: 'bg-orange-600'
    },
    {
      name: 'Bapa dr. Rivo Mario Warouw Lintuuran, Sp.KJ',
      role: 'Dosen Kedokteran Trisakti',
      description: 'Memberikan bimbingan akademik dan wawasan mendalam tentang psikologi klinis dalam pengembangan HaloSani.',
      email: 'rivo@trisakti.ac.id',
      color: 'bg-violet-600'
    }
  ];

  const developers = [
    {
      name: 'Achmad Fauzy',
      nim: '064002100031',
      role: 'Pengembang Aplikasi Web',
      description: 'Mengembangkan aplikasi web kesehatan mental HaloSani dengan penerapan fitur CMS dan API sebagai media edukasi kesehatan mental menggunakan Laravel dan React+Vite.',
      image: AchmadFauzy,
      social: {
        github: 'https://github.com/ahmdfauzy15',
        email: 'ahfauzy15@gmail.com',
        linkedin: '#',
        twitter: '#'
      },
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600'
    },
    {
      name: 'Gagah Putra Bangsa',
      nim: '064002100036',
      role: 'Pengembang Chatbot AI',
      description: 'Mengembangkan Chatbot Mentor AI HaloSani berbasis Retrieval-Augmented Generation (RAG) untuk memberikan dukungan kesehatan mental berbasis AI.',
      image: GagahPutra,
      social: {
        github: '#',
        email: '064002100036@trisakti.ac.id',
        linkedin: '#',
        twitter: '#'
      },
      color: 'bg-gradient-to-br from-fuchsia-500 to-violet-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const hoverVariants = {
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const listItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
            Tim HaloSani
          </span>
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Kenali tim di balik pengembangan platform kesehatan mental inovatif ini
        </motion.p>
      </motion.div>

      {/* Developers Section */}
      <motion.section 
        className="mb-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          variants={itemVariants}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
            Tim Pengembang
          </span>
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {developers.map((dev, index) => (
            <motion.div
              key={index}
              className={`${dev.color} rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300`}
              variants={itemVariants}
              whileHover="hover"
              variant={hoverVariants}
            >
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-2/5 relative">
                  <motion.img
                    src={dev.image}
                    alt={dev.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r md:from-black/40 md:to-transparent"></div>
                </div>
                <div className="md:w-3/5 p-6 text-white flex flex-col">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{dev.name}</h3>
                    <p className="text-blue-100 font-medium mb-1">{dev.role}</p>
                    <p className="text-white/80 text-sm mb-3">NIM: {dev.nim}</p>
                    <p className="text-white/90 text-sm mb-4">{dev.description}</p>
                  </div>
                  <div className="mt-auto flex space-x-3">
                    <a 
                      href={`mailto:${dev.social.email}`} 
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors duration-200 hover:scale-110"
                      title="Email"
                    >
                      <FiMail className="text-lg" />
                    </a>
                    <a 
                      href={dev.social.github} 
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors duration-200 hover:scale-110"
                      title="GitHub"
                    >
                      <FaGithub className="text-lg" />
                    </a>
                    <a 
                      href={dev.social.linkedin} 
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors duration-200 hover:scale-110"
                      title="LinkedIn"
                    >
                      <FaLinkedin className="text-lg" />
                    </a>
                    <a 
                      href={dev.social.twitter} 
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors duration-200 hover:scale-110"
                      title="Twitter"
                    >
                      <FaTwitter className="text-lg" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Mentors Section - Now placed below Developers */}
      <motion.section 
        className="mb-20 max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          variants={itemVariants}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Tim Mentor
          </span>
        </motion.h2>
        
        <motion.ul 
          className="space-y-4"
          variants={containerVariants}
        >
          {mentors.map((mentor, index) => (
            <motion.li
              key={index}
              className={`${mentor.color} text-white rounded-xl shadow-lg overflow-hidden`}
              variants={listItemVariants}
              whileHover={{ 
                x: 5,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{mentor.name}</h3>
                    <p className="text-white/90 font-medium mb-2">{mentor.role}</p>
                    <p className="text-white/80 text-sm">{mentor.description}</p>
                  </div>
                  <a 
                    href={`mailto:${mentor.email}`} 
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors duration-200 ml-4 flex-shrink-0"
                    title="Email"
                  >
                    <FiMail className="text-lg" />
                  </a>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>

      {/* About HaloSani Section */}
      <motion.section 
        className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl shadow-2xl overflow-hidden max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="p-8 md:p-12 text-white">
          <motion.h2 
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Tentang HaloSani
          </motion.h2>
          <motion.p 
            className="text-lg mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            HaloSani adalah platform inovatif yang bertujuan untuk memberikan edukasi dan dukungan kesehatan mental secara komprehensif melalui teknologi modern.
          </motion.p>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {[
              "Fitur CMS untuk manajemen konten edukasi",
              "API terintegrasi untuk pengalaman pengguna yang lancar",
              "Chatbot AI berbasis RAG untuk dukungan mental"
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors duration-300"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: '0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.05)'
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p>{feature}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default OurTeam;