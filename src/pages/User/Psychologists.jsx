// src/pages/User/Psychologists.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiStar, FiClock, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import api from '../../api/axios';

const Psychologists = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [specializations, setSpecializations] = useState(['All']);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/user/psychologists');
        const data = response.data.data || response.data;
        
        setPsychologists(data);
        
        // Extract specializations from psychologists data
        const uniqueSpecs = [...new Set(
  data.map(p => p.specialization).filter(spec => spec)
)];

        setSpecializations(['All', ...uniqueSpecs]);
        
      } catch (error) {
        console.error('Error fetching psychologists:', error);
        setError('Failed to load psychologists. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPsychologists();
  }, []);

  const filteredPsychologists = psychologists.filter(psychologist => {
    const matchesSearch = psychologist.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         psychologist.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'All' || 
                                psychologist.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/default-psychologist.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000/storage/${imagePath}`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white py-20 px-4"
      >
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            Temukan Psikolog Anda
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl opacity-90 max-w-2xl mx-auto"
          >
            Terhubung dengan profesional kesehatan mental yang terverifikasi
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
              placeholder="Cari Berdasarkan Nama Dan Keahlian"
              className="w-full px-5 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex flex-wrap gap-2">
            {specializations.map(spec => (
              <motion.button
                key={spec}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSpecialization(spec)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedSpecialization === spec
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {spec}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Psychologists List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPsychologists.map((psychologist) => (
              <motion.div 
                key={psychologist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={getImageUrl(psychologist.image)}
                      alt={psychologist.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/images/default-psychologist.jpg';
                        e.target.className = 'w-full h-full object-contain bg-gray-100 p-4';
                      }}
                    />
                  </div>
                  {psychologist.is_verified && (
                    <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                      <div className="flex items-center text-yellow-500">
                        <FiStar className="mr-1" />
                        <span className="text-sm font-semibold">Verified</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{psychologist.name}</h2>
                  <p className="text-blue-600 font-medium mb-2">{psychologist.specialization}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <FiClock className="mr-1" />
                    <span>{psychologist.experience_years}+ years experience</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                    {psychologist.description}
                  </p>
                  
                  <div className="mt-auto space-y-2">
                    {psychologist.hospital_affiliation && (
                      <div className="flex items-start text-sm text-gray-600">
                        <FiMapPin className="mt-1 mr-2 flex-shrink-0" />
                        <span>{psychologist.hospital_affiliation}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <FiPhone className="mr-2 flex-shrink-0" />
                      <span>{psychologist.contact_phone}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <FiMail className="mr-2 flex-shrink-0" />
                      <span className="truncate">{psychologist.contact_email}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredPsychologists.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700">No psychologists found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Psychologists;