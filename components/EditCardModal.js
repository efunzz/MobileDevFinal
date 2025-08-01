import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';

const EditCardModal = ({ visible, card, onSave, onClose }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  useEffect(() => {
    if (card) {
      setFront(card.front || '');
      setBack(card.back || '');
    }
  }, [card]);

  const handleSave = () => {
    if (!front.trim() && !back.trim()) {
      return; // Don't save completely empty cards
    }

    onSave({
      ...card,
      front: front.trim(),
      back: back.trim(),
    });

    // Reset form
    setFront('');
    setBack('');
  };

  const handleClose = () => {
    setFront('');
    setBack('');
    onClose();
  };

  const canSave = front.trim() || back.trim();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}>
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                
                {/* Header */}
                <Text style={styles.title}>
                  Edit Card {card?.index !== undefined ? card.index + 1 : ''}
                </Text>
                
                {/* Front Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Front (Question/Word)</Text>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Enter the question or word..."
                    placeholderTextColor="#9ca3af"
                    value={front}
                    onChangeText={setFront}
                    multiline={true}
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* Back Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Back (Answer/Definition)</Text>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Enter the answer or definition..."
                    placeholderTextColor="#9ca3af"
                    value={back}
                    onChangeText={setBack}
                    multiline={true}
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>

                {/* Helper Text */}
                <Text style={styles.helperText}>
                  Fill in at least one side to save the card
                </Text>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <Pressable 
                    style={[styles.button, styles.cancelButton]} 
                    onPress={handleClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={[styles.button, styles.saveButton, !canSave && styles.disabledButton]} 
                    onPress={handleSave}
                    disabled={!canSave}
                  >
                    <Text style={[styles.saveButtonText, !canSave && styles.disabledText]}>
                      Save Card
                    </Text>
                  </Pressable>
                </View>
                
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
    minHeight: 80,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  saveButton: {
    backgroundColor: '#111827',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  disabledText: {
    color: '#ffffff',
  },
});

export default EditCardModal;