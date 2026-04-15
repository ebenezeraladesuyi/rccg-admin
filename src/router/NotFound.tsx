// src/pages/NotFound.tsx
// import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaQuestionCircle } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* 404 Header */}
          <div className="bg-gradient-to-r from-[#28166f] to-[#3a2a8a] p-8 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-white/20 rounded-full mb-4">
              <FaQuestionCircle className="text-white text-5xl" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-2">404</h1>
            <p className="text-gray-200">Page Not Found</p>
          </div>

          {/* 404 Content */}
          <div className="p-8 text-center">
            <p className="text-gray-600 mb-6">
              Oops! The page you are looking for doesn't exist or has been moved.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#28166f] to-[#3a2a8a] text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <FaHome />
                Go to Dashboard
              </button>
              
              <button
                onClick={() => navigate(-1)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                <FaArrowLeft />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;