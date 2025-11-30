import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import NotificationService from '../services/NotificationService';

const NotificationCenterPage = ({ user }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, high, medium, low

  const translations = {
    en: {
      title: "Notification Center",
      noNotifications: "No notifications found",
      markAsRead: "Mark as Read",
      markAllAsRead: "Mark All as Read",
      delete: "Delete",
      filterAll: "All",
      filterUnread: "Unread",
      filterHigh: "High Priority",
      filterMedium: "Medium Priority",
      filterLow: "Low Priority",
      campToday: "Camp Today",
      campTomorrow: "Camp Tomorrow",
      campUpcoming: "Upcoming Camp",
      priority: "Priority",
      high: "High",
      medium: "Medium",
      low: "Low",
      viewCamp: "View Camp",
      justNow: "Just now",
      minutesAgo: "minutes ago",
      hoursAgo: "hours ago",
      daysAgo: "days ago",
      backToDashboard: "Back to Dashboard",
      phoneNotification: "Phone Notification",
      smsSent: "SMS Sent",
      loadingNotifications: "Loading notifications..."
    },
    kn: {
      title: "ಅಧಿಸೂಚನೆಗಳು ಕೇಂದ್ರ",
      noNotifications: "ಯಾವುದೇ ಅಧಿಸೂಚನೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
      markAsRead: "ಓದಿದೆಂದು ಗುರುತಿಸಿ",
      markAllAsRead: "ಎಲ್ಲಾ ಓದಿದೆಂದು ಗುರುತಿಸಿ",
      delete: "ಅಳಿಸಿ",
      filterAll: "ಎಲ್ಲಾ",
      filterUnread: "ಓದಿದ",
      filterHigh: "ಹೆಚ್ಚಿನ ಆದ್ಯತೆ",
      filterMedium: "ಮಧ್ಯಮಾನ ಆದ್ಯತೆ",
      filterLow: "ಕಡಿಮೆ ಆದ್ಯತೆ",
      campToday: "ಇಂದು ಕ್ಯಾಂಪ್",
      campTomorrow: "ನಾಳೆ ಕ್ಯಾಂಪ್",
      campUpcoming: "ಮುಂಬರುವ ಕ್ಯಾಂಪ್",
      priority: "ಆದ್ಯತೆ",
      high: "ಹೆಚ್ಚಿನ",
      medium: "ಮಧ್ಯಮಾನ",
      low: "ಕಡಿಮೆ",
      viewCamp: "ಕ್ಯಾಂಪ್ ವೀಕ್ಷಿಸಿ",
      justNow: "ಈಗ",
      minutesAgo: "ನಿಮಿಷಗಳ ಹಿಂದೆ",
      hoursAgo: "ಗಂಟೆಗಳ ಹಿಂದೆ",
      daysAgo: "ದಿನಗಳ ಹಿಂದೆ",
      backToDashboard: "ಡ್ಯಾಶ್ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರಿಗಿ",
      phoneNotification: "ಫೋನ್ ಅಧಿಸೂಚನೆ",
      smsSent: "SMS ಕಳುಹಿಸಲಾಗಿದೆ",
      loadingNotifications: "ಅಧಿಸೂಚನೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadNotifications();
    
    // Listen for new notifications
    const handleNewNotification = (event) => {
      console.log("🔔 New notification received:", event.detail);
      loadNotifications();
    };
    
    window.addEventListener('newNotification', handleNewNotification);
    
    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
    };
  }, [user, filter]);

  const loadNotifications = () => {
    setLoading(true);
    
    try {
      let userNotifications = NotificationService.getNotificationsForUser(user?.id || '');
      
      // Apply filter
      if (filter === 'unread') {
        userNotifications = userNotifications.filter(n => !n.read);
      } else if (filter === 'high') {
        userNotifications = userNotifications.filter(n => n.priority === 'high');
      } else if (filter === 'medium') {
        userNotifications = userNotifications.filter(n => n.priority === 'medium');
      } else if (filter === 'low') {
        userNotifications = userNotifications.filter(n => n.priority === 'low');
      }
      
      // Sort by timestamp (newest first) and priority
      userNotifications.sort((a, b) => {
        // First sort by priority (high to low)
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        // Then sort by timestamp (newest first)
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      
      setNotifications(userNotifications);
      console.log("🔔 Loaded notifications:", userNotifications.length);
    } catch (error) {
      console.error("❌ Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    NotificationService.markAsRead(notification.id);
    
    // Update in list
    setNotifications(prev => prev.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));
    
    // Navigate to camp if it's a camp notification
    if (notification.campId) {
      navigate('/camp', { state: { search: notification.campName } });
    }
  };

  const handleMarkAllAsRead = () => {
    NotificationService.markAllAsRead(user?.id || '');
    
    // Update in list
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (notificationId) => {
    if (window.confirm(language === 'kn' ? 'ಈ ಅಧಿಸೂಚನೆಯನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?' : 'Are you sure you want to delete this notification?')) {
      NotificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now - notificationTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return t.justNow;
    if (diffMins < 60) return `${diffMins} ${t.minutesAgo}`;
    if (diffHours < 24) return `${diffHours} ${t.hoursAgo}`;
    return `${diffDays} ${t.daysAgo}`;
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

  const getNotificationTypeText = (type) => {
    switch (type) {
      case 'camp-today': return t.campToday;
      case 'camp-tomorrow': return t.campTomorrow;
      case 'camp-upcoming': return t.campUpcoming;
      case 'sms': return t.phoneNotification;
      default: return 'Notification';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'high-priority';
      case 'medium': return 'medium-priority';
      case 'low': return 'low-priority';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>{t.loadingNotifications}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="notification-center">
        <h1>{t.title}</h1>
        
        {/* Notification filters */}
        <div className="notification-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t.filterAll}
          </button>
          <button 
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            {t.filterUnread}
          </button>
          <button 
            className={`filter-btn ${filter === 'high' ? 'active' : ''}`}
            onClick={() => setFilter('high')}
          >
            {t.filterHigh}
          </button>
          <button 
            className={`filter-btn ${filter === 'medium' ? 'active' : ''}`}
            onClick={() => setFilter('medium')}
          >
            {t.filterMedium}
          </button>
          <button 
            className={`filter-btn ${filter === 'low' ? 'active' : ''}`}
            onClick={() => setFilter('low')}
          >
            {t.filterLow}
          </button>
        </div>
        
        {/* Mark all as read button */}
        {notifications.some(n => !n.read) && (
          <div className="notification-actions">
            <button 
              className="mark-all-read-btn"
              onClick={handleMarkAllAsRead}
            >
              {t.markAllAsRead}
            </button>
          </div>
        )}
        
        {notifications.length > 0 ? (
          <div className="notification-list">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.read ? 'unread' : ''} ${getPriorityClass(notification.priority)}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="notification-content">
                  <div className="notification-header">
                    <h3 className="notification-title">{notification.title}</h3>
                    <div className="notification-meta">
                      <span className="notification-type">
                        {getNotificationTypeText(notification.type)}
                      </span>
                      <span className="notification-time">
                        {getTimeAgo(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="notification-message">{notification.message}</p>
                  
                  {notification.phoneNumber && (
                    <div className="notification-phone">
                      <span><strong>{t.smsSent}:</strong> {notification.phoneNumber}</span>
                    </div>
                  )}
                  
                  {notification.campName && (
                    <div className="notification-camp">
                      <span><strong>{language === 'kn' ? 'ಕ್ಯಾಂಪ್ ಹೆಸರು' : 'Camp'}:</strong> {notification.campName}</span>
                      <span><strong>{language === 'kn' ? 'ಸ್ಥಳ' : 'Location'}:</strong> {notification.campLocation}</span>
                    </div>
                  )}
                </div>
                
                <div className="notification-actions">
                  {!notification.read && (
                    <button 
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        NotificationService.markAsRead(notification.id);
                        setNotifications(prev => prev.map(n => 
                          n.id === notification.id ? { ...n, read: true } : n
                        ));
                      }}
                    >
                      {t.markAsRead}
                    </button>
                  )}
                  
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-notifications">
            <p>{t.noNotifications}</p>
            <button 
              className="submit-btn"
              onClick={() => navigate(user?.role === 'organizer' ? '/organizer-dashboard' : '/dashboard')}
            >
              {t.backToDashboard}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenterPage;