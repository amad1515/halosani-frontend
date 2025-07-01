import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiMenu, FiX, FiArrowRight, FiChevronDown } from 'react-icons/fi';
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import './LandingPage.css';
import halosanilan from '../assets/halosani_lan.png';

// Particle component yang dioptimasi
const Particle = ({ index, isMobile }) => {
  const size = Math.random() * (isMobile ? 5 : 10) + 3;
  return (
    <motion.div
      className="particle"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        x: [0, Math.random() * 100 - 50],
        y: [0, Math.random() * 100 - 50]
      }}
      transition={{
        duration: Math.random() * 10 + 10,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: index * 0.2
      }}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: `hsla(${Math.random() * 60 + 200}, 70%, 60%, 0.7)`
      }}
    />
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 100,
        ease: 'easeOut'
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const navItems = [
    { 
      label: 'Fitur', 
      action: () => document.getElementById('features').scrollIntoView({ behavior: 'smooth' }) 
    },
    { 
      label: 'Pengalaman Pengguna', 
      action: () => document.getElementById('testimonials').scrollIntoView({ behavior: 'smooth' }) 
    },
    { 
      label: 'Login', 
      action: () => navigate('/user/login') 
    }
  ];

  return (
    <div className="halosani-landing">
      {/* Animated Gradient Background */}
      <motion.div 
        className="gradient-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      
      {/* Optimized Floating Particles */}
      <div className="particles-container">
        {[...Array(isMobile ? 15 : 30)].map((_, i) => (
          <Particle key={i} index={i} isMobile={isMobile} />
        ))}
      </div>

      {/* Mobile Navigation */}
      <motion.nav 
        className="mobile-navbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div 
          className="navbar-brand"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="halo">Halo</span>
          <span className="sani">sani</span>
        </motion.div>
        
        <motion.button 
          className="menu-toggle" 
          onClick={toggleMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </motion.button>
      </motion.nav>

      {/* Mobile Menu with AnimatePresence */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div 
              className="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="menu-items">
                {navItems.map((item, index) => (
                  <motion.button
                    key={index}
                    className="menu-item"
                    onClick={() => {
                      item.action();
                      setIsMenuOpen(false);
                    }}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                    <FiArrowRight className="menu-item-arrow" />
                  </motion.button>
                ))}
              </div>
              
              <div className="mobile-social-links">
                <a href="#"><FaInstagram size={20} /></a>
                <a href="#"><FaTwitter size={20} /></a>
                <a href="#"><FaFacebookF size={20} /></a>
                <a href="#"><FaLinkedinIn size={20} /></a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation */}
      <motion.nav 
        className="landing-nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="halo">Halo</span>
          <span className="sani">sani</span>
        </motion.div>
        <div className="nav-links">
          {navItems.map((item, index) => (
            <motion.button 
              key={index}
              whileHover={{ 
                scale: 1.05,
                color: '#6366f1'
              }}
              whileTap={{ scale: 0.95 }}
              className="nav-link"
              onClick={item.action}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {item.label}
              <div className="nav-link-underline" />
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="hero-content">
          <motion.div className="hero-text" variants={itemVariants}>
            <motion.h1 className="hero-tagline">
              <motion.span 
                className="gradient-text"
                initial={{ backgroundPosition: '0% 50%' }}
                animate={{ backgroundPosition: '100% 50%' }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'linear'
                }}
              >
                Kesehatan Mental
              </motion.span> 
              <br />
              Dimulai dari Sini
            </motion.h1>
            <motion.p className="hero-description" variants={itemVariants}>
              Di dunia yang serba cepat saat ini, kesehatan mental telah menjadi aspek penting dari kesejahteraan keseluruhan. HaloSani memahami tantangan yang dihadapi individu dalam mengelola kesehatan mental, dan kami hadir untuk menyediakan lingkungan yang suportif dan mudah diakses.
            </motion.p>
            <motion.div className="hero-buttons" variants={itemVariants}>
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
                className="primary-btn"
                onClick={() => navigate('/user/login')}
              >
                Mulailah Perjalanan Anda
                <FiArrowRight className="btn-icon" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="secondary-btn"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                Pelajari Lebih Lanjut
                <FiChevronDown className="btn-icon" />
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div 
            className="hero-image-container"
            variants={itemVariants}
          >
            <motion.div 
              className="phone-mockup"
              initial={{ rotate: -5, scale: 0.9 }}
              animate={{ rotate: 5, scale: 1 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            >
              <img 
                src={halosanilan}
                alt="Halosani app interface" 
                className="mockup-screen"
                loading="lazy"
              />
            </motion.div>
            <div className="floating-elements">
              <motion.div 
                className="floating-element element-1"
                animate={{
                  y: [0, -25, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🧘‍♀️
              </motion.div>
              <motion.div 
                className="floating-element element-2"
                animate={{
                  y: [0, 20, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                😌
              </motion.div>
              <motion.div 
                className="floating-element element-3"
                animate={{
                  y: [0, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                🌱
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="scroll-indicator"
          animate={{
            y: [0, 10, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
        >
          <FiChevronDown size={24} />
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="stats-section"
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={fadeIn}
      >
        <div className="stats-container">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="stat-card"
              whileHover={{ 
                y: -10,
                boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.1)'
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.h3 
                className="stat-number"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 200,
                  damping: 10,
                  delay: index * 0.1
                }}
                viewport={{ once: true }}
              >
                {stat.number}
              </motion.h3>
              <p className="stat-label">{stat.label}</p>
              <div className="stat-icon">{stat.icon}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Teman Edukasi Kesehatan Mental Anda
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            Fitur-fitur komprehensif yang dirancang untuk mendukung perjalanan kesehatan Anda
          </motion.p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: 'spring',
                stiffness: 100
              }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ 
                y: -10,
                boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.3)'
              }}
            >
              <motion.div 
                className="feature-icon"
                whileHover={{ scale: 1.1 }}
              >
                {feature.icon}
              </motion.div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <motion.div 
                className="feature-hover-bg"
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="testimonials-bg"></div>
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2>Dukungan Nyata</h2>
          <p>Dengarkan cerita dari orang-orang yang telah mengubah kesehatan mental mereka dengan HaloSani</p>
        </motion.div>

        <div className="testimonials-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              className="testimonial-card active"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="testimonial-content">
                <p>"{testimonials[activeTestimonial].quote}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonials[activeTestimonial].avatar}</div>
                  <div className="author-info">
                    <h4>{testimonials[activeTestimonial].name}</h4>
                    <p>{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === activeTestimonial ? 'active' : ''}`}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`Testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <motion.section 
        className="final-cta"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="cta-container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Siap memprioritaskan kesehatan mental Anda?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            Bergabunglah dengan kami dan orang yang telah menemukan keseimbangan dengan HaloSani
          </motion.p>
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 15px 30px -5px rgba(99, 102, 241, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
            className="cta-btn"
            onClick={() => navigate('/user/login')}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Mulai Sekarang
            <FiArrowRight className="btn-icon" />
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="halo">Halo</span>
            <span className="sani">sani</span>
            <p className="footer-tagline">Teman Kesehatan Mental Anda</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Navigasi</h4>
              <a href="/user/login">Login</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="/stakeholder/login">care.mind.id</a>
              <a href="/admin/login">Admin</a>
            </div>
          </div>
          
          <div className="footer-social">
            <h4>Ikuti Kami</h4>
            <div className="social-icons">
              <a href="#" aria-label="Instagram"><FaInstagram size={20} /></a>
              <a href="#" aria-label="Twitter"><FaTwitter size={20} /></a>
              <a href="#" aria-label="Facebook"><FaFacebookF size={20} /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedinIn size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="footer-copyright">
          © {new Date().getFullYear()} Halosani. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

// Data dummy (tetap sama seperti sebelumnya)
const stats = [
  { number: "100%", label: "Gratis", icon: "👥" },
  { number: "100%", label: "Privasi Terjaga", icon: "🔒" },
  { number: "24/7", label: "Dukungan", icon: "⏰" }
];
// Enhanced features data
const features = [
  {
    icon: '🧠',
    title: 'Mentor AI',
    description: 'Menggunakan teknologi Large Language Model (LLM) dan RAG untuk memberikan dukungan, wawasan, dan saran terkait kesehatan mental secara real-time.'
  },
  {
    icon: '📘',
    title: 'Blog Kesehatan Mental',
    description: 'Artikel berbasis penelitian dari ahli kesehatan mental untuk meningkatkan pemahaman dan kesadaran tentang berbagai isu psikologis.'
  },
  {
    icon: '🎥',
    title: 'Video Edukasi',
    description: 'Konten video interaktif yang mencakup teknik relaksasi, manajemen stres, dan terapi perilaku kognitif sederhana.'
  },
  {
    icon: '👥',
    title: 'Komunitas Support',
    description: 'Ruang aman untuk berbagi pengalaman dan mendapatkan dukungan dari sesama pengguna yang memahami perjuangan Anda.'
  },
  {
    icon: '📝',
    title: 'E-book Eksklusif',
    description: 'Panduan mendalam tentang berbagai topik kesehatan mental yang dapat diunduh dan dipelajari sesuai kecepatan Anda.'
  },
  {
    icon: '🎯',
    title: 'Event Virtual',
    description: 'Webinar dan workshop langsung dengan psikolog dan praktisi kesehatan mental terkemuka.'
  }
];

// Enhanced testimonials data
const testimonials = [
  {
    quote: "Halosani membantu saya mengelola kecemasan saya dengan cara yang tidak pernah saya duga sebelumnya. Sesi yang dipandu sangat mengubah hidup saya. Sekarang saya bisa tidur nyenyak dan menghadapi hari dengan lebih percaya diri.",
    avatar: "👩",
    name: "Ghavira",
    role: "Mahasiswa, 22 tahun"
  },
  {
    quote: "Sebagai seseorang yang awalnya skeptis terhadap aplikasi kesehatan mental, Halosani benar-benar mengejutkan saya. Fitur mentor AI-nya sangat membantu ketika saya butuh seseorang untuk diajak bicara di tengah malam.",
    avatar: "👨",
    name: "Ahmad",
    role: "Freelancer, 21 tahun"
  },
  {
    quote: "Komunitas di Halosani membuat saya merasa tidak sendirian. Saya menemukan teman-teman yang memahami perjuangan saya tanpa menghakimi. Aplikasi ini lebih dari sekadar tool - ini adalah sistem pendukung yang nyata.",
    avatar: "🧑",
    name: "Gagah",
    role: "Karyawan, 21 tahun"
  }
];
export default LandingPage;