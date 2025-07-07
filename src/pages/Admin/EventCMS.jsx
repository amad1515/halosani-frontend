import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Sidebar from '../../components/Admin/Sidebar';

const EventCMS = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    link: '',
    image: null,
    currentImage: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/events');
      const baseUrl = process.env.REACT_APP_API_URL || 'https://apihalosani.cloud/';
      const eventsWithImageUrl = res.data.map(event => ({
        ...event,
        image: event.image ? `${baseUrl}/storage/${event.image}` : null
      }));
      setEvents(eventsWithImageUrl);
    } catch (error) {
      console.error('Gagal mengambil data event', error);
      setError('Gagal memuat event. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validFormats.includes(file.type)) {
        setError('Harap unggah gambar yang valid (jpeg, png, jpg)');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Ukuran file tidak boleh melebihi 2MB');
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        image: file,
        currentImage: previewUrl
      }));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Judul dan Deskripsi wajib diisi");
      setIsLoading(false);
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('event_date', formData.event_date);
    data.append('link', formData.link || '');
    
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingEvent) {
        data.append('_method', 'PUT');
        await api.post(`/admin/events/${editingEvent.id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
      } else {
        await api.post('/admin/events', data, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
      }
      
      resetForm();
      await fetchEvents();
      navigate('/admin/event-cms');
    } catch (error) {
      console.error('Gagal menyimpan event:', error);
      setError(error.response?.data?.message || 'Gagal menyimpan event. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date || '',
      link: event.link || '',
      image: null,
      currentImage: event.image || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus event ini?')) return;
    
    setIsLoading(true);
    try {
      await api.delete(`/admin/events/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      await fetchEvents();
    } catch (error) {
      console.error('Gagal menghapus event:', error);
      setError('Gagal menghapus event. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      link: '',
      image: null,
      currentImage: ''
    });
    setEditingEvent(null);
    setError(null);
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:z-0`}>
        <Sidebar onLogout={handleLogout} />
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {editingEvent ? 'Edit Event' : 'Event Management'}
            </h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 lg:p-6 xl:p-8">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {editingEvent ? 'Edit Event' : 'Buat Event Baru'}
              </h1>
              <p className="text-sm text-gray-600">
                {editingEvent ? 'Perbarui informasi event yang sudah ada' : 'Tambahkan event baru ke sistem'}
              </p>
            </div>
            <button 
              onClick={() => navigate('/admin/event-cms')} 
              className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-700 font-medium transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Daftar
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Event Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Title Field */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Event <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Masukkan judul event"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Date Field */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Event
                  </label>
                  <input
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={isLoading}
                  />
                </div>

                {/* Description Field */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Masukkan deskripsi event"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Link Field */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Eksternal
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="https://example.com"
                    disabled={isLoading}
                  />
                </div>

                {/* Image Upload */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {editingEvent ? 'Perbarui Gambar' : 'Unggah Gambar'}
                    {!editingEvent && <span className="text-red-500"> *</span>}
                  </label>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        id="event-image-upload"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/jpeg, image/png, image/jpg"
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="event-image-upload"
                        className="cursor-pointer flex flex-col items-center justify-center"
                      >
                        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Klik untuk mengunggah gambar</span>
                        <span className="text-xs text-gray-500 mt-1">JPEG, PNG, JPG (Maksimal 2MB)</span>
                      </label>
                    </div>
                    
                    {formData.currentImage && (
                      <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={formData.currentImage} 
                          alt="Preview" 
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                          }}
                        />
                        <div className="p-3 text-center">
                          <span className="text-sm text-gray-600 font-medium">Preview Gambar</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Bersihkan Form
                </button>
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-lg text-white font-medium transition-all flex items-center justify-center ${
                    isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {editingEvent ? 'Perbarui Event' : 'Buat Event'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Events List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-4 lg:px-6 lg:py-5 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Daftar Event</h2>
                  <p className="text-sm text-gray-600">
                    Kelola semua event yang telah dibuat
                  </p>
                </div>
                <div className="mt-3 sm:mt-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {events.length} Event
                  </span>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4" />
                <p className="text-gray-500">Memuat data event...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gambar
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Informasi Event
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        Link
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.length > 0 ? (
                      events.map(event => (
                        <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex-shrink-0 h-16 w-20">
                              {event.image ? (
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  className="h-16 w-20 object-cover rounded-lg border border-gray-200"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/80x64?text=No+Image';
                                  }}
                                />
                              ) : (
                                <div className="h-16 w-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="max-w-xs lg:max-w-md">
                              <div className="text-sm font-medium text-gray-900 truncate mb-1">
                                {event.title}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-2">
                                {event.description}
                              </div>
                              <div className="text-xs text-gray-400 mt-2 lg:hidden">
                                {event.event_date ? new Date(event.event_date).toLocaleDateString('id-ID') : 'Tanggal tidak tersedia'}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                            <div className="text-sm text-gray-900">
                              {event.event_date ? new Date(event.event_date).toLocaleDateString('id-ID') : 'Tidak ada'}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden xl:table-cell">
                            <div className="max-w-xs">
                              {event.link ? (
                                <a 
                                  href={event.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 truncate block"
                                >
                                  {event.link}
                                </a>
                              ) : (
                                <span className="text-sm text-gray-500">Tidak ada</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(event)}
                                className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                                disabled={isLoading}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(event.id)}
                                className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                                disabled={isLoading}
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-gray-500 text-lg font-medium mb-2">Belum ada event</p>
                            <p className="text-gray-400 text-sm">Buat event pertama Anda dengan mengisi form di atas</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventCMS;