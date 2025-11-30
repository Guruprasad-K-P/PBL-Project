import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';

const PatientRegistrationPage = ({ user }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const camp = location.state?.camp;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: '',
    gender: '',
    phone: user?.phone || '',
    village: user?.village || '',
    symptoms: '',
    emergencyContact: '',
    anyMedications: '',
    bloodGroup: '',
    previousConditions: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const translations = {
    en: {
      title: "Register for Health Camp",
      campInfo: "Camp Information",
      personalInfo: "Personal Information",
      healthInfo: "Health Information",
      name: "Full Name",
      age: "Age",
      gender: "Gender",
      phone: "Phone Number",
      village: "Village",
      symptoms: "Symptoms / Health Concerns",
      emergencyContact: "Emergency Contact Number",
      anyMedications: "Current Medications",
      bloodGroup: "Blood Group",
      previousConditions: "Previous Medical Conditions",
      submit: "Submit Registration",
      submitting: "Submitting...",
      success: "Registration Successful!",
      successMessage: "You have successfully registered for the health camp.",
      backToCamps: "Back to Health Camps",
      selectGender: "Select Gender",
      male: "Male",
      female: "Female",
      other: "Other",
      selectBloodGroup: "Select Blood Group",
      required: "This field is required",
      optional: "Optional"
    },
    kn: {
      title: "ಹೆಲ್ತ್ ಕ್ಯಾಂಪ್ಗೆ ನೋಂದಾಯಿಸಿ",
      campInfo: "ಕ್ಯಾಂಪ್ ಮಾಹಿತಿ",
      personalInfo: "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ",
      healthInfo: "ಆರೋಗ್ಯ ಮಾಹಿತಿ",
      name: "ಪೂರ್ಣ ಹೆಸರು",
      age: "ವಯಸ್ಸು",
      gender: "ಲಿಂಗ",
      phone: "ಫೋನ್ ನಂಬರ್",
      village: "ಗ್ರಾಮ",
      symptoms: "ಲಕ್ಷಣಗಳು / ಆರೋಗ್ಯ ಕಾಳಜಿಗಳು",
      emergencyContact: "ಅತ್ಯಾವಶ್ಯಕ ಸಂಪರ್ಕ ಸಂಖ್ಯೆ",
      anyMedications: "ಪ್ರಸ್ತುತ ಮದ್ದುಗಳು",
      bloodGroup: "ರಕ್ತದ ಗುಂಪು",
      previousConditions: "ಹಿಂದಿನ ವೈದ್ಯಕೀಯ ಪರಿಸ್ಥಿತಿಗಳು",
      submit: "ನೋಂದಣಿ ಸಲ್ಲಿಸಿ",
      submitting: "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...",
      success: "ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ!",
      successMessage: "ನೀವು ಹೆಲ್ತ್ ಕ್ಯಾಂಪ್ಗೆ ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಿದ್ದೀರಿ.",
      backToCamps: "ಹೆಲ್ತ್ ಕ್ಯಾಂಪ್ಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
      selectGender: "ಲಿಂಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      male: "ಪುರುಷ",
      female: "ಸ್ತ್ರೀ",
      other: "ಇತರೆ",
      selectBloodGroup: "ರಕ್ತದ ಗುಂಪನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      required: "ಈ ಫೀಲ್ಡ್ ಅಗತ್ಯವಿದೆ",
      optional: "ಐಚ್ಛಿಕ"
    }
  };

  const t = translations[language];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("🔄 Starting patient registration...");
    console.log("📋 Form data:", formData);
    console.log("🏥 Camp:", camp);

    // Create registration object
    const registration = {
      id: Date.now(),
      patientId: user?.id,
      patientName: formData.name,
      patientAge: formData.age,
      patientGender: formData.gender,
      patientPhone: formData.phone,
      patientVillage: formData.village,
      campId: camp.id,
      campName: camp.campName,
      campLocation: camp.location.village,
      campDate: camp.date,
      doctorName: camp.doctorName,
      symptoms: formData.symptoms,
      emergencyContact: formData.emergencyContact,
      anyMedications: formData.anyMedications,
      bloodGroup: formData.bloodGroup,
      previousConditions: formData.previousConditions,
      registrationDate: new Date().toISOString(),
      status: "registered"
    };

    try {
      // Get existing registrations from localStorage
      const existingRegistrations = JSON.parse(localStorage.getItem('campRegistrations') || '[]');
      
      // Add new registration
      const updatedRegistrations = [...existingRegistrations, registration];
      
      // Save to localStorage
      localStorage.setItem('campRegistrations', JSON.stringify(updatedRegistrations));
      
      // Update camp participants count
      const organizerCamps = JSON.parse(localStorage.getItem('organizerCamps') || '[]');
      const healthCamps = JSON.parse(localStorage.getItem('healthCamps') || '[]');
      
      // Check in organizer camps first
      let campIndex = organizerCamps.findIndex(c => c.id === camp.id);
      if (campIndex !== -1) {
        organizerCamps[campIndex].currentParticipants = (organizerCamps[campIndex].currentParticipants || 0) + 1;
        localStorage.setItem('organizerCamps', JSON.stringify(organizerCamps));
      } else {
        // Check in health camps
        campIndex = healthCamps.findIndex(c => c.id === camp.id);
        if (campIndex !== -1) {
          healthCamps[campIndex].currentParticipants = (healthCamps[campIndex].currentParticipants || 0) + 1;
          localStorage.setItem('healthCamps', JSON.stringify(healthCamps));
        }
      }

      // Update user's registered camps
      const userRegisteredCamps = JSON.parse(localStorage.getItem(`user_${user?.id}_registered_camps`) || '[]');
      userRegisteredCamps.push(camp.id);
      localStorage.setItem(`user_${user?.id}_registered_camps`, JSON.stringify(userRegisteredCamps));

      console.log("✅ Patient registration successful!");
      console.log("📊 Registration Details:", registration);
      
      setLoading(false);
      setSubmitted(true);
      
      setTimeout(() => {
        navigate('/camp');
      }, 2000);
      
    } catch (error) {
      console.error("❌ Registration error:", error);
      setLoading(false);
      alert("Registration failed. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="page">
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: '#f0fff4',
          borderRadius: '0.5rem',
          border: '1px solid #48bb78',
          margin: '2rem 0'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: '#2d3748', marginBottom: '1rem' }}>{t.success}</h2>
          <p style={{ color: '#4a5568', marginBottom: '2rem' }}>{t.successMessage}</p>
          <button
            onClick={() => navigate('/camp')}
            style={{
              background: '#3182ce',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem'
            }}
          >
            {t.backToCamps}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t.title}</h1>
        <button
          onClick={() => navigate('/camp')}
          style={{
            background: 'transparent',
            border: '1px solid #e2e8f0',
            color: '#4a5568',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          ← {t.backToCamps}
        </button>
      </div>

      {camp && (
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>{t.campInfo}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>🏥 Camp Name:</strong>
              <p style={{ margin: '0.25rem 0', color: '#4a5568' }}>{camp.campName}</p>
            </div>
            <div>
              <strong>📍 Location:</strong>
              <p style={{ margin: '0.25rem 0', color: '#4a5568' }}>{camp.location.village}, {camp.location.district}</p>
            </div>
            <div>
              <strong>📅 Date:</strong>
              <p style={{ margin: '0.25rem 0', color: '#4a5568' }}>{new Date(camp.date).toLocaleDateString()}</p>
            </div>
            <div>
              <strong>👨‍⚕️ Doctor:</strong>
              <p style={{ margin: '0.25rem 0', color: '#4a5568' }}>{camp.doctorName}</p>
            </div>
          </div>
        </div>
      )}

      <div className="form-container" style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '1.5rem', color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            {t.personalInfo}
          </h3>
          
          <div className="form-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>
                {t.name} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>
                {t.age} *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="1"
                max="120"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>
                {t.gender} *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  background: 'white'
                }}
              >
                <option value="">{t.selectGender}</option>
                <option value="male">{t.male}</option>
                <option value="female">{t.female}</option>
                <option value="other">{t.other}</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>
                {t.bloodGroup} ({t.optional})
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  background: 'white'
                }}
              >
                <option value="">{t.selectBloodGroup}</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>
                {t.phone} *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>
                {t.emergencyContact} *
              </label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>
              {t.village} *
            </label>
            <input
              type="text"
              name="village"
              value={formData.village}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          <h3 style={{ 
            marginTop: '2rem', 
            marginBottom: '1.5rem', 
            color: '#2d3748', 
            borderBottom: '2px solid #e2e8f0', 
            paddingBottom: '0.5rem' 
          }}>
            {t.healthInfo}
          </h3>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>
              {t.symptoms} *
            </label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Describe your symptoms or health concerns in detail..."
              required
              rows="4"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>
              {t.anyMedications} ({t.optional})
            </label>
            <textarea
              name="anyMedications"
              value={formData.anyMedications}
              onChange={handleChange}
              placeholder="List any medications you are currently taking, including dosage and frequency..."
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d3748' }}>
              {t.previousConditions} ({t.optional})
            </label>
            <textarea
              name="previousConditions"
              value={formData.previousConditions}
              onChange={handleChange}
              placeholder="Any previous medical conditions, surgeries, allergies, or family medical history..."
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
            style={{
              background: loading ? '#a0aec0' : '#3182ce',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              width: '100%'
            }}
          >
            {loading ? t.submitting : t.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistrationPage;