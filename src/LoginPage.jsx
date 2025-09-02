import React, { useState } from 'react';

const UserIcon = () => (
  <svg className="h-5 w-5 text-[#9ca3af]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const LockIcon = () => (
  <svg className="h-5 w-5 text-[#9ca3af]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

function LoginPage({ onLogin, loading }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      return; // prevent blank submissions
    }

    onLogin(username, password);
  };

  return (
        <div 
      className="min-h-screen flex items-center justify-center px-4 font-['Inter'] text-[#f9fafb]"
      style={{
        backgroundImage: 'url(/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 w-full max-w-md mx-auto">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <img src="/police.png" alt="SP Office Admin Portal Logo" className="mx-auto h-20 w-auto" />
          <h1 className="text-2xl font-bold mt-4">SP Office Admin Portal</h1>
          <p className="text-[#9ca3af] text-sm mt-1">Please sign in to continue</p>
        </div>

        <div className="bg-[#1f2937] p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="text-sm font-medium text-[#9ca3af]">Username</label>
              <div className="mt-2 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon />
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border-0 py-2.5 pl-10 bg-[#374151] text-[#f9fafb] placeholder:text-[#9ca3af] 
             focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e40af] sm:text-sm"                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="text-sm font-medium text-[#9ca3af]">Password</label>
              <div className="mt-2 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockIcon />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-2.5 pl-10 bg-[#374151] text-[#f9fafb] placeholder:text-[#9ca3af] 
             focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e40af] sm:text-sm"                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full justify-center mt-6 rounded-md bg-[#1e40af] px-3 py-2.5 text-sm font-semibold  shadow-sm hover:bg-[#1b3a9a] focus-visible:outline focus-visible:outline-none   focus-visible:outline-offset-2 focus-visible:outline-[#] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}

export default LoginPage;
