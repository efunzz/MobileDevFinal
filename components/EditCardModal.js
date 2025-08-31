import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const EditCardModal = ({ visible, card, onSave, onClose }) => {
  const [front, setFront] = useState(card?.front || '');
  const [back, setBack] = useState(card?.back || '');
  const [frontImage, setFrontImage] = useState(card?.frontImage || null);
  const [backImage, setBackImage] = useState(card?.backImage || null);

  // Update form fields when card prop changes
  useEffect(() => {
    if (card) {
      setFront(card.front || '');
      setBack(card.back || '');
      setFrontImage(card.frontImage || null);
      setBackImage(card.backImage || null);
    }
  }, [card]);

  // Save card with validation
  const handleSave = () => {
    if (!front.trim() && !back.trim() && !frontImage && !backImage) {
      Alert.alert('Error', 'Please add some content to the card');
      return;
    }

    const updatedCard = {
      ...card,
      front: front.trim(),
      back: back.trim(),
      frontImage,
      backImage,
      isEmpty: !front.trim() && !back.trim() && !frontImage && !backImage
    };

    onSave(updatedCard);
  };

  // Show image source selection options
  const showImageOptions = (target) => {
    Alert.alert(
      'Add Image',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => takePhoto(target) },
        { text: 'Choose from Library', onPress: () => pickImage(target) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Capture photo with camera
  const takePhoto = async (target) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
        if (target === 'front') {
          setFrontImage(imageUri);
        } else {
          setBackImage(imageUri);
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // Select image from photo library
  const pickImage = async (target) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Photo library permission is required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
        if (target === 'front') {
          setFrontImage(imageUri);
        } else {
          setBackImage(imageUri);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Remove image from card side
  const removeImage = (target) => {
    if (target === 'front') {
      setFrontImage(null);
    } else {
      setBackImage(null);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              <ScrollView style={styles.modalContent}>
                
                <Text style={styles.title}>Edit Card {(card?.index || 0) + 1}</Text>
                
                <View style={styles.cardSide}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.label}>Front</Text>
                    <Pressable 
                      style={styles.imageButton} 
                      onPress={() => showImageOptions('front')}
                    >
                      <Ionicons name="camera-outline" size={16} color="#374151" />
                      <Text style={styles.imageButtonText}>Add Image</Text>
                    </Pressable>
                  </View>
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Enter question or term..."
                    placeholderTextColor="#9ca3af"
                    value={front}
                    onChangeText={setFront}
                    multiline
                  />
                  
                  {frontImage && (
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: frontImage }} style={styles.cardImage} />
                      <Pressable 
                        style={styles.removeButton} 
                        onPress={() => removeImage('front')}
                      >
                      <Ionicons name="close" size={14} color="white" />
                      </Pressable>
                    </View>
                  )}
                </View>

                <View style={styles.cardSide}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.label}>Back</Text>
                    <Pressable 
                      style={styles.imageButton} 
                      onPress={() => showImageOptions('back')}
                    >
                      <Ionicons name="camera-outline" size={16} color="#374151" />
                      <Text style={styles.imageButtonText}>Add Image</Text>
                    </Pressable>
                  </View>
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Enter answer or definition..."
                    placeholderTextColor="#9ca3af"
                    value={back}
                    onChangeText={setBack}
                    multiline
                  />
                  
                  {backImage && (
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: backImage }} style={styles.cardImage} />
                      <Pressable 
                        style={styles.removeButton} 
                        onPress={() => removeImage('back')}
                      >
                      <Ionicons name="close" size={14} color="white" />
                      </Pressable>
                    </View>
                  )}
                </View>

                <View style={styles.buttonContainer}>
                  <Pressable style={styles.cancelButton} onPress={onClose}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  
                  <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Card</Text>
                  </Pressable>
                </View>
                
              </ScrollView>
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
    width: '95%',
    maxHeight: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  cardSide: {
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  imageButtonText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  imageContainer: {
    position: 'relative',
    marginTop: 12,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
});

export default EditCardModal;