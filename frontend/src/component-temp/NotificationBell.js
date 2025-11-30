import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationService from '../services/NotificationService';

const NotificationBell = ({ user }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);

  useEffect(() => {
    // Get initial unread count
    updateUnreadCount();
    
    // Listen for new notifications
    const handleNewNotification = () => {
      updateUnreadCount();
    };
    
    window.addEventListener('newNotification', handleNewNotification);
    
    // Set up periodic check for new notifications
    const interval = setInterval(updateUnreadCount, 30000); // Check every 30 seconds
    
    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
      clearInterval(interval);
    };
  }, [user]);

  const updateUnreadCount = () => {
    const count = NotificationService.getUnreadCount(user?.id || '');
    setUnreadCount(count);
    
    // Get recent notifications for dropdown
    const notifications = NotificationService.getNotificationsForUser(user?.id || '')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5); // Show only 5 most recent
    
    setRecentNotifications(notifications);
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    NotificationService.markAsRead(notification.id);
    updateUnreadCount();
    
    // Navigate to camp if it's a camp notification
    if (notification.campId) {
      setShowDropdown(false);
      navigate('/camp', { state: { search: notification.campName } });
    }
  };

  const handleViewAll = () => {
    setShowDropdown(false);
    navigate('/notifications');
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now - notificationTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'camp-today': return '🏥';
      case 'camp-tomorrow': return '📅';
      case 'camp-upcoming': return '📋';
      case 'sms': return '📱';
      default: return '🔔';
    }
  };

  return (
    <div className="notification-bell-container">
      <button 
        className="notification-bell"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>
      
      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            <button 
              className="view-all-btn"
              onClick={handleViewAll}
            >
              View All
            </button>
          </div>
          
          {recentNotifications.length > 0 ? (
            <div className="notification-dropdown-list">
              {recentNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-dropdown-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-dropdown-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="notification-dropdown-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    {notification.phoneNumber && (
                      <span className="notification-phone">SMS to: {notification.phoneNumber}</span>
                    )}
                    <span className="notification-time">
                      {getTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-notifications-dropdown">
              <p>No notifications</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;