// src/pages/NotificationsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { CustomScrollbarStyles } from '../components/CustomScrollbarStyles';
import { getNotificationsApi, markNotificationReadApi, markAllNotificationsReadApi } from '../apiService'; // WHAT CHANGED: Imported API functions
import { AlertTriangle, Info, CheckCircle } from 'lucide-react'; // WHAT CHANGED: Imported icons for notification types

// Helper component for a single notification item
const NotificationItem = ({ notification, onMarkAsRead }) => {
  let IconComponent = Info; // Default icon
  let iconColorClass = 'text-blue-400'; // Default color

  // Determine icon and color based on notification type
  switch (notification.type) {
    case 'warning':
      IconComponent = AlertTriangle;
      iconColorClass = 'text-yellow-400';
      break;
    case 'info':
      IconComponent = Info;
      iconColorClass = 'text-blue-400';
      break;
    case 'success':
      IconComponent = CheckCircle;
      iconColorClass = 'text-green-400';
      break;
    default:
      IconComponent = Info;
      iconColorClass = 'text-gray-400';
  }

  const handleMarkAsRead = async () => {
    try {
      await onMarkAsRead(notification.id);
      toast.success('Notification marked as read!');
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
     // toast.error('Failed to mark notification as read.');
    }
  };

  return (
    
    <div
      className={`flex items-center justify-between p-4 rounded-lg border mb-2 last:mb-0
        ${notification.is_read ? 'bg-gray-800 border-gray-700 opacity-70' : 'bg-gray-700 border-gray-600'}
      `}
    >
      <div className="flex items-center flex-1">
        <IconComponent className={`w-5 h-5 mr-3 flex-shrink-0 ${iconColorClass}`} /> {/* Icon */}
        <div>
          <p className={`text-sm font-medium ${notification.is_read ? 'text-gray-400' : 'text-gray-100'}`}>
            {notification.message}
          </p>
          <p className={`text-xs ${notification.is_read ? 'text-gray-500' : 'text-gray-400'}`}>
            {notification.timestamp ? new Date(notification.timestamp).toLocaleString() : 'N/A'} {/* Format timestamp */}
          </p>
        </div>
      </div>
      {!notification.is_read && (
        <button
          onClick={handleMarkAsRead}
          className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md flex-shrink-0"
        >
          Mark as Read
        </button>
      )}
    </div>
  );
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialFetchCompleted = useRef(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotificationsApi();
      setNotifications(data);
      if (!initialFetchCompleted.current) {
        toast.success('Notifications loaded!');
        initialFetchCompleted.current = true;
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast.error(`Failed to load notifications: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsReadInList = async (id) => {
    // Optimistically update UI
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    await markNotificationReadApi(id); // Call API to mark as read
  };

  const handleMarkAllAsRead = async () => {
    if (window.confirm('Are you sure you want to mark all notifications as read?')) {
      try {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true }))); // Optimistic update
        await markAllNotificationsReadApi();
        toast.success('All notifications marked as read!');
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
       // toast.error('Failed to mark all notifications as read.');
      }
    }
  };

  return (
    <div className="flex-1 p-6 bg-[#070b13] min-h-screen text-gray-100 font-sans">
      <CustomScrollbarStyles />
      <div className="bg-[#141824] p-6 rounded-lg shadow-xl border border-gray-800">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-50">Organizations Management System</h1> {/* WHAT CHANGED: Title from image */}
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Mark All as Read
          </button>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3"> {/* Added spacing between notification items */}
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsReadInList}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">No notifications found.</div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
