import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Sidebar from '../../components/Admin/Sidebars';
// import MobileSidebarToggle from '../../components/Admin/MobileSidebarToggle';
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
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/events');
      // Tambahkan URL lengkap untuk gambar yang sudah ada
      const eventsWithImageUrl = res.data.map(event => ({
        ...event,
        image: event.image ? `http://localhost:8000/storage/${event.image}` : null
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
      // Validasi gambar
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
        // Untuk Laravel, gunakan POST dengan _method=PUT
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
      navigate('/stakholder/event-cms');
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
      currentImage: event.imageUrl || ''
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
      navigate('/stakeholder/login');
    } catch (error) {
      console.error('Logout gagal', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar Desktop */}
      <Sidebar onLogout={handleLogout} />
      
      {/* Toggle Sidebar Mobile */}
      {/* <MobileSidebarToggle onLogout={handleLogout} /> */}

      {/* Konten Utama */}
      <div className="flex-1 md:ml-72 p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {editingEvent ? 'Edit Event' : 'Buat Event Baru'}
          </h1>
          <button 
            onClick={() => navigate('/stakholder/event-cms')} 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition duration-200"
          >
            Kembali ke Daftar Event
          </button>
        </div>

        {/* Pesan Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Form Event */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Field Judul */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Event*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan judul event"
                required
                disabled={isLoading}
              />
            </div>

            {/* Field Tanggal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Event</label>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            {/* Field Deskripsi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan deskripsi event"
                required
                disabled={isLoading}
              />
            </div>

            {/* Field Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link Eksternal</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
                disabled={isLoading}
              />
            </div>

            {/* Unggah Gambar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {editingEvent ? 'Perbarui Gambar' : 'Unggah Gambar*'}
              </label>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      id="event-image-upload"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/jpeg, image/png, image/jpg"
                    />
                    <label
                      htmlFor="event-image-upload"
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
                
                {formData.currentImage && (
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={formData.currentImage} 
                        alt="Preview" 
                        className="w-full h-auto max-h-48 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300';
                        }}
                      />
                      <div className="p-2 text-center text-sm text-gray-600">
                        Gambar Saat Ini
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
              onClick={resetForm}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              disabled={isLoading}
            >
              Bersihkan Form
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
                  Memproses...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  {editingEvent ? 'Perbarui Event' : 'Buat Event'}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Daftar Event */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Semua Event</h2>
            <span className="text-sm text-gray-500">
              {events.length} {events.length === 1 ? 'event' : 'event'} ditemukan
            </span>
          </div>
          
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gambar
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Judul
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Link
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.length > 0 ? (
                    events.map(event => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                        {event.image && (
                            <img
                                src={event.image}
                                alt={event.title}
                                className="h-12 w-16 object-cover rounded"
                                onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80'; // Gambar fallback
                                }}
                            />
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{event.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'Tidak ada'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {event.link ? (
                            <a 
                              href={event.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-900 truncate max-w-xs block"
                            >
                              {event.link}
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">Tidak ada</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(event)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            disabled={isLoading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={isLoading}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        Tidak ada event ditemukan. Buat event pertama Anda!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCMS;