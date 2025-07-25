import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiUser, FiChevronUp, FiChevronDown, FiEdit2, FiTrash2, FiClock, FiAlertTriangle } from 'react-icons/fi';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, onValue, push, serverTimestamp, update } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANZSa_HyVle2eyDZL0jo8DeOE7KwtarVc",
  authDomain: "halosanichatcom.firebaseapp.com",
  projectId: "halosanichatcom",
  storageBucket: "halosanichatcom.appspot.com",
  messagingSenderId: "421638057459",
  appId: "1:421638057459:web:5d341b1f407452d647b686",
  measurementId: "G-NBNCCG4EBL"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

// List of prohibited words (Indonesian and English)
const BAD_WORDS = [
  'anjing', 'bangsat', 'bajingan', 'kontol', 'memek', 'jembut', 'ngentot', 'ngewe', 'pepek', 
  'pantek', 'puki', 'bego', 'goblok', 'idiot', 'tolol', 'kirek', 'jancok', 'jancuk', 'fuck', 
  'shit', 'asshole', 'bitch', 'cunt', 'dick', 'pussy', 'bastard', 'motherfucker', 'whore', 'slut'
];

// Phone number and URL regex patterns
const PHONE_REGEX = /(\+?\d{1,3}[- ]?)?\(?\d{2,3}\)?[- ]?\d{3,4}[- ]?\d{3,4}/g;
const URL_REGEX = /(https?:\/\/|www\.)[^\s]+/gi;

const MESSAGE_COOLDOWN = 10000; // 10 detik

// Avatar colors and styles
const AVATAR_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
  'bg-red-500', 'bg-orange-500', 'bg-yellow-500',
  'bg-green-500', 'bg-teal-500', 'bg-indigo-500'
];
const AVATAR_STYLES = [
  'rounded-full', 'rounded-lg', 'rounded-2xl',
  'rounded-tl-full rounded-br-full', 'rounded-tr-full rounded-bl-full'
];

// Format date header
const formatDateHeader = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Hari Ini';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Kemarin';
  } else {
    const options = { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    };
    return date.toLocaleDateString('id-ID', options);
  }
};

const CommunityChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [showRules, setShowRules] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Responsive width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chatWidth = windowWidth < 640 ? 'w-[calc(100%-3rem)]' : 'w-96';

  // Load user data from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('chatUsername') || 
      `Pengguna${Math.floor(Math.random() * 10000)}`;
    const userId = localStorage.getItem('chatUserId') || uuidv4();
    
    setUsername(storedUsername);
    localStorage.setItem('chatUserId', userId);
  }, []);

  // Fetch messages from Firebase
  useEffect(() => {
    const messagesRef = ref(db, 'communityChat/messages');
    onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val() || {};
      const messagesList = Object.keys(messagesData)
        .map(key => ({
          id: key,
          ...messagesData[key]
        }))
        .filter(msg => !msg.isDeleted)
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      
      setMessages(messagesList);
    });
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cooldown timer
  useEffect(() => {
    if (!lastMessageTime) return;
    
    const timer = setInterval(() => {
      const remaining = Math.max(0, MESSAGE_COOLDOWN - (Date.now() - lastMessageTime));
      setCooldown(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [lastMessageTime]);

  // Enhanced content filtering
  const filterContent = (text) => {
    if (!text) return text;
    
    // Filter bad words
    let filteredText = text;
    BAD_WORDS.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filteredText = filteredText.replace(regex, '*'.repeat(word.length));
    });
    
    // Remove phone numbers
    filteredText = filteredText.replace(PHONE_REGEX, '[nomor telepon dihapus]');
    
    // Remove URLs
    filteredText = filteredText.replace(URL_REGEX, '[tautan dihapus]');
    
    return filteredText;
  };

  // Generate random avatar
  const generateAvatar = (userId) => {
    if (!userId) return AVATAR_COLORS[0];
    
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = AVATAR_COLORS[hash % AVATAR_COLORS.length];
    const style = AVATAR_STYLES[hash % AVATAR_STYLES.length];
    
    return `${color} ${style}`;
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const grouped = {};
    messages.forEach(message => {
      const date = message.timestamp ? new Date(message.timestamp).toDateString() : 'Unknown';
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    return grouped;
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    if (cooldown > 0) {
      alert(`Tunggu ${Math.ceil(cooldown / 1000)} detik sebelum mengirim pesan lagi`);
      return;
    }

    const filteredMessage = filterContent(newMessage);

    try {
      await push(ref(db, 'communityChat/messages'), {
        text: filteredMessage,
        username,
        timestamp: serverTimestamp(),
        userId: localStorage.getItem('chatUserId'),
        isDeleted: false
      });

      setLastMessageTime(Date.now());
      setNewMessage('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Gagal mengirim pesan');
    }
  };

  // Unsend message
  const unsendMessage = async (messageId, userId) => {
    const currentUserId = localStorage.getItem('chatUserId');
    if (userId === currentUserId) {
      try {
        await update(ref(db, `communityChat/messages/${messageId}`), {
          isDeleted: true,
          deletedAt: serverTimestamp()
        });
      } catch (error) {
        console.error('Error unsending message:', error);
        alert('Gagal menghapus pesan');
      }
    }
  };

  // Update username
  const updateUsername = () => {
    if (tempUsername.trim() && tempUsername !== username) {
      const filteredUsername = filterContent(tempUsername);
      setUsername(filteredUsername);
      localStorage.setItem('chatUsername', filteredUsername);
      setEditingUsername(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  // Cooldown progress
  const cooldownProgress = cooldown > 0 ? (1 - (cooldown / MESSAGE_COOLDOWN)) * 100 : 100;

  // Grouped messages
  const groupedMessages = groupMessagesByDate();

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className={`fixed bottom-6 right-6 z-50 ${isOpen ? 'hidden' : ''}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      >
        <button
          onClick={toggleChat}
          className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
        >
          <FiMessageSquare size={24} />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
              {Math.min(messages.length, 9)}
            </span>
          )}
        </button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed bottom-6 right-6 ${chatWidth} bg-white rounded-t-xl shadow-xl z-50 flex flex-col overflow-hidden ${
              isMinimized ? 'h-16' : 'h-[32rem]'
            }`}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-xl flex justify-between items-center">
              <div className="flex items-center">
                <FiMessageSquare className="mr-2" />
                <span className="font-medium">Obrolan Komunitas</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleMinimize} 
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  {isMinimized ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                <button 
                  onClick={toggleChat} 
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <FiX />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-gray-50">
                {/* Rules Notification */}
                {showRules && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg"
                  >
                    <div className="flex items-start">
                      <FiAlertTriangle className="text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-yellow-800">Aturan Komunitas</h3>
                        <ul className="text-sm text-yellow-700 mt-1 list-disc pl-5 space-y-1">
                          <li>Gunakan bahasa yang sopan dan santun</li>
                          <li>Dilarang mengirim konten SARA atau pornografi</li>
                          <li>Dilarang mengiklankan produk atau jasa</li>
                          <li>Gunakan fitur ini untuk berbagi pengetahuan</li>
                          <li>Pesan akan otomatis terfilter jika mengandung kata kasar</li>
                        </ul>
                        <button 
                          onClick={() => setShowRules(false)}
                          className="text-xs text-yellow-600 hover:text-yellow-800 mt-2 underline"
                        >
                          Saya mengerti
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-gray-500 text-center p-4"
                  >
                    <FiMessageSquare size={48} className="mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-1">Belum ada pesan</p>
                    <p className="text-sm">Jadilah yang pertama menyapa!</p>
                  </motion.div>
                ) : (
                  Object.keys(groupedMessages).map((date) => (
                    <div key={date}>
                      {/* Date header */}
                      <div className="flex items-center my-4">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-3 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                          {formatDateHeader(new Date(date))}
                        </span>
                        <div className="flex-1 border-t border-gray-300"></div>
                      </div>
                      
                      {/* Messages for this date */}
                      {groupedMessages[date].map((message) => {
                        const isCurrentUser = message.userId === localStorage.getItem('chatUserId');
                        const avatarClass = generateAvatar(message.userId);

                        return (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex max-w-[85%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                              {/* Avatar */}
                              <motion.div 
                                className="flex-shrink-0 mr-2"
                                whileHover={{ scale: 1.1 }}
                              >
                                <div className={`${avatarClass} w-8 h-8 flex items-center justify-center text-white`}>
                                  {message.username.charAt(0).toUpperCase()}
                                </div>
                              </motion.div>
                              
                              {/* Message Content */}
                              <div className={`flex-1 ${isCurrentUser ? 'flex flex-col items-end' : ''}`}>
                                {/* Username and timestamp */}
                                <div className="flex items-center mb-1">
                                  {!isCurrentUser && (
                                    <span className="text-xs font-semibold text-gray-600 mr-2">
                                      {message.username}
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <FiClock className="mr-1" size={10} />
                                    {formatTime(message.timestamp)}
                                  </span>
                                </div>
                                
                                {/* Message bubble */}
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={`relative p-3 rounded-lg text-sm ${
                                    isCurrentUser 
                                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none' 
                                      : 'bg-gray-100 rounded-bl-none'
                                  }`}
                                >
                                  {message.text}
                                  
                                  {/* Unsend button */}
                                  {isCurrentUser && (
                                    <motion.button
                                      onClick={() => unsendMessage(message.id, message.userId)}
                                      className={`absolute -top-2 -left-2 bg-white p-1 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors ${
                                        isCurrentUser ? '' : 'hidden'
                                      }`}
                                      title="Hapus pesan"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <FiTrash2 size={12} />
                                    </motion.button>
                                  )}
                                </motion.div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* User Profile Section */}
            {!isMinimized && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 border-t border-gray-200 bg-gray-100 flex items-center"
              >
                <div className="mr-3">
                  <motion.div 
                    className={`${generateAvatar(localStorage.getItem('chatUserId'))} w-10 h-10 flex items-center justify-center text-white`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {username.charAt(0).toUpperCase()}
                  </motion.div>
                </div>
                <div className="flex-1">
                  {editingUsername ? (
                    <motion.div 
                      className="flex"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <input
                        type="text"
                        value={tempUsername}
                        onChange={(e) => setTempUsername(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        autoFocus
                        maxLength={20}
                        onKeyDown={(e) => e.key === 'Enter' && updateUsername()}
                      />
                      <button
                        onClick={updateUsername}
                        className="bg-blue-500 text-white px-3 py-2 rounded-r-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        Simpan
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {username}
                      </span>
                      <motion.button 
                        onClick={() => {
                          setTempUsername(username);
                          setEditingUsername(true);
                        }}
                        className="ml-2 text-gray-500 hover:text-blue-500 transition-colors"
                        title="Edit nama pengguna"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiEdit2 size={14} />
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Message Input */}
            {!isMinimized && (
              <motion.form 
                onSubmit={sendMessage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 border-t border-gray-200 bg-white"
              >
                <div className="relative">
                  {/* Cooldown indicator */}
                  {cooldown > 0 && (
                    <div className="absolute -top-1 left-0 right-0 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: '0%' }}
                        animate={{ width: `${cooldownProgress}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  )}
                  
                  <div className="flex mt-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={
                        cooldown > 0 
                          ? `Tunggu ${Math.ceil(cooldown / 1000)} detik...` 
                          : "Ketik pesan..."
                      }
                      className="flex-1 border border-gray-300 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                      disabled={cooldown > 0}
                    />
                    <motion.button
                      type="submit"
                      className={`px-4 py-3 rounded-r-lg transition-colors ${
                        newMessage.trim() && cooldown <= 0
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      whileTap={newMessage.trim() && cooldown <= 0 ? { scale: 0.95 } : {}}
                      disabled={!newMessage.trim() || cooldown > 0}
                    >
                      <FiSend size={18} />
                    </motion.button>
                  </div>
                </div>
              </motion.form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommunityChat;