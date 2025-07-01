import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { FiArrowLeft, FiClock, FiShare2, FiBookmark, FiHeart } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const [blogResponse, relatedResponse] = await Promise.all([
          api.get(`/user/blogs/${id}`),
          api.get('/user/blogs?limit=3')
        ]);
        
        // Process the blog content to handle line breaks
        const processedBlog = {
          ...blogResponse.data,
          description: blogResponse.data.description?.replace(/\n/g, '<br>'),
          content: blogResponse.data.content?.replace(/\n/g, '<br>')
        };
        
        setBlog(processedBlog);
        setRelatedBlogs(relatedResponse.data.filter(b => b.id !== parseInt(id)));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog.title;
    const description = blog.description || blog.content.substring(0, 100);
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(description)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=mentalhealth`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`, '_blank');
        break;
      default:
        if (navigator.share) {
          navigator.share({
            title: title,
            text: description,
            url: url
          }).catch(console.error);
        }
    }
  };

  // Function to render HTML with proper line breaks
  const renderHTML = (htmlString) => {
    return { 
      __html: htmlString?.replace(/\n/g, '<br>') || '' 
    };
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-md mx-auto">
          {error}
        </div>
      </div>
    </div>
  );

  if (!blog) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
        aria-label="Go back"
      >
        <FiArrowLeft className="text-gray-700" />
      </motion.button>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="h-64 md:h-96 w-full overflow-hidden">
            <img
              src={blog.image_url || '/images/blog-placeholder.jpg'}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/images/blog-placeholder.jpg';
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-20 pb-20">
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto"
            >
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <FiClock className="mr-1" />
                {formatDate(blog.created_at)}
                {blog.category && (
                  <span className="ml-4 px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                    {blog.category}
                  </span>
                )}
              </div>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
              >
                {blog.title}
              </motion.h1>
              
              {/* Description with proper line breaks */}
              {blog.description && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="text-lg text-gray-600 mb-6 whitespace-pre-line"
                  dangerouslySetInnerHTML={renderHTML(blog.description)}
                />
              )}

              <div className="flex items-center space-x-4 mb-6">
                <button 
                  onClick={() => handleShare()}
                  className="p-2 rounded-full text-gray-400 hover:bg-gray-100"
                  aria-label="Share"
                >
                  <FiShare2 />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Blog Content with proper line breaks */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl mb-16"
        >
          <article className="prose prose-lg max-w-none">
            <div 
              className="whitespace-pre-line"
              dangerouslySetInnerHTML={renderHTML(blog.content)} 
            />
          </article>
        </motion.section>

        {/* Author Section */}
        {blog.author && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl mb-16"
          >
            <div className="flex items-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden">
                {blog.author.avatar && (
                  <img 
                    src={blog.author.avatar} 
                    alt={blog.author.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Written by {blog.author.name}</h4>
                <p className="text-gray-600 text-sm whitespace-pre-line">
                  {blog.author.bio || 'Mental health expert'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Share Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl mb-16"
        >
          <div className="border-t border-b border-gray-200 py-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Bagikan</h3>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleShare('facebook')}
                className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                aria-label="Share on Facebook"
              >
                <FaFacebook />
              </button>
              <button 
                onClick={() => handleShare('twitter')}
                className="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors"
                aria-label="Share on Twitter"
              >
                <FaTwitter />
              </button>
              <button 
                onClick={() => handleShare('linkedin')}
                className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <FaLinkedin />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-100 py-16"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Mungkin kamu tertarik</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedBlogs.map((blog) => (
                  <motion.div
                    key={blog.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/user/blogs/${blog.id}`)}
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={blog.image_url || '/images/blog-placeholder.jpg'}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      {blog.category && (
                        <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                          {blog.category}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{blog.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 whitespace-pre-line">
                        {blog.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {formatDate(blog.created_at)}
                        </span>
                        <span className="text-blue-600 hover:text-blue-800 font-medium">
                          Baca Lebih Lengkap →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Newsletter Subscription */}
        {/* <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated With Our Latest Posts</h2>
            <p className="mb-6 opacity-90">
              Subscribe to our newsletter to receive mental health tips and new articles
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
              />
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </motion.section> */}
      </main>
    </div>
  );
};

export default BlogDetail;