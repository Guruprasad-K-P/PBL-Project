import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = ({ user }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [organizerCamps, setOrganizerCamps] = useState([]);
  const [stats, setStats] = useState({
    totalCamps: 0,
    upcomingCamps: 0,
    totalRegistrations: 0,
    completedRegistrations: 0
  });
  const [loading, setLoading] = useState(true);

  const translations = {
    en: {
      title: "Dashboard",
      welcome: "Welcome back",
      patientDashboard: "Patient Dashboard",
      organizerDashboard: "Organizer Dashboard",
      myRegistrations: "My Camp Registrations",
      myCamps: "My Health Camps",
      upcomingCamps: "Upcoming Camps",
      statistics: "Statistics",
      totalCamps: "Total Camps",
      upcomingCampsLabel: "Upcoming Camps",
      totalRegistrations: "Total Registrations",
      completedRegistrations: "Completed Registrations",
      noRegistrations: "You haven't registered for any camps yet.",
      noCamps: "You haven't created any camps yet.",
      campName: "Camp Name",
      date: "Date",
      location: "Location",
      status: "Status",
      registered: "Registered",
      upcoming: "Upcoming",
      completed: "Completed",
      participants: "Participants",
      actions: "Actions",
      viewDetails: "View Details",
      manageCamp: "Manage Camp",
      registrationDate: "Registration Date",
      symptoms: "Symptoms",
      doctor: "Doctor",
      createCamp: "Create New Camp",
      browseCamps: "Browse Camps",
      upcomingAppointments: "Upcoming Appointments",
      noAppointments: "No upcoming appointments",
      healthRecords: "Health Records",
      recentActivity: "Recent Activity"
    },
    kn: {
      title: "ಡ್ಯಾಶ್ಬೋರ್ಡ್",
      welcome: "ಸ್ವಾಗತಿಸುತ್ತೇನೆ",
      patientDashboard: "ರೋಗಿ ಡ್ಯಾಶ್ಬೋರ್ಡ್",
      organizerDashboard: "ಆಯೋಜಕ ಡ್ಯಾಶ್ಬೋರ್ಡ್",
      myRegistrations: "ನನ್ನ ಕ್ಯಾಂಪ್ ನೋಂದಣಿಗಳು",
      myCamps: "ನನ್ನ ಆರೋಗ್ಯ ಶಿಬಿರಗಳು",
      upcomingCamps: "ಮುಂಬರುವ ಶಿಬಿರಗಳು",
      statistics: "ಅಂಕಿಅಂಶಗಳು",
      totalCamps: "ಒಟ್ಟು ಶಿಬಿರಗಳು",
      upcomingCampsLabel: "ಮುಂಬರುವ ಶಿಬಿರಗಳು",
      totalRegistrations: "ಒಟ್ಟು ನೋಂದಣಿಗಳು",
      completedRegistrations: "ಪೂರ್ಣಗೊಂಡ ನೋಂದಣಿಗಳು",
      noRegistrations: "ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಶಿಬಿರಗಳಿಗೆ ನೋಂದಾಯಿಸಿಲ್ಲ.",
      noCamps: "ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಶಿಬಿರಗಳನ್ನು ರಚಿಸಿಲ್ಲ.",
      campName: "ಕ್ಯಾಂಪ್ ಹೆಸರು",
      date: "ದಿನಾಂಕ",
      location: "ಸ್ಥಳ",
      status: "ಸ್ಥಿತಿ",
      registered: "ನೋಂದಾಯಿತ",
      upcoming: "ಮುಂಬರುವ",
      completed: "ಪೂರ್ಣಗೊಂಡ",
      participants: "ಭಾಗವಹಿಸುವವರು",
      actions: "ಕ್ರಮಗಳು",
      viewDetails: "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
      manageCamp: "ಕ್ಯಾಂಪ್ ನಿರ್ವಹಿಸಿ",
      registrationDate: "ನೋಂದಣಿ ದಿನಾಂಕ",
      symptoms: "ಲಕ್ಷಣಗಳು",
      doctor: "ಡಾಕ್ಟರ್",
      createCamp: "ಹೊಸ ಕ್ಯಾಂಪ್ ರಚಿಸಿ",
      browseCamps: "ಶಿಬಿರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
      upcomingAppointments: "ಮುಂಬರುವ ನೇಮಕಾತಿಗಳು",
      noAppointments: "ಮುಂಬರುವ ನೇಮಕಾತಿಗಳಿಲ್ಲ",
      healthRecords: "ಆರೋಗ್ಯ ದಾಖಲೆಗಳು",
      recentActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ"
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = () => {
    setLoading(true);
    
    try {
      if (user?.role === 'patient') {
        // Load patient registrations
        const registrations = JSON.parse(localStorage.getItem('campRegistrations') || '[]');
        const patientRegistrations = registrations.filter(reg => reg.patientId === user.id);
        setUserRegistrations(patientRegistrations);
        
        // Calculate stats
        const upcoming = patientRegistrations.filter(reg => {
          const campDate = new Date(reg.campDate || reg.registrationDate);
          return campDate > new Date();
        }).length;
        
        setStats({
          totalCamps: patientRegistrations.length,
          upcomingCamps: upcoming,
          totalRegistrations: patientRegistrations.length,
          completedRegistrations: patientRegistrations.length - upcoming
        });
        
      } else if (user?.role === 'organizer') {
        // Load organizer camps
        const camps = JSON.parse(localStorage.getItem('organizerCamps') || '[]');
        const organizerCamps = camps.filter(camp => camp.organizerId === user.id);
        setOrganizerCamps(organizerCamps);
        
        // Load all registrations for organizer's camps
        const registrations = JSON.parse(localStorage.getItem('campRegistrations') || '[]');
        const organizerRegistrations = registrations.filter(reg => 
          organizerCamps.some(camp => camp.id === reg.campId)
        );
        
        // Calculate stats
        const upcoming = organizerCamps.filter(camp => new Date(camp.date) > new Date()).length;
        
        setStats({
          totalCamps: organizerCamps.length,
          upcomingCamps: upcoming,
          totalRegistrations: organizerRegistrations.length,
          completedRegistrations: organizerRegistrations.filter(reg => {
            const camp = organizerCamps.find(c => c.id === reg.campId);
            return camp && new Date(camp.date) < new Date();
          }).length
        });
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'kn' ? 'kn-IN' : 'en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  const getCampStatus = (dateString) => {
    return isUpcoming(dateString) ? t.upcoming : t.completed;
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="dashboard-header">
        <h1>{t.title}</h1>
        <p>{t.welcome}, <strong>{user?.name}</strong>!</p>
      </div>

      {/* Statistics Cards */}
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
            <p>{t.upcomingCampsLabel}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalRegistrations}</h3>
            <p>{t.totalRegistrations}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completedRegistrations}</h3>
            <p>{t.completedRegistrations}</p>
          </div>
        </div>
      </div>

      {/* Role-specific content */}
      {user?.role === 'patient' ? (
        <div className="patient-dashboard">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>{t.myRegistrations}</h2>
              <button 
                className="btn-primary"
                onClick={() => navigate('/camp')}
              >
                {t.browseCamps}
              </button>
            </div>
            
            {userRegistrations.length > 0 ? (
              <div className="dashboard-table">
                <table>
                  <thead>
                    <tr>
                      <th>{t.campName}</th>
                      <th>{t.date}</th>
                      <th>{t.location}</th>
                      <th>{t.status}</th>
                      <th>{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userRegistrations.map(registration => (
                      <tr key={registration.id}>
                        <td>
                          <div>
                            <strong>{registration.campName}</strong>
                            <br />
                            <small>{registration.symptoms?.substring(0, 50)}...</small>
                          </div>
                        </td>
                        <td>{formatDate(registration.registrationDate)}</td>
                        <td>{registration.patientVillage}</td>
                        <td>
                          <span className={`status-badge ${getCampStatus(registration.registrationDate).toLowerCase()}`}>
                            {getCampStatus(registration.registrationDate)}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn-small"
                            onClick={() => navigate('/camp')}
                          >
                            {t.viewDetails}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>{t.noRegistrations}</p>
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/camp')}
                >
                  {t.browseCamps}
                </button>
              </div>
            )}
          </div>

          <div className="dashboard-section">
            <h2>{t.upcomingAppointments}</h2>
            {userRegistrations.filter(reg => isUpcoming(reg.registrationDate)).length > 0 ? (
              <div className="appointments-list">
                {userRegistrations
                  .filter(reg => isUpcoming(registrationDate))
                  .map(registration => (
                    <div key={registration.id} className="appointment-card">
                      <h4>{registration.campName}</h4>
                      <p><strong>{t.date}:</strong> {formatDate(registration.registrationDate)}</p>
                      <p><strong>{t.symptoms}:</strong> {registration.symptoms}</p>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>{t.noAppointments}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="organizer-dashboard">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>{t.myCamps}</h2>
              <button 
                className="btn-primary"
                onClick={() => navigate('/organize-camp')}
              >
                {t.createCamp}
              </button>
            </div>
            
            {organizerCamps.length > 0 ? (
              <div className="dashboard-table">
                <table>
                  <thead>
                    <tr>
                      <th>{t.campName}</th>
                      <th>{t.date}</th>
                      <th>{t.location}</th>
                      <th>{t.participants}</th>
                      <th>{t.status}</th>
                      <th>{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizerCamps.map(camp => {
                      const registrations = JSON.parse(localStorage.getItem('campRegistrations') || '[]')
                        .filter(reg => reg.campId === camp.id);
                      
                      return (
                        <tr key={camp.id}>
                          <td>
                            <div>
                              <strong>{camp.campName}</strong>
                              <br />
                              <small>{camp.doctorName}</small>
                            </div>
                          </td>
                          <td>{formatDate(camp.date)}</td>
                          <td>{camp.location.village}</td>
                          <td>
                            {registrations.length}/{camp.maxParticipants}
                          </td>
                          <td>
                            <span className={`status-badge ${getCampStatus(camp.date).toLowerCase()}`}>
                              {getCampStatus(camp.date)}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-small"
                              onClick={() => navigate('/camp')}
                            >
                              {t.manageCamp}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>{t.noCamps}</p>
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/organize-camp')}
                >
                  {t.createCamp}
                </button>
              </div>
            )}
          </div>

          <div className="dashboard-section">
            <h2>{t.recentActivity}</h2>
            <div className="activity-list">
              {organizerCamps.slice(0, 3).map(camp => {
                const registrations = JSON.parse(localStorage.getItem('campRegistrations') || '[]')
                  .filter(reg => reg.campId === camp.id);
                
                return (
                  <div key={camp.id} className="activity-item">
                    <div className="activity-icon">🏥</div>
                    <div className="activity-content">
                      <h4>{camp.campName}</h4>
                      <p>{registrations.length} people registered</p>
                      <small>{formatDate(camp.date)}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;