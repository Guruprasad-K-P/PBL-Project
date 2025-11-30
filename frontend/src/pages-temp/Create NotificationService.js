// Notification service for handling real-time camp notifications
class NotificationService {
  // Initialize notification system
  static initialize() {
    console.log("🔔 Initializing notification service...");
    
    // Check for notifications on app load
    this.checkForUpcomingCamps();
    
    // Set up periodic check (every 5 minutes)
    setInterval(() => {
      this.checkForUpcomingCamps();
    }, 5 * 60 * 1000);
  }

  // Check for upcoming camps and send notifications
  static checkForUpcomingCamps() {
    try {
      console.log("🔍 Checking for upcoming camps...");
      
      // Get all camps and registrations
      const camps = JSON.parse(localStorage.getItem('organizerCamps') || '[]');
      const registrations = JSON.parse(localStorage.getItem('campRegistrations') || '[]');
      
      // Get default camps as well
      const defaultCamps = [
        {
          id: 1,
          campName: "Free Health Checkup Camp",
          location: { village: "Ramanagara", district: "Ramanagara", address: "Near Government School" },
          date: "2024-12-15T10:00:00",
          doctorName: "Dr. Rajesh Kumar",
          services: ["General Checkup", "Blood Test", "Eye Care", "BP Check"],
          maxParticipants: 100,
          currentParticipants: 45,
          status: "upcoming",
          organizer: "Government Health Department",
          isFree: true
        },
        {
          id: 2,
          campName: "Village Health Awareness Camp", 
          location: { village: "Magadi", district: "Ramanagara", address: "Community Hall" },
          date: "2024-12-18T09:00:00",
          doctorName: "Dr. Priya Sharma",
          services: ["Dental Care", "Child Health", "Medicine Distribution"],
          maxParticipants: 80,
          currentParticipants: 80,
          status: "upcoming",
          organizer: "Local NGO",
          isFree: true
        }
      ];
      
      const allCamps = [...camps, ...defaultCamps];
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Check each camp
      allCamps.forEach(camp => {
        const campDate = new Date(camp.date);
        
        // Check if camp is today
        if (this.isSameDay(campDate, now)) {
          this.sendCampTodayNotifications(camp, registrations);
        }
        // Check if camp is tomorrow
        else if (this.isSameDay(campDate, tomorrow)) {
          this.sendCampTomorrowNotifications(camp, registrations);
        }
        // Check if camp is within 3 days
        else if (this.isWithinDays(campDate, now, 3)) {
          this.sendCampUpcomingNotifications(camp, registrations, 3);
        }
      });
      
    } catch (error) {
      console.error("❌ Error checking for upcoming camps:", error);
    }
  }

  // Check if two dates are the same day
  static isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  // Check if a date is within a certain number of days
  static isWithinDays(targetDate, fromDate, days) {
    const timeDiff = targetDate.getTime() - fromDate.getTime();
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
    return dayDiff > 0 && dayDiff <= days;
  }

  // Send notifications for camps happening today
  static sendCampTodayNotifications(camp, registrations) {
    const campRegistrations = registrations.filter(reg => reg.campId === camp.id);
    
    campRegistrations.forEach(registration => {
      // Check if we already sent this notification
      if (this.notificationExists(registration.patientId, camp.id, 'camp-today')) {
        return;
      }
      
      const notification = {
        id: this.generateNotificationId(),
        userId: registration.patientId,
        userEmail: registration.patientEmail || 'patient@example.com',
        type: 'camp-today',
        title: 'Camp Today!',
        message: `Your registered camp "${camp.campName}" is happening today at ${camp.location.village}.`,
        campId: camp.id,
        campName: camp.campName,
        campDate: camp.date,
        campLocation: camp.location.village,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'high'
      };
      
      this.storeNotification(notification);
    });
  }

  // Send notifications for camps happening tomorrow
  static sendCampTomorrowNotifications(camp, registrations) {
    const campRegistrations = registrations.filter(reg => reg.campId === camp.id);
    
    campRegistrations.forEach(registration => {
      // Check if we already sent this notification
      if (this.notificationExists(registration.patientId, camp.id, 'camp-tomorrow')) {
        return;
      }
      
      const notification = {
        id: this.generateNotificationId(),
        userId: registration.patientId,
        userEmail: registration.patientEmail || 'patient@example.com',
        type: 'camp-tomorrow',
        title: 'Camp Tomorrow!',
        message: `Your registered camp "${camp.campName}" is happening tomorrow at ${camp.location.village}.`,
        campId: camp.id,
        campName: camp.campName,
        campDate: camp.date,
        campLocation: camp.location.village,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      };
      
      this.storeNotification(notification);
    });
  }

