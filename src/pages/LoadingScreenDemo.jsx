// src/pages/LoadingScreenDemo.jsx
import React, { useState } from 'react';
import LoadingSpinner, { PoliceFullPageLoading } from '../components/LoadingSpinner';

const LoadingScreenDemo = () => {
  const [showPoliceLoading, setShowPoliceLoading] = useState(false);
  const [showVariantDemo, setShowVariantDemo] = useState(false);

  const handleShowPoliceLoading = () => {
    setShowPoliceLoading(true);
    // Auto-hide after 5 seconds for demo
    setTimeout(() => setShowPoliceLoading(false), 5000);
  };

  const handleShowVariantDemo = () => {
    setShowVariantDemo(true);
    // Auto-hide after 5 seconds for demo
    setTimeout(() => setShowVariantDemo(false), 5000);
  };

  if (showPoliceLoading) {
    return <PoliceFullPageLoading message="Loading Police System..." />;
  }

  if (showVariantDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] flex items-center justify-center">
        <LoadingSpinner variant="police" size="large" message="Loading with Police Badge..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-8 text-center">
          Police Loading Screen Demo
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Full Page Police Loading */}
          <div className="bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Full Page Police Loading
            </h2>
            <p className="text-gray-300 mb-6">
              A beautiful full-screen loading experience with the police badge logo, 
              smooth ease-in-out animations, and animated rings.
            </p>
            <button
              onClick={handleShowPoliceLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200"
            >
              Show Full Page Loading
            </button>
          </div>

          {/* Police Variant Loading */}
          <div className="bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Police Badge Variant
            </h2>
            <p className="text-gray-300 mb-6">
              A compact police badge loading spinner that can be used within 
              components and modals with the same beautiful animations.
            </p>
            <button
              onClick={handleShowVariantDemo}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200"
            >
              Show Badge Variant
            </button>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-12 bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Loading Screen Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-yellow-400 mb-2">
                🎨 Visual Features
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Custom police badge SVG logo</li>
                <li>• Golden yellow and blue color scheme</li>
                <li>• Gradient background</li>
                <li>• Drop shadows and visual depth</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-400 mb-2">
                ⚡ Animation Features
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Smooth ease-in-out logo animation</li>
                <li>• Animated pulsing rings</li>
                <li>• Bouncing dots indicator</li>
                <li>• Fade-in text animation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-8 bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Usage Examples
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-md">
              <h4 className="text-yellow-400 font-medium mb-2">Full Page Loading:</h4>
              <code className="text-green-400 text-sm">
                {`<PoliceFullPageLoading message="Loading dashboard..." />`}
              </code>
            </div>
            <div className="bg-gray-800 p-4 rounded-md">
              <h4 className="text-yellow-400 font-medium mb-2">Component Loading:</h4>
              <code className="text-green-400 text-sm">
                {`<LoadingSpinner variant="police" message="Loading data..." />`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreenDemo;
