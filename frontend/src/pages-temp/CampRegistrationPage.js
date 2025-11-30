// pages/CampRegistration.js
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const CampRegistration = () => {
  const { language } = useLanguage();
  const [isOrganizer, setIsOrganizer] = useState(false);

  const translations = {
    en: {
      patientTitle: "Register for Health Camp",
      organizerTitle: "Organize New Health Camp",
      name: "Full Name",
      age: "Age",
      symptoms: "Symptoms", 
      village: "Village Name",
      doctorName: "Doctor Name",
      date: "Camp Date",
      services: "Services Offered",
      register: "Register",
      organize: "Organize Camp",
      switchPatient: "Register as Patient",
      switchOrganizer: "Organize Camp"
    },
    kn: {
      patientTitle: "ಹೆಲ್ತ್ ಕ್ಯಾಂಪ್ಗೆ ನೋಂದಾಯಿಸಿ",
      organizerTitle: "ಹೊಸ ಹೆಲ್ತ್ ಕ್ಯಾಂಪ್ ಆಯೋಜಿಸಿ",
      name: "ಪೂರ್ಣ ಹೆಸರು",
      age: "ವಯಸ್ಸು",
      symptoms: "ಲಕ್ಷಣಗಳು",
      village: "ಗ್ರಾಮದ ಹೆಸರು",
      doctorName: "ಡಾಕ್ಟರ್ ಹೆಸರು", 
      date: "ಕ್ಯಾಂಪ್ ದಿನಾಂಕ",
      services: "ಒದಗಿಸುವ ಸೇವೆಗಳು",
      register: "ನೋಂದಾಯಿಸಿ",
      organize: "ಕ್ಯಾಂಪ್ ಆಯೋಜಿಸಿ",
      switchPatient: "ರೋಗಿಯಾಗಿ ನೋಂದಾಯಿಸಿ",
      switchOrganizer: "ಕ್ಯಾಂಪ್ ಆಯೋಜಿಸಿ"
    }
  };

  const t = translations[language];

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="role-switcher">
          <button 
            className={!isOrganizer ? 'role-btn active' : 'role-btn'}
            onClick={() => setIsOrganizer(false)}
          >
            {t.switchPatient}
          </button>
          <button 
            className={isOrganizer ? 'role-btn active' : 'role-btn'}
            onClick={() => setIsOrganizer(true)}
          >
            {t.switchOrganizer}
          </button>
        </div>

        <h2>{isOrganizer ? t.organizerTitle : t.patientTitle}</h2>
        
        <form className="registration-form">
          {isOrganizer ? (
            <>
              <div className="form-group">
                <label>{t.village}</label>
                <input type="text" placeholder={t.village} />
              </div>
              <div className="form-group">
                <label>{t.doctorName}</label>
                <input type="text" placeholder={t.doctorName} />
              </div>
              <div className="form-group">
                <label>{t.date}</label>
                <input type="date" />
              </div>
              <div className="form-group">
                <label>{t.services}</label>
                <textarea placeholder={t.services} rows="3"></textarea>
              </div>
              <button type="submit" className="submit-btn">
                {t.organize}
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>{t.name}</label>
                <input type="text" placeholder={t.name} />
              </div>
              <div className="form-group">
                <label>{t.age}</label>
                <input type="number" placeholder={t.age} />
              </div>
              <div className="form-group">
                <label>{t.village}</label>
                <input type="text" placeholder={t.village} />
              </div>
              <div className="form-group">
                <label>{t.symptoms}</label>
                <textarea placeholder={t.symptoms} rows="3"></textarea>
              </div>
              <button type="submit" className="submit-btn">
                {t.register}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default CampRegistration;