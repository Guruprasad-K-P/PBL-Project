import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import NotificationService from '../services/NotificationService';

const PhoneInboxPage = ({ user }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, sent

  const translations = {
    en: {
      title: "SMS Notifications",
      inbox: "Inbox",
      sent: "Sent",
      all: "All",
      unread: "Unread",
      noMessages: "No messages found",
      subject: "Subject",
      from: "From",
      to: "To",
      date: "Date",
      markAsRead: "Mark as Read",
      delete: "Delete",
      backToList: "Back to List",
      registrationConfirmation: "Camp Registration Confirmation",
      campReminder: "Camp Reminder",
      dear: "Dear",
      thankYou: "Thank you for registering for our health camp!",
      campDetails: "Camp Details",
      campName: "Camp Name",
      date: "Date",
      location: "Location",
      doctor: "Doctor",
      services: "Services",
      contact: "Contact",
      registrationId: "Registration ID",
      daysUntil: "Days until camp",
      reminderMessage: "This is a reminder about your upcoming health camp.",
      seeYouThere: "We look forward to seeing you there!",
      bestRegards: "Best regards,",
      villageHealthTeam: "Village Health Care Team",
      phoneNumber: "Phone Number",
      smsType: "SMS Type",
      loadingMessages: "Loading messages...",
      confirmDelete: "Are you sure you want to delete this message?"
    },
    kn: {
      title: "SMS ಅಧಿಸೂಚನೆಗಳು",
      inbox: "ಇನ್‌ಬಾಕ್ಸ್",
      sent: "ಕಳುಹಿಸಿದ",
      all: "ಎಲ್ಲಾ",
      unread: "ಓದದ",
      noMessages: "ಯಾವುದೇ ಸಂದೇಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
      subject: "ವಿಷಯ",
      from: "ಇಂದ",
      to: "ಗೆ",
      date: "ದಿನಾಂಕ",
      markAsRead: "ಓದಿದೆಂದು ಗುರುತಿಸಿ",
      delete: "ಅಳಿಸಿ",
      backToList: "ಪಟ್ಟಿಗೆ ಹಿಂತಿರಿಗಿ",
      registrationConfirmation: "ಕ್ಯಾಂಪ್ ನೋಂದಣಿ ದೃಢೀಕರಣ",
      campReminder: "ಕ್ಯಾಂಪ್ ನೆನಪಕ",
      dear: "ಪ್ರಿಯ",
      thankYou: "ನಮ್ಮ ಆರೋಗ್ಯ ಶಿಬಿರಕ್ಕೆ ನೋಂದಾಯಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು!",
      campDetails: "ಕ್ಯಾಂಪ್ ವಿವರಗಳು",
      campName: "ಕ್ಯಾಂಪ್ ಹೆಸರು",
      date: "ದಿನಾಂಕ",
      location: "ಸ್ಥಳ",
      doctor: "ವೈದ್ಯರು",
      services: "ಸೇವೆಗಳು",
      contact: "ಸಂಪರ್ಕ",
      registrationId: "ನೋಂದಣಿ ID",
      daysUntil: "ಕ್ಯಾಂಪ್‌ವರೆಗಿನ ದಿನಗಳು",
      reminderMessage: "ಇದು ನಿಮ್ಮ ಮುಂಬರುವ ಆರೋಗ್ಯ ಶಿಬಿರದ ಬಗ್ಗೆ ನೆನಪ.",
      seeYouThere: "ಅಲ್ಲಿ ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾಗುವೆವು!",
      bestRegards: "ಶುಭ ಹಾರೈಗಳು,",
      villageHealthTeam: "ಗ್ರಾಮೀಣ ಆರೋಗ್ಯ ರಕ್ಷಣ ತಂಡ",
      phoneNumber: "ಫೋನ್ ನಂಬರ್",
      smsType: "SMS ಪ್ರಕಾರ",
      loadingMessages: "ಸಂದೇಶಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
      confirmDelete: "ಈ ಸಂದೇಶವನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?"
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadMessages();
  }, [user, filter]);

  const loadMessages = () => {
    setLoading(true);
    
    try {
      let userMessages = [];
      
      if (filter === 'all' || filter === 'inbox') {
        // Get messages for the current user's phone number
        userMessages = NotificationService.getMessagesForPhone(user?.phone || '');
      }
      
      if (filter === 'all' || filter === 'sent') {
        // Get all sent messages (for organizers)
        const allMessages = NotificationService.getAllSentMessages();
        userMessages = [...userMessages, ...allMessages];
      }
      
      // Sort by date (newest first)
      userMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setMessages(userMessages);
      console.log("📱 Loaded messages:", userMessages.length);
    } catch (error) {
      console.error("❌ Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    
    // Mark as read if it's unread
    if (!message.read) {
      NotificationService.markMessageAsRead(message.id);
      // Update in the list
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, read: true } : m
      ));
    }
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm(t.confirmDelete)) {
      NotificationService.deleteMessage(messageId);
      setMessages(prev => prev.filter(m => m.id !== messageId));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'kn' ? 'kn-IN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const renderMessageContent = (message) => {
    if (message.type === 'registration') {
      return (
        <div className="message-content">
          <p>{t.dear} {message.content.patientName},</p>
          <p>{t.thankYou}</p>
          
          <h3>{t.campDetails}</h3>
          <div className="message-details">
            <p><strong>{t.campName}:</strong> {message.content.campName}</p>
            <p><strong>{t.date}:</strong> {formatDate(message.content.campDate)}</p>
            <p><strong>{t.location}:</strong> {message.content.campLocation}</p>
            <p><strong>{t.doctor}:</strong> {message.content.doctorName}</p>
            <p><strong>{t.services}:</strong> {message.content.services.join(', ')}</p>
            <p><strong>{t.contact}:</strong> {message.content.contactNumber}</p>
            <p><strong>{t.registrationId}:</strong> {message.content.registrationId}</p>
          </div>
          
          <p>{t.seeYouThere}</p>
          <p>{t.bestRegards}</p>
          <p>{t.villageHealthTeam}</p>
        </div>
      );
    } else if (message.type === 'reminder') {
      return (
        <div className="message-content">
          <p>{t.dear} {message.content.patientName},</p>
          <p>{t.reminderMessage}</p>
          
          <h3>{t.campDetails}</h3>
          <div className="message-details">
            <p><strong>{t.campName}:</strong> {message.content.campName}</p>
            <p><strong>{t.date}:</strong> {formatDate(message.content.campDate)}</p>
            <p><strong>{t.location}:</strong> {message.content.campLocation}</p>
            <p><strong>{t.doctor}:</strong> {message.content.doctorName}</p>
            <p><strong>{t.services}:</strong> {message.content.services.join(', ')}</p>
            <p><strong>{t.contact}:</strong> {message.content.contactNumber}</p>
            <p><strong>{t.registrationId}:</strong> {message.content.registrationId}</p>
            <p><strong>{t.daysUntil}:</strong> {message.content.daysUntil}</p>
          </div>
          
          <p>{t.seeYouThere}</p>
          <p>{t.bestRegards}</p>
          <p>{t.villageHealthTeam}</p>
        </div>
      );
    }
    
    return <div className="message-content">{message.content}</div>;
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>{t.loadingMessages}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="phone-inbox">
        <h1>{t.title}</h1>
        
        {/* Message filters */}
        <div className="message-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t.all}
          </button>
          <button 
            className={`filter-btn ${filter === 'inbox' ? 'active' : ''}`}
            onClick={() => setFilter('inbox')}
          >
            {t.inbox}
          </button>
          <button 
            className={`filter-btn ${filter === 'sent' ? 'active' : ''}`}
            onClick={() => setFilter('sent')}
          >
            {t.sent}
          </button>
        </div>
        
        {selectedMessage ? (
          // Message detail view
          <div className="message-detail">
            <div className="message-header">
              <button 
                className="back-btn"
                onClick={() => setSelectedMessage(null)}
              >
                {t.backToList}
              </button>
              
              <div className="message-actions">
                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                >
                  {t.delete}
                </button>
              </div>
            </div>
            
            <div className="message-meta">
              <h2>{selectedMessage.subject}</h2>
              <div className="message-info">
                <p><strong>{t.from}:</strong> {selectedMessage.from}</p>
                <p><strong>{t.to}:</strong> {selectedMessage.to}</p>
                <p><strong>{t.phoneNumber}:</strong> {selectedMessage.phoneNumber}</p>
                <p><strong>{t.date}:</strong> {formatDate(selectedMessage.timestamp)}</p>
                <p><strong>{t.smsType}:</strong> {selectedMessage.type === 'registration' ? t.registrationConfirmation : t.campReminder}</p>
              </div>
            </div>
            
            <div className="message-body">
              {renderMessageContent(selectedMessage)}
            </div>
          </div>
        ) : (
          // Message list view
          <div className="message-list">
            {messages.length > 0 ? (
              messages.map(message => (
                <div 
                  key={message.id} 
                  className={`message-item ${!message.read ? 'unread' : ''}`}
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="message-preview">
                    <div className="message-subject">
                      {!message.read && <span className="unread-indicator">●</span>}
                      {message.subject}
                    </div>
                    <div className="message-meta-info">
                      <span className="message-from">
                        {message.type === 'registration' ? t.registrationConfirmation : 
                         message.type === 'reminder' ? t.campReminder : 
                         message.from}
                      </span>
                      <span className="message-phone">{message.phoneNumber}</span>
                      <span className="message-date">{formatDate(message.timestamp)}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="delete-message-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMessage(message.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <div className="no-messages">
                <p>{t.noMessages}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneInboxPage;