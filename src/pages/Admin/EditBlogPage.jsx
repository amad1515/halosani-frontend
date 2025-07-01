import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Sidebar from '../../components/Admin/Sidebar';
// import MobileSidebarToggle from '../../components/Admin/MobileSidebarToggle';

const EditBlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/admin/blogs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
        });
        setBlog(response.data);
        if (response.data.imageUrl) {
          setImagePreview(response.data.imageUrl);
        }
      } catch (error) {
        console.error('Gagal mengambil data blog:', error);
      }
    };
    fetchBlog();
  }, [id]);

  const handleEditBlog = async (event) => {
    event.preventDefault();

    if (!blog.title || !blog.description) {
      alert("Judul dan Deskripsi wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.append('title', blog.title);
    formData.append('description', blog.description);
    if (blog.image) formData.append('image', blog.image);

    setLoading(true);
    try {
      await api.post(`/admin/blogs/${id}`, formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      setLoading(false);
      navigate('/admin/blogs');
    } catch (error) {
      console.error('Gagal memperbarui blog:', error);
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validFormats.includes(file.type)) {
        alert('Harap unggah gambar yang valid (jpeg, png, jpg)');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file tidak boleh melebihi 2MB');
        return;
      }
      
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setBlog({ ...blog, image: file });
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      localStorage.removeItem('admin_token');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout gagal', error);
    }
  };

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <Sidebar onLogout={handleLogout} />
      
      {/* Toggle Sidebar Mobile */}
      {/* <MobileSidebarToggle onLogout={handleLogout} /> */}

      {/* Konten Utama */}
      <div className="flex-1 md:ml-64 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Edit Postingan Blog</h1>
              <p className="text-gray-600">Perbarui konten dan informasi blog Anda</p>
            </div>
            <button 
              onClick={() => navigate('/admin/blogs')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition duration-200"
            >
              Kembali ke Daftar Blog
            </button>
          </div>

          {/* Kontainer Form */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <form onSubmit={handleEditBlog} className="p-6">
              {/* Field Judul */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
                  Judul
                </label>
                <input
                  id="title"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  placeholder="Masukkan judul blog"
                  value={blog.title}
                  onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                  required
                />
              </div>
              
              {/* Field Deskripsi */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                  Deskripsi
                </label>
                <textarea
                  id="description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200 min-h-[200px]"
                  placeholder="Tulis konten blog Anda di sini..."
                  value={blog.description}
                  onChange={(e) => setBlog({ ...blog, description: e.target.value })}
                  required
                />
              </div>
              
              {/* Unggah Gambar */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Gambar Utama
                </label>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/jpeg, image/png, image/jpg"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center justify-center p-4"
                      >
                        <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span className="text-sm text-gray-600">Klik untuk mengunggah gambar</span>
                        <span className="text-xs text-gray-500 mt-1">JPEG, PNG (Maks 2MB)</span>
                      </label>
                    </div>
                  </div>
                  
                  {imagePreview && (
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Pratinjau" 
                          className="w-full h-auto max-h-48 object-contain"
                        />
                        <div className="p-2 text-center text-sm text-gray-600">
                          Pratinjau Gambar Saat Ini
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tombol Submit */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBlogPage;