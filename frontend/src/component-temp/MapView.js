import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const MapView = ({ location, campName }) => {
  const { language } = useLanguage();

  const translations = {
    en: {
      location: "Location",
      viewOnMaps: "View on Google Maps",
      getDirections: "Get Directions",
      openInGoogleMaps: "Open in Google Maps",
      address: "Address",
      campLocation: "Camp Location"
    },
    kn: {
      location: "ಸ್ಥಳ",
      viewOnMaps: "Google Maps ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ",
      getDirections: "ದಿಕ್ಕುಸೂಚಿ ಪಡೆಯಿರಿ",
      openInGoogleMaps: "Google Maps ನಲ್ಲಿ ತೆರೆಯಿರಿ",
      address: "ವಿಳಾಸ",
      campLocation: "ಶಿಬಿರದ ಸ್ಥಳ"
    }
  };

  const t = translations[language];

  // Generate Google Maps URLs
  const getEmbedUrl = () => {
    const query = encodeURIComponent(`${location.address}, ${location.village}, ${location.district}, Karnataka`);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${query}&zoom=15`;
  };

  const getGoogleMapsUrl = () => {
    const query = encodeURIComponent(`${location.address}, ${location.village}, ${location.district}, Karnataka`);
    return `https://www.google.com/maps?q=${query}`;
  };

  const getDirectionsUrl = () => {
    const query = encodeURIComponent(`${location.address}, ${location.village}, ${location.district}, Karnataka`);
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  };

  return (
    <div className="map-view">
      <h4>📍 {t.location}</h4>
      
      {/* Location Details */}
      <div className="location-details" style={{ marginBottom: '1rem' }}>
        <p><strong>{location.village}, {location.district}</strong></p>
        <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
          {location.address}
        </p>
      </div>

      {/* Google Maps Embed */}
      <div className="map-container" style={{ 
        height: '300px', 
        borderRadius: '0.5rem', 
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        marginBottom: '1rem'
      }}>
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={getEmbedUrl()}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`${t.campLocation}: ${campName}`}
        />
      </div>

      {/* Action Buttons */}
      <div className="map-actions" style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        flexWrap: 'wrap' 
      }}>
        <a 
          href={getGoogleMapsUrl()}
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            background: '#4285f4',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            flex: 1,
            textAlign: 'center',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}
        >
          <span>🗺️</span>
          {t.openInGoogleMaps}
        </a>
        
        <a 
          href={getDirectionsUrl()}
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            background: '#34a853',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            flex: 1,
            textAlign: 'center',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}
        >
          <span>🧭</span>
          {t.getDirections}
        </a>
      </div>

      {/* Attribution */}
      <div style={{ 
        marginTop: '0.5rem', 
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#666'
      }}>
        <a 
          href="https://maps.google.com" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#666', textDecoration: 'none' }}
        >
          Google Maps
        </a>
      </div>
    </div>
  );
};

export default MapView;