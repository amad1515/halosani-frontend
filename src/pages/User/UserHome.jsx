import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiActivity, FiBookOpen, FiCalendar, FiUsers, FiTool,
  FiHeart, FiSun, FiMoon, FiSmile, FiMeh, FiFrown,
  FiCheckCircle, FiXCircle, FiPlus, FiMinus, FiHome,
  FiBarChart2, FiPieChart, FiBook, FiTrendingUp // Tambahkan ikon-ikon yang diperlukan
} from 'react-icons/fi';
import api from '../../api/axios';
import './UserHome.css';
import CommunityChat from '../../components/User/CommunityChat';
const tipsKesehatanMental = [
  {
    tip: "Luangkan waktu 5 menit setiap pagi untuk meditasi",
    manfaat: "Mengurangi stres dan meningkatkan fokus sepanjang hari"
  },
  {
    tip: "Jaga pola tidur teratur 7-8 jam per malam",
    manfaat: "Meningkatkan mood dan kesehatan emosional"
  },
  {
    tip: "Buat jurnal rasa syukur setiap hari",
    manfaat: "Membantu mengembangkan pola pikir positif"
  },
  {
    tip: "Lakukan aktivitas fisik minimal 30 menit",
    manfaat: "Melepaskan endorfin yang meningkatkan perasaan bahagia"
  },
  {
    tip: "Batasi waktu di media sosial",
    manfaat: "Mengurangi kecemasan dan perbandingan sosial"
  }
];
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari dalam milidetik
const ActivityFrequencyChart = ({ activities }) => {
  const completedActivities = activities.filter(a => a.time !== '--').length;
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-40 h-40 mb-4">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="8"
            strokeDasharray={`${(completedActivities / activities.length) * 282.6} 282.6`}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-800 dark:text-white">
            {Math.round((completedActivities / activities.length) * 100)}%
          </span>
        </div>
      </div>
      <p className="text-center text-gray-600 dark:text-gray-300">
        {completedActivities} dari {activities.length} aktivitas diselesaikan
      </p>
    </div>
  );
};
const UserHome = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [gratitudeList, setGratitudeList] = useState([]);
  const [newGratitudeItem, setNewGratitudeItem] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Load data dari localStorage
  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  const checkAndResetWeeklyData = () => {
    const lastResetDate = localStorage.getItem('lastResetDate');
    const currentDate = new Date().getTime();

    if (!lastResetDate || (currentDate - parseInt(lastResetDate)) >= ONE_WEEK_MS) {
      // Reset data yang perlu direset setiap minggu
      localStorage.setItem('moodHistory', JSON.stringify([]));
      localStorage.setItem('breathingCount', JSON.stringify(0));
      localStorage.setItem('journalEntries', JSON.stringify([]));
      localStorage.setItem('lastResetDate', currentDate.toString());
      
      // Update state
      setMoodHistory([]);
      setBreathingCount(0);
      setJournalEntries([]);
    }
  };
  const getWeeklyMoodHistory = () => {
    const now = new Date().getTime();
    return moodHistory.filter(entry => {
      const entryDate = new Date(entry.date).getTime();
      return (now - entryDate) <= ONE_WEEK_MS;
    });
  };
  useEffect(() => {
    checkAndResetWeeklyData();
    
    // Inisialisasi lastResetDate jika belum ada
    if (!localStorage.getItem('lastResetDate')) {
      localStorage.setItem('lastResetDate', new Date().getTime().toString());
    }
  }, []);


  // State dengan inisialisasi dari localStorage
  const [currentMood, setCurrentMood] = useState(() => 
    loadFromLocalStorage('currentMood', null)
  );
  const [moodHistory, setMoodHistory] = useState(() => 
    loadFromLocalStorage('moodHistory', [])
  );
  const [breathingCount, setBreathingCount] = useState(() => 
    loadFromLocalStorage('breathingCount', 0)
  );
  const [journalEntries, setJournalEntries] = useState(() => 
    loadFromLocalStorage('journalEntries', [])
  );

  // Simpan ke localStorage setiap kali state berubah
  useEffect(() => {
    localStorage.setItem('currentMood', JSON.stringify(currentMood));
  }, [currentMood]);

  useEffect(() => {
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
  }, [moodHistory]);

  useEffect(() => {
    localStorage.setItem('breathingCount', JSON.stringify(breathingCount));
  }, [breathingCount]);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  // Fetch user data dan events dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('user_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        setEventsLoading(true);
        
        // Fetch events
        const eventsResponse = await api.get('/user/events', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (eventsResponse.data.success) {
          const eventsData = eventsResponse.data.events || [];
          const validatedEvents = eventsData
            .filter(event => event && event.id && event.title)
            .map(event => ({
              ...event,
              event_date: event.event_date || null,
              image: event.image 
                ? event.image.startsWith('http') 
                  ? event.image 
                  : `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/storage/${event.image}`
                : null,
            }));
          setEvents(validatedEvents);
        }

        // Fetch user data
        const userResponse = await api.get('/user/dashboard/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const user = userResponse.data.user || userResponse.data;
        if (user) setUserData(user);

      } catch (error) {
        console.error('Error in fetchData:', error);
        setEvents([]);
      } finally {
        setLoading(false);
        setEventsLoading(false);
      }
    };

    fetchData();
  }, []);   

  // Breathing exercise effect
  useEffect(() => {
    if (!breathingActive) return;

    const timer = setInterval(() => {
      setBreathingPhase(prev => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        if (prev === 'exhale') {
          setBreathingCount(c => c + 1);
          return 'inhale';
        }
        return 'inhale';
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [breathingActive]);

  // Fungsi untuk menghitung statistik mood
  const getMoodStatistics = () => {
    const weeklyMoodHistory = getWeeklyMoodHistory();
    const moodCounts = {
      Bahagia: 0,
      Normal: 0,
      Sedih: 0,
      Khawatir: 0,
      Marah: 0
    };

    weeklyMoodHistory.forEach(entry => {
      if (moodCounts.hasOwnProperty(entry.mood)) {
        moodCounts[entry.mood]++;
      }
    });

    return moodCounts;
  };

   const MoodHistoryChart = () => {
    const weeklyMoodHistory = getWeeklyMoodHistory();

    if (weeklyMoodHistory.length === 0) {
      return <p className="text-gray-500 text-center py-4">No mood records in the past week</p>;
    }

    return (
      <div className="mt-6">
        <h3 className="font-medium text-gray-800 dark:text-white mb-3">
          Your Mood This Week
        </h3>
        <div className="space-y-3">
          {weeklyMoodHistory.map((entry, index) => {
            const moodOption = moodOptions.find(m => m.value === entry.mood);
            const date = new Date(entry.date);
            const timeString = date.toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Asia/Jakarta'
            });
            const dateString = date.toLocaleDateString('id-ID', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              timeZone: 'Asia/Jakarta'
            });

            return (
              <div 
                key={index}
                className={`flex items-center p-3 rounded-lg ${moodOption?.color.replace('bg-', 'bg-opacity-20 ')}`}
              >
                <span className="text-xl mr-3">{moodOptions.find(m => m.value === entry.mood)?.label.split(' ')[0]}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white capitalize">
                    {entry.mood}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {dateString} at {timeString}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleMoodSelection = (mood) => {
    const newMoodEntry = {
      mood,
      date: new Date().toISOString(),
      timestamp: new Date().getTime()
    };

    setCurrentMood(mood);
    setMoodHistory(prev => [newMoodEntry, ...prev]);
  };

  const startBreathingExercise = () => {
    setBreathingActive(true);
    setBreathingPhase('inhale');
  };

  const stopBreathingExercise = () => {
    setBreathingActive(false);
  };

  const addGratitudeItem = () => {
    if (newGratitudeItem.trim()) {
      setGratitudeList(prev => [...prev, newGratitudeItem.trim()]);
      setNewGratitudeItem('');
    }
  };

  const removeGratitudeItem = (index) => {
    setGratitudeList(prev => prev.filter((_, i) => i !== index));
  };

  const saveJournalEntry = () => {
    if (journalEntry.trim()) {
      const newEntry = {
        content: journalEntry,
        date: new Date().toISOString()
      };
      setJournalEntries(prev => [newEntry, ...prev.slice(0, 49)]); // Simpan maksimal 50 entri
      setJournalEntry('');
      setShowJournalForm(false);
    }
  };

  const EventCarousel = () => {
    if (eventsLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading events...</span>
        </div>
      );
    }

    if (!Array.isArray(events)) {
      return (
        <div className="text-center py-8 text-red-500">
          Error: Events data format is invalid
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Tidak ada acara mendatang yang tersedia. Periksa kembali nanti!        </div>
      );
    }

    return (
      <div className="relative overflow-hidden">
        <div className="flex space-x-4 py-4 overflow-x-auto pb-6 snap-x snap-mandatory">
          {events.map((event, index) => {
            const imageUrl = event.image 
              ? event.image.startsWith('http') 
                ? event.image 
                : `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/storage/${event.image}`
              : null;

            return (
              <motion.div
                key={event.id || `event-${index}`}
                className="flex-shrink-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden snap-center"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                  {imageUrl ? (
                    <img 
                      src={imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300?text=Event+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 dark:bg-gray-700">
                      <FiCalendar className="text-4xl" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate">
                    {event.title || 'Untitled Event'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    {event.description || 'No description available'}
                  </p>
                  {event.event_date && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(event.event_date).toLocaleDateString('id-ID', {
                         timeZone: 'Asia/Jakarta',
                          weekday: 'long',    // Senin, Selasa, ...
                          year: 'numeric',    // 2025
                          month: 'long',      // Januari, Februari, ...
                          day: 'numeric',
                      })}
                    </p>
                  )}
                  {event.link && (
                    <a 
                      href={event.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Pelajari Lebih Lanjut
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // Stats data dengan informasi dari localStorage
  const stats = [
    { 
      icon: <FiHeart />, 
      value: `${moodHistory.length} Suasana Hati`, 
      label: 'Pelacakan Suasana Hati', 
      color: '#ef4444',
      description: `Bahagia: ${getMoodStatistics().Bahagia}, Normal: ${getMoodStatistics().Normal}, Sedih:${getMoodStatistics().Sedih},Khawatir: ${getMoodStatistics().Khawatir}, Marah: ${getMoodStatistics().Marah}`
    },
    { 
      icon: <FiActivity />, 
      value: breathingCount > 0 ? `${breathingCount} Siklus Selesai` : 'Belum Ada', 
      label: 'Latihan Pernapasan', 
      color: '#4f46e5',
      description: breathingCount > 0 ? `${Math.round(breathingCount/7)} Menit Perminggu` : 'Mulai Sesi Pertama'
    },
    { 
      icon: <FiBookOpen />, 
      value: journalEntries.length, 
      label: 'Jurnal Tercatat', 
      color: '#10b981',
      description: journalEntries.length > 0 ? 
        `Terakhir kali: ${new Date(journalEntries[0].date).toLocaleDateString()}` : 
        'Buat Journal baru'
    },
    { 
      icon: <FiCalendar />, 
      value: events.length, 
      label: 'Event Yang Akan Datang', 
      color: '#f59e0b',
      description: events.length > 0 ? 
        `Event Berikutnya: ${events[0].title}` : 
        'Event Tidak Tersedia'
    }
  ];

  const recentActivities = [
    { 
      title: currentMood ? `Logged ${currentMood} mood` : 'No mood logged today', 
      time: 'Today', 
      icon: currentMood ? '😊' : '🤔' 
    },
    { 
      title: breathingCount > 0 ? 'Completed breathing exercise' : 'No breathing exercise today', 
      time: breathingCount > 0 ? 'Today' : '--', 
      icon: breathingCount > 0 ? '🧘‍♂️' : '💨' 
    },
    { 
      title: journalEntries.length > 0 ? 'Wrote journal entry' : 'No journal entry today', 
      time: journalEntries.length > 0 ? 'Today' : '--', 
      icon: journalEntries.length > 0 ? '📝' : '✏️' 
    }
  ];

  const wellnessTips = [
    { 
      tip: 'Practice deep breathing for 5 minutes today',
      benefit: 'Reduces stress and anxiety by activating the parasympathetic nervous system'
    },
    { 
      tip: 'Write down three things you are grateful for',
      benefit: 'Boosts mood and shifts focus to positive aspects of life'
    },
    { 
      tip: 'Take a 10-minute walk outside',
      benefit: 'Increases serotonin levels and improves overall mental wellbeing'
    }
  ];

  const moodOptions = [
    { value: 'Bahagia', label: '😊 Bahagia', color: 'bg-green-100 text-green-800' },
    { value: 'Normal', label: '😐 Normal', color: 'bg-blue-100 text-blue-800' },
    { value: 'Sedih', label: '😔 Sedih', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'Khawatir', label: '😰 Khawatir', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Marah', label: '😡 Marah', color: 'bg-red-100 text-red-800' }
  ];

return (
  <div className={`user-home ${darkMode ? 'dark' : ''}`}>
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header with Mood Tracker */}
      <motion.header 
        className="welcome-header mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Selamat Datang, <span className="text-blue-600 dark:text-blue-400">
            {userData?.name || userData?.username || userData?.email?.split('@')[0] || 'Friend'}
          </span>!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Bagaimana perasaan Anda hari ini?
        </p>
        
        <div className="mood-tracker flex flex-wrap justify-center gap-2 mb-4">
          {moodOptions.map((mood, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full ${mood.color} ${
                currentMood === mood.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              } transition-all flex items-center gap-2`}
              onClick={() => handleMoodSelection(mood.value)}
            >
              <span className="text-xl">{mood.label.split(' ')[0]}</span>
              <span className="hidden sm:inline">{mood.label.split(' ')[1]}</span>
            </motion.button>
          ))}
        </div>

        {/* Weekly Mood History */}
        {/* <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mt-6">
          <MoodHistoryChart />
        </div> */}
      </motion.header>
      <motion.section
          className="mb-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <FiCalendar className="mr-2" /> Acara Kesehatan Mendatang
          </h2>
          <EventCarousel />
        </motion.section>

      {/* Stats Overview */}
      <motion.section 
        className="stats-section mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard Kesehatan Mental Anda</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="stat-card bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col"
              whileHover={{ y: -5 }}
              style={{ borderLeft: `4px solid ${stat.color}` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start mb-4">
                <div 
                  className="stat-icon text-2xl p-3 rounded-lg mr-4"
                  style={{ 
                    color: stat.color,
                    backgroundColor: `${stat.color}20`
                  }}
                >
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-auto">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Content Tabs */}
      <div className="content-tabs flex border-b border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto">
        <button 
          className={`tab-btn px-6 py-3 font-medium ${activeTab === 'overview' ? 
            'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 
            'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('overview')}
        >
          <FiHome className="inline mr-2" /> Tips
        </button>
        <button 
          className={`tab-btn px-6 py-3 font-medium ${activeTab === 'tools' ? 
            'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 
            'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('tools')}
        >
          <FiTool className="inline mr-2" /> Alat Bantu
        </button>
        <button 
          className={`tab-btn px-6 py-3 font-medium ${activeTab === 'records' ? 
            'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 
            'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('records')}
        >
          <FiActivity className="inline mr-2" /> Catatan kesehatan
        </button>
      </div>

      {/* Main Content */}
      {activeTab === 'overview' && (
        <div className="main-content grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          {/* <motion.section 
            className="recent-activity lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiCalendar className="mr-2" /> Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div 
                  key={index}
                  className="activity-item flex items-start p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ x: 5 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="activity-icon text-2xl mr-4">{activity.icon}</div>
                  <div className="activity-details">
                    <h4 className="font-medium text-gray-800 dark:text-white">{activity.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section> */}

          {/* Wellness Tips */}
          <motion.section 
              className="wellness-tips bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <FiSun className="mr-2 text-yellow-500" /> Tips Kesehatan Mental
              </h2>
              
              <div className="space-y-4">
                {tipsKesehatanMental.map((item, index) => (
                  <motion.div 
                    key={index}
                    className="tip-card p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-700"
                    whileHover={{ 
                      y: -5,
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex items-start">
                      <div className="tip-number w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full mr-3 font-bold shadow-inner">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{item.tip}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.manfaat}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
        </div>
      )}

      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Breathing Exercise */}
          <motion.section
            className="breathing-exercise bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiActivity className="mr-2" /> Latihan Pernafasan
            </h2>
            {!breathingActive ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Latihan pernapasan 4-4-4 ini dapat membantu mengurangi stres dan kecemasan.
                </p>
                <button
                  onClick={startBreathingExercise}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all flex items-center gap-2 mx-auto shadow-md"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>Mulai</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="relative mx-auto w-64 h-64 mb-8">
                  {/* Animated human figure with breathing effect */}
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    animate={{
                      scale: breathingPhase === 'inhale' ? [1, 1.05] : 
                            breathingPhase === 'hold' ? 1 : 
                            [1.05, 1],
                      opacity: [0.9, 1, 0.9]
                    }}
                    transition={{
                      duration: breathingPhase === 'inhale' ? 4 : 
                               breathingPhase === 'hold' ? 4 : 4,
                      repeat: Infinity,
                      ease: breathingPhase === 'inhale' ? 'easeOut' : 
                            breathingPhase === 'exhale' ? 'easeIn' : 'linear'
                    }}
                  >
                    {/* Head */}
                    <div className="w-16 h-16 bg-blue-200 rounded-full mb-2"></div>
                    {/* Body */}
                    <div className="w-12 h-24 bg-blue-300 rounded-lg relative">
                      {/* Breathing animation - expanding/contracting chest */}
                      <motion.div 
                        className="absolute top-1/4 left-0 right-0 h-8 bg-blue-400 rounded-lg"
                        animate={{
                          scaleX: breathingPhase === 'inhale' ? [1, 1.2] : 
                                  breathingPhase === 'hold' ? 1.2 : 
                                  [1.2, 1],
                        }}
                        transition={{
                          duration: breathingPhase === 'inhale' ? 4 : 
                                   breathingPhase === 'hold' ? 4 : 4,
                          repeat: Infinity
                        }}
                      />
                    </div>
                  </motion.div>
                </div>
                
                <div className="text-center">
                  <motion.div
                    key={breathingPhase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      {breathingPhase === 'inhale' ? 'Tarik Napas' : 
                       breathingPhase === 'hold' ? 'Tahan' : 'Hembuskan Perlahan'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {breathingPhase === 'inhale' ? 'Tarik napas dalam-dalam selama 4 detik' : 
                       breathingPhase === 'hold' ? 'Tahan napas selama 4 detik' : 
                       'Buang napas perlahan selama 4 detik'}
                    </p>
                  </motion.div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <motion.div 
                      className="bg-blue-600 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ 
                        duration: breathingPhase === 'inhale' ? 4 : 
                                 breathingPhase === 'hold' ? 4 : 4,
                        repeat: Infinity
                      }}
                    />
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-6">
                    Siklus yang telah selesai: {breathingCount}
                  </p>
                  <button
                    onClick={stopBreathingExercise}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-700 text-white rounded-lg hover:from-red-700 hover:to-pink-800 transition-all flex items-center gap-2 mx-auto shadow-md"
                  >
                    <FiXCircle className="w-5 h-5" />
                    <span>Berhenti Latihan</span>
                  </button>
                </div>
              </div>
            )}
          </motion.section>

          {/* Gratitude Journal */}
          <motion.section
            className="gratitude-journal bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiHeart className="mr-2" /> Jurnal Syukur

            </h2>
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGratitudeItem}
                  onChange={(e) => setNewGratitudeItem(e.target.value)}
                  placeholder="Apa yang kamu syukuri hari ini?"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
                <button
                  onClick={addGratitudeItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {gratitudeList.length > 0 ? (
                gratitudeList.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-gray-800 dark:text-white">• {item}</span>
                    <button
                      onClick={() => removeGratitudeItem(index)}
                      className="text-red-600 hover:text-red-800 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">Tambahkan hal-hal yang Anda syukuri untuk memulai</p>
              )}
            </div>
          </motion.section>

          {/* Personal Journal */}
          <motion.section
            className="personal-journal bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                <FiBookOpen className="mr-2" /> Jurnal Pribadi
              </h2>
              <button
                onClick={() => setShowJournalForm(!showJournalForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {showJournalForm ? (
                  <>
                    <FiXCircle className="w-4 h-4" />
                    <span>Batalkan</span>
                  </>
                ) : (
                  <>
                    <FiPlus className="w-4 h-4" />
                    <span>Buat Baru</span>
                  </>
                )}
              </button>
            </div>

            {showJournalForm && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Tulis pemikiran Anda di sini..."
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={saveJournalEntry}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Simpan</span>
                  </button>
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              {journalEntries.length > 0 ? (
                journalEntries.map((entry, index) => (
                  <motion.div
                    key={index}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(entry.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-white whitespace-pre-line">
                      {entry.content}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  {showJournalForm ? 'Write your first journal entry' : 'No journal entries yet'}
                </p>
              )}
            </div>
          </motion.section>
        </div>
      )}

{activeTab === 'records' && (
  <div className="wellness-records bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center">
      <FiActivity className="mr-2" /> Catatan Kesehatan
    </h2>
    
    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Mood History - Improved with scrollable container */}
      <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg flex flex-col">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center">
          <FiBarChart2 className="mr-2" /> Catatan Suasana Hati
        </h3>
        <div className="flex-1 min-h-0"> {/* This makes the chart container flexible */}
          <div className="h-full overflow-auto"> {/* Scrollable container */}
            <div className="h-96 min-w-[600px]"> {/* Increased height and minimum width */}
              <MoodHistoryChart detailed={true} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Activity Frequency */}
      <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center">
          <FiPieChart className="mr-2" /> Frekuensi Aktivitas
        </h3>
        <div className="h-60 sm:h-64">
          <ActivityFrequencyChart activities={recentActivities} />
        </div>
      </div>
    </div>
  </div>
)}
    </div>
    <CommunityChat />
  </div>
);
};

export default UserHome;