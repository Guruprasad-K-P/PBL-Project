import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = ({ onLogin }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    village: '', // For patients
    organization: '', // For organizers
    organizationType: '', // Additional field for organizers
    district: '',
    role: 'patient' // Default to patient
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const translations = {
    en: {
      loginTitle: "Login to Your Account",
      signupTitle: "Create New Account",
      email: "Email Address",
      password: "Password",
      fullName: "Full Name",
      phone: "Phone Number",
      village: "Village Name",
      organization: "Organization Name",
      organizationType: "Organization Type",
      district: "District",
      role: "I am a",
      patient: "Patient (I need health services)",
      organizer: "Organizer (I want to conduct camps)",
      loginBtn: "Login",
      signupBtn: "Sign Up",
      switchLogin: "Already have account? Login",
      switchSignup: "Don't have account? Sign Up",
      loggingIn: "Logging in...",
      signingUp: "Creating account...",
      loginSuccess: "Login successful!",
      signupSuccess: "Account created successfully!",
      invalidEmail: "Please enter a valid email address",
      passwordLength: "Password must be at least 6 characters",
      requiredField: "This field is required",
      invalidPhone: "Please enter a valid 10-digit phone number",
      loginError: "Invalid email or password",
      phoneExists: "Phone number already exists. Please use a different phone number.",
      emailExists: "Email already exists. Please use a different email.",
      otpSent: "OTP sent to your phone number",
      enterOtp: "Enter OTP",
      verifyOtp: "Verify OTP",
      otpVerified: "OTP verified successfully",
      invalidOtp: "Invalid OTP. Please try again.",
      sendOtp: "Send OTP",
      resendOtp: "Resend OTP",
      otpResent: "OTP has been resent to your phone number",
      otpExpired: "OTP has expired. Please request a new one.",
      didntReceiveOtp: "Didn't receive the OTP?",
      selectOrgType: "Select Organization Type",
      hospital: "Hospital",
      clinic: "Clinic",
      ngo: "NGO",
      trust: "Trust",
      others: "Others",
      selectRole: "Select Your Role",
      rolePatient: "Patient",
      roleOrganizer: "Organizer",
      patientDesc: "I need health services",
      organizerDesc: "I want to conduct health camps"
    },
    kn: {
      loginTitle: "ನಿಮ್ಮ ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ",
      signupTitle: "ಹೊಸ ಖಾತೆ ರಚಿಸಿ",
      email: "ಇಮೇಲ್ ವಿಳಾಸ",
      password: "ಪಾಸ್ವರ್ಡ್",
      fullName: "ಪೂರ್ಣ ಹೆಸರು",
      phone: "ಫೋನ್ ನಂಬರ್",
      village: "ಗ್ರಾಮದ ಹೆಸರು",
      organization: "ಸಂಸ್ಥೆಯ ಹೆಸರು",
      organizationType: "ಸಂಸ್ಥೆಯ ಪ್ರಕಾರ",
      district: "ಜಿಲ್ಲೆ",
      role: "ನಾನು",
      patient: "ರೋಗಿ (ನನಗೆ ಆರೋಗ್ಯ ಸೇವೆಗಳು ಬೇಕು)",
      organizer: "ಆಯೋಜಕ (ನಾನು ಕ್ಯಾಂಪ್ಗಳನ್ನು ನಡೆಸಲು ಬಯಸುತ್ತೇನೆ)",
      loginBtn: "ಲಾಗಿನ್",
      signupBtn: "ಸೈನ್ ಅಪ್",
      switchLogin: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ಲಾಗಿನ್ ಮಾಡಿ",
      switchSignup: "ಖಾತೆ ಇಲ್ಲವೇ? ಸೈನ್ ಅಪ್ ಮಾಡಿ",
      loggingIn: "ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...",
      signingUp: "ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
      loginSuccess: "ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ!",
      signupSuccess: "ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!",
      invalidEmail: "ದಯವಿಟ್ಟು ಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ",
      passwordLength: "ಪಾಸ್ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಾಗಿರಬೇಕು",
      requiredField: "ಈ ಫೀಲ್ಡ್ ಅಗತ್ಯವಿದೆ",
      invalidPhone: "ದಯವಿಟ್ಟು ಮಾನ್ಯ 10-ಅಂಕಿಯ ಫೋನ್ ನಂಬರ್ ನಮೂದಿಸಿ",
      loginError: "ಅಮಾನ್ಯ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್ವರ್ಡ್",
      phoneExists: "ಫೋನ್ ನಂಬರ್ ಈಗಾಗಲೇ ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ. ದಯವಿಟ್ಟು ಬೇರೆ ಫೋನ್ ನಂಬರ್ ಬಳಸಿ.",
      emailExists: "ಇಮೇಲ್ ಈಗಾಗಲೇ ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ. ದಯವಿಟ್ಟು ಬೇರೆ ಇಮೇಲ್ ಬಳಸಿ.",
      otpSent: "ನಿಮ್ಮ ಫೋನ್ ನಂಬರ್‌ಗೆ OTP ಕಳುಹಿಸಲಾಗಿದೆ",
      enterOtp: "OTP ನಮೂದಿಸಿ",
      verifyOtp: "OTP ಪರಿಶೀಲಿಸಿ",
      otpVerified: "OTP ಯಶಸ್ವಿಯಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
      invalidOtp: "ಅಮಾನ್ಯ OTP. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      sendOtp: "OTP ಕಳುಹಿಸಿ",
      resendOtp: "OTP ಮರು ಕಳುಹಿಸಿ",
      otpResent: "OTP ಅನ್ನು ನಿಮ್ಮ ಫೋನ್ ನಂಬರ್‌ಗೆ ಮರು ಕಳುಹಿಸಲಾಗಿದೆ",
      otpExpired: "OTP ಅವಧಿ ಮುಗಿದಿದೆ. ದಯವಿಟ್ಟು ಹೊಸದನ್ನು ವಿನಂತಿಸಿ.",
      didntReceiveOtp: "OTP ಸಿಗಲಿಲ್ಲವೇ?",
      selectOrgType: "ಸಂಸ್ಥೆಯ ಪ್ರಕಾರ ಆಯ್ಕೆಮಾಡಿ",
      hospital: "ಆಸ್ಪತ್ರೆ",
      clinic: "ಕ್ಲಿನಿಕ್",
      ngo: "ಎನ್‌ಜಿಓ",
      trust: "ಟ್ರಸ್ಟ್",
      others: "ಇತರೆ",
      selectRole: "ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      rolePatient: "ರೋಗಿ",
      roleOrganizer: "ಆಯೋಜಕ",
      patientDesc: "ನನಗೆ ಆರೋಗ್ಯ ಸೇವೆಗಳು ಬೇಕು",
      organizerDesc: "ನಾನು ಆರೋಗ್ಯ ಶಿಬಿರಗಳನ್ನು ನಡೆಸಲು ಬಯಸುತ್ತೇನೆ"
    }
  };

  const t = translations[language];

  // State for OTP verification
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resend OTP
  React.useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validateForm = () => {
    const newErrors = {};

    // Phone validation (required for both login and signup)
    if (!formData.phone) {
      newErrors.phone = t.requiredField;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = t.invalidPhone;
    }

    // Organizer specific validations
    if (formData.role === 'organizer') {
      // Email validation (only for organizers)
      if (!formData.email) {
        newErrors.email = t.requiredField;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t.invalidEmail;
      }

      // Password validation (only for organizers)
      if (!formData.password) {
        newErrors.password = t.requiredField;
      } else if (formData.password.length < 6) {
        newErrors.password = t.passwordLength;
      }

      // Organization validation (only for organizers during signup)
      if (!isLogin && !formData.organization) {
        newErrors.organization = t.requiredField;
      }

      // Organization Type validation (only for organizers during signup)
      if (!isLogin && !formData.organizationType) {
        newErrors.organizationType = t.requiredField;
      }
    }

    // Signup specific validations
    if (!isLogin) {
      if (!formData.name) newErrors.name = t.requiredField;
      
      // District is required for both
      if (!formData.district) newErrors.district = t.requiredField;
      
      // Village is required for patients
      if (formData.role === 'patient' && !formData.village) {
        newErrors.village = t.requiredField;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role: role
    });
    // Clear all errors when role changes
    setErrors({});
    // Reset OTP state when switching roles
    if (isLogin) {
      setOtpSent(false);
      setOtp('');
      setOtpAttempts(0);
    }
  };

  const checkPhoneExists = (phone) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(user => user.phone === phone);
  };

  const checkEmailExists = (email) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(user => user.email === email);
  };

  const saveUserToStorage = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
  };

  // FIXED: Verify organizer by email and password
  const verifyOrganizerByEmail = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log("🔍 Checking organizer credentials:", { email, password });
    
    const organizer = users.find(user => 
      user.email === email && 
      user.password === password && 
      user.role === 'organizer'
    );
    
    console.log("✅ Found organizer:", organizer);
    return organizer;
  };

  const verifyPatientByPhone = (phone) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const patient = users.find(user => user.phone === phone && user.role === 'patient');
    console.log("📞 Patient search - Phone:", phone, "Found:", patient);
    return patient;
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOtp = (isResend = false) => {
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    setOtpSent(true);
    setOtp('');
    setOtpAttempts(0);
    setCanResendOtp(false);
    setResendTimer(30); // 30 second countdown
    
    // In a real app, this would send an SMS
    console.log(`OTP ${isResend ? 'resent' : 'sent'} to ${formData.phone}: ${newOtp}`);
    alert(`${isResend ? t.otpResent : t.otpSent}: ${newOtp}`);
  };

  const verifyOtpCode = () => {
    if (otp === generatedOtp) {
      return true;
    }
    return false;
  };

  const handleResendOtp = () => {
    if (canResendOtp) {
      sendOtp(true);
      setErrors({}); // Clear previous errors
    }
  };

  // FIXED: handleSubmit function with proper organizer login
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // For patients in login mode, handle OTP verification
    if (isLogin && formData.role === 'patient') {
      if (!otpSent) {
        sendOtp();
        return;
      } else {
        // Check OTP attempts
        if (otpAttempts >= 3) {
          setErrors({ general: t.otpExpired });
          setOtpSent(false);
          setOtp('');
          setOtpAttempts(0);
          return;
        }

        if (!verifyOtpCode()) {
          setOtpAttempts(prev => prev + 1);
          setErrors({ otp: `${t.invalidOtp} (${3 - (otpAttempts + 1)} attempts left)` });
          return;
        }
      }
    }

    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        // Login process
        console.log("🔄 Attempting login with:", { 
          role: formData.role,
          email: formData.email,
          phone: formData.phone
        });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        let existingUser = null;
        
        if (formData.role === 'patient') {
          // For patients, verify by phone only
          console.log("👤 Looking for patient with phone:", formData.phone);
          existingUser = verifyPatientByPhone(formData.phone);
          console.log("📞 Patient found:", existingUser);
          
          if (!existingUser) {
            setErrors({ general: "Phone number not found. Please sign up." });
            setLoading(false);
            return;
          }
        } else {
          // For organizers, verify by email and password
          console.log("🏢 Looking for organizer with email:", formData.email);
          existingUser = verifyOrganizerByEmail(formData.email, formData.password);
          console.log("📧 Organizer found:", existingUser);
          
          if (!existingUser) {
            setErrors({ general: "Invalid email or password, or account is not an organizer" });
            setLoading(false);
            return;
          }
        }
        
        if (existingUser) {
          const userWithoutPassword = { ...existingUser };
          delete userWithoutPassword.password;
          
          console.log("✅ Login successful - Final user data:", userWithoutPassword);
          console.log("🎯 User role from database:", userWithoutPassword.role);
          
          onLogin(userWithoutPassword);
          alert(t.loginSuccess);
          
          // Navigate based on actual user role from database
          if (userWithoutPassword.role === 'organizer') {
            console.log("🚀 Redirecting to organizer dashboard");
            navigate('/organizer-dashboard');
          } else {
            console.log("🏕️ Redirecting to camp page");
            navigate('/camp');
          }
        }
      } else {
        // Signup process
        console.log("🔄 Attempting signup with:", formData);
        
        // Check if phone already exists
        if (checkPhoneExists(formData.phone)) {
          setErrors({ phone: t.phoneExists });
          setLoading(false);
          return;
        }

        // For organizers, check if email already exists
        if (formData.role === 'organizer' && checkEmailExists(formData.email)) {
          setErrors({ email: t.emailExists });
          setLoading(false);
          return;
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const newUser = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          village: formData.role === 'patient' ? formData.village : '',
          organization: formData.role === 'organizer' ? formData.organization : '',
          organizationType: formData.role === 'organizer' ? formData.organizationType : '',
          district: formData.district,
          phone: formData.phone,
          token: "mock-jwt-token",
          createdAt: new Date().toISOString()
        };
        
        // Save user to storage
        saveUserToStorage(newUser);
        
        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;
        
        console.log("✅ Signup successful:", userWithoutPassword);
        onLogin(userWithoutPassword);
        alert(t.signupSuccess);
        
        // Navigate based on the role that was just created
        if (newUser.role === 'organizer') {
          navigate('/organizer-dashboard');
        } else {
          navigate('/camp');
        }
      }
    } catch (error) {
      console.error("❌ Auth error:", error);
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Function to determine button text
  const getButtonText = () => {
    if (loading) {
      return isLogin ? t.loggingIn : t.signingUp;
    }
    
    if (isLogin) {
      if (formData.role === 'patient') {
        return otpSent ? t.verifyOtp : t.sendOtp;
      } else {
        return t.loginBtn;
      }
    } else {
      return t.signupBtn;
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>{isLogin ? t.loginTitle : t.signupTitle}</h2>
        
        {errors.general && (
          <div className="error-message" style={{color: '#e53e3e', marginBottom: '1rem', padding: '0.5rem', background: '#fed7d7', borderRadius: '0.375rem'}}>
            {errors.general}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Role Selection - Radio Buttons */}
          <div className="form-group">
            <label className="role-label">{t.selectRole} *</label>
            <div className="role-selection" style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '1.5rem',
              flexWrap: 'wrap'
            }}>
              {/* Patient Radio Button */}
              <label className="role-option" style={{
                flex: 1,
                minWidth: '200px',
                padding: '1rem',
                border: `2px solid ${formData.role === 'patient' ? '#3182ce' : '#e2e8f0'}`,
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backgroundColor: formData.role === 'patient' ? '#ebf8ff' : 'white',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="patient"
                  checked={formData.role === 'patient'}
                  onChange={() => handleRoleChange('patient')}
                  style={{ display: 'none' }}
                />
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</div>
                <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{t.rolePatient}</div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                  {t.patientDesc}
                </div>
              </label>

              {/* Organizer Radio Button */}
              <label className="role-option" style={{
                flex: 1,
                minWidth: '200px',
                padding: '1rem',
                border: `2px solid ${formData.role === 'organizer' ? '#3182ce' : '#e2e8f0'}`,
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backgroundColor: formData.role === 'organizer' ? '#ebf8ff' : 'white',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}>
                <input
                  type="radio"
                  name="role"
                  value="organizer"
                  checked={formData.role === 'organizer'}
                  onChange={() => handleRoleChange('organizer')}
                  style={{ display: 'none' }}
                />
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏢</div>
                <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{t.roleOrganizer}</div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                  {t.organizerDesc}
                </div>
              </label>
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>{t.fullName}</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder={t.fullName}
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-row">
                {/* Show Village for patients, Organization for organizers */}
                <div className="form-group">
                  <label>{formData.role === 'organizer' ? t.organization : t.village}</label>
                  <input 
                    type="text" 
                    name={formData.role === 'organizer' ? 'organization' : 'village'}
                    placeholder={formData.role === 'organizer' ? t.organization : t.village}
                    value={formData.role === 'organizer' ? formData.organization : formData.village}
                    onChange={handleChange}
                    className={errors[formData.role === 'organizer' ? 'organization' : 'village'] ? 'error' : ''}
                  />
                  {errors[formData.role === 'organizer' ? 'organization' : 'village'] && 
                    <span className="error-text">{errors[formData.role === 'organizer' ? 'organization' : 'village']}</span>}
                </div>

                <div className="form-group">
                  <label>{t.district}</label>
                  <input 
                    type="text" 
                    name="district"
                    placeholder={t.district}
                    value={formData.district}
                    onChange={handleChange}
                    className={errors.district ? 'error' : ''}
                  />
                  {errors.district && <span className="error-text">{errors.district}</span>}
                </div>
              </div>

              {/* Additional Organization Type field for organizers */}
              {formData.role === 'organizer' && (
                <div className="form-group">
                  <label>{t.organizationType}</label>
                  <select 
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={handleChange}
                    className={errors.organizationType ? 'error' : ''}
                  >
                    <option value="">{t.selectOrgType}</option>
                    <option value="hospital">{t.hospital}</option>
                    <option value="clinic">{t.clinic}</option>
                    <option value="ngo">{t.ngo}</option>
                    <option value="trust">{t.trust}</option>
                    <option value="others">{t.others}</option>
                  </select>
                  {errors.organizationType && <span className="error-text">{errors.organizationType}</span>}
                </div>
              )}
            </>
          )}
          
          <div className="form-group">
            <label>{t.phone}</label>
            <input 
              type="tel" 
              name="phone"
              placeholder={t.phone}
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
          
          {/* Email and password fields ONLY for organizers */}
          {formData.role === 'organizer' && (
            <>
              <div className="form-group">
                <label>{t.email}</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder={t.email}
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label>{t.password}</label>
                <input 
                  type="password" 
                  name="password"
                  placeholder={t.password}
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  minLength="6"
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
            </>
          )}
          
          {/* OTP field for patient login */}
          {isLogin && formData.role === 'patient' && otpSent && (
            <div className="form-group">
              <label>{t.enterOtp}</label>
              <input 
                type="text" 
                placeholder={t.enterOtp}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={errors.otp ? 'error' : ''}
                maxLength={6}
              />
              {errors.otp && <span className="error-text">{errors.otp}</span>}
              
              {/* Resend OTP option */}
              <div className="resend-otp-container">
                <span className="didnt-receive">{t.didntReceiveOtp}</span>
                {canResendOtp ? (
                  <button 
                    type="button" 
                    className="resend-otp-btn"
                    onClick={handleResendOtp}
                  >
                    {t.resendOtp}
                  </button>
                ) : (
                  <span className="resend-timer">
                    Resend in {resendTimer}s
                  </span>
                )}
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {getButtonText()}
          </button>
        </form>
        
        {/* Quick Test Button - UPDATED */}
        {!isLogin && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button 
              onClick={() => {
                const testOrganizer = {
                  id: Date.now(),
                  name: "Test Organizer",
                  email: "organizer@test.com",
                  password: "password123",
                  role: "organizer",
                  organization: "Test Health Organization",
                  organizationType: "hospital",
                  district: "Bangalore", 
                  phone: "9876543210",
                  token: "mock-jwt-token",
                  createdAt: new Date().toISOString()
                };
                
                // Save test user
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                // Remove any existing test organizer
                const filteredUsers = users.filter(user => user.email !== "organizer@test.com");
                filteredUsers.push(testOrganizer);
                localStorage.setItem('users', JSON.stringify(filteredUsers));
                
                const userWithoutPassword = { ...testOrganizer };
                delete userWithoutPassword.password;
                
                console.log("👤 Quick test organizer created:", userWithoutPassword);
                
                // Auto-fill the form for testing
                setFormData({
                  ...formData,
                  role: 'organizer',
                  email: 'organizer@test.com',
                  password: 'password123'
                });
                
                alert("Test organizer account created! You can now login with email: organizer@test.com and password: password123");
              }}
              style={{
                background: 'transparent',
                border: '1px solid #48bb78',
                color: '#48bb78',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                marginBottom: '0.5rem'
              }}
            >
              {language === 'en' ? '🚀 Create Test Organizer' : '🚀 ಪರೀಕ್ಷಾ ಆಯೋಜಕ ರಚಿಸಿ'}
            </button>

            <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.5rem' }}>
              {language === 'en' 
                ? 'Test credentials: organizer@test.com / password123' 
                : 'ಪರೀಕ್ಷಾ ರುಜುವಾತುಗಳು: organizer@test.com / password123'}
            </div>
          </div>
        )}
        
        <button 
          className="switch-btn"
          onClick={() => {
            setIsLogin(!isLogin);
            setErrors({});
            setOtpSent(false);
            setOtp('');
            setOtpAttempts(0);
            setCanResendOtp(false);
            setResendTimer(0);
          }}
          disabled={loading}
          style={{ marginTop: '1rem' }}
        >
          {isLogin ? t.switchSignup : t.switchLogin}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;