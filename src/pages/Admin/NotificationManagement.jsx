// src/pages/Admin/NotificationManagement.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import Sidebar from '../../components/Admin/Sidebar';
// import MobileSidebarToggle from '../../components/Admin/MobileSidebarToggle';
import { toast } from 'react-toastify';
import { FiSend, FiUsers, FiMail, FiInfo, FiCheck, FiLoader } from 'react-icons/fi';

const NotificationManagement = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        toast.error('Gagal memuat daftar user');
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, []);

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
    setSelectAll(!selectAll);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        user_ids: selectedUsers.length > 0 ? selectedUsers : undefined
      };

      await api.post('/admin/send-notification', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Notifikasi berhasil dikirim!');
      reset();
      setSelectedUsers([]);
      setSelectAll(false);
    } catch (error) {
      toast.error('Gagal mengirim notifikasi');
      console.error('Error sending notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar onLogout={onLogout} />
      
      {/* Mobile Sidebar Toggle */}
      {/* <MobileSidebarToggle onLogout={onLogout} /> */}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-72">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Notification Management</h1>
              <p className="text-gray-600 mt-2">Kirim notifikasi email ke user secara efisien</p>
            </div>
            
            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form Card */}
              <div className="lg:col-span-2 space-y-6">
                {/* Notification Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <div className="flex items-center space-x-3">
                      <FiMail className="w-6 h-6" />
                      <h2 className="text-xl font-semibold">Buat Notifikasi Baru</h2>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      {/* Subject Field */}
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id="subject"
                            type="text"
                            {...register('subject', { required: 'Subject harus diisi' })}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.subject ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} focus:ring-2 focus:ring-opacity-50 transition`}
                            placeholder="Masukkan subject email"
                          />
                          {errors.subject && (
                            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Message Field */}
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Pesan <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <textarea
                            id="message"
                            rows={6}
                            {...register('message', { required: 'Pesan harus diisi' })}
                            className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} focus:ring-2 focus:ring-opacity-50 transition`}
                            placeholder="Tulis pesan notifikasi..."
                          ></textarea>
                          {errors.message && (
                            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Recipients Selection */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            <FiUsers className="mr-2" /> Pilih Penerima
                          </h3>
                          <div className="flex items-center">
                            <input
                              id="select-all"
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleSelectAll}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
                              Pilih Semua
                            </label>
                          </div>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="mb-3">
                          <input
                            type="text"
                            placeholder="Cari user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        
                        {/* Users List */}
                        <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto shadow-inner">
                          {users.length === 0 ? (
                            <div className="text-center py-6">
                              <div className="animate-pulse flex flex-col items-center">
                                <FiLoader className="w-8 h-8 text-gray-400 mb-2 animate-spin" />
                                <p className="text-gray-500">Memuat daftar user...</p>
                              </div>
                            </div>
                          ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-6">
                              <FiInfo className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500">Tidak ada user yang cocok</p>
                            </div>
                          ) : (
                            <ul className="divide-y divide-gray-200">
                              {filteredUsers.map(user => (
                                <li key={user.id} className="py-3">
                                  <div className="flex items-center">
                                    <input
                                      id={`user-${user.id}`}
                                      type="checkbox"
                                      checked={selectedUsers.includes(user.id)}
                                      onChange={() => handleSelectUser(user.id)}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={`user-${user.id}`} className="ml-3 flex-1 cursor-pointer">
                                      <div className="flex items-center justify-between">
                                        <span className="block text-sm font-medium text-gray-700">{user.name}</span>
                                        {selectedUsers.includes(user.id) && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Dipilih
                                          </span>
                                        )}
                                      </div>
                                      <span className="block text-xs text-gray-500 truncate">{user.email}</span>
                                    </label>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      
                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isLoading ? (
                            <>
                              <FiLoader className="animate-spin mr-2" />
                              Mengirim...
                            </>
                          ) : (
                            <>
                              <FiSend className="mr-2" />
                              Kirim Notifikasi
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              
              {/* Sidebar Cards */}
              <div className="space-y-6">
                {/* Stats Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <h3 className="text-lg font-semibold">Statistik Pengiriman</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total User</span>
                        <span className="font-medium">{users.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Dipilih</span>
                        <span className="font-medium">
                          {selectedUsers.length === 0 ? 'Semua User' : `${selectedUsers.length} User`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiCheck className="mr-1" /> Siap Kirim
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Guide Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <h3 className="text-lg font-semibold flex items-center">
                      <FiInfo className="mr-2" /> Panduan Pengiriman
                    </h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                          <FiCheck />
                        </div>
                        <span className="ml-2 text-sm text-gray-700">Isikan subject dan pesan yang jelas</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                          <FiCheck />
                        </div>
                        <span className="ml-2 text-sm text-gray-700">Pilih user tertentu atau biarkan kosong untuk broadcast</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                          <FiCheck />
                        </div>
                        <span className="ml-2 text-sm text-gray-700">Gunakan fitur pencarian untuk menemukan user cepat</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                          <FiCheck />
                        </div>
                        <span className="ml-2 text-sm text-gray-700">Notifikasi dikirim via email menggunakan SMTP</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                          <FiCheck />
                        </div>
                        <span className="ml-2 text-sm text-gray-700">Pengiriman banyak email mungkin membutuhkan waktu</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Quick Tips */}
                <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Tips Cepat</h4>
                  <p className="text-xs text-blue-700">
                    Gunakan template untuk pesan yang sering dikirim. Simpan template di catatan Anda untuk efisiensi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationManagement;