import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import FeedbackSystem from '../component-temp/FeedbackSystem';
import GoogleEmbedMap from '../component-temp/GoogleEmbedMap';

const OrganizerCampCard = ({ camp, onEdit, onDelete }) => {
  const { language } = useLanguage();
  const [showFeedback, setShowFeedback] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const translations = {
    en: {
      edit: "Edit",
      delete: "Delete",
      viewFeedback: "View Feedback",
      viewLocation: "View Location",
      close: "Close",
      services: "Services",
      doctor: "Doctor",
      participants: "Participants",
      status: "Status",
      upcoming: "Upcoming",
      completed: "Completed",
      registeredPatients: "Registered Patients"
    },
    kn: {
      edit: "ಸಂಪಾದಿಸಿ",
      delete: "ಅಳಿಸಿ",
      viewFeedback: "ಪ್ರತಿಕ್ರಿಯೆ ವೀಕ್ಷಿಸಿ",
      viewLocation: "ಸ್ಥಳ ವೀಕ್ಷಿಸಿ",
      close: "ಮುಚ್ಚಿ",
      services: "ಸೇವೆಗಳು",
      doctor: "ಡಾಕ್ಟರ್",
      participants: "ಭಾಗವಹಿಸುವವರು",
      status: "ಸ್ಥಿತಿ",
      upcoming: "ಮುಂಬರುವ",
      completed: "ಪೂರ್ಣಗೊಂಡಿದೆ",
      registeredPatients: "ನೋಂದಾಯಿತ ರೋಗಿಗಳು"
    }
  };

  const t = translations[language];

  // Safe check for camp data
  if (!camp) {
    return null;
  }

  return (
    <div className="organizer-camp-card" style={{
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      marginBottom: '1rem',
      background: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div className="camp-header" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', flex: 1 }}>
            {camp.campName || 'Unnamed Camp'}
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ 
              background: camp.status === 'upcoming' ? '#48bb78' : '#ed8936', 
              color: 'white', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '1rem', 
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              {camp.status === 'upcoming' ? t.upcoming : t.completed}
            </span>
            <span style={{ 
              background: '#3182ce', 
              color: 'white', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '1rem', 
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              👥 {camp.currentParticipants || 0}/{camp.maxParticipants || 100}
            </span>
          </div>
        </div>
      </div>

      <div className="camp-details" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
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

        <div style={{ marginBottom: '1rem' }}>
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

        {camp.description && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ margin: '0', color: '#4a5568', fontStyle: 'italic' }}>
              "{camp.description}"
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons for Organizer */}
      <div className="organizer-actions" style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        marginTop: '1rem'
      }}>
        {/* Edit Button */}
        {camp.status === 'upcoming' && (
          <button
            onClick={() => onEdit(camp)}
            style={{
              background: '#3182ce',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: '600',
              flex: 1,
              minWidth: '100px'
            }}
          >
            ✏️ {t.edit}
          </button>
        )}

        {/* Delete Button */}
        <button
          onClick={() => onDelete(camp.id)}
          style={{
            background: '#e53e3e',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '600',
            flex: 1,
            minWidth: '100px'
          }}
        >
          🗑️ {t.delete}
        </button>

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
          <FeedbackSystem campId={camp.id} user={null} />
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

export default OrganizerCampCard;