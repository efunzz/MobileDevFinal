import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';

const { height } = Dimensions.get('window');

export default function ReminderModal({ visible, onClose, onSetReminder, currentTime }) {
  const [selectedHour, setSelectedHour] = useState(currentTime?.hour || 19);
  const [selectedMinute, setSelectedMinute] = useState(currentTime?.minute || 0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45]; // 15-minute intervals

  const handleSetReminder = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSetReminder(selectedHour, selectedMinute);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Daily Reminder</Text>
            <Pressable onPress={handleSetReminder} style={styles.setButton}>
              <Text style={styles.setButtonText}>Set</Text>
            </Pressable>
          </View>

          <Text style={styles.modalSubtitle}>
            When should we remind you to practice?
          </Text>

          <View style={styles.timePickerContainer}>
            {/* Hours */}
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Hour</Text>
              <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                {hours.map((hour) => (
                  <Pressable
                    key={hour}
                    style={[
                      styles.pickerItem,
                      selectedHour === hour && styles.selectedPickerItem
                    ]}
                    onPress={async () => {
                      await Haptics.selectionAsync();
                      setSelectedHour(hour);
                    }}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      selectedHour === hour && styles.selectedPickerItemText
                    ]}>
                      {hour.toString().padStart(2, '0')}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.timeSeparator}>:</Text>

            {/* Minutes */}
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Minute</Text>
              <ScrollView style={styles.picker} showsVerticalScrollIndicator={false}>
                {minutes.map((minute) => (
                  <Pressable
                    key={minute}
                    style={[
                      styles.pickerItem,
                      selectedMinute === minute && styles.selectedPickerItem
                    ]}
                    onPress={async () => {
                      await Haptics.selectionAsync();
                      setSelectedMinute(minute);
                    }}
                  >
                    <Text style={[
                      styles.pickerItemText,
                      selectedMinute === minute && styles.selectedPickerItemText
                    ]}>
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.previewContainer}>
            <Text style={styles.previewText}>
              Daily reminder at {selectedHour.toString().padStart(2, '0')}:
              {selectedMinute.toString().padStart(2, '0')}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      backgroundColor: '#ffffff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 34,
      minHeight: height * 0.5,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    cancelButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    cancelButtonText: {
      fontSize: 16,
      color: '#6b7280',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
    },
    setButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: '#111827',
      borderRadius: 8,
    },
    setButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
    },
    modalSubtitle: {
      fontSize: 16,
      color: '#6b7280',
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 30,
      paddingHorizontal: 20,
    },
    timePickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
    },
    pickerColumn: {
      alignItems: 'center',
    },
    pickerLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: '#6b7280',
      marginBottom: 8,
    },
    picker: {
      height: 120,
      width: 80,
    },
    pickerItem: {
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginVertical: 2,
    },
    selectedPickerItem: {
      backgroundColor: '#111827',
    },
    pickerItemText: {
      fontSize: 16,
      color: '#6b7280',
    },
    selectedPickerItemText: {
      color: '#ffffff',
      fontWeight: '600',
    },
    timeSeparator: {
      fontSize: 20,
      fontWeight: '600',
      color: '#111827',
      marginHorizontal: 20,
    },
    previewContainer: {
      marginTop: 20,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    previewText: {
      fontSize: 16,
      color: '#111827',
      fontWeight: '500',
    },
  });