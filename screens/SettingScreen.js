import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Alert,
  Switch,
  Button,
} from 'react-native';
import { supabase } from '../lib/supabase';
import ReminderModal from '../components/ReminderModal';
import NotificationService from '../services/NotificationService'
import * as Haptics from 'expo-haptics';

export default function SettingsScreen({ navigation }) {
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState({ hour: 19, minute: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    initializeNotifications();
    loadSettings();

    // Cleanup on unmount
    return () => {
      NotificationService.cleanup();
    };
  }, []);

  // Initialize notification service
  const initializeNotifications = async () => {
    const token = await NotificationService.initialize();
    setExpoPushToken(token);
  };

  // Load settings using service
  const loadSettings = async () => {
    const settings = await NotificationService.loadReminderSettings();
    setReminderEnabled(settings.enabled);
    setReminderTime(settings.time);
  };

  // Handle reminder toggle
  const handleReminderToggle = async (value) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (value) {
      setModalVisible(true);
    } else {
      setReminderEnabled(false);
      await NotificationService.cancelAllNotifications();
      await NotificationService.saveReminderSettings(false, reminderTime);
    }
  };

  // Handle setting reminder
  const handleSetReminder = async (hour, minute) => {
    const newTime = { hour, minute };
    setReminderTime(newTime);
    setReminderEnabled(true);
    
    const success = await NotificationService.scheduleDailyReminder(hour, minute);
    if (success) {
      await NotificationService.saveReminderSettings(true, newTime);
      
      Alert.alert(
        'Reminder Set! 🔔',
        `Daily study reminder at ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        [{ text: 'OK', onPress: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success) }]
      );
    } else {
      Alert.alert('Error', 'Failed to set reminder. Please try again.');
    }
  };

  // Test notification
  const testNotification = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await NotificationService.sendTestNotification();
  };

  // Handle logout
  const handleLogout = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: async () => await supabase.auth.signOut() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.content}>
        {/* Push Token Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          <Text style={styles.tokenLabel}>Expo Push Token:</Text>
          <Text style={styles.tokenText} selectable>{expoPushToken}</Text>
          
          <Button
            title="Test notification (5s)"
            onPress={testNotification}
          />
        </View>

        {/* Daily Reminder Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Study Reminders</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Daily Reminder</Text>
              <Text style={styles.settingSubtitle}>
                {reminderEnabled 
                  ? `Enabled at ${reminderTime.hour.toString().padStart(2, '0')}:${reminderTime.minute.toString().padStart(2, '0')}`
                  : 'Get notified to practice daily'
                }
              </Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={handleReminderToggle}
              trackColor={{ false: '#e5e7eb', true: '#111827' }}
              thumbColor={reminderEnabled ? '#ffffff' : '#f3f4f6'}
            />
          </View>

          {reminderEnabled && (
            <Pressable 
              style={styles.timeButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.timeButtonText}>Change Time</Text>
            </Pressable>
          )}
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </Pressable>
        </View>
      </View>

      {/* Reminder Modal */}
      <ReminderModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSetReminder={handleSetReminder}
        currentTime={reminderTime}
      />
    </SafeAreaView>
  );
}

// Styles remain the same as before...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  tokenLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  tokenText: {
    fontSize: 12,
    color: '#111827',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 6,
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  timeButton: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  logoutButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#dc2626',
  },
});