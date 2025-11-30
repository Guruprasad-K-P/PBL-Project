import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

const Navbar = ({ user, isAuthenticated, onLogout }) => {
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const translations = {
    en: {
      home: "Home",
      login: "Login",
      signup: "Sign Up",
      camps: "Health Camps",
      registerCamp: "Register Camp",
      dashboard: "Dashboard",
      notifications: "Notifications",
      search: "Search camps by village, doctor...",
      logout: "Logout",
      welcome: "Welcome",
      profile: "Profile",
      searchPlaceholder: "Search by village, doctor, services..."
    },
    kn: {
      home: "ಮುಖಪುಟ",
      login: "ಲಾಗಿನ್",
      signup: "ಸೈನ್ ಅಪ್",
      camps: "ಹೆಲ್ತ್ ಕ್ಯಾಂಪ್ಗಳು",
      registerCamp: "ಕ್ಯಾಂಪ್ ನೋಂದಣಿ",
      dashboard: "ಡ್ಯಾಶ್ಬೋರ್ಡ್",
      notifications: "ಅಧಿಸೂಚನೆಗಳು",
      search: "ಗ್ರಾಮ, ಡಾಕ್ಟರ್ ಮೂಲಕ ಕ್ಯಾಂಪ್ಗಳನ್ನು ಹುಡುಕಿ...",
      logout: "ಲಾಗ್ ಔಟ್",
      welcome: "ಸ್ವಾಗತ",
      profile: "ಪ್ರೊಫೈಲ್",
      searchPlaceholder: "ಗ್ರಾಮ, ಡಾಕ್ಟರ್, ಸೇವೆಗಳ ಮೂಲಕ ಹುಡುಕಿ..."
    }
  };

  const t = translations[language];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("🔍 Searching for:", searchQuery);
      navigate('/camp', { state: { search: searchQuery } });
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOrganizeCamp = () => {
    if (user?.role === 'organizer') {
      navigate('/organize-camp');
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="logo">
          <span className="logo-icon">🏥</span>
          <span className="logo-text">Village Health Care</span>
        </div>
      </div>

      <div className="nav-center">
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar"
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>
      </div>

      <div className="nav-right">
        <a href="/" className="nav-link">{t.home}</a>
        
        {isAuthenticated ? (
          <>
            <a href="/dashboard" className="nav-link">{t.dashboard}</a>
            <a href="/camp" className="nav-link">{t.camps}</a>
            <a href="/notifications" className="nav-link">{t.notifications}</a>
            
            <div className="user-welcome">
              <span>{t.welcome}, {user?.name}</span>
              <span className="user-role">({user?.role})</span>
            </div>
            
            {user?.role === 'organizer' && (
              <button className="nav-link organizer-btn" onClick={handleOrganizeCamp}>
                {t.registerCamp}
              </button>
            )}
            
            <button className="nav-link logout-btn" onClick={onLogout}>
              {t.logout}
            </button>
          </>
        ) : (
          <>
            <a href="/auth" className="nav-link login-btn">{t.login}</a>
            <a href="/auth" className="nav-link signup-btn">{t.signup}</a>
          </>
        )}
        
        <button className="language-btn" onClick={toggleLanguage}>
          {language === 'en' ? 'ಕನ್ನಡ' : 'English'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;