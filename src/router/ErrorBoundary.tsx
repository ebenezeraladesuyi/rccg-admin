// src/components/ErrorBoundary.tsx
import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';

interface RouteError {
  status?: number;
  statusText?: string;
  message?: string;
  data?: string;
}

const ErrorBoundary: React.FC = () => {
  const error = useRouteError() as RouteError;
  const navigate = useNavigate();

  const getErrorMessage = () => {
    if (error?.status === 404) {
      return {
        title: 'Page Not Found',
        message: 'The page you are looking for does not exist or has been moved.',
        icon: '🔍'
      };
    }
    if (error?.status === 500) {
      return {
        title: 'Server Error',
        message: 'Something went wrong on our server. Please try again later.',
        icon: '⚠️'
      };
    }
    return {
      title: 'Application Error',
      message: error?.message || 'An unexpected error occurred. Please try again.',
      icon: '💥'
    };
  };

  const { title, message, icon } = getErrorMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Error Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-white/20 rounded-full mb-4">
              <FaExclamationTriangle className="text-white text-4xl" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {icon} {title}
            </h1>
          </div>

          {/* Error Content */}
          <div className="p-8 text-center">
            <p className="text-gray-600 mb-6">{message}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#28166f] to-[#3a2a8a] text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <FaHome />
                Go to Login
              </button>
              
              <button
                onClick={() => navigate(-1)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                <FaArrowLeft />
                Go Back
              </button>
            </div>

            {/* Error Details (only in development) */}
            {import.meta.env.DEV && error?.message && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                <p className="text-sm font-mono text-gray-600">
                  <strong>Error Details:</strong><br />
                  {error.message}
                  {error?.status && <><br /><strong>Status:</strong> {error.status}</>}
                  {error?.statusText && <><br /><strong>Status Text:</strong> {error.statusText}</>}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;