  // Send notifications for camps happening within 3 days
  static sendCampUpcomingNotifications(camp, registrations, days) {
    const campRegistrations = registrations.filter(reg => reg.campId === camp.id);
    
    campRegistrations.forEach(registration => {
      // Check if we already sent this notification
      if (this.notificationExists(registration.patientId, camp.id, 'camp-upcoming')) {
        return;
      }
      
      const notification = {
        id: this.generateNotificationId(),
        userId: registration.patientId,
        userEmail: registration.patientEmail || 'patient@example.com',
        type: 'camp-upcoming',
        title: 'Upcoming Camp',
        message: `Your registered camp "${camp.campName}" is happening in ${days} days at ${camp.location.village}.`,
        campId: camp.id,
        campName: camp.campName,
        campDate: camp.date,
        campLocation: camp.location.village,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'low'
      };
      
      this.storeNotification(notification);
    });
  }

  // Check if notification already exists
  static notificationExists(userId, campId, type) {
    try {
      const notifications = JSON.parse(localStorage.getItem('villageHealthNotifications') || '[]');
      return notifications.some(notification => 
        notification.userId === userId && 
        notification.campId === campId && 
        notification.type === type
      );
    } catch (error) {
      console.error("❌ Error checking if notification exists:", error);
      return false;
    }
  }

  // Generate a unique notification ID
  static generateNotificationId() {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Store notification in localStorage
  static storeNotification(notification) {
    try {
      const notifications = JSON.parse(localStorage.getItem('villageHealthNotifications') || '[]');
      notifications.push(notification);
      localStorage.setItem('villageHealthNotifications', JSON.stringify(notifications));
      console.log("🔔 Notification stored:", notification);
      
      // Trigger a custom event for real-time updates
      window.dispatchEvent(new CustomEvent('newNotification', { detail: notification }));
    } catch (error) {
      console.error("❌ Error storing notification:", error);
    }
  }

  // Get all notifications for a specific user
  static getNotificationsForUser(userId) {
    try {
      const notifications = JSON.parse(localStorage.getItem('villageHealthNotifications') || '[]');
      return notifications.filter(n => n.userId === userId);
    } catch (error) {
      console.error("❌ Error retrieving notifications:", error);
      return [];
    }
  }

  // Get unread notification count for a user
  static getUnreadCount(userId) {
    try {
      const notifications = JSON.parse(localStorage.getItem('villageHealthNotifications') || '[]');
      return notifications.filter(n => n.userId === userId && !n.read).length;
    } catch (error) {
      console.error("❌ Error getting unread count:", error);
      return 0;
    }
  }

  // Mark notification as read
  static markAsRead(notificationId) {
    try {
      const notifications = JSON.parse(localStorage.getItem('villageHealthNotifications') || '[]');
      const notificationIndex = notifications.findIndex(n => n.id === notificationId);
      
      if (notificationIndex !== -1) {
        notifications[notificationIndex].read = true;
        localStorage.setItem('villageHealthNotifications', JSON.stringify(notifications));
        return true;
      }
      return false;
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
      return false;
    }
  }

  // Mark all notifications for a user as read
  static markAllAsRead(userId) {
    try {
      const notifications = JSON.parse(localStorage.getItem('villageHealthNotifications') || '[]');
      const updatedNotifications = notifications.map(n => 
        n.userId === userId ? { ...n, read: true } : n
      );
      localStorage.setItem('villageHealthNotifications', JSON.stringify(updatedNotifications));
      return true;
    } catch (error) {
      console.error("❌ Error marking all notifications as read:", error);
      return false;
    }
  }

  // Delete notification
  static deleteNotification(notificationId) {
    try {
      const notifications = JSON.parse(localStorage.getItem('villageHealthNotifications') || '[]');
      const filteredNotifications = notifications.filter(n => n.id !== notificationId);
      localStorage.setItem('villageHealthNotifications', JSON.stringify(filteredNotifications));
      return true;
    } catch (error) {
      console.error("❌ Error deleting notification:", error);
      return false;
    }
  }
}

export default NotificationService;