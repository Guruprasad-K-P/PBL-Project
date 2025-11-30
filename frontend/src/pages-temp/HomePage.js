import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ user }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const translations = {
    en: {
      title: "Village Health Camp Services",
      subtitle: "Connecting Rural Communities with Quality Healthcare",
      getServices: "Get Health Services",
      organizeCamp: "Organize Health Camp", 
      viewCamps: "View Health Camps",
      goToDashboard: "Go to Dashboard",
      forPatients: "For Patients",
      forOrganizers: "For Organizers",
      patientDesc: "Register for free health camps and get quality healthcare services",
      organizerDesc: "Organize health camps and serve your community",
      alreadyLoggedIn: "You are logged in as"
    },
    kn: {
      title: "ಗ್ರಾಮೀಣ ಆರೋಗ್ಯ ಶಿಬಿರ ಸೇವೆಗಳು",
      subtitle: "ಗ್ರಾಮೀಣ ಸಮುದಾಯಗಳನ್ನು ಗುಣಮಟ್ಟದ ಆರೋಗ್ಯ ಸೇವೆಗಳೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವುದು",
      getServices: "ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ಪಡೆಯಿರಿ",
      organizeCamp: "ಹೆಲ್ತ್ ಕ್ಯಾಂಪ್ ಆಯೋಜಿಸಿ",
      viewCamps: "ಹೆಲ್ತ್ ಕ್ಯಾಂಪ್ಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
      goToDashboard: "ಡ್ಯಾಶ್ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ",
      forPatients: "ರೋಗಿಗಳಿಗಾಗಿ",
      forOrganizers: "ಆಯೋಜಕರಿಗಾಗಿ",
      patientDesc: "ಉಚಿತ ಆರೋಗ್ಯ ಶಿಬಿರಗಳಿಗೆ ನೋಂದಾಯಿಸಿ ಮತ್ತು ಗುಣಮಟ್ಟದ ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ಪಡೆಯಿರಿ",
      organizerDesc: "ಆರೋಗ್ಯ ಶಿಬಿರಗಳನ್ನು ಆಯೋಜಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಸಮುದಾಯವನ್ನು ಸೇವೆ ಮಾಡಿ",
      alreadyLoggedIn: "ನೀವು ಲಾಗಿನ್ ಆಗಿರುವಿರಿ"
    }
  };

  const t = translations[language];

  const handleGetServices = () => {
    if (user) {
      navigate('/camp');
    } else {
      navigate('/auth');
    }
  };

  const handleOrganizeCamp = () => {
    if (user) {
      if (user.role === 'organizer') {
        navigate('/organize-camp');
      } else {
        navigate('/camp');
      }
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="page">
      <div className="hero-section">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
        
        {user && (
          <div className="message success">
            {t.alreadyLoggedIn}: <strong>{user.name}</strong> ({user.role})
            <div style={{marginTop: '1rem'}}>
              <button className="submit-btn" onClick={() => navigate('/dashboard')}>
                {t.goToDashboard}
              </button>
            </div>
          </div>
        )}

        <div className="options-grid">
          <div className="camp-card">
            <h3>{t.forPatients}</h3>
            <p>{t.patientDesc}</p>
            <button className="submit-btn" onClick={handleGetServices}>
              {user ? t.viewCamps : t.getServices}
            </button>
          </div>

          <div className="camp-card">
            <h3>{t.forOrganizers}</h3>
            <p>{t.organizerDesc}</p>
            <button className="submit-btn" onClick={handleOrganizeCamp}>
              {t.organizeCamp}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;