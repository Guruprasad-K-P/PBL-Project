import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const OrganizerCampPage = ({ user }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    campName: '',
    date: '',
    time: '',
    doctorName: '',
    doctorSpecialization: '',
    village: '',
    district: '',
    address: '',
    landmark: '',
    services: [],
    maxParticipants: 100,
    description: '',
    contactNumber: user?.phone || '',
    organizerName: user?.name || ''
  });

  const [loading, setLoading] = useState(false);

  const translations = {
    en: {
      title: "Organize New Health Camp",
      campDetails: "Camp Details",
      locationDetails: "Location Details",
      servicesDetails: "Services & Capacity",
      campName: "Camp Name",
      date: "Camp Date",
      time: "Camp Time",
      doctorName: "Doctor Name",
      doctorSpecialization: "Doctor Specialization",
      village: "Village Name",
      district: "District",
      address: "Full Address",
      landmark: "Landmark",
      services: "Services Offered",
      maxParticipants: "Maximum Participants",
      description: "Camp Description",
      contactNumber: "Contact Number",
      organizerName: "Organizer Name",
      submit: "Create Health Camp",
      submitting: "Creating Camp...",
      success: "Camp Created Successfully!",
      successMessage: "Your health camp has been created and is now visible to patients.",
      availableServices: [
        "General Checkup",
        "Blood Test",
        "BP Check",
        "Eye Care",
        "Dental Checkup",
        "Child Health",
        "Medicine Distribution",
        "Diabetes Screening",
        "Cardiac Checkup",
        "Women's Health"
      ]
    },
    kn: {
      title: "ಹೊಸ ಹೆಲ್ತ್ ಕ್ಯಾಂಪ್ ಆಯೋಜಿಸಿ",
      campDetails: "ಕ್ಯಾಂಪ್ ವಿವರಗಳು",
      locationDetails: "ಸ್ಥಳ ವಿವರಗಳು",
      servicesDetails: "ಸೇವೆಗಳು & ಸಾಮರ್ಥ್ಯ",
      campName: "ಕ್ಯಾಂಪ್ ಹೆಸರು",
      date: "ಕ್ಯಾಂಪ್ ದಿನಾಂಕ",
      time: "ಕ್ಯಾಂಪ್ ಸಮಯ",
      doctorName: "ಡಾಕ್ಟರ್ ಹೆಸರು",
      doctorSpecialization: "ಡಾಕ್ಟರ್ ವಿಶೇಷತೆ",
      village: "ಗ್ರಾಮದ ಹೆಸರು",
      district: "ಜಿಲ್ಲೆ",
      address: "ಪೂರ್ಣ ವಿಳಾಸ",
      landmark: "ಲ್ಯಾಂಡ್ಮಾರ್ಕ್",
      services: "ಒದಗಿಸುವ ಸೇವೆಗಳು",
      maxParticipants: "ಗರಿಷ್ಠ ಭಾಗವಹಿಸುವವರು",
      description: "ಕ್ಯಾಂಪ್ ವಿವರಣೆ",
      contactNumber: "ಸಂಪರ್ಕ ಸಂಖ್ಯೆ",
      organizerName: "ಆಯೋಜಕರ ಹೆಸರು",
      submit: "ಹೆಲ್ತ್ ಕ್ಯಾಂಪ್ ರಚಿಸಿ",
      submitting: "ಕ್ಯಾಂಪ್ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
      success: "ಕ್ಯಾಂಪ್ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!",
      successMessage: "ನಿಮ್ಮ ಹೆಲ್ತ್ ಕ್ಯಾಂಪ್ ರಚಿಸಲಾಗಿದೆ ಮತ್ತು ಈಗ ರೋಗಿಗಳಿಗೆ ಗೋಚರಿಸುತ್ತದೆ.",
      availableServices: [
        "ಸಾಮಾನ್ಯ ತಪಾಸಣೆ",
        "ರಕ್ತ ಪರೀಕ್ಷೆ",
        "ಬಿಪಿ ತಪಾಸಣೆ",
        "ಕಣ್ಣಿನ ಚಿಕಿತ್ಸೆ",
        "ದಂತ ಚಿಕಿತ್ಸೆ",
        "ಮಗು ಆರೋಗ್ಯ",
        "ಔಷಧಿ ವಿತರಣೆ",
        "ಮಧುಮೇಹ ತಪಾಸಣೆ",
        "ಹೃದಯ ತಪಾಸಣೆ",
        "ಮಹಿಳೆಯರ ಆರೋಗ್ಯ"
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

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("🔄 Creating new health camp...");
    console.log("📋 Camp data:", formData);
    console.log("👤 Current user:", user);

    // Create new camp object with consistent organizer ID
    const newCamp = {
      id: Date.now(), // Use timestamp for unique camp ID
      campName: formData.campName,
      location: {
        village: formData.village,
        district: formData.district,
        address: formData.address
      },
      date: `${formData.date}T${formData.time}:00`,
      doctorName: formData.doctorName,
      services: formData.services,
      maxParticipants: parseInt(formData.maxParticipants),
      currentParticipants: 0,
      status: "upcoming",
      organizer: formData.organizerName,
      isFree: true,
      organizerId: user?.id, // Use consistent user ID
      organizerEmail: user?.email, // Store email for backup identification
      contactNumber: formData.contactNumber,
      description: formData.description,
      createdAt: new Date().toISOString()
    };

    console.log("✅ New camp created:", newCamp);

    try {
      // Get existing camps from localStorage
      const existingCamps = JSON.parse(localStorage.getItem('organizerCamps') || '[]');
      
      // Add new camp
      const updatedCamps = [...existingCamps, newCamp];
      
      // Save to localStorage
      localStorage.setItem('organizerCamps', JSON.stringify(updatedCamps));

      console.log("💾 Camp saved to localStorage. Total camps:", updatedCamps.length);
      console.log("📊 Organizer ID:", user?.id);
      console.log("📧 Organizer Email:", user?.email);

      // Also save a backup reference for this organizer
      const organizerCamps = JSON.parse(localStorage.getItem(`organizer_${user?.id}_camps`) || '[]');
      organizerCamps.push(newCamp.id);
      localStorage.setItem(`organizer_${user?.id}_camps`, JSON.stringify(organizerCamps));

      // Save camp details in organizer-specific storage as backup
      const organizerCampDetails = JSON.parse(localStorage.getItem(`organizer_${user?.id}_camp_details`) || '[]');
      organizerCampDetails.push(newCamp);
      localStorage.setItem(`organizer_${user?.id}_camp_details`, JSON.stringify(organizerCampDetails));

      console.log("🔄 Backup storage created for organizer:", user?.id);

      // Simulate API call delay
      setTimeout(() => {
        setLoading(false);
        alert(t.success);
        console.log("🎉 Camp creation completed. Redirecting to Health Camps...");
        navigate('/camp');
      }, 1500);
    } catch (error) {
      console.error("❌ Error saving camp:", error);
      setLoading(false);
      alert("Error creating camp. Please try again.");
    }
  };

  return (
    <div className="page">
      <h1>{t.title}</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h3>{t.campDetails}</h3>
          
          <div className="form-row">
            <div className="form-group small">
              <label>{t.campName} *</label>
              <input
                type="text"
                name="campName"
                value={formData.campName}
                onChange={handleChange}
                placeholder="e.g., Free Health Checkup Camp"
                required
              />
            </div>

            <div className="form-group small">
              <label>{t.maxParticipants} *</label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min="1"
                max="1000"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group small">
              <label>{t.date} *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group small">
              <label>{t.time} *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group small">
              <label>{t.doctorName} *</label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                placeholder="Dr. Name"
                required
              />
            </div>

            <div className="form-group small">
              <label>{t.doctorSpecialization}</label>
              <input
                type="text"
                name="doctorSpecialization"
                value={formData.doctorSpecialization}
                onChange={handleChange}
                placeholder="e.g., General Physician"
              />
            </div>
          </div>

          <h3 style={{marginTop: '2rem'}}>{t.locationDetails}</h3>

          <div className="form-row">
            <div className="form-group small">
              <label>{t.village} *</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                placeholder="Enter village name"
                required
              />
            </div>

            <div className="form-group small">
              <label>{t.district} *</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Enter district name"
                required
              />
            </div>
          </div>

          <div className="form-group large">
            <label>{t.address} *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address of the camp location with detailed directions..."
              required
              className="large-textarea"
            />
          </div>

          <div className="form-group small">
            <label>{t.landmark}</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="Nearby landmark for easy location"
            />
          </div>

          <h3 style={{marginTop: '2rem'}}>{t.servicesDetails}</h3>

          <div className="form-group">
            <label>{t.services} *</label>
            <div className="services-checkbox-grid">
              {t.availableServices.map(service => (
                <label key={service} className="service-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                  />
                  {service}
                </label>
              ))}
            </div>
            {formData.services.length === 0 && (
              <p style={{color: '#e53e3e', fontSize: '0.9rem', marginTop: '0.5rem'}}>
                Please select at least one service
              </p>
            )}
          </div>

          <div className="form-row">
            <div className="form-group small">
              <label>{t.contactNumber} *</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group small">
              <label>{t.organizerName} *</label>
              <input
                type="text"
                name="organizerName"
                value={formData.organizerName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group large">
            <label>{t.description}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional information about the camp, special instructions, facilities available, etc..."
              className="large-textarea"
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading || formData.services.length === 0}
          >
            {loading ? t.submitting : t.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganizerCampPage;