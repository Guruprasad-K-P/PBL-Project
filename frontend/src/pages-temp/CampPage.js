import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import CampCard from '../component-temp/CampCard';

const CampPage = ({ user }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [camps, setCamps] = useState([]);
  const [filteredCamps, setFilteredCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const translations = {
    en: {
      title: "Health Camps",
      searchPlaceholder: "Search by camp name, doctor, services...",
      filterByDistrict: "Filter by District",
      allDistricts: "All Districts",
      noCamps: "No health camps available",
      loading: "Loading camps...",
      registerSuccess: "Successfully registered for the camp!",
      registerError: "Error registering for camp",
      alreadyRegistered: "You are already registered for this camp",
      campFull: "This camp is already full"
    },
    kn: {
      title: "ಆರೋಗ್ಯ ಶಿಬಿರಗಳು",
      searchPlaceholder: "ಶಿಬಿರದ ಹೆಸರು, ಡಾಕ್ಟರ್, ಸೇವೆಗಳಿಂದ ಹುಡುಕಿ...",
      filterByDistrict: "ಜಿಲ್ಲೆಯಿಂದ ಫಿಲ್ಟರ್ ಮಾಡಿ",
      allDistricts: "ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು",
      noCamps: "ಯಾವುದೇ ಆರೋಗ್ಯ ಶಿಬಿರಗಳು ಲಭ್ಯವಿಲ್ಲ",
      loading: "ಶಿಬಿರಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
      registerSuccess: "ಶಿಬಿರಕ್ಕೆ ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿತರಾಗಿದ್ದೀರಿ!",
      registerError: "ಶಿಬಿರಕ್ಕೆ ನೋಂದಣಿ ಮಾಡುವಲ್ಲಿ ದೋಷ",
      alreadyRegistered: "ನೀವು ಈಗಾಗಲೇ ಈ ಶಿಬಿರಕ್ಕೆ ನೋಂದಾಯಿತರಾಗಿದ್ದೀರಿ",
      campFull: "ಈ ಶಿಬಿರ ಈಗಾಗಲೇ ಪೂರ್ಣವಾಗಿದೆ"
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadCamps();
  }, []);

  useEffect(() => {
    filterCamps();
  }, [searchTerm, selectedDistrict, camps]);

  const loadCamps = () => {
    try {
      setLoading(true);
      // Load from both localStorage sources
      const organizerCamps = JSON.parse(localStorage.getItem('organizerCamps') || '[]');
      const sampleCamps = JSON.parse(localStorage.getItem('healthCamps') || '[]');
      
      const allCamps = [...organizerCamps, ...sampleCamps];
      
      // Filter out camps with missing required fields and add defaults
      const validCamps = allCamps.filter(camp => 
        camp && 
        camp.campName && 
        camp.location && 
        camp.location.village && 
        camp.location.district
      ).map(camp => ({
        ...camp,
        currentParticipants: camp.currentParticipants || 0,
        maxParticipants: camp.maxParticipants || 100,
        status: camp.status || 'upcoming',
        isFree: camp.isFree !== undefined ? camp.isFree : true,
        services: camp.services || [],
        doctorName: camp.doctorName || 'Dr. Not Specified',
        organizer: camp.organizer || 'Unknown Organizer'
      }));

      console.log("Loaded camps:", validCamps);
      setCamps(validCamps);
      setFilteredCamps(validCamps);
    } catch (error) {
      console.error('Error loading camps:', error);
      setCamps([]);
      setFilteredCamps([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCamps = () => {
    if (!camps || camps.length === 0) {
      setFilteredCamps([]);
      return;
    }

    let filtered = camps.filter(camp => {
      if (!camp) return false;

      // Safe search term filtering
      const searchLower = (searchTerm || '').toLowerCase();
      
      if (searchLower) {
        const matchesSearch = 
          (camp.campName && camp.campName.toLowerCase().includes(searchLower)) ||
          (camp.doctorName && camp.doctorName.toLowerCase().includes(searchLower)) ||
          (camp.organizer && camp.organizer.toLowerCase().includes(searchLower)) ||
          (camp.location && camp.location.village && camp.location.village.toLowerCase().includes(searchLower)) ||
          (camp.location && camp.location.district && camp.location.district.toLowerCase().includes(searchLower)) ||
          (camp.services && Array.isArray(camp.services) && camp.services.some(service => 
            service && service.toLowerCase().includes(searchLower)
          ));
        
        if (!matchesSearch) return false;
      }

      // Safe district filtering
      if (selectedDistrict && selectedDistrict !== 'all') {
        if (!camp.location || !camp.location.district) return false;
        return camp.location.district.toLowerCase() === selectedDistrict.toLowerCase();
      }

      return true;
    });

    setFilteredCamps(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleRegister = (camp) => {
    if (!user) {
      alert('Please login to register for camps');
      navigate('/auth');
      return;
    }

    // Check if already registered
    const userRegisteredCamps = JSON.parse(localStorage.getItem(`user_${user.id}_registered_camps`) || '[]');
    if (userRegisteredCamps.includes(camp.id)) {
      alert(t.alreadyRegistered);
      return;
    }

    // Check if camp is full
    if (camp.currentParticipants >= camp.maxParticipants) {
      alert(t.campFull);
      return;
    }

    console.log("🚀 Navigating to registration form for camp:", camp);
    
    // Navigate to PatientRegistrationPage with camp data
    navigate('/register-patient', { state: { camp } });
  };

  // Get unique districts safely
  const getDistricts = () => {
    if (!camps || camps.length === 0) return [];
    
    const districts = camps
      .filter(camp => camp && camp.location && camp.location.district)
      .map(camp => camp.location.district)
      .filter((district, index, self) => 
        district && self.indexOf(district) === index
      )
      .sort();
    
    return districts;
  };

  const districts = getDistricts();

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
        <h1>{t.title}</h1>
        <p>{filteredCamps.length} {language === 'en' ? 'camps found' : 'ಶಿಬಿರಗಳು ಕಂಡುಬಂದಿವೆ'}</p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section" style={{
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          alignItems: 'end'
        }}>
          {/* Search Input */}
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              🔍 {language === 'en' ? 'Search' : 'ಹುಡುಕಿ'}
            </label>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* District Filter */}
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              📍 {t.filterByDistrict}
            </label>
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                background: 'white'
              }}
            >
              <option value="all">{t.allDistricts}</option>
              {districts.map(district => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || selectedDistrict) && (
            <div className="form-group">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDistrict('');
                }}
                style={{
                  background: '#718096',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  width: '100%'
                }}
              >
                🗑️ {language === 'en' ? 'Clear Filters' : 'ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Camps List */}
      <div className="camps-list">
        {filteredCamps.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#718096', marginBottom: '1rem' }}>
              {searchTerm || selectedDistrict ? 
                (language === 'en' ? 'No camps match your search' : 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಹೊಂದುವ ಶಿಬಿರಗಳಿಲ್ಲ') : 
                t.noCamps}
            </h3>
            <p style={{ color: '#a0aec0' }}>
              {searchTerm || selectedDistrict ? 
                (language === 'en' ? 'Try changing your search terms or filters' : 'ನಿಮ್ಮ ಹುಡುಕಾಟದ ಪದಗಳನ್ನು ಅಥವಾ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಬದಲಾಯಿಸಿ') : 
                (language === 'en' ? 'Check back later for new health camps' : 'ಹೊಸ ಆರೋಗ್ಯ ಶಿಬಿರಗಳಿಗಾಗಿ ನಂತರ ಪರಿಶೀಲಿಸಿ')}
            </p>
          </div>
        ) : (
          filteredCamps.map(camp => (
            <CampCard
              key={camp.id}
              camp={camp}
              user={user}
              onRegister={handleRegister}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CampPage;