import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const OrganizerRegistrations = ({ user }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCamp, setSelectedCamp] = useState('all');
  const [organizerCamps, setOrganizerCamps] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);

  const translations = {
    en: {
      title: "Patient Registrations",
      backToDashboard: "Back to Dashboard",
      selectCamp: "Select Camp",
      allCamps: "All Camps",
      noRegistrations: "No registrations found",
      loading: "Loading registrations...",
      patientName: "Patient Name",
      age: "Age",
      gender: "Gender",
      phone: "Phone",
      village: "Village",
      camp: "Camp",
      registrationDate: "Registration Date",
      symptoms: "Symptoms",
      medications: "Medications",
      bloodGroup: "Blood Group",
      previousConditions: "Medical History",
      emergencyContact: "Emergency Contact",
      status: "Status",
      registered: "Registered",
      attended: "Attended",
      cancelled: "Cancelled",
      totalRegistrations: "Total Registrations",
      exportData: "Export Data",
      viewDetails: "View Details",
      updateStatus: "Update Status",
      debugInfo: "Debug Information",
      organizerId: "Organizer ID",
      campId: "Camp ID",
      totalCamps: "Total Camps",
      totalAllRegistrations: "Total All Registrations"
    },
    kn: {
      title: "ರೋಗಿ ನೋಂದಣಿಗಳು",
      backToDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
      selectCamp: "ಶಿಬಿರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      allCamps: "ಎಲ್ಲಾ ಶಿಬಿರಗಳು",
      noRegistrations: "ಯಾವುದೇ ನೋಂದಣಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
      loading: "ನೋಂದಣಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
      patientName: "ರೋಗಿಯ ಹೆಸರು",
      age: "ವಯಸ್ಸು",
      gender: "ಲಿಂಗ",
      phone: "ಫೋನ್",
      village: "ಗ್ರಾಮ",
      camp: "ಶಿಬಿರ",
      registrationDate: "ನೋಂದಣಿ ದಿನಾಂಕ",
      symptoms: "ಲಕ್ಷಣಗಳು",
      medications: "ಮದ್ದುಗಳು",
      bloodGroup: "ರಕ್ತದ ಗುಂಪು",
      previousConditions: "ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ",
      emergencyContact: "ಅತ್ಯಾವಶ್ಯಕ ಸಂಪರ್ಕ",
      status: "ಸ್ಥಿತಿ",
      registered: "ನೋಂದಾಯಿತ",
      attended: "ಹಾಜರಾದ",
      cancelled: "ರದ್ದುಗೊಂಡ",
      totalRegistrations: "ಒಟ್ಟು ನೋಂದಣಿಗಳು",
      exportData: "ಡೇಟಾ ರಫ್ತು ಮಾಡಿ",
      viewDetails: "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
      updateStatus: "ಸ್ಥಿತಿಯನ್ನು ನವೀಕರಿಸಿ",
      debugInfo: "ಡೀಬಗ್ ಮಾಹಿತಿ",
      organizerId: "ಆಯೋಜಕ ಐಡಿ",
      campId: "ಶಿಬಿರ ಐಡಿ",
      totalCamps: "ಒಟ್ಟು ಶಿಬಿರಗಳು",
      totalAllRegistrations: "ಒಟ್ಟು ಎಲ್ಲಾ ನೋಂದಣಿಗಳು"
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadOrganizerData();
  }, [user]);

  const loadOrganizerData = () => {
    try {
      setLoading(true);
      console.log("🔄 Loading organizer data for user:", user);
      
      // Load ALL camps from both sources
      const organizerCampsData = JSON.parse(localStorage.getItem('organizerCamps') || '[]');
      const healthCampsData = JSON.parse(localStorage.getItem('healthCamps') || '[]');
      const allCamps = [...organizerCampsData, ...healthCampsData];
      
      console.log("📊 All camps found:", allCamps.length);
      console.log("🏥 Organizer camps:", organizerCampsData.length);
      console.log("🏥 Health camps:", healthCampsData.length);

      // Filter camps that belong to this organizer
      const myCamps = allCamps.filter(camp => {
        if (!camp) return false;
        
        const isOrganizerCamp = 
          camp.organizerId === user?.id || 
          camp.organizerEmail === user?.email ||
          camp.organizer === user?.name;
        
        console.log(`Camp: ${camp.campName}, Organizer: ${camp.organizer}, Match: ${isOrganizerCamp}`);
        return isOrganizerCamp;
      });

      console.log("✅ Organizer's camps:", myCamps);
      setOrganizerCamps(myCamps);

      // Load ALL registrations
      const allRegistrationsData = JSON.parse(localStorage.getItem('campRegistrations') || '[]');
      console.log("📋 All registrations found:", allRegistrationsData.length);
      setAllRegistrations(allRegistrationsData);

      // Filter registrations for organizer's camps only
      const myCampIds = myCamps.map(camp => camp.id);
      console.log("🎯 Organizer's camp IDs:", myCampIds);

      const myRegistrations = allRegistrationsData.filter(reg => {
        if (!reg) return false;
        const isMyCamp = myCampIds.includes(reg.campId);
        console.log(`Registration: ${reg.patientName}, Camp ID: ${reg.campId}, My Camp: ${isMyCamp}`);
        return isMyCamp;
      });

      console.log("✅ Organizer's registrations:", myRegistrations);
      setRegistrations(myRegistrations);

    } catch (error) {
      console.error('❌ Error loading organizer registrations:', error);
      setRegistrations([]);
      setOrganizerCamps([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (registrationId, newStatus) => {
    try {
      const updatedRegistrations = registrations.map(reg =>
        reg.id === registrationId ? { ...reg, status: newStatus } : reg
      );
      
      // Update localStorage
      const allRegistrationsData = JSON.parse(localStorage.getItem('campRegistrations') || '[]');
      const updatedAllRegistrations = allRegistrationsData.map(reg =>
        reg.id === registrationId ? { ...reg, status: newStatus } : reg
      );
      
      localStorage.setItem('campRegistrations', JSON.stringify(updatedAllRegistrations));
      setRegistrations(updatedRegistrations);
      
      alert(language === 'en' ? 'Status updated successfully!' : 'ಸ್ಥಿತಿ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert(language === 'en' ? 'Error updating status' : 'ಸ್ಥಿತಿಯನ್ನು ನವೀಕರಿಸುವಲ್ಲಿ ದೋಷ');
    }
  };

  const handleExportData = () => {
    if (filteredRegistrations.length === 0) {
      alert(language === 'en' ? 'No data to export' : 'ರಫ್ತು ಮಾಡಲು ಡೇಟಾ ಇಲ್ಲ');
      return;
    }

    const dataToExport = filteredRegistrations.map(reg => ({
      'Patient Name': reg.patientName,
      'Age': reg.patientAge || 'N/A',
      'Gender': reg.patientGender || 'N/A',
      'Phone': reg.patientPhone,
      'Village': reg.patientVillage,
      'Camp': reg.campName,
      'Registration Date': new Date(reg.registrationDate).toLocaleDateString(),
      'Status': reg.status,
      'Emergency Contact': reg.emergencyContact,
      'Blood Group': reg.bloodGroup || 'N/A',
      'Symptoms': reg.symptoms || 'N/A'
    }));

    const csv = convertToCSV(dataToExport);
    downloadCSV(csv, 'patient_registrations.csv');
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        `"${String(value).replace(/"/g, '""')}"`
      ).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRegistrations = selectedCamp === 'all' 
    ? registrations 
    : registrations.filter(reg => reg.campId.toString() === selectedCamp);

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
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>{t.title}</h1>
            <p style={{ color: '#666', margin: 0 }}>
              {t.totalRegistrations}: {filteredRegistrations.length}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleExportData}
              disabled={filteredRegistrations.length === 0}
              style={{
                background: filteredRegistrations.length === 0 ? '#a0aec0' : '#48bb78',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                cursor: filteredRegistrations.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              📊 {t.exportData}
            </button>
            <button
              onClick={() => navigate('/organizer-dashboard')}
              style={{
                background: '#718096',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              ← {t.backToDashboard}
            </button>
          </div>
        </div>
      </div>

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          background: '#f0fff4', 
          border: '1px solid #48bb78', 
          borderRadius: '0.5rem', 
          padding: '1rem', 
          marginBottom: '1rem' 
        }}>
          <h4>🔧 {t.debugInfo}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.8rem' }}>
            <div><strong>{t.organizerId}:</strong> {user?.id}</div>
            <div><strong>{t.totalCamps}:</strong> {organizerCamps.length}</div>
            <div><strong>{t.totalAllRegistrations}:</strong> {allRegistrations.length}</div>
            <div><strong>{t.totalRegistrations}:</strong> {registrations.length}</div>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
            <strong>Camp IDs:</strong> {organizerCamps.map(camp => camp.id).join(', ')}
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: '600', color: '#2d3748' }}>
            {t.selectCamp}:
          </label>
          <select
            value={selectedCamp}
            onChange={(e) => setSelectedCamp(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              background: 'white',
              minWidth: '200px'
            }}
          >
            <option value="all">{t.allCamps}</option>
            {organizerCamps.map(camp => (
              <option key={camp.id} value={camp.id}>
                {camp.campName} ({camp.location?.village})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Registrations List */}
      <div className="registrations-list">
        {filteredRegistrations.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#718096', marginBottom: '1rem' }}>{t.noRegistrations}</h3>
            <p style={{ color: '#a0aec0', marginBottom: '1rem' }}>
              {language === 'en' 
                ? 'Patient registrations will appear here when they register for your camps.'
                : 'ರೋಗಿಗಳು ನಿಮ್ಮ ಶಿಬಿರಗಳಿಗೆ ನೋಂದಾಯಿಸಿದಾಗ ರೋಗಿ ನೋಂದಣಿಗಳು ಇಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತವೆ.'}
            </p>
            <div style={{ fontSize: '0.9rem', color: '#718096' }}>
              <p><strong>Tips:</strong></p>
              <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                <li>Make sure patients are registering for your camps</li>
                <li>Check if camps are properly linked to your organizer account</li>
                <li>Verify camp IDs match between camps and registrations</li>
              </ul>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredRegistrations.map(registration => (
              <div key={registration.id} style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>
                      👤 {registration.patientName}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.9rem', color: '#666' }}>
                      <span>📞 {registration.patientPhone}</span>
                      <span>📍 {registration.patientVillage}</span>
                      <span>🏥 {registration.campName}</span>
                      <span>🆔 {registration.campId}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <select
                      value={registration.status || 'registered'}
                      onChange={(e) => handleStatusUpdate(registration.id, e.target.value)}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.375rem',
                        fontSize: '0.8rem',
                        background: 'white'
                      }}
                    >
                      <option value="registered">{t.registered}</option>
                      <option value="attended">{t.attended}</option>
                      <option value="cancelled">{t.cancelled}</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <strong>{t.age}:</strong> {registration.patientAge || 'N/A'}
                  </div>
                  <div>
                    <strong>{t.gender}:</strong> {registration.patientGender || 'N/A'}
                  </div>
                  <div>
                    <strong>{t.bloodGroup}:</strong> {registration.bloodGroup || 'N/A'}
                  </div>
                  <div>
                    <strong>{t.emergencyContact}:</strong> {registration.emergencyContact}
                  </div>
                </div>

                {registration.symptoms && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>{t.symptoms}:</strong>
                    <p style={{ margin: '0.25rem 0', color: '#4a5568' }}>{registration.symptoms}</p>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#666' }}>
                  <span>
                    {t.registrationDate}: {new Date(registration.registrationDate).toLocaleDateString()}
                  </span>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    background: registration.status === 'attended' ? '#48bb78' : 
                               registration.status === 'cancelled' ? '#e53e3e' : '#3182ce',
                    color: 'white'
                  }}>
                    {registration.status === 'attended' ? t.attended : 
                     registration.status === 'cancelled' ? t.cancelled : t.registered}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerRegistrations;