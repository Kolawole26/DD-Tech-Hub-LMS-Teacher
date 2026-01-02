'use client';

import { useState } from 'react';
import { Bell, Check, X, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';

export default function SimpleNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Assignment Submitted',
      message: 'John Student submitted Assignment 2',
      time: '10 min ago',
      read: false,
      type: 'success'
    },
    {
      id: 2,
      title: 'Class Starting Soon',
      message: 'Web Development class starts in 30 minutes',
      time: '1 hour ago',
      read: false,
      type: 'info'
    },
    {
      id: 3,
      title: 'Grades Published',
      message: 'Quiz 3 grades are now available',
      time: '3 hours ago',
      read: true,
      type: 'success'
    },
    {
      id: 4,
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Sunday night',
      time: '1 day ago',
      read: true,
      type: 'warning'
    }
  ]);

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Delete a notification
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Get icon based on type
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with important alerts</p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-lighter rounded-lg">
              <Bell className="text-primary-dark" size={24} />
            </div>
            <div>
              <div className="text-sm text-gray-600">Unread Notifications</div>
              <div className="text-2xl font-bold">{unreadCount}</div>
            </div>
          </div>
          
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              unreadCount === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-dark hover:bg-primary-light hover:text-primary-dark text-white'
            }`}
          >
            <Check size={16} />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-primary-lighter' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-semibold ${
                          notification.read ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                      </div>
                      
                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary-dark rounded-full ml-2 flex-shrink-0"></div>
                      )}
                    </div>
                    
                    {/* Time and Actions */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        <span>{notification.time}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm text-primary-dark px-3 py-1 hover:bg-primary-lighter rounded"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{notifications.length} total notifications</span>
              <button
                onClick={() => setNotifications([])}
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Simple Add Notification (Optional) */}
      {/* <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Test Notification</h2>
        <button
          onClick={() => {
            const newId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1;
            setNotifications(prev => [
              {
                id: newId,
                title: 'New Notification',
                message: 'This is a test notification',
                time: 'Just now',
                read: false,
                type: 'info'
              },
              ...prev
            ]);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Test Notification
        </button>
      </div> */}
    </div>
  );
}