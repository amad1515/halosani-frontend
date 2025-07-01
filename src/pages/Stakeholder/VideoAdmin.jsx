import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Admin/Sidebars';
// import MobileSidebarToggle from '../../components/Admin/MobileSidebarToggle';
import api from '../../api/axios';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiClock, FiYoutube, FiFilter } from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';

const VideoAdmin = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    youtube_link: '',
    description: ''
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mengambil semua video
  const fetchVideos = async () => {
    try {
      const response = await api.get('/admin/videos');
      let sortedVideos = response.data;
      
      // Logika pengurutan
      if (sortBy === 'newest') {
        sortedVideos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (sortBy === 'oldest') {
        sortedVideos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      } else if (sortBy === 'title') {
        sortedVideos.sort((a, b) => a.title.localeCompare(b.title));
      }
      
      setVideos(sortedVideos);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengambil data video');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [sortBy]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openAddModal = () => {
    setCurrentVideo(null);
    setFormData({
      title: '',
      youtube_link: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (video) => {
    setCurrentVideo(video);
    setFormData({
      title: video.title,
      youtube_link: video.youtube_link,
      description: video.description
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentVideo) {
        // Update video yang ada
        await api.put(`/admin/videos/${currentVideo.id}`, formData);
        toast.success('Video berhasil diperbarui');
      } else {
        // Buat video baru
        await api.post('/admin/videos', formData);
        toast.success('Video berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchVideos();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus video ini?')) {
      try {
        await api.delete(`/admin/videos/${id}`);
        toast.success('Video berhasil dihapus');
        fetchVideos();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Gagal menghapus video');
      }
    }
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Filter video berdasarkan kata kunci pencarian
  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar Desktop - selalu terlihat di layar besar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Toggle Sidebar Mobile */}
      {/* <MobileSidebarToggle 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isOpen={isSidebarOpen}
      /> */}
      
      {/* Sidebar Mobile - ditampilkan secara kondisional */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative z-50 w-80 h-full bg-gradient-to-b from-indigo-900 to-purple-900 text-white p-6 shadow-2xl transform transition-transform duration-300">
            <Sidebar isMobile={true} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Konten Utama */}
      <div className="flex-1 p-4 lg:p-8 lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header dengan pencarian dan aksi */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manajemen Video</h1>
                <p className="text-gray-600 mt-1">Kelola dan atur konten video Anda</p>
              </div>
              
              <button
                onClick={openAddModal}
                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <FiPlus className="w-5 h-5" />
                <span>Tambah Video</span>
              </button>
            </div>
            
            {/* Bar Pencarian dan Filter */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari video..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2.5">
                    <FiFilter className="text-gray-500 mr-2" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent border-none focus:ring-0 text-sm text-gray-700 outline-none"
                    >
                      <option value="newest">Terbaru</option>
                      <option value="oldest">Terlama</option>
                      <option value="title">A-Z</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Konten */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
              <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 mb-4">
                <FaYoutube className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Tidak ada video yang cocok' : 'Belum ada video tersedia'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Coba sesuaikan pencarian atau filter Anda' : 'Mulailah dengan menambahkan video pertama Anda'}
              </p>
              <button
                onClick={openAddModal}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all flex items-center justify-center gap-2 mx-auto shadow-md"
              >
                <FiPlus className="w-5 h-5" />
                <span>Tambah Video</span>
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-500 flex items-center gap-2">
                <span>Menampilkan {filteredVideos.length} dari {videos.length} video</span>
                <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                <span className="flex items-center gap-1">
                  <FiClock className="w-3 h-3" />
                  Diurutkan berdasarkan {sortBy === 'newest' ? 'terbaru' : sortBy === 'oldest' ? 'terlama' : 'A-Z'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full border border-gray-200">
                    <div className="relative pt-[56.25%] bg-gray-100">
                      {video.youtube_link && (
                        <>
                          <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${getYouTubeId(video.youtube_link)}?rel=0&modestbranding=1`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            <FiYoutube className="inline mr-1" />
                            YouTube
                          </div>
                        </>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-medium text-gray-800 line-clamp-2 mb-2">{video.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">{video.description}</p>
                      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {new Date(video.created_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(video)}
                            className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(video.id)}
                            className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Hapus"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {currentVideo ? 'Edit Video' : 'Tambah Video Baru'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Judul <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Masukkan judul video"
                      />
                    </div>

                    <div>
                      <label htmlFor="youtube_link" className="block text-sm font-medium text-gray-700 mb-2">
                        URL YouTube <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaYoutube className="h-5 w-5 text-red-500" />
                        </div>
                        <input
                          type="url"
                          id="youtube_link"
                          name="youtube_link"
                          value={formData.youtube_link}
                          onChange={handleInputChange}
                          required
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        />
                      </div>
                      {formData.youtube_link && (
                        <div className="mt-2 text-xs text-gray-500">
                          Pratinjau: 
                          <a 
                            href={formData.youtube_link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline ml-1 break-all"
                          >
                            {formData.youtube_link}
                          </a>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Masukkan deskripsi video (opsional)"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3 border-t border-gray-200 pt-5">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Memproses...
                        </>
                      ) : currentVideo ? (
                        <>
                          <FiCheck className="w-4 h-4" />
                          Perbarui Video
                        </>
                      ) : (
                        <>
                          <FiPlus className="w-4 h-4" />
                          Tambah Video
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAdmin;