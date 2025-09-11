// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-2xl font-semibold text-gray-300 mb-6">Page Not Found</p>
      <p className="text-lg text-gray-400 text-center mb-8">
        The page you're looking for does not exist or an unexpected error occurred.
      </p>
      <Link
        to="/dashboard"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-colors duration-200"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
