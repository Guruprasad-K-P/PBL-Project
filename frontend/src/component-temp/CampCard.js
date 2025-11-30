import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import FeedbackSystem from './FeedbackSystem';
import GoogleEmbedMap from './GoogleEmbedMap';

const CampCard = ({ camp, user, onRegister }) => {
  const { language } = useLanguage();
  const [showFeedback, setShowFeedback] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const translations = {
    en: {
      register: "Register",
      registered: "Registered",
      viewFeedback: "View Feedback",
      viewLocation: "View Location",
      close: "Close",
      services: "Services",
      doctor: "Doctor",
      participants: "Participants",
      organizer: "Organizer",
      free: "Free",
      paid: "Paid"
    },
    kn: {
      register: "ನೋಂದಣಿ",
      registered: "ನೋಂದಾಯಿತ",
      viewFeedback: "ಪ್ರತಿಕ್ರಿಯೆ ವೀಕ್ಷಿಸಿ",
      viewLocation: "ಸ್ಥಳ ವೀಕ್ಷಿಸಿ",
      close: "ಮುಚ್ಚಿ",
      services: "ಸೇವೆಗಳು",
      doctor: "ಡಾಕ್ಟರ್",
      participants: "ಭಾಗವಹಿಸುವವರು",
      organizer: "ಆಯೋಜಕ",
      free: "ಉಚಿತ",
      paid: "ಪಾವತಿ"
    }
  };

  const t = translations[language];

  // Safe check for camp data
  if (!camp) {
    return null;
  }

  const isRegistered = user?.registeredCamps?.includes(camp.id);

  return (
    <div className="camp-card" style={{
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      marginBottom: '1rem',
      background: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div className="camp-header" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>
          {camp.campName || 'Unnamed Camp'}
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ 
            background: camp.status === 'upcoming' ? '#48bb78' : '#ed8936', 
            color: 'white', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '1rem', 
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            {camp.status === 'upcoming' ? 'Upcoming' : 'Completed'}
          </span>
          <span style={{ 
            background: camp.isFree ? '#48bb78' : '#e53e3e', 
            color: 'white', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '1rem', 
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            {camp.isFree ? t.free : t.paid}
          </span>
        </div>
      </div>

      <div className="camp-details" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <strong>📍 {camp.location?.village || 'Unknown Village'}, {camp.location?.district || 'Unknown District'}</strong>
            <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
              {camp.date ? new Date(camp.date).toLocaleDateString() : 'Date not set'} at {camp.date ? new Date(camp.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Time not set'}
            </p>
          </div>
          
          <div>
            <strong>👨‍⚕️ {t.doctor}:</strong>
            <p style={{ margin: '0.25rem 0', color: '#666' }}>{camp.doctorName || 'Doctor not specified'}</p>
            {camp.doctorSpecialization && (
              <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                ({camp.doctorSpecialization})
              </p>
            )}
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <strong>🏥 {t.organizer}:</strong>
          <p style={{ margin: '0.25rem 0', color: '#666' }}>{camp.organizer || 'Unknown Organizer'}</p>
        </div>

        {camp.description && (
          <div style={{ marginTop: '1rem' }}>
            <p style={{ margin: '0', color: '#4a5568', fontStyle: 'italic' }}>
              "{camp.description}"
            </p>
          </div>
        )}

        <div style={{ marginTop: '1rem' }}>
          <strong>🩺 {t.services}:</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {(camp.services || []).map((service, index) => (
              <span key={index} style={{
                background: '#edf2f7',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.8rem',
                color: '#4a5568'
              }}>
                {service}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            👥 {camp.currentParticipants || 0}/{camp.maxParticipants || 100} {t.participants}
          </span>
          {camp.contactNumber && (
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              📞 {camp.contactNumber}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="camp-actions" style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        marginTop: '1rem'
      }}>
        {/* Register Button */}
        {user?.role === 'patient' && camp.status === 'upcoming' && (
          <button
            onClick={() => onRegister(camp)}
            disabled={isRegistered || (camp.currentParticipants || 0) >= (camp.maxParticipants || 100)}
            style={{
              background: isRegistered ? '#48bb78' : ((camp.currentParticipants || 0) >= (camp.maxParticipants || 100) ? '#a0aec0' : '#3182ce'),
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              cursor: isRegistered || (camp.currentParticipants || 0) >= (camp.maxParticipants || 100) ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              flex: 1,
              minWidth: '120px'
            }}
          >
            {isRegistered ? '✅ ' + t.registered : 
             (camp.currentParticipants || 0) >= (camp.maxParticipants || 100) ? '🚫 Full' : t.register}
          </button>
        )}

        {/* Feedback Button */}
        <button
          onClick={() => setShowFeedback(!showFeedback)}
          style={{
            background: showFeedback ? '#e53e3e' : '#805ad5',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '600',
            flex: 1,
            minWidth: '140px'
          }}
        >
          {showFeedback ? '✕ ' + t.close : '💬 ' + t.viewFeedback}
        </button>

        {/* Location Button */}
        <button
          onClick={() => setShowLocation(!showLocation)}
          style={{
            background: showLocation ? '#e53e3e' : '#38a169',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '600',
            flex: 1,
            minWidth: '140px'
          }}
        >
          {showLocation ? '✕ ' + t.close : '📍 ' + t.viewLocation}
        </button>
      </div>

      {/* Feedback Section */}
      {showFeedback && (
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
          <FeedbackSystem campId={camp.id} user={user} />
        </div>
      )}

      {/* Location Section */}
      {showLocation && (
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
          <GoogleEmbedMap location={camp.location} campName={camp.campName} />
        </div>
      )}
    </div>
  );
};

export default CampCard;