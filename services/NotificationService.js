import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notifications (from lecturer's demo)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = '';
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Initialize notification service
  async initialize() {
    this.expoPushToken = await this.registerForPushNotifications();
    this.setupListeners();
    return this.expoPushToken;
  }

  // Register for push notifications (exactly from lecturer's demo)
  async registerForPushNotifications() {
    let token;

    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id-here',
      })).data;

    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }

  // Setup notification listeners (from lecturer's demo)
  setupListeners() {
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });
    Alert.alert(
      '🔔 Notification Triggered!', 
      notification.request.content.body,
      [{ text: 'Perfect!' }]
    );
  }

  // Cleanup listeners
  cleanup() {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      this.responseListener.remove();
    }
  }

  // Test notification (from lecturer's demo)
  async sendTestNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🧪 Test Notification",
        body: "Your notifications are working perfectly!",
        data: { data: 'test notification' },
      },
      trigger: { seconds: 1 },
    });
  }

  // Schedule daily reminder
  async scheduleDailyReminder(hour, minute) {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      const now = new Date();
      const target = new Date();
      target.setHours(hour, minute, 0, 0);

      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }

      const secondsUntilTarget = Math.floor((target - now) / 1000);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📚 Time to Study!",
          body: "Your flashcards are waiting. Let's build that knowledge!",
          data: { data: 'daily reminder' },
        },
        trigger: { seconds: secondsUntilTarget, repeats: false },
      });

      console.log(`Daily reminder scheduled in ${secondsUntilTarget} seconds`);
      return true;
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      return false;
    }
  }

  // Cancel all notifications
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Load reminder settings
  async loadReminderSettings() {
    try {
      const enabled = await AsyncStorage.getItem('reminderEnabled');
      const time = await AsyncStorage.getItem('reminderTime');
      
      return {
        enabled: enabled ? JSON.parse(enabled) : false,
        time: time ? JSON.parse(time) : { hour: 19, minute: 0 }
      };
    } catch (error) {
      console.error('Error loading reminder settings:', error);
      return { enabled: false, time: { hour: 19, minute: 0 } };
    }
  }

  // Save reminder settings
  async saveReminderSettings(enabled, time) {
    try {
      await AsyncStorage.setItem('reminderEnabled', JSON.stringify(enabled));
      await AsyncStorage.setItem('reminderTime', JSON.stringify(time));
      return true;
    } catch (error) {
      console.error('Error saving reminder settings:', error);
      return false;
    }
  }

  // Get push token
  getPushToken() {
    return this.expoPushToken;
  }
}

// Export singleton instance
export default new NotificationService();