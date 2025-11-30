import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const VolunteerRegistrationPage = ({ user }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    village: user?.village || '',
    district: user?.district || '',
    age: '',
    gender: '',
    skills: [],
    availability: '',
    experience: '',
    interests: [],
    emergencyContact: ''
  });

  const [loading, setLoading] = useState(false);

  const translations = {
    en: {
      title: "Volunteer Registration",
      personalInfo: "Personal Information",
      volunteerInfo: "Volunteer Information",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      village: "Village",
      district: "District",
      age: "Age",
      gender: "Gender",
      skills: "Skills & Expertise",
      availability: "Availability",
      experience: "Previous Experience",
      interests: "Areas of Interest",
      emergencyContact: "Emergency Contact",
      submit: "Register as Volunteer",
      submitting: "Registering...",
      success: "Registration Successful!",
      successMessage: "You have successfully registered as a volunteer. You can now participate in health camps and help organize community events.",
      selectGender: "Select Gender",
      male: "Male",
      female: "Female",
      other: "Other",
      availableSkills: [
        "Medical Assistance",
        "First Aid",
        "Patient Registration",
        "Camp Setup",
        "Crowd Management",
        "Health Education",
        "Data Entry",
        "Logistics",
        "Communication",
        "Translation Services"
      ],
      availableInterests: [
        "Health Camps",
        "Medical Camps",
        "Blood Donation Drives",
        "Health Awareness",
        "Child Health Programs",
        "Women's Health Initiatives",
        "Elderly Care",
        "Community Outreach",
        "Emergency Response"
      ],
      availabilityOptions: [
        "Weekdays",
        "Weekends",
        "Flexible",
        "On Call"
      ]
    },
    kn: {
      title: "ಸ್ವಯಂತರ ನೋಂದಣಿ",
      personalInfo: "ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ",
      volunteerInfo: "ಸ್ವಯಂತರ ಮಾಹಿತಿ",
      name: "ಪೂರ್ಣ ಹೆಸರು",
      email: "ಇಮೇಲ್ ವಿಳಾಸ",
      phone: "ಫೋನ್ ನಂಬರ್",
      village: "ಗ್ರಾಮ",
      district: "ಜಿಲ್ಲೆ",
      age: "ವಯಸ್ಸು",
      gender: "ಲಿಂಗ",
      skills: "ಕೌಶಲ್ಯಗಳು & ಪರಿಣತಿ",
      availability: "ಲಭ್ಯತೆ",
      experience: "ಹಿಂದಿನ ಅನುಭವ",
      interests: "ಆಸಕ್ತೆಯ ಕ್ಷೇತ್ರಗಳು",
      emergencyContact: "ತುರ್ತು ಸಂಪರ್ಕ",
      submit: "ಸ್ವಯಂತರನಾಗಿ ನೋಂದಣಿ",
      submitting: "ನೋಂದಾಯಿಸಲಾಗುತ್ತಿದೆ...",
      success: "ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ!",
      successMessage: "ನೀವು ಯಶಸ್ವಿಯಾಗಿ ಸ್ವಯಂತರನಾಗಿ ನೋಂದಾಯಿಸಿದ್ದೀರಿ. ಈಗ ನೀವು ಆರೋಗ್ಯ ಶಿಬಿರಗಳಲ್ ಭಾಗವಹಿಸಬಹುದು ಮತ್ತು ಸಮುದಾಯ ಸಮಾರಂಬು ಕಾರ್ಯಕ್ರಮಾಡಬಹುದು.",
      selectGender: "ಲಿಂಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      male: "ಪುರುಷ",
      female: "ಸ್ತ್ರೀ",
      other: "ಇತರೆ",
      availableSkills: [
        "ವೈದ್ಯುಕೀಯ ಸಹಾಯ",
        "ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ",
        "ರೋಗಿ ನೋಂದಣಿ",
        "ಶಿಬಿರ ವ್ಯವಸ್ಥೆ",
        "ಗುಂಪ ನಿರ್ವಹಣ",
        "ಆರೋಗ್ಯ ಶಿಕ್ಷಣೆ",
        "ದತ್ತಾಂಶ ನಮೂದಾಣ",
        "ಸಂವಹಾತ",
        "ಭಾಷಾಂತರ ಸೇವೆಗಳು"
      ],
      availableInterests: [
        "ಆರೋಗ್ಯ ಶಿಬಿರಗಳು",
        "ವೈದ್ಯುಕೀಯ ಶಿಬಿರಗಳು",
        "ರಕ್ತ ದಾನ ಚಳುವೆ",
        "ಆರೋಗ್ಯ ಜಾಗೃತೆ",
        "ಮಕುಮಕ್ಷಣೆ ಕಾರ್ಯಕ್ರಮಾಡ",
        "ಮಹಿಳೆಯರರ ಆರೋಗ್ಯ",
        "ವೃದ್ಧ ರಕ್ಷಣೆ",
        "ಸಮುದಾಯ ಪ್ರತಿಸಾಹಾರ"
      ],
      availabilityOptions: [
        "ವಾರದಿನಗಳು",
        "ವಾರಾಂತ್ರಗಳು",
        "ನಮಣಪಟ್ಟಿ",
        "ಕರೆಳಿಸಿದಾಗ"
      ]
    }
  };

  const t = translations[language];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("🔄 Starting volunteer registration...");
    console.log("📋 Form data:", formData);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const volunteerData = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        village: formData.village,
        district: formData.district,
        age: formData.age,
        gender: formData.gender,
        skills: formData.skills,
        availability: formData.availability,
        experience: formData.experience,
        interests: formData.interests,
        emergencyContact: formData.emergencyContact,
        role: 'volunteer',
        registeredAt: new Date().toISOString(),
        status: 'active'
      };

      // Save volunteer data
      const existingVolunteers = JSON.parse(localStorage.getItem('registeredVolunteers') || '[]');
      existingVolunteers.push(volunteerData);
      localStorage.setItem('registeredVolunteers', JSON.stringify(existingVolunteers));

      console.log("✅ Volunteer registration successful:", volunteerData);
      
      setLoading(false);
      alert(t.success + "\n\n" + t.successMessage);
      navigate('/dashboard');
    } catch (error) {
      console.error("❌ Registration error:", error);
      setLoading(false);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="page">
      <h1>{t.title}</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h3>{t.personalInfo}</h3>
          
          <div className="form-row">
            <div className="form-group small">
              <label>{t.name}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group small">
              <label>{t.email}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group small">
              <label>{t.phone}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="form-group small">
              <label>{t.age}</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="100"
                placeholder="Enter your age"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group small">
              <label>{t.gender}</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">{t.selectGender}</option>
                <option value="male">{t.male}</option>
                <option value="female">{t.female}</option>
                <option value="other">{t.other}</option>
              </select>
            </div>

            <div className="form-group small">
              <label>{t.village}</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                placeholder="Enter your village name"
                required
              />
            </div>
          </div>

          <div className="form-group small">
            <label>{t.district}</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="Enter your district name"
              required
            />
          </div>

          <h3 style={{marginTop: '2rem'}}>{t.volunteerInfo}</h3>

          <div className="form-group">
            <label>{t.skills}</label>
            <div className="skills-checkbox-grid">
              {t.availableSkills.map(skill => (
                <label key={skill} className="skill-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                  />
                  {skill}
                </label>
              ))}
            </div>
            {formData.skills.length === 0 && (
              <p style={{color: '#e53e3e', fontSize: '0.9rem', marginTop: '0.5rem'}}>
                Please select at least one skill
              </p>
            )}
          </div>

          <div className="form-row">
            <div className="form-group small">
              <label>{t.availability}</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
              >
                <option value="">{t.selectAvailability}</option>
                {t.availabilityOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-group small">
              <label>{t.emergencyContact}</label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Emergency contact number"
                required
              />
            </div>
          </div>

          <div className="form-group large">
            <label>{t.experience}</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Describe your previous volunteer experience, if any..."
              className="large-textarea"
              rows="4"
            />
          </div>

          <div className="form-group large">
            <label>{t.interests}</label>
            <div className="interests-checkbox-grid">
              {t.availableInterests.map(interest => (
                <label key={interest} className="interest-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading || formData.skills.length === 0}>
            {loading ? t.submitting : t.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VolunteerRegistrationPage;