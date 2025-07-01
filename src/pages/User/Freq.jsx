import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaQuestionCircle, FaShieldAlt, FaCalendarAlt, FaWind, 
  FaBook, FaRobot, FaVideo, FaFileAlt, FaCommentAlt,
  FaChevronDown, FaLightbulb, FaHeart
} from 'react-icons/fa';

const Freq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Bagaimana keamanan akun Login/Register dengan OTP di HaloSani?",
      answer: "HaloSani menggunakan sistem OTP (One-Time Password) untuk memastikan keamanan akun Anda. Saat registrasi, Anda akan menerima kode unik melalui email yang hanya berlaku untuk satu kali penggunaan dalam waktu terbatas. Kami juga menggunakan enkripsi end-to-end untuk melindungi data pribadi Anda.",
      icon: <FaShieldAlt />,
      color: "bg-gradient-to-br from-blue-600 to-indigo-700"
    },
    {
      question: "Apa saja Event kesehatan mental yang tersedia di HaloSani?",
      answer: "HaloSani menyediakan berbagai kumpulan event kesehatan mental seperti webinar dengan psikolog, sesi meditasi grup, workshop manajemen stres, dan komunitas dukungan sebaya. Anda bisa melihat jadwal event dan mendaftar untuk berpartisipasi.",
      icon: <FaCalendarAlt />,
      color: "bg-gradient-to-br from-purple-600 to-fuchsia-700"
    },
    {
      question: "Bagaimana cara menggunakan fitur manajemen nafas?",
      answer: "Fitur manajemen nafas di HaloSani dirancang untuk membantu Anda relaksasi. Ikuti panduan visual yang muncul di layar: tarik nafas dalam ketika lingkaran mengembang, tahan saat lingkaran berhenti, dan hembuskan perlahan ketika lingkaran mengecil. Anda bisa menyesuaikan durasi sesuai kebutuhan di pengaturan.",
      icon: <FaWind />,
      color: "bg-gradient-to-br from-emerald-600 to-teal-700"
    },
    {
      question: "Apakah curhat di jurnal harian akan hilang setelah di refresh?",
      answer: "Ya, fitur jurnal harian di HaloSani dirancang sebagai 'jurnal ephemeral' yang akan hilang setelah Anda refresh atau tutup aplikasi. Ini bertujuan memberi Anda kebebasan untuk mengekspresikan perasaan tanpa khawatir tentang penyimpanan permanen. Namun, kami menyediakan opsi ekspor manual jika Anda ingin menyimpan entri tertentu.",
      icon: <FaBook />,
      color: "bg-gradient-to-br from-amber-600 to-yellow-600"
    },
    {
      question: "Bagaimana Mentor AI bisa membantu kesehatan mental saya?",
      answer: "Mentor AI HaloSani adalah pendengar yang selalu ada untuk Anda. Dengan teknologi NLP canggih, AI dapat memahami keluhan dan kegiatan Anda, kemudian memberikan insight berbasis terapi kognitif-perilaku (CBT), saran aktivitas self-care, atau sekadar validasi emosi. Namun, ingat bahwa AI tidak menggantikan profesional kesehatan mental.",
      icon: <FaRobot />,
      color: "bg-gradient-to-br from-rose-600 to-pink-700"
    },
    {
      question: "Apa saja konten yang tersedia di blog kesehatan mental HaloSani?",
      answer: "Blog HaloSani berisi artikel blog tentang berbagai topik kesehatan mental seperti manajemen kecemasan, meningkatkan resiliensi, pola tidur sehat, hubungan interpersonal, dan kisah inspiratif pemulihan. Konten kami ditinjau oleh profesional kesehatan mental untuk memastikan akurasi.",
      icon: <FaFileAlt />,
      color: "bg-gradient-to-br from-indigo-600 to-violet-700"
    },
    {
      question: "Apakah ada video YouTube kesehatan mental yang direkomendasikan?",
      answer: "Ya, HaloSani menyediakan konten kesehatan mental untuk menyediakan playlist video edukatif tentang mindfulness, teknik relaksasi, pemahaman gangguan mental, dan tips sehari-hari untuk kesehatan psikologis. Anda bisa mengaksesnya langsung dari aplikasi.",
      icon: <FaVideo />,
      color: "bg-gradient-to-br from-pink-600 to-rose-700"
    },
    {
      question: "Bagaimana saya bisa mendapatkan ebook kesehatan mental dari HaloSani?",
      answer: "HaloSani menyediakan koleksi ebook yang bisa Anda akses di bagian 'Ebooks'. Ebook gratis dengan topik mencakup panduan self-help, workbook CBT, dan materi psikoedukasi.",
      icon: <FaFileAlt />,
      color: "bg-gradient-to-br from-teal-600 to-cyan-700"
    },
    {
      question: "Bagaimana cara memberikan feedback tentang HaloSani?",
      answer: "Kami sangat menghargai feedback Anda! Anda bisa mengisi formulir feedback di bagian Footer kami dan Beri Kami Masukan', atau langsung menghubungi tim kami melalui email di support@halosani.com. Feedback Anda membantu kami terus meningkatkan layanan.",
      icon: <FaCommentAlt />,
      color: "bg-gradient-to-br from-orange-600 to-amber-700"
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Header with Floating Elements */}
      <motion.div 
        initial={{ opacity: 0, y: -40 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            type: "spring", 
            stiffness: 100,
            damping: 10
          }
        }}
        className="text-center mb-16 relative"
      >
        {/* Floating decorative elements */}
        <motion.div 
          animate={{
            y: [0, -15, 0],
            x: [-20, 0, -20]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-1/4 w-8 h-8 rounded-full bg-blue-200/50 blur-md"
        />
        <motion.div 
          animate={{
            y: [0, 15, 0],
            x: [0, 20, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-10 right-1/4 w-6 h-6 rounded-full bg-purple-200/50 blur-md"
        />
        
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
            y: [0, -5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="inline-block mb-6"
        >
          <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full shadow-lg">
            <FaQuestionCircle className="text-4xl text-white" />
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: { delay: 0.3 }
          }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
            Pertanyaan Umum
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: { delay: 0.6 }
          }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Temukan jawaban untuk pertanyaan seputar fitur HaloSani dan kesehatan mental Anda
        </motion.p>
      </motion.div>

      {/* FAQ Container with Staggered Animations */}
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }
            }}
            whileHover={{ scale: 1.01 }}
            className="overflow-hidden rounded-xl shadow-lg"
          >
            <motion.button
              onClick={() => toggleFAQ(index)}
              className={`w-full flex items-center justify-between p-6 transition-all duration-300 ${activeIndex === index ? `${faq.color} text-white` : 'bg-white hover:bg-gray-50'}`}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-4">
                <motion.div 
                  className={`p-3 rounded-full ${activeIndex === index ? 'bg-white/20' : `${faq.color} text-white`} text-lg`}
                  animate={{
                    rotate: activeIndex === index ? [0, 10, -10, 0] : 0
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: activeIndex === index ? Infinity : 0
                  }}
                >
                  {faq.icon}
                </motion.div>
                <h2 className="text-lg md:text-xl font-semibold text-left">
                  {faq.question}
                </h2>
              </div>
              <motion.div
                animate={{ 
                  rotate: activeIndex === index ? 180 : 0,
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 0.3 }}
                className={`text-xl ${activeIndex === index ? 'text-white' : 'text-gray-500'}`}
              >
                <FaChevronDown />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: 1, 
                    height: 'auto',
                    transition: {
                      type: "spring",
                      stiffness: 100,
                      damping: 20
                    }
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/90 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      transition: { delay: 0.2 }
                    }}
                    className="p-6 pl-20 text-gray-700"
                  >
                    {faq.answer}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Mental Health Tips with Floating Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            delay: 0.8,
            type: "spring",
            stiffness: 80
          }
        }}
        className="mt-24 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto"
      >
        <div className="p-8">
          <motion.h2 
            className="text-3xl font-bold text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { delay: 1 }
            }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
              Tips Kesehatan Mental
            </span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "Luangkan waktu 5 menit setiap hari untuk menenangkan pikiran",
              "Ekspresikan perasaan Anda melalui jurnal atau seni",
              "Jangan ragu mencari bantuan profesional ketika diperlukan",
              "Tetap terhubung dengan orang-orang yang mendukung Anda",
              "Latihan pernapasan dapat membantu mengurangi kecemasan",
              "Self-care bukan egois, tapi kebutuhan"
            ].map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: 1.2 + index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }
                }}
                whileHover={{ 
                  y: -8,
                  scale: 1.03,
                  transition: { 
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                  }
                }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100/50 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start space-x-3">
                  <motion.div 
                    className="p-2 rounded-full"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    {index % 3 === 0 ? (
                      <FaLightbulb className="text-yellow-500" />
                    ) : index % 3 === 1 ? (
                      <FaHeart className="text-pink-500" />
                    ) : (
                      <FaQuestionCircle className="text-blue-500" />
                    )}
                  </motion.div>
                  <p className="text-gray-700 font-medium">{tip}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Decorative footer */}
        <motion.div 
          className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: 1,
            transition: { 
              delay: 1.8,
              duration: 1,
              ease: "circOut"
            }
          }}
        />
      </motion.div>
      
      {/* Floating CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { 
            delay: 2,
            type: "spring",
            stiffness: 100
          }
        }}
        whileHover={{ scale: 1.02 }}
        className="mt-12 text-center"
      >
        
      </motion.div>
    </div>
  );
};

export default Freq;