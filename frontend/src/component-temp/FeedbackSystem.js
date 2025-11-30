import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const FeedbackSystem = ({ campId, user }) => {
  const { language } = useLanguage();
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [campFeedback, setCampFeedback] = useState([]);

  const translations = {
    en: {
      giveFeedback: "Give Feedback",
      yourExperience: "Your Experience",
      rateCamp: "Rate this health camp",
      writeFeedback: "Write your feedback...",
      submitFeedback: "Submit Feedback",
      thankYou: "Thank you for your feedback!",
      overallRating: "Overall Rating",
      basedOn: "Based on {count} reviews",
      noReviews: "No reviews yet",
      poor: "Poor",
      average: "Average",
      good: "Good",
      veryGood: "Very Good",
      excellent: "Excellent",
      recentFeedback: "Recent Feedback"
    },
    kn: {
      giveFeedback: "ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ",
      yourExperience: "ನಿಮ್ಮ ಅನುಭವ",
      rateCamp: "ಈ ಆರೋಗ್ಯ ಶಿಬಿರವನ್ನು ರೇಟ್ ಮಾಡಿ",
      writeFeedback: "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಬರೆಯಿರಿ...",
      submitFeedback: "ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಸಲ್ಲಿಸಿ",
      thankYou: "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗೆ ಧನ್ಯವಾದಗಳು!",
      overallRating: "ಒಟ್ಟು ರೇಟಿಂಗ್",
      basedOn: "{count} ವಿಮರ್ಶೆಗಳ ಆಧಾರದ ಮೇಲೆ",
      noReviews: "ಇನ್ನೂ ವಿಮರ್ಶೆಗಳಿಲ್ಲ",
      poor: "ಕಳಪೆ",
      average: "ಸರಾಸರಿ",
      good: "ಒಳ್ಳೆಯದು",
      veryGood: "ಅತ್ಯುತ್ತಮ",
      excellent: "ಅದ್ಭುತ",
      recentFeedback: "ಇತ್ತೀಚಿನ ಪ್ರತಿಕ್ರಿಯೆ"
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadFeedback();
  }, [campId]);

  const loadFeedback = () => {
    try {
      const allFeedback = JSON.parse(localStorage.getItem('campFeedback') || '[]');
      const campSpecificFeedback = allFeedback.filter(fb => fb.campId === campId);
      setCampFeedback(campSpecificFeedback);
    } catch (error) {
      console.error('Error loading feedback:', error);
    }
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to submit feedback');
      return;
    }

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    const feedbackData = {
      id: Date.now(),
      campId,
      userId: user.id,
      userName: user.name,
      rating,
      feedback: feedback.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      const existingFeedback = JSON.parse(localStorage.getItem('campFeedback') || '[]');
      const updatedFeedback = [...existingFeedback, feedbackData];
      localStorage.setItem('campFeedback', JSON.stringify(updatedFeedback));
      
      setSubmitted(true);
      setFeedback('');
      setRating(0);
      loadFeedback();
      
      setTimeout(() => {
        setShowFeedback(false);
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  const averageRating = campFeedback.length > 0 
    ? (campFeedback.reduce((sum, fb) => sum + fb.rating, 0) / campFeedback.length).toFixed(1)
    : 0;

  const getRatingText = (rating) => {
    const numRating = parseFloat(rating);
    if (numRating >= 4.5) return t.excellent;
    if (numRating >= 4) return t.veryGood;
    if (numRating >= 3) return t.good;
    if (numRating >= 2) return t.average;
    return t.poor;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="feedback-system" style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
      {/* Overall Rating Display */}
      {campFeedback.length > 0 && (
        <div className="overall-rating" style={{ 
          marginBottom: '1rem', 
          padding: '1rem', 
          background: '#f0fff4', 
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>
            {t.overallRating}: ⭐ {averageRating}/5 
            <span style={{ fontSize: '0.9rem', color: '#666', marginLeft: '0.5rem' }}>
              ({getRatingText(averageRating)})
            </span>
          </h4>
          <p style={{ margin: 0, color: '#666' }}>
            {t.basedOn.replace('{count}', campFeedback.length)}
          </p>
        </div>
      )}

      {/* Feedback Button */}
      {user && !submitted && (
        <button 
          onClick={() => setShowFeedback(!showFeedback)}
          className="submit-btn"
          style={{ 
            marginBottom: '1rem',
            background: showFeedback ? '#e53e3e' : '#3182ce'
          }}
        >
          {showFeedback ? '✕ Cancel' : t.giveFeedback}
        </button>
      )}

      {/* Feedback Form */}
      {showFeedback && user && (
        <div className="feedback-form" style={{ 
          padding: '1.5rem', 
          background: 'white', 
          borderRadius: '0.5rem', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '1rem'
        }}>
          <h4 style={{ marginBottom: '1rem' }}>{t.yourExperience}</h4>
          <form onSubmit={handleSubmitFeedback}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                {t.rateCamp}
              </label>
              <div className="star-rating" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', justifyContent: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '2rem',
                      cursor: 'pointer',
                      color: star <= rating ? '#ffc107' : '#e4e5e9',
                      transition: 'color 0.2s'
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Your Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={t.writeFeedback}
                rows="4"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '0.375rem',
                  fontFamily: 'inherit',
                  fontSize: 'inherit'
                }}
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              style={{ width: '100%' }}
              disabled={rating === 0}
            >
              {t.submitFeedback}
            </button>
          </form>
        </div>
      )}

      {submitted && (
        <div style={{ 
          color: '#48bb78', 
          textAlign: 'center', 
          padding: '1rem',
          background: '#f0fff4',
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          ✅ {t.thankYou}
        </div>
      )}

      {/* Recent Feedback Display */}
      {campFeedback.length > 0 && (
        <div className="recent-feedback">
          <h5 style={{ marginBottom: '1rem' }}>{t.recentFeedback}:</h5>
          {campFeedback.slice(-3).reverse().map((fb) => (
            <div key={fb.id} style={{ 
              padding: '1rem', 
              marginBottom: '0.75rem', 
              background: '#f7fafc', 
              borderRadius: '0.375rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong>{fb.userName}</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>⭐ {fb.rating}/5</span>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>
                    {formatDate(fb.timestamp)}
                  </span>
                </div>
              </div>
              {fb.feedback && (
                <p style={{ margin: 0, color: '#4a5568', lineHeight: '1.5' }}>
                  {fb.feedback}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {campFeedback.length === 0 && !showFeedback && (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#666',
          background: '#f7fafc',
          borderRadius: '0.5rem'
        }}>
          {t.noReviews}
          {!user && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Login to be the first to review!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackSystem;