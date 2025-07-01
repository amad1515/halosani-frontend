// src/pages/Admin/PsychologistCMS.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Sidebar from '../../components/Admin/Sidebar';
import { FiEdit, FiTrash2, FiUser, FiMail, FiPhone, FiMapPin, FiBook, FiBriefcase } from 'react-icons/fi';

const PsychologistCMS = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [editingPsychologist, setEditingPsychologist] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    description: '',
    education: '',
    experience_years: '',
    hospital_affiliation: '',
    contact_email: '',
    contact_phone: '',
    languages: [],
    treatment_approaches: [],
    image: null,
    currentImage: '',
    is_verified: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tempLanguage, setTempLanguage] = useState('');
  const [tempApproach, setTempApproach] = useState('');
  const navigate = useNavigate();

  const fetchPsychologists = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/psychologists');
      const psychologistsData = res.data.data ? res.data.data : res.data;
      setPsychologists(psychologistsData);
    } catch (error) {
      console.error('Gagal mengambil data psikolog:', error);
      setError('Gagal memuat data psikolog. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPsychologists();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
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

  const addLanguage = () => {
    if (tempLanguage.trim() && !formData.languages.includes(tempLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, tempLanguage.trim()]
      }));
      setTempLanguage('');
    }
  };

  const removeLanguage = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const addApproach = () => {
    if (tempApproach.trim() && !formData.treatment_approaches.includes(tempApproach.trim())) {
      setFormData(prev => ({
        ...prev,
        treatment_approaches: [...prev.treatment_approaches, tempApproach.trim()]
      }));
      setTempApproach('');
    }
  };

  const removeApproach = (approach) => {
    setFormData(prev => ({
      ...prev,
      treatment_approaches: prev.treatment_approaches.filter(a => a !== approach)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    
    data.append('name', formData.name);
    data.append('specialization', formData.specialization);
    data.append('description', formData.description);
    data.append('education', formData.education);
    data.append('experience_years', Number(formData.experience_years));
    data.append('hospital_affiliation', formData.hospital_affiliation || '');
    data.append('contact_email', formData.contact_email);
    data.append('contact_phone', formData.contact_phone);
    data.append('is_verified', formData.is_verified ? '1' : '0');

    formData.languages.forEach(lang => data.append('languages[]', lang));
    formData.treatment_approaches.forEach(approach => data.append('treatment_approaches[]', approach));

    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      };

      if (editingPsychologist) {
        data.append('_method', 'PUT');
        await api.post(`/admin/psychologists/${editingPsychologist.id}`, data, config);
      } else {
        await api.post('/admin/psychologists', data, config);
      }
      
      resetForm();
      await fetchPsychologists();
    } catch (error) {
      console.error('Gagal menyimpan psikolog:', error);
      
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0][0];
        setError(firstError || 'Terjadi kesalahan validasi');
      } else {
        setError(error.response?.data?.message || 'Gagal menyimpan psikolog. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (psychologist) => {
    setEditingPsychologist(psychologist);
    setFormData({
      name: psychologist.name,
      specialization: psychologist.specialization,
      description: psychologist.description,
      education: psychologist.education,
      experience_years: psychologist.experience_years,
      hospital_affiliation: psychologist.hospital_affiliation || '',
      contact_email: psychologist.contact_email,
      contact_phone: psychologist.contact_phone,
      languages: psychologist.languages || [],
      treatment_approaches: psychologist.treatment_approaches || [],
      image: null,
      currentImage: psychologist.image 
        ? `http://localhost:8000/storage/${psychologist.image}`
        : '',
      is_verified: psychologist.is_verified
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus psikolog ini?')) return;
    
    setLoading(true);
    try {
      await api.delete(`/admin/psychologists/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      await fetchPsychologists();
    } catch (error) {
      console.error('Gagal menghapus psikolog:', error);
      setError('Gagal menghapus psikolog. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      description: '',
      education: '',
      experience_years: '',
      hospital_affiliation: '',
      contact_email: '',
      contact_phone: '',
      languages: [],
      treatment_approaches: [],
      image: null,
      currentImage: '',
      is_verified: false
    });
    setEditingPsychologist(null);
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

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar onLogout={handleLogout} />
      
      <div className="flex-1 md:ml-72 p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {editingPsychologist ? 'Edit Psikolog' : 'Tambah Psikolog Baru'}
          </h1>
          <button 
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition duration-200"
          >
            Kembali ke Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informasi Dasar */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Dasar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Dr. John Doe"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spesialisasi*</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Psikologi Klinis"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Deskripsi profesional lengkap"
                required
                disabled={loading}
              />
            </div>

            {/* Pendidikan & Pengalaman */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pendidikan*</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="S2 Psikologi, Universitas Indonesia"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Pengalaman*</label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="10"
                required
                disabled={loading}
              />
            </div>

            {/* Afiliasi Rumah Sakit */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Afiliasi Rumah Sakit</label>
              <input
                type="text"
                name="hospital_affiliation"
                value={formData.hospital_affiliation}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rumah Sakit Umum Pusat Nasional"
                disabled={loading}
              />
            </div>

            {/* Informasi Kontak */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Kontak</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="dokter@example.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telepon*</label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+62 812 3456 7890"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Bahasa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bahasa yang Dikuasai</label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={tempLanguage}
                  onChange={(e) => setTempLanguage(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tambahkan bahasa"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={addLanguage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                  disabled={loading}
                >
                  Tambah
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.languages.map(language => (
                  <div key={language} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {language}
                    <button
                      type="button"
                      onClick={() => removeLanguage(language)}
                      className="ml-2 text-blue-600 hover:text-blue-900"
                      disabled={loading}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pendekatan Terapi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pendekatan Terapi</label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={tempApproach}
                  onChange={(e) => setTempApproach(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tambahkan pendekatan"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={addApproach}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                  disabled={loading}
                >
                  Tambah
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.treatment_approaches.map(approach => (
                  <div key={approach} className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {approach}
                    <button
                      type="button"
                      onClick={() => removeApproach(approach)}
                      className="ml-2 text-green-600 hover:text-green-900"
                      disabled={loading}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Verifikasi */}
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_verified"
                  name="is_verified"
                  checked={formData.is_verified}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="is_verified" className="ml-2 block text-sm text-gray-700">
                  Profesional Terverifikasi
                </label>
              </div>
            </div>

            {/* Unggah Foto */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {editingPsychologist ? 'Perbarui Foto Profil' : 'Unggah Foto Profil'}
              </label>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      id="psychologist-image-upload"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/jpeg, image/png, image/jpg"
                    />
                    <label
                      htmlFor="psychologist-image-upload"
                      className="cursor-pointer flex flex-col items-center justify-center p-4"
                    >
                      <FiUser className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Klik untuk mengunggah foto profil</span>
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
                        Foto Saat Ini
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
              disabled={loading}
            >
              Bersihkan Form
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-lg text-white transition flex items-center ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={loading}
            >
              {loading ? (
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
                  {editingPsychologist ? 'Perbarui Psikolog' : 'Tambah Psikolog'}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Daftar Psikolog */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Semua Psikolog</h2>
            <span className="text-sm text-gray-500">
              {psychologists.length} {psychologists.length === 1 ? 'psikolog' : 'psikolog'} ditemukan
            </span>
          </div>
          
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Foto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spesialisasi
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {psychologists.length > 0 ? (
                    psychologists.map(psychologist => (
                      <tr key={psychologist.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                         <img
                            src={psychologist.image 
                                ? `http://localhost:8000/storage/${psychologist.image}`
                                : '/images/default-psychologist.jpg'}
                            alt={psychologist.name}
                            className="h-12 w-12 rounded-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/default-psychologist.jpg';
                            }}
                            />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{psychologist.name}</div>
                          <div className="text-sm text-gray-500">{psychologist.experience_years} tahun pengalaman</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{psychologist.specialization}</div>
                          <div className="text-sm text-gray-500">{psychologist.education}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{psychologist.contact_email}</div>
                          <div className="text-sm text-gray-500">{psychologist.contact_phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            psychologist.is_verified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {psychologist.is_verified ? 'Terverifikasi' : 'Menunggu'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(psychologist)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            disabled={loading}
                          >
                            <FiEdit className="inline mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(psychologist.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={loading}
                          >
                            <FiTrash2 className="inline mr-1" /> Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        Tidak ada psikolog yang ditemukan. Tambahkan psikolog pertama Anda!
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

export default PsychologistCMS;