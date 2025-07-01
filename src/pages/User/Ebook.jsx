import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { FiSearch, FiBookOpen, FiDownload, FiClock } from 'react-icons/fi';

// Define your API base URL here (you should get this from your environment configuration)
const API_BASE_URL = 'http://localhost:8000'; // Replace with your actual API base URL

const Ebook = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const response = await api.get('/user/ebooks');
        // Format data to ensure proper image URLs
        const formattedEbooks = Array.isArray(response.data) 
          ? response.data.map(ebook => ({
              ...ebook,
              // Handle both full URLs and storage paths
              image_url: getImageUrl(ebook.image),
              // Handle both full URLs and storage paths for download links
              download_url: getDownloadUrl(ebook.link)
            }))
          : [];
        setEbooks(formattedEbooks);
      } catch (error) {
        console.error('Error fetching ebooks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEbooks();
  }, []);

  // Helper function to construct proper image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/ebook-placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}/storage/${imagePath.replace('public/', '')}`;
  };

  // Helper function to construct proper download URLs
  const getDownloadUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith('http')) return filePath;
    return `${API_BASE_URL}/storage/${filePath.replace('public/', '')}`;
  };

  // Get unique categories if they exist
const categories = ['All', ...new Set(ebooks.map(ebook => ebook.category).filter(Boolean))];

  const filteredEbooks = ebooks.filter(ebook =>
    (ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ebook.short_description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === 'All' || ebook.category === selectedCategory)
  );

  const handleDownload = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (

    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1">
        {/* Hero Section */}
<motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-4xl font-bold mb-4"
            >
              Ebooks Kesehatan Mental
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl opacity-90 max-w-2xl mx-auto"
            >
              Temukan sumber daya berharga untuk mendukung perjalanan kesehatan Anda
            </motion.p>
          </div>
        </motion.section>


    

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
           <div className="max-w-4xl mx-auto mb-8">
                     <div className="relative mb-6">
                       <input
                         type="text"
                         placeholder="Search Topic"
                         className="w-full px-5 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                       />
                       <FiSearch className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                     </div>

            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Ebook List */}
          {loading ? (
             <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEbooks.map((ebook) => (
                <motion.div 
                  key={ebook.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={ebook.image_url}
                      alt={ebook.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/images/ebook-placeholder.jpg';
                        e.target.className = 'w-full h-full object-contain bg-gray-100 p-4';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-white bg-purple-600 rounded-full">
                        <FiBookOpen className="mr-1" /> Ebook
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{ebook.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                      {ebook.short_description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiClock className="mr-1" />
                        {new Date(ebook.created_at).toLocaleDateString()}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownload(ebook.download_url)}
                        disabled={!ebook.download_url}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                          ebook.download_url 
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <FiDownload className="mr-2" />
                        {ebook.download_url ? 'Download' : 'Unavailable'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredEbooks.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700">No ebooks found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Ebook;