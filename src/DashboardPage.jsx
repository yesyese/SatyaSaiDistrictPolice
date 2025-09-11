// src/DashboardPage.js
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom'; // WHAT CHANGED: useLocation is imported here
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserIcon } from '@heroicons/react/24/outline'; // or solid
import UserProfileModal from './components/UserProfileModal'; // WHAT CHANGED: Import UserProfileModal
import { getNotificationsApi } from './apiService'; // update the path based on your project


import { CustomScrollbarStyles } from './components/CustomScrollbarStyles';


// WHAT CHANGED: Removed all chart-related imports from here.
// They now belong exclusively in DashboardOverviewPage.jsx.

import {
  Home,
  BarChart2,
  Users,
  Briefcase,
  Bell,
  MessageSquare, // Keep if used in Header, otherwise remove
  Search,        // Keep if used in Header, otherwise remove
  ChevronDown,
  Settings,
  Shield,
  HelpCircle,
  Clock,
  UserCheck,
  Building,
  AlertTriangle, // Used in DashboardOverviewPage, so remove from here.
  LineChart,     // Used in DashboardOverviewPage, so remove from here.
  Layers,
  MessageSquareText,
  Clipboard,     // Used in DashboardOverviewPage, so remove from here.
  EyeOff,        // WHAT CHANGED: Keep EyeOff here as it's used in Sidebar, and it comes from lucide-react.
} from 'lucide-react';

import { LogOut } from 'lucide-react';

// DashboardPage component - this is the main component rendered after login
function DashboardPage({ user, onLogout }) {
  const defaultUser = { username: 'Guest', role: 'Viewer' };
  const currentUser = user || defaultUser;
  const handleLogout = onLogout || (() => console.log("Logout function not provided"));
  useEffect(() => {
    const shouldWelcome = sessionStorage.getItem('showWelcomeToast');
    if (shouldWelcome && user?.username) {
      toast.success(`Welcome back, ${user.username}!`);
      sessionStorage.removeItem('showWelcomeToast');
    }
  }, []);
  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-inter">
      <Sidebar user={currentUser} onLogout={handleLogout} />

      <div className="flex flex-col flex-1 overflow-hidden min-h-0"> {/* WHAT CHANGED: Changed overflow-hidden to overflow-y-auto to allow vertical scrolling */}
        <Header user={currentUser} onLogout={handleLogout} />
        <Outlet /> {/* This is where nested routes like DashboardOverviewPage will render */}
      </div>
    </div>
  );
}


// WHAT CHANGED: Converted PageName into a custom React Hook
const usePageName = () => {
  const location = useLocation(); // Call useLocation hook
  const path = location.pathname;

  if (path.includes('dashboard')) return 'Dashboard'; // Handle dashboard specifically
  if (path.includes('unregistered-arrivals')) return 'Unregistered Arrivals';
  if (path.includes('registered-arrivals')) return 'Registered Arrivals';
  if (path.includes('overstays')) return 'Overstays';
  if (path.includes('refugees')) return 'Refugees';
  if (path.includes('citizenship-requests')) return 'Citizenship Requests';
  if (path.includes('out-of-view-cases')) return 'Out of View Cases';
  if (path.includes('grievance-handling')) return 'Grievance Handling';
  if (path.includes('users')) return 'User Management'; // Added for User Management
  if (path.includes('notifications')) return 'Notifications'; // Added for Notifications
  if (path.includes('settings')) return 'Settings'; // Added for Settings
  if (path.includes('security')) return 'Security';
  // Added for Security
  if (path.includes('organizations')) return 'Police Stations';
  if (path.includes('help')) return 'Help'; // Added for Help
  // Add other pages as needed
  return 'Dashboard'; // Default if no match
};

// Sidebar Component
const Sidebar = ({ user, onLogout }) => {
  const location = useLocation(); // WHAT CHANGED: useLocation is correctly called here

  const navItems = [
    { section: 'OVERVIEW', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Analytics', icon: BarChart2, path: '/ai-analytics' },
  ];

  const coreModules = [
    { section: 'CORE MODULES', label: 'Registered Arrivals', icon: Users, path: '/registered-arrivals' },
    { label: 'Unregistered Arrivals', icon: UserCheck, path: '/unregistered-arrivals' },
    { label: 'Overstays', icon: Clock, path: '/overstays' },
    { label: 'Refugees', icon: Layers, path: '/refugees' },
    { label: 'Citizenship Requests', icon: Briefcase, path: '/citizenship-requests' },
    { label: 'Out of View Cases', icon: EyeOff, path: '/out-of-view-cases' },
    { label: 'Grievance Handling', icon: MessageSquareText, path: '/grievance-handling' },
  ];

  const administration = [
    { section: 'ADMINISTRATION', label: 'Users', icon: Users, path: '/users' },
     { label: 'Police Stations', icon: Building, path: '/organizations' },
  ];

  const system = [
    { section: 'SYSTEM', label: 'Notifications', icon: Bell, path: '/notifications' },
    // { label: 'Settings', icon: Settings, path: '/settings' },
    { label: 'Help', icon: HelpCircle, path: '/help' },
  ];

  const systemSuperAdmin = [
    { label: 'Security', icon: Shield, path: '/security' },
  ];

  const NavSection = ({ title, items, location }) => ( // WHAT CHANGED: location prop is received
    <div className="mb-6">
      <h3 className="text-xs font-semibold uppercase text-gray-500 mb-3 ml-4">{title}</h3>
      <nav>
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center py-2 px-4 rounded-lg mx-2 transition-colors duration-200
              ${location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-800 text-gray-300'}
            `}
          >
            <item.icon className={`w-5 h-5 mr-3 ${location.pathname === item.path ? 'text-white' : 'text-gray-400'}`} />
            <span className={`text-sm ${location.pathname === item.path ? 'font-semibold' : ''}`}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      <CustomScrollbarStyles />
      <div className="w-64 bg-gray-900 shadow-xl flex flex-col p-4 overflow-y-auto custom-scrollbar">
        <div className="flex items-center mb-8 px-2">
          <div className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-lg mr-2">
            <img src="./police.png" alt="police logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-lg font-bold">SP Admin</span>
        </div>

        <NavSection title="OVERVIEW" items={navItems} location={location} />
        <NavSection title="CORE MODULES" items={coreModules} location={location} />
        {user && user.role === 'SuperAdmin' && (
          <NavSection title="ADMINISTRATION" items={administration} location={location} />
        )}
        <NavSection title="SYSTEM" items={system} location={location} />
        {user && user.role === 'SuperAdmin' && (
          <NavSection title="" items={systemSuperAdmin} location={location} />
        )}

        <div className="mt-auto px-4 py-4 border-t border-gray-800">
          {user && (
            <div className="text-gray-400 text-sm mb-2">
              Logged in as: <span className="font-semibold text-gray-300">{user.username}</span> ({user.role})
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

// Header Component
// Header Component
const Header = ({ user, onLogout }) => {
  const currentPageName = usePageName();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotificationsApi();
        setNotifications(data);
        const unread = data.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleViewProfile = () => {
    setIsDropdownOpen(false);
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-900 shadow-md border-b border-gray-800">
      <h1 className="text-xl font-semibold text-gray-50">{currentPageName}</h1>

      <div className="flex items-center space-x-4">
        {/* Notification Bell with Red Dot */}
        <div className="relative">
          <Bell
            className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white"
            onClick={() => navigate('/notifications')}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] text-[10.5px] px-1 rounded-full bg-red-700 text-white flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative user-dropdown-area cursor-pointer">
          <div
            onClick={toggleDropdown}
            className="user-dropdown-area flex items-center justify-between w-35 transition-colors duration-200 relative"
          >
            <div className="flex items-center space-x-3">
              <img
                src="https://placehold.co/32x32/ffffff/000000?text=V"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">
                  {user?.username || 'User'}
                </span>
                <span className="text-xs text-gray-400">
                  {user?.role || 'Role'}
                </span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 mr-1" />
          </div>

          {isDropdownOpen && (
            <div className="absolute -right-2 mt-4 w-45 bg-gray-800 rounded-md shadow-lg p-4 z-20 border border-gray-700">
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleViewProfile}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 bg-gray-900 hover:bg-blue-700 rounded-lg hover:text-white transition-colors duration-200"
                >
                  <UserIcon className="w-4 h-4 mr-2" /> View Profile
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 bg-gray-900 hover:bg-red-700 rounded-lg hover:text-white transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showProfileModal && (
        <UserProfileModal
          user={user}
          onClose={handleCloseProfileModal}
          onProfileUpdated={handleCloseProfileModal}
        />
      )}
    </header>
  );
};

// Custom scrollbar styling (no changes, remains here)


export default DashboardPage;

