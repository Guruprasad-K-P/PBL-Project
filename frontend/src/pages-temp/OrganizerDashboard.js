import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import OrganizerCampCard from './OrganizerCampCard';

const OrganizerDashboard = ({ user }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed
  const [showNotification, setShowNotification] = useState(false);

  const translations = {
    en: {
      title: "Organizer Dashboard",
      createCamp: "Create New Health Camp",
      myCamps: "My Health Camps",
      noCamps: "No camps created yet",
      createFirstCamp: "Create your first health camp to get started!",
      allCamps: "All Camps",
      upcomingCamps: "Upcoming Camps",
      completedCamps: "Completed Camps",
      totalCamps: "Total Camps",
      totalParticipants: "Total Participants",
      averageRating: "Average Rating",
      edit: "Edit",
      delete: "Delete",
      deleteConfirm: "Are you sure you want to delete this camp?",
      deleteSuccess: "Camp deleted successfully",
      deleteError: "Error deleting camp",
      loading: "Loading your camps...",
      stats: "Camp Statistics",
      welcome: "Welcome back,",
      newRegistration: "New Patient Registration!",
      patientRegistered: "A new patient has registered for your camp",
      viewDetails: "View Details",
      dismiss: "Dismiss"
    },
    kn: {
      title: "ಆಯೋಜಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      createCamp: "ಹೊಸ ಆರೋಗ್ಯ ಶಿಬಿರ ರಚಿಸಿ",
      myCamps: "ನನ್ನ ಆರೋಗ್ಯ ಶಿಬಿರಗಳು",
      noCamps: "ಇನ್ನೂ ಯಾವುದೇ ಶಿಬಿರಗಳನ್ನು ರಚಿಸಲಾಗಿಲ್ಲ",
      createFirstCamp: "ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಮೊದಲ ಆರೋಗ್ಯ ಶಿಬಿರವನ್ನು ರಚಿಸಿ!",
      allCamps: "ಎಲ್ಲಾ ಶಿಬಿರಗಳು",
      upcomingCamps: "ಮುಂಬರುವ ಶಿಬಿರಗಳು",
      completedCamps: "ಪೂರ್ಣಗೊಂಡ ಶಿಬಿರಗಳು",
      totalCamps: "ಒಟ್ಟು ಶಿಬಿರಗಳು",
      totalParticipants: "ಒಟ್ಟು ಭಾಗವಹಿಸುವವರು",
      averageRating: "ಸರಾಸರಿ ರೇಟಿಂಗ್",
      edit: "ಸಂಪಾದಿಸಿ",
      delete: "ಅಳಿಸಿ",
      deleteConfirm: "ಈ ಶಿಬಿರವನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತರಾಗಿದ್ದೀರಾ?",
      deleteSuccess: "ಶಿಬಿರವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ",
      deleteError: "ಶಿಬಿರವನ್ನು ಅಳಿಸುವಲ್ಲಿ ದೋಷ",
      loading: "ನಿಮ್ಮ ಶಿಬಿರಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
      stats: "ಶಿಬಿರ ಅಂಕಿಅಂಶಗಳು",
      welcome: "ಮರಳಿ ಸ್ವಾಗತ,",
      newRegistration: "ಹೊಸ ರೋಗಿ ನೋಂದಣಿ!",
      patientRegistered: "ನಿಮ್ಮ ಶಿಬಿರಕ್ಕೆ ಹೊಸ ರೋಗಿ ನೋಂದಾಯಿತರಾಗಿದ್ದಾರೆ",
      viewDetails: "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
      dismiss: "ವಜಾಗೊಳಿಸಿ"
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadOrganizerCamps();
    checkForNewRegistrations();
  }, [user]);

  const loadOrganizerCamps = () => {
    try {
      setLoading(true);
      
      // Load from multiple storage locations to ensure we get all camps
      const organizerCamps = JSON.parse(localStorage.getItem('organizerCamps') || '[]');
      const organizerSpecificCamps = JSON.parse(localStorage.getItem(`organizer_${user?.id}_camp_details`) || '[]');
      
      // Combine all camps and filter by current organizer
      const allCamps = [...organizerCamps, ...organizerSpecificCamps];
      
      const myCamps = allCamps.filter(camp => 
        camp && (
          camp.organizerId === user?.id || 
          camp.organizerEmail === user?.email ||
          camp.organizer === user?.name
        )
      );

      console.log("Organizer camps loaded:", myCamps);
      setCamps(myCamps);
    } catch (error) {
      console.error('Error loading organizer camps:', error);
      setCamps([]);
    } finally {
      setLoading(false);
    }
  };

  const checkForNewRegistrations = () => {
    // Check if there are new registrations for this organizer's camps
    const registrations = JSON.parse(localStorage.getItem('campRegistrations') || '[]');
    const myCampIds = camps.map(camp => camp.id);
    const newRegistrations = registrations.filter(reg => 
      myCampIds.includes(reg.campId) && 
      !reg.notified
    );

    if (newRegistrations.length > 0) {
      setShowNotification(true);
      
      // Mark as notified
      const updatedRegistrations = registrations.map(reg => ({
        ...reg,
        notified: true
      }));
      localStorage.setItem('campRegistrations', JSON.stringify(updatedRegistrations));
    }
  };

  const handleEditCamp = (camp) => {
    // Navigate to edit camp page or open edit modal
    console.log("Edit camp:", camp);
    alert('Edit functionality will be implemented soon');
  };

  const handleDeleteCamp = (campId) => {
    if (!window.confirm(t.deleteConfirm)) {
      return;
    }

    try {
      // Remove from organizerCamps
      const organizerCamps = JSON.parse(localStorage.getItem('organizerCamps') || '[]');
      const updatedOrganizerCamps = organizerCamps.filter(camp => camp.id !== campId);
      localStorage.setItem('organizerCamps', JSON.stringify(updatedOrganizerCamps));

      // Remove from organizer-specific storage
      const organizerSpecificCamps = JSON.parse(localStorage.getItem(`organizer_${user?.id}_camp_details`) || '[]');
      const updatedSpecificCamps = organizerSpecificCamps.filter(camp => camp.id !== campId);
      localStorage.setItem(`organizer_${user?.id}_camp_details`, JSON.stringify(updatedSpecificCamps));

      // Update camp IDs reference
      const organizerCampIds = JSON.parse(localStorage.getItem(`organizer_${user?.id}_camps`) || '[]');
      const updatedCampIds = organizerCampIds.filter(id => id !== campId);
      localStorage.setItem(`organizer_${user?.id}_camps`, JSON.stringify(updatedCampIds));

      // Update state
      setCamps(prevCamps => prevCamps.filter(camp => camp.id !== campId));
      
      alert(t.deleteSuccess);
    } catch (error) {
      console.error('Error deleting camp:', error);
      alert(t.deleteError);
    }
  };

  const handleCreateCamp = () => {
    navigate('/organize-camp');
  };

  const handleAddSampleCamps = () => {
    const sampleCamps = [
      {
        id: Date.now() + 1,
        campName: "Free Health Checkup Camp",
        location: {
          village: "Sample Village",
          district: "Bangalore",
          address: "Community Hall, Main Road"
        },
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        doctorName: "Dr. Rajesh Kumar",
        doctorSpecialization: "General Physician",
        services: ["General Checkup", "BP Check", "Medicine Distribution"],
        maxParticipants: 150,
        currentParticipants: 45,
        status: "upcoming",
        organizer: user?.name,
        isFree: true,
        organizerId: user?.id,
        organizerEmail: user?.email,
        contactNumber: user?.phone,
        description: "Free health checkup camp for all villagers"
      },
      {
        id: Date.now() + 2,
        campName: "Diabetes Screening Camp",
        location: {
          village: "Example Town",
          district: "Mysore",
          address: "Primary Health Center"
        },
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        doctorName: "Dr. Priya Sharma",
        doctorSpecialization: "Endocrinologist",
        services: ["Diabetes Screening", "Blood Test", "Diet Consultation"],
        maxParticipants: 100,
        currentParticipants: 28,
        status: "upcoming",
        organizer: user?.name,
        isFree: true,
        organizerId: user?.id,
        organizerEmail: user?.email,
        contactNumber: user?.phone,
        description: "Specialized diabetes screening and consultation camp"
      }
    ];

    const existingCamps = JSON.parse(localStorage.getItem('organizerCamps') || '[]');
    const updatedCamps = [...existingCamps, ...sampleCamps];
    localStorage.setItem('organizerCamps', JSON.stringify(updatedCamps));

    // Also save to organizer-specific storage
    const organizerSpecificCamps = JSON.parse(localStorage.getItem(`organizer_${user?.id}_camp_details`) || '[]');
    const updatedSpecificCamps = [...organizerSpecificCamps, ...sampleCamps];
    localStorage.setItem(`organizer_${user?.id}_camp_details`, JSON.stringify(updatedSpecificCamps));

    setCamps(prevCamps => [...prevCamps, ...sampleCamps]);
    alert(language === 'en' ? 'Sample camps added successfully!' : 'ನಮೂನಾ ಶಿಬಿರಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ!');
  };

  // Filter camps based on selected filter
  const filteredCamps = camps.filter(camp => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return camp.status === 'upcoming';
    if (filter === 'completed') return camp.status === 'completed';
    return true;
  });

  // Calculate statistics
  const stats = {
    totalCamps: camps.length,
    upcomingCamps: camps.filter(camp => camp.status === 'upcoming').length,
    completedCamps: camps.filter(camp => camp.status === 'completed').length,
    totalParticipants: camps.reduce((sum, camp) => sum + (camp.currentParticipants || 0), 0),
    averageRating: 4.2 // You can calculate this from feedback data
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page organizer-dashboard">
      {/* Notification Banner */}
      {showNotification && (
        <div className="notification-banner">
          <div className="notification-content">
            <div className="notification-icon">🔔</div>
            <div className="notification-text">
              <strong>{t.newRegistration}</strong>
              <span>{t.patientRegistered}</span>
            </div>
            <div className="notification-actions">
              <button 
                className="notification-btn primary"
                onClick={() => setShowNotification(false)}
              >
                {t.viewDetails}
              </button>
              <button 
                className="notification-btn secondary"
                onClick={() => setShowNotification(false)}
              >
                {t.dismiss}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>{t.title}</h1>
            <p style={{ color: '#666', margin: 0 }}>
              {t.welcome} {user?.name}!
            </p>
          </div>
          <div className="header-actions">
            {camps.length === 0 && (
              <button
                onClick={handleAddSampleCamps}
                className="sample-btn large"
              >
                🚀 {language === 'en' ? 'Add Sample Camps' : 'ನಮೂನಾ ಶಿಬಿರಗಳನ್ನು ಸೇರಿಸಿ'}
              </button>
            )}
            <button
              onClick={handleCreateCamp}
              className="create-camp-btn"
            >
              ➕ {t.createCamp}
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {camps.length > 0 && (
        <div className="organizer-content">
          <div className="stats-section">
            <h3 style={{ marginBottom: '1rem' }}>{t.stats}</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏥</div>
                <div className="stat-content">
                  <h3>{stats.totalCamps}</h3>
                  <p>{t.totalCamps}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <h3>{stats.upcomingCamps}</h3>
                  <p>{t.upcomingCamps}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>{stats.totalParticipants}</h3>
                  <p>{t.totalParticipants}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <h3>{stats.averageRating}</h3>
                  <p>{t.averageRating}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Section */}
      {camps.length > 0 && (
        <div className="filter-section" style={{
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <label style={{ fontWeight: '600', color: '#2d3748' }}>
            {language === 'en' ? 'Filter by:' : 'ಫಿಲ್ಟರ್ ಮಾಡಿ:'}
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'upcoming', 'completed'].map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                style={{
                  background: filter === filterType ? '#3182ce' : 'white',
                  color: filter === filterType ? 'white' : '#4a5568',
                  border: `1px solid ${filter === filterType ? '#3182ce' : '#e2e8f0'}`,
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                {t[`${filterType}Camps`]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Camps List */}
      <div className="camps-section">
        <h3 style={{ marginBottom: '1rem' }}>
          {t.myCamps} ({filteredCamps.length})
        </h3>

        {camps.length === 0 ? (
          <div className="no-data">
            <h4 style={{ color: '#718096', marginBottom: '1rem' }}>{t.noCamps}</h4>
            <p style={{ color: '#a0aec0', marginBottom: '2rem' }}>{t.createFirstCamp}</p>
            <button
              onClick={handleCreateCamp}
              className="create-camp-btn large"
              style={{ padding: '12px 24px', fontSize: '16px' }}
            >
              ➕ {t.createCamp}
            </button>
          </div>
        ) : (
          <div className="camps-list">
            {filteredCamps.map(camp => (
              <OrganizerCampCard
                key={camp.id}
                camp={camp}
                onEdit={handleEditCamp}
                onDelete={handleDeleteCamp}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;