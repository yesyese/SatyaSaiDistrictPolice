// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  fullScreen = false, 
  variant = 'default' 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-[#070b13] bg-opacity-90 flex items-center justify-center z-50'
    : 'flex items-center justify-center py-8';

  const SpinnerIcon = () => (
    <div className="relative">
      {/* Outer ring */}
      <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-700 animate-pulse`}></div>
      {/* Spinning ring */}
      <div className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400 animate-spin`}></div>
      {/* Inner dot */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full animate-ping`}></div>
    </div>
  );

  const PulseSpinner = () => (
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );

  const TableSpinner = () => (
    <div className="flex items-center justify-center space-x-3">
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
      <div className="text-gray-400">{message}</div>
      <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
    </div>
  );

  const PoliceLogoSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Police Logo with ease-in-out animation */}
      <div className="relative">
        <div 
          className="w-24 h-24 flex items-center justify-center animate-bounce"
          style={{
            animation: 'logoEaseInOut 2s ease-in-out infinite',
          }}
        >
          {/* Police Badge/Logo SVG */}
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full text-yellow-400 drop-shadow-lg"
            fill="currentColor"
          >
            {/* Badge outline */}
            <path d="M50 5 L65 20 L85 15 L80 35 L95 50 L80 65 L85 85 L65 80 L50 95 L35 80 L15 85 L20 65 L5 50 L20 35 L15 15 L35 20 Z" 
                  fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
            {/* Inner circle */}
            <circle cx="50" cy="50" r="25" fill="#1E40AF" stroke="#FFD700" strokeWidth="2"/>
            {/* Police text/symbol */}
            <text x="50" y="55" textAnchor="middle" fontSize="12" fill="#FFD700" fontWeight="bold">
              POLICE
            </text>
          </svg>
        </div>
        
        {/* Animated rings around logo */}
        <div className="absolute inset-0 rounded-full border-2 border-yellow-400 opacity-30 animate-ping"></div>
        <div 
          className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-20 animate-ping"
          style={{ animationDelay: '0.5s' }}
        ></div>
      </div>
      
      {/* Loading text with fade animation */}
      <div className="text-center">
        <div className="text-gray-300 text-lg font-semibold animate-pulse">
          {message}
        </div>
        <div className="flex justify-center space-x-1 mt-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  const renderSpinner = () => {
    switch (variant) {
      case 'pulse':
        return <PulseSpinner />;
      case 'table':
        return <TableSpinner />;
      case 'police':
        return <PoliceLogoSpinner />;
      default:
        return <SpinnerIcon />;
    }
  };

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4">
        {renderSpinner()}
        {variant !== 'table' && (
          <div className="text-gray-300 text-sm font-medium animate-pulse">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

// Table-specific loading row component
export const LoadingTableRow = ({ colSpan, message = 'Loading...' }) => (
  <tr className="text-center">
    <td colSpan={colSpan} className="py-8 text-gray-400">
      <LoadingSpinner variant="table" message={message} />
    </td>
  </tr>
);

// Full page loading component
export const FullPageLoading = ({ message = 'Loading page...' }) => (
  <LoadingSpinner 
    size="large" 
    message={message} 
    fullScreen={true} 
  />
);

// Police-themed full page loading component
export const PoliceFullPageLoading = ({ message = 'Loading...' }) => (
  <div className="fixed inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] flex items-center justify-center z-50">
    <style jsx>{`
      @keyframes logoEaseInOut {
        0%, 100% { 
          transform: scale(1) rotate(0deg);
          opacity: 0.8;
        }
        25% { 
          transform: scale(1.1) rotate(2deg);
          opacity: 1;
        }
        50% { 
          transform: scale(1.2) rotate(0deg);
          opacity: 1;
        }
        75% { 
          transform: scale(1.1) rotate(-2deg);
          opacity: 1;
        }
      }
      
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .logo-container {
        animation: logoEaseInOut 3s ease-in-out infinite;
      }
      
      .fade-in-up {
        animation: fadeInUp 1s ease-out forwards;
      }
    `}</style>
    
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Police Logo with custom ease-in-out animation */}
      <div className="relative logo-container">
        <div className="w-32 h-32 flex items-center justify-center">
          {/* Police Badge/Logo SVG */}
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full drop-shadow-2xl"
            fill="currentColor"
          >
            {/* Badge outline */}
            <path d="M50 5 L65 20 L85 15 L80 35 L95 50 L80 65 L85 85 L65 80 L50 95 L35 80 L15 85 L20 65 L5 50 L20 35 L15 15 L35 20 Z" 
                  fill="#FFD700" stroke="#B8860B" strokeWidth="2"/>
            {/* Inner circle */}
            <circle cx="50" cy="50" r="25" fill="#1E40AF" stroke="#FFD700" strokeWidth="2"/>
            {/* Police text */}
            <text x="50" y="55" textAnchor="middle" fontSize="12" fill="#FFD700" fontWeight="bold">
              POLICE
            </text>
          </svg>
        </div>
        
        {/* Animated rings around logo */}
        <div className="absolute inset-0 rounded-full border-2 border-yellow-400 opacity-20 animate-ping"></div>
        <div 
          className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-15 animate-ping"
          style={{ animationDelay: '1s' }}
        ></div>
        <div 
          className="absolute inset-0 rounded-full border-2 border-yellow-300 opacity-10 animate-ping"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>
      
      {/* Loading text with fade animation */}
      <div className="text-center fade-in-up">
        <div className="text-gray-100 text-xl font-semibold mb-4">
          {message}
        </div>
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  </div>
);

// Card loading component
export const CardLoading = ({ message = 'Loading data...' }) => (
  <div className="bg-[#141824] p-8 rounded-lg shadow-xl border border-gray-800">
    <LoadingSpinner size="medium" message={message} />
  </div>
);

export default LoadingSpinner;
