// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-gray-600">
        Halaman yang Anda cari tidak ada
      </p>
      <Link 
        to="/" 
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;