import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { FiClock, FiArrowLeft } from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await api.get(`/user/videos/${id}`);
        setVideo(response.data);
      } catch (err) {
        setError('Failed to load video');
        console.error('Error fetching video:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  // Extract video ID from YouTube URL
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) {
    return (
       <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-700">{error || 'Video not found'}</h3>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const videoId = getYouTubeId(video.youtube_link);

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-red-600 hover:text-red-700 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Kembali Menuju Videos
        </button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Video Player */}
          <div className="relative pt-[56.25%] bg-black">
            {videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              ></iframe>
            ) : (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <FaYoutube className="text-5xl mx-auto mb-4 text-red-600" />
                  <p>Invalid YouTube URL</p>
                </div>
              </div>
            )}
          </div>

          {/* Video Details */}
          <div className="p-6 md:p-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <FiClock className="mr-1" />
              {new Date(video.created_at).toLocaleDateString()}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">{video.title}</h1>

            {video.description && (
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-line">{video.description}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VideoDetail;