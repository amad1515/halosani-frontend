import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { FiSearch, FiClock, FiYoutube } from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get('/user/videos');
        // Ensure we always set an array, even if response.data is null/undefined
        setVideos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos. Please try again later.');
        setVideos([]); // Ensure videos is always an array
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Extract video ID from YouTube URL
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Safe filtering
  const filteredVideos = Array.isArray(videos) ? videos.filter(video => {
    if (!video) return false;
    const titleMatch = video.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const descMatch = video.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return titleMatch || descMatch;
  }) : [];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
          <h3 className="text-xl font-medium text-gray-700 mb-4">{error}</h3>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
                      Video Kesehatan Mental
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-xl opacity-90 max-w-2xl mx-auto"
                    >
                    Tonton video edukasi dan inspiratif untuk mendukung perjalanan kesehatan Anda</motion.p>
                  </div>
                </motion.section>

        {/* Search */}
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

                    </div>

          {/* Video List */}
          {loading ? (
             <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.length > 0 ? (
                filteredVideos.map((video) => {
                  if (!video) return null;
                  
                  const videoId = getYouTubeId(video.youtube_link);
                  const thumbnailUrl = videoId 
                    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    : '/images/video-placeholder.jpg';

                  return (
                    <motion.div 
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                      onClick={() => navigate(`/user/videos/${video.id}`)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={thumbnailUrl}
                          alt={video.title || 'Video thumbnail'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/images/video-placeholder.jpg';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity hover:bg-opacity-10">
                          <FiYoutube className="text-4xl text-red-600 bg-white rounded-full p-1" />
                        </div>
                      </div>
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                          {video.title || 'Untitled Video'}
                        </h2>
                        {video.description && (
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {video.description}
                          </p>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <FiClock className="mr-1" />
                          {video.created_at ? new Date(video.created_at).toLocaleDateString() : 'Unknown date'}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-xl font-medium text-gray-700">
                    {searchTerm ? 'No videos match your search' : 'No videos available'}
                  </h3>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Video;