import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { FiSearch, FiClock } from 'react-icons/fi';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/user/blogs');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Get unique categories
  const categories = ['semua', ...new Set(blogs.map(blog => blog.category))];

  const filteredBlogs = blogs.filter(blog =>
    (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === 'semua' || blog.category === selectedCategory)
  );

  // Function to clean up description text
  const cleanDescription = (text) => {
    if (!text) return '';
    // Replace multiple spaces with single space and trim
    return text.replace(/\s+/g, ' ').trim();
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
              Blog Kesehatan Mental
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl opacity-90 max-w-2xl mx-auto"
            >
              Temukan wawasan, kiat, dan cerita untuk mendukung perjalanan kesehatan Anda
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
                placeholder="Cari Topik"
                className="w-full px-5 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Blog List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <motion.div 
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/user/blogs/${blog.id}`)} 
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={blog.image_url || '/images/blog-placeholder.jpg'}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/images/blog-placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    {blog.category && (
                      <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                        {blog.category}
                      </span>
                    )}
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{blog.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-3 whitespace-normal">
                      {cleanDescription(blog.description)}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-1" />
                      {new Date(blog.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700">No articles found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Blog;