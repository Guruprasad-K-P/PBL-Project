import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./component-temp/Navbar";
import HomePage from "./pages-temp/HomePage";
import AuthPage from "./pages-temp/AuthPage";
import CampPage from "./pages-temp/CampPage";
import PatientRegistrationPage from "./pages-temp/PatientRegistrationPage";
import OrganizerCampPage from "./pages-temp/OrganizerCampPage";
import OrganizerDashboard from "./pages-temp/OrganizerDashboard";
import OrganizerRegistrations from "./pages-temp/OrganizerRegistrations";
import DashboardPage from "./pages-temp/DashBoardPage";
import NotificationCenterPage from "./pages-temp/NotificationCenterPage";
import PhoneInboxPage from "./pages-temp/PhoneInboxPage";
import NotificationService from "./services/NotificationService";
import { LanguageProvider } from "./context/LanguageContext";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (savedUser && token) {
          const parsedUser = JSON.parse(savedUser);
          console.log("🔄 Initializing auth with user:", parsedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log("✅ User auto-logged in from localStorage");
          
          // Initialize notification service for logged in users
          NotificationService.initialize();
        } else {
          console.log("📝 No saved user found");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = (userData) => {
    console.log("🔐 Handling login for user:", userData);
    
    // Clear any existing data first
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Set new user data
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    
    console.log("✅ Login successful. User role:", userData.role);
    console.log("💾 User data saved to localStorage");
    
    // Initialize notification service after login
    NotificationService.initialize();
  };

  const handleLogout = () => {
    console.log("🚪 Handling logout");
    
    // Clear all auth data
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    console.log("✅ Logout successful");
  };

  // Initialize sample data if not exists
  useEffect(() => {
    if (!loading) {
      initializeSampleData();
    }
  }, [loading]);

  const initializeSampleData = () => {
    try {
      // Initialize health camps if not exists
      const existingCamps = JSON.parse(localStorage.getItem('healthCamps') || '[]');
      if (existingCamps.length === 0) {
        const sampleCamps = [
          {
            id: 1,
            campName: "Free Health Checkup Camp",
            location: {
              village: "Rajajinagar",
              district: "Bangalore",
              address: "Community Hall, 1st Cross"
            },
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            doctorName: "Dr. Ramesh Kumar",
            doctorSpecialization: "General Physician",
            services: ["General Checkup", "BP Check", "Blood Sugar Test"],
            maxParticipants: 100,
            currentParticipants: 45,
            status: "upcoming",
            organizer: "City Health Department",
            isFree: true,
            contactNumber: "9876543210",
            description: "Free health checkup camp for all residents. Basic health screening and consultation available."
          },
          {
            id: 2,
            campName: "Eye Care Camp",
            location: {
              village: "Koramangala",
              district: "Bangalore",
              address: "Primary Health Center, 3rd Block"
            },
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            doctorName: "Dr. Priya Sharma",
            doctorSpecialization: "Ophthalmologist",
            services: ["Eye Checkup", "Vision Test", "Cataract Screening"],
            maxParticipants: 80,
            currentParticipants: 32,
            status: "upcoming",
            organizer: "Vision Care Foundation",
            isFree: true,
            contactNumber: "9876543211",
            description: "Comprehensive eye care camp with free vision tests and consultations."
          },
          {
            id: 3,
            campName: "Dental Health Camp",
            location: {
              village: "Whitefield",
              district: "Bangalore Rural",
              address: "Government School Campus"
            },
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            doctorName: "Dr. Anil Mehta",
            doctorSpecialization: "Dentist",
            services: ["Dental Checkup", "Oral Hygiene Education", "Basic Treatment"],
            maxParticipants: 120,
            currentParticipants: 67,
            status: "upcoming",
            organizer: "Dental Health Initiative",
            isFree: true,
            contactNumber: "9876543212",
            description: "Free dental checkup and oral health awareness camp."
          },
          {
            id: 4,
            campName: "Women's Health Camp",
            location: {
              village: "Jayanagar",
              district: "Bangalore",
              address: "Women's Welfare Center, 4th Block"
            },
            date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            doctorName: "Dr. Sunita Reddy",
            doctorSpecialization: "Gynecologist",
            services: ["Women's Health Checkup", "Cancer Screening", "Nutrition Advice"],
            maxParticipants: 60,
            currentParticipants: 28,
            status: "upcoming",
            organizer: "Women Health Organization",
            isFree: true,
            contactNumber: "9876543213",
            description: "Specialized health camp focusing on women's health issues and preventive care."
          },
          {
            id: 5,
            campName: "Child Health Camp",
            location: {
              village: "Indiranagar",
              district: "Bangalore",
              address: "Anganwadi Center, 100 Feet Road"
            },
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            doctorName: "Dr. Vikram Singh",
            doctorSpecialization: "Pediatrician",
            services: ["Child Health Checkup", "Vaccination", "Growth Monitoring"],
            maxParticipants: 90,
            currentParticipants: 51,
            status: "upcoming",
            organizer: "Child Care Trust",
            isFree: true,
            contactNumber: "9876543214",
            description: "Health camp dedicated to children's health and development."
          }
        ];
        localStorage.setItem('healthCamps', JSON.stringify(sampleCamps));
        console.log("✅ Sample health camps initialized");
      }

      // Initialize organizer camps if not exists
      const existingOrganizerCamps = JSON.parse(localStorage.getItem('organizerCamps') || '[]');
      if (existingOrganizerCamps.length === 0) {
        localStorage.setItem('organizerCamps', JSON.stringify([]));
        console.log("✅ Organizer camps storage initialized");
      }

      // Initialize users if not exists
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      if (existingUsers.length === 0) {
        const sampleUsers = [
          {
            id: 1,
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
          },
          {
            id: 2,
            name: "Test Patient",
            email: "patient@test.com",
            password: "password123",
            role: "patient",
            village: "Test Village",
            district: "Bangalore",
            phone: "9876543211",
            token: "mock-jwt-token",
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem('users', JSON.stringify(sampleUsers));
        console.log("✅ Sample users initialized");
      }

      // Initialize feedback storage if not exists
      const existingFeedback = JSON.parse(localStorage.getItem('campFeedback') || '[]');
      if (existingFeedback.length === 0) {
        localStorage.setItem('campFeedback', JSON.stringify([]));
        console.log("✅ Feedback storage initialized");
      }

      // Initialize notifications if not exists
      const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      if (existingNotifications.length === 0) {
        localStorage.setItem('notifications', JSON.stringify([]));
        console.log("✅ Notifications storage initialized");
      }

      // Initialize camp registrations if not exists
      const existingRegistrations = JSON.parse(localStorage.getItem('campRegistrations') || '[]');
      if (existingRegistrations.length === 0) {
        localStorage.setItem('campRegistrations', JSON.stringify([]));
        console.log("✅ Camp registrations storage initialized");
      }

    } catch (error) {
      console.error("❌ Error initializing sample data:", error);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Navbar 
          user={user} 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout} 
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage user={user} />} />
          <Route 
            path="/auth" 
            element={
              !isAuthenticated ? 
                <AuthPage onLogin={handleLogin} /> : 
                <Navigate to="/dashboard" replace />
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
                <DashboardPage user={user} /> : 
                <Navigate to="/auth" replace />
            } 
          />
          
          <Route 
            path="/camp" 
            element={
              isAuthenticated ? 
                <CampPage user={user} /> : 
                <Navigate to="/auth" replace />
            } 
          />
          
          <Route 
            path="/register-patient" 
            element={
              isAuthenticated && user?.role === 'patient' ? 
                <PatientRegistrationPage user={user} /> : 
                <Navigate to="/camp" replace />
            } 
          />
          
          <Route 
            path="/organize-camp" 
            element={
              isAuthenticated && user?.role === 'organizer' ? 
                <OrganizerCampPage user={user} /> : 
                <Navigate to="/camp" replace />
            } 
          />

          <Route 
            path="/organizer-dashboard" 
            element={
              isAuthenticated && user?.role === 'organizer' ? 
                <OrganizerDashboard user={user} /> : 
                <Navigate to="/camp" replace />
            } 
          />

          <Route 
            path="/organizer-registrations" 
            element={
              isAuthenticated && user?.role === 'organizer' ? 
                <OrganizerRegistrations user={user} /> : 
                <Navigate to="/camp" replace />
            } 
          />
          
          <Route 
            path="/notifications" 
            element={
              isAuthenticated ? 
                <NotificationCenterPage user={user} /> : 
                <Navigate to="/auth" replace />
            } 
          />
          
          {/* Phone Inbox Route */}
          <Route 
            path="/phone-inbox" 
            element={
              isAuthenticated ? 
                <PhoneInboxPage user={user} /> : 
                <Navigate to="/auth" replace />
            } 
          />
          
          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;