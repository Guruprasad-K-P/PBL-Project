// Authentication service for handling user operations
export const authService = {
  // Verify user credentials for login
  verifyLogin: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log("🔍 Checking users in storage:", users);
    
    let user;
    
    if (credentials.role === 'patient') {
      // For patients, verify by phone only
      user = users.find(u => u.phone === credentials.phone && u.role === 'patient');
      console.log("👨‍⚕️ Patient login attempt:", { phone: credentials.phone, found: !!user });
    } else {
      // For organizers, verify by email and password
      user = users.find(u => 
        u.email === credentials.email && 
        u.password === credentials.password && 
        u.role === 'organizer'
      );
      console.log("🏥 Organizer login attempt:", { email: credentials.email, found: !!user });
    }
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      console.log("✅ Login successful for user:", userWithoutPassword);
      return {
        success: true,
        user: userWithoutPassword,
        token: user.token || `mock-token-${Date.now()}`
      };
    }
    
    console.log("❌ Login failed - user not found");
    return {
      success: false,
      error: credentials.role === 'patient' ? 
        'Phone number not found. Please sign up.' : 
        'Invalid email or password'
    };
  },

  // Register new user
  registerUser: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    console.log("📝 Registering new user:", userData);
    console.log("Existing users count:", users.length);
    
    // Check if phone already exists
    if (users.some(user => user.phone === userData.phone)) {
      console.log("❌ Phone number already exists:", userData.phone);
      return {
        success: false,
        error: 'Phone number already exists'
      };
    }
    
    // For organizers, check if email already exists
    if (userData.role === 'organizer' && 
        users.some(user => user.email === userData.email)) {
      console.log("❌ Email already exists:", userData.email);
      return {
        success: false,
        error: 'Email already exists'
      };
    }
    
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      token: `mock-token-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const { password, ...userWithoutPassword } = newUser;
    
    console.log("✅ User registered successfully:", userWithoutPassword);
    console.log("Total users after registration:", users.length);
    
    return {
      success: true,
      user: userWithoutPassword,
      token: newUser.token
    };
  },

  // Get current user from storage (compatible with both formats)
  getCurrentUser: () => {
    try {
      const userData = localStorage.getItem('user') || localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Check if user is authenticated (compatible with both formats)
  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return !!(user && token);
  },

  // Clear all auth data (both formats)
  clearAuth: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
  }
};