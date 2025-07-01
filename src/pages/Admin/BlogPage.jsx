import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Sidebar from '../../components/Admin/Sidebar';
// import MobileSidebarToggle from '../../components/Admin/MobileSidebarToggle';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ 
    title: '', 
    description: '', 
    image: null 
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/admin/blogs', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          },
        });
        setBlogs(response.data);
      } catch (error) {
        console.error('Gagal mengambil data blog:', error);
      }
    };
    fetchBlogs();
  }, []);

  const handleAddBlog = async (event) => {
    event.preventDefault();
    if (!newBlog.title || !newBlog.description || !newBlog.image) {
      alert("Judul, deskripsi, dan gambar wajib diisi");
      return;
    }

    const formData = new FormData();
    formData.append('title', newBlog.title);
    // Mempertahankan line breaks dalam deskripsi
    formData.append('description', newBlog.description.replace(/\n/g, '<br>'));
    formData.append('image', newBlog.image);

    setLoading(true);
    try {
      const response = await api.post('/admin/blogs', formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      
      setBlogs([response.data, ...blogs]);
      setNewBlog({ title: '', description: '', image: null });
      setPreviewImage(null);
    } catch (error) {
      console.error('Gagal menambahkan blog:', error);
      alert('Gagal menambahkan blog. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validFormats.includes(file.type)) {
        alert('Harap unggah gambar yang valid (JPEG, PNG, JPG)');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file tidak boleh melebihi 2MB');
        return;
      }
      setNewBlog({ ...newBlog, image: file });
      
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus posting blog ini?')) return;
    
    try {
      await api.delete(`/admin/blogs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
      });
      setBlogs(blogs.filter(blog => blog.id !== id));
    } catch (error) {
      console.error('Gagal menghapus blog:', error);
      alert('Gagal menghapus blog. Silakan coba lagi.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  // Format deskripsi untuk mempertahankan line breaks
  const formatDescription = (text) => {
    if (!text) return '';
    return text.replace(/<br\s*\/?>/gi, '\n');
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
    {/* Sidebar Desktop */}
    <Sidebar onLogout={handleLogout} />
    
    {/* Toggle Sidebar Mobile */}
    {/* <MobileSidebarToggle onLogout={handleLogout} /> */}
      {/* Area Konten Utama */}
      <div className="flex-1 md:ml-20 lg:ml-64 flex flex-col min-h-screen">
        {/* Area Konten yang Dapat Digulir */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-6">
              {/* Kartu Buat Blog */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800">Buat Posting Blog Baru</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Isi formulir di bawah untuk membuat posting blog baru
                  </p>
                </div>
                
                <div className="p-6">
                  <form onSubmit={handleAddBlog} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      {/* Judul */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Judul <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                          placeholder="Masukkan judul blog"
                          value={newBlog.title}
                          onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                          required
                        />
                      </div>

                      {/* Konten */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Konten <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={8}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 whitespace-pre-wrap"
                          placeholder="Tulis konten blog Anda di sini... (Tekan Enter untuk baris baru)"
                          value={newBlog.description}
                          onChange={(e) => setNewBlog({ ...newBlog, description: e.target.value })}
                          required
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Catatan: Line breaks akan dipertahankan dalam posting yang diterbitkan
                        </p>
                      </div>

                      {/* Unggah Gambar */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Gambar Unggulan <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition duration-200">
                              <input
                                type="file"
                                id="image-upload"
                                className="hidden"
                                onChange={handleImageChange}
                                accept="image/jpeg, image/png, image/jpg"
                                required
                              />
                              <label
                                htmlFor="image-upload"
                                className="cursor-pointer flex flex-col items-center justify-center p-4"
                              >
                                <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">
                                  {newBlog.image ? newBlog.image.name : 'Klik untuk mengunggah gambar'}
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                  JPEG, PNG (Maks 2MB)
                                </span>
                              </label>
                            </div>
                          </div>
                          
                          {previewImage && (
                            <div className="flex-1">
                              <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <img 
                                  src={previewImage} 
                                  alt="Pratinjau" 
                                  className="w-full h-auto max-h-48 object-contain"
                                />
                                <div className="p-2 text-center text-sm text-gray-600 bg-white">
                                  Pratinjau Gambar
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tombol Submit */}
                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className={`inline-flex items-center px-6 py-3 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${
                            loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                          }`}
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Mempublikasikan...
                            </>
                          ) : (
                            'Publikasikan Posting Blog'
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Header Daftar Blog */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Posting Blog Anda
                </h2>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  {blogs.length} {blogs.length === 1 ? 'Posting' : 'Posting'}
                </div>
              </div>

              {/* Daftar Blog */}
              {blogs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Belum ada posting blog
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Mulailah dengan membuat posting blog pertama Anda di atas
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  <div className="divide-y divide-gray-200">
                    {blogs.map((blog) => (
                      <div key={blog.id} className="p-6 hover:bg-gray-50 transition duration-150">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {blog.title}
                              </h3>
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Diterbitkan
                              </span>
                            </div>
                            
                            {/* Deskripsi yang diformat dengan line breaks yang dipertahankan */}
                            <div className="mt-3 text-gray-600 whitespace-pre-line">
                              {formatDescription(blog.description)}
                            </div>
                            
                            {blog.image_url && (
                              <div className="mt-4">
                                <img
                                  src={blog.image_url}
                                  alt={blog.title}
                                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                  onError={(e) => {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHN0eWxlPnRleHR7Zm9udC1mYW1pbHk6c2Fucy1zZXJpZjtmb250LXNpemU6MTRweDtmaWxsOiM2NjY7fTwvc3R5bGU+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-shrink-0 gap-2">
                            <button
                              onClick={() => navigate(`/admin/blogs/${blog.id}/edit`)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog.id)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;