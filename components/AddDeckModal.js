import React, {useState} from 'react';
import {Modal, StyleSheet, Text, Pressable, View, TextInput, TouchableWithoutFeedback, Keyboard} from 'react-native';

const AddDeckModal = ({ visible, hideModal }) => {
    console.log('=== DEBUG INFO ===');
  console.log('visible:', visible);
  console.log('hideModal type:', typeof hideModal);
  console.log('hideModal value:', hideModal);
  console.log('==================');

  const [deckName, setDeckName] = useState('');
  const [cardNumber, setCardNumber] = useState('5');

  const handleCreateDeck = () => {
    if (!deckName.trim()) return;
    // TODO: Handle deck creation logic here
    console.log('Creating deck:', deckName, 'with', cardNumber, 'cards');
    setDeckName('');
    setCardNumber('5');
  };

  const incrementCard = () => {
    setCardNumber((parseInt(cardNumber) + 1).toString());
  };

  const decrementCard = () => {
    const newNumber = Math.max(1, parseInt(cardNumber) - 1);
    setCardNumber(newNumber.toString());
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={hideModal}>
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                
                {/* Header */}
                <Text style={styles.title}>Create New Deck</Text>
                
                {/* Deck Name Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Deck Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter deck name..."
                    placeholderTextColor="#9ca3af"
                    value={deckName}
                    onChangeText={setDeckName}
                  />
                </View>
  
                {/* Card Counter */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Number of Cards</Text>
                  <View style={styles.counterContainer}>
                    <Pressable 
                      style={styles.counterButton} 
                      onPress={decrementCard}
                    >
                      <Text style={styles.counterButtonText}>−</Text>
                    </Pressable>
                    
                    <View style={styles.counterDisplay}>
                      <Text style={styles.counterText}>{cardNumber}</Text>
                    </View>
                    
                    <Pressable 
                      style={styles.counterButton} 
                      onPress={incrementCard}
                    >
                      <Text style={styles.counterButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>
  
                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <Pressable 
                    style={[styles.button, styles.cancelButton]} 
                    onPress={() => hideModal()}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={[styles.button, styles.createButton, !deckName.trim() && styles.disabledButton]} 
                    onPress={handleCreateDeck}
                    disabled={!deckName.trim()}
                  >
                    <Text style={styles.createButtonText}>Create Deck</Text>
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
    fontSize: 24,
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
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  counterButton: {
    flex: 1,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  counterButtonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#374151',
  },
  counterDisplay: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#d1d5db',
  },
  counterText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 24,
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
    flex: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  createButton: {
    backgroundColor: '#111827',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
});

export default AddDeckModal;