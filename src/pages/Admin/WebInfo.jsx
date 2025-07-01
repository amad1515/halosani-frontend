import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiEdit, FiTrash2, FiUpload, FiSave, FiPlus, FiChevronLeft } from 'react-icons/fi';
import Sidebar from '../../components/Admin/Sidebar';
// import MobileSidebarToggle from '../../components/Admin/MobileSidebarToggle';
import { useNavigate } from 'react-router-dom';

const WebInfoAdmin = () => {
  const [webInfo, setWebInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Added this state
  // const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWebInfo();
  }, []);

  const fetchWebInfo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/web-info');
      if (response.data.length > 0) {
        const info = {
          ...response.data[0],
          imageUrl: response.data[0].image ? `http://localhost:8000/storage/${response.data[0].image}` : null
        };
        setWebInfo(info);
        reset(info);
        setImagePreview(info.imageUrl);
      }
    } catch (error) {
      console.error('Error fetching web info:', error);
      setError('Failed to load website information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image (JPEG, PNG)');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should not exceed 2MB');
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setSelectedImage(file); // Save the file object to state
      setError(null);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description.replace(/\n/g, '<br>'));
    formData.append('contact', data.contact);
    formData.append('address', data.address);
    
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      let response;
      if (webInfo) {
        formData.append('_method', 'PUT');
        response = await api.post(`/admin/web-info/${webInfo.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await api.post('/admin/web-info', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      // Update with new image URL
      const updatedInfo = {
        ...response.data,
        imageUrl: response.data.image ? `http://localhost:8000/storage/${response.data.image}` : null
      };
      
      setWebInfo(updatedInfo);
      setImagePreview(updatedInfo.imageUrl);
      setSelectedImage(null); // Clear the selected image after upload
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving web info:', error);
      setError(error.response?.data?.message || 'Failed to save website information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!webInfo) return;
    
    if (!window.confirm('Apakah Anda yakin ingin menghapus informasi situs web ini?')) return;
    
    setIsLoading(true);
    try {
      await api.delete(`/admin/web-info/${webInfo.id}`);
      setWebInfo(null);
      reset();
      setImagePreview(null);
      setSelectedImage(null); // Clear selected image on delete
      setIsEditing(false);
    } catch (error) {
      console.error('Error deleting web info:', error);
      setError('Failed to delete website information');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 md:ml-72 p-4 md:p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Sidebar Toggle */}
      {/* <MobileSidebarToggle 
        isOpen={mobileSidebarOpen} 
        toggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
      /> */}

      {/* Main Content */}
      <div className="flex-1 md:ml-72 p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Informasi Website
          </h1>
          {isEditing && (
            <button 
              onClick={() => {
                setIsEditing(false);
                if (webInfo) {
                  reset(webInfo);
                  setImagePreview(webInfo.imageUrl);
                  setSelectedImage(null); // Clear selected image when canceling
                }
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition duration-200 flex items-center"
            >
              <FiChevronLeft className="mr-1" /> Kembali
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        {!isEditing ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {webInfo ? (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Informasi Situs Web Terkini</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Judul</h3>
                        <p className="mt-1 text-gray-600">{webInfo.title}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Kontak</h3>
                        <p className="mt-1 text-gray-600">{webInfo.contact}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Alamat</h3>
                        <p className="mt-1 text-gray-600">{webInfo.address}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Deskripsi</h3>
                        <div 
                          className="mt-1 text-gray-600 whitespace-pre-line"
                          dangerouslySetInnerHTML={{ __html: webInfo.description }}
                        />
                      </div>
                    </div>

                    {webInfo.imageUrl && (
                      <div className="flex flex-col">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Cover Gambar</h3>
                        <div className="bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={webInfo.imageUrl} 
                            alt={webInfo.title} 
                            className="w-full h-auto object-contain max-h-64"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/400';
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <h3 className="text-lg font-medium text-gray-600 mb-4">No website information found</h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className={`px-6 py-2.5 rounded-lg text-white transition flex items-center mx-auto ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                  disabled={isLoading}
                >
                  <FiPlus className="mr-2" /> Create Website Information
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul*</label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Judul Website"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kontak*</label>
                <input
                  type="text"
                  {...register('contact', { required: 'Contact is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Informasi Kontak"
                />
                {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat*</label>
                <input
                  type="text"
                  {...register('address', { required: 'Address is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Alamat Lengkap"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi*</label>
                <textarea
                  rows={6}
                  {...register('description', { required: 'Description is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukan Deskripsi Detil"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {webInfo?.image ? 'Perbarui Gambar' : 'Upload Gambar'}
                </label>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        id="webinfo-image-upload"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/jpeg, image/png, image/jpg"
                      />
                      <label
                        htmlFor="webinfo-image-upload"
                        className="cursor-pointer flex flex-col items-center justify-center p-4"
                      >
                        <FiUpload className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click Untuk Upload Gambar</span>
                        <span className="text-xs text-gray-500 mt-1">JPEG, PNG (Max 2MB)</span>
                      </label>
                    </div>
                  </div>
                  
                  {(imagePreview || (webInfo?.imageUrl && !selectedImage)) && (
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={imagePreview || webInfo.imageUrl} 
                          alt="Preview" 
                          className="w-full h-auto max-h-48 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400';
                          }}
                        />
                        <div className="p-2 text-center text-sm text-gray-600">
                          {selectedImage ? 'Gambar Baru' : 'Gambar Saat Ini'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  if (webInfo) {
                    reset(webInfo);
                    setImagePreview(webInfo.imageUrl);
                    setSelectedImage(null);
                  }
                }}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                className={`px-6 py-2.5 rounded-lg text-white transition flex items-center ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" /> 
                    {webInfo ? 'Perbarui Informasi' : 'Simpan Informasi'}
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default WebInfoAdmin;