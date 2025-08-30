import React, { useState } from 'react';
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
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { generateFlashcards } from '../services/aiService';
import { supabase } from '../lib/supabase';

export default function AiCreateModal({ visible, onClose, onDeckCreated }) {
  const [deckName, setDeckName] = useState('');
  const [topic, setTopic] = useState('');
  const [cardCount, setCardCount] = useState(8);
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens
  const handleClose = () => {
    setDeckName('');
    setTopic('');
    setCardCount(8);
    setLoading(false);
    onClose();
  };

  // Generate deck with AI
  const handleGenerateDeck = async () => {
    if (!deckName.trim() || !topic.trim()) {
      Alert.alert('Error', 'Please enter both deck name and topic');
      return;
    }

    setLoading(true);

    try {
      console.log(`Starting AI generation for: ${topic}`);
      
      // Step 1: Generate flashcards with AI
      const aiResult = await generateFlashcards(topic, cardCount);
      
      if (!aiResult.success) {
        Alert.alert('AI Generation Failed', aiResult.error);
        setLoading(false);
        return;
      }

      console.log(`AI generated ${aiResult.flashcards.length} cards`);

      // Step 2: Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert('Error', 'Please log in to create decks');
        setLoading(false);
        return;
      }

      // Step 3: Create deck in database
      const { data: deckData, error: deckError } = await supabase
        .from('decks')
        .insert({
          name: deckName.trim(),
          user_id: user.id,
          card_count: aiResult.flashcards.length,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (deckError) {
        console.error('Error creating deck:', deckError);
        Alert.alert('Error', 'Failed to create deck');
        setLoading(false);
        return;
      }

      console.log(`Created deck with ID: ${deckData.id}`);

      // Step 4: Create cards in database
      const cardsToInsert = aiResult.flashcards.map((card, index) => ({
        deck_id: deckData.id,
        question: card.front,
        answer: card.back,
        position: index,
        front_image: null,
        back_image: null
      }));

      const { error: cardsError } = await supabase
        .from('cards')
        .insert(cardsToInsert);

      if (cardsError) {
        console.error('Error creating cards:', cardsError);
        Alert.alert('Error', 'Failed to create cards');
        setLoading(false);
        return;
      }

      console.log(`Created ${cardsToInsert.length} cards`);

      // Step 5: Success!
      Alert.alert(
        'AI Deck Created!',
        `Successfully generated "${deckName}" with ${aiResult.flashcards.length} cards about ${topic}`,
        [
          {
            text: 'Done',
            onPress: () => {
              handleClose();
              if (onDeckCreated) onDeckCreated();
            }
          }
        ]
      );

    } catch (error) {
      console.error('Error in AI deck generation:', error);
      Alert.alert('Error', 'Something went wrong during generation');
      setLoading(false);
    }
  };

  // Card count controls - INCREMENT BY 1
  const incrementCount = () => setCardCount(prev => Math.min(prev + 1, 25));
  const decrementCount = () => setCardCount(prev => Math.max(prev - 1, 3));

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                
                {/* Header */}
                <View style={styles.header}>
                  <Ionicons name="sparkles" size={24} color="#7c3aed" />
                  <Text style={styles.title}>Generate with AI</Text>
                </View>
                
                {/* Deck Name Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Deck Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Spanish Vocabulary"
                    placeholderTextColor="#9ca3af"
                    value={deckName}
                    onChangeText={setDeckName}
                    editable={!loading}
                  />
                </View>

                {/* Topic Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Topic</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Basic Spanish food vocabulary for beginners"
                    placeholderTextColor="#9ca3af"
                    value={topic}
                    onChangeText={setTopic}
                    multiline
                    editable={!loading}
                  />
                </View>

                {/* Card Count */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Number of Cards (3-25)</Text>
                  <View style={styles.counterContainer}>
                    <Pressable 
                      style={[
                        styles.counterButton,
                        (cardCount <= 3 || loading) && styles.counterButtonDisabled
                      ]} 
                      onPress={decrementCount}
                      disabled={cardCount <= 3 || loading}
                    >
                      <Text style={[
                        styles.counterButtonText,
                        (cardCount <= 3 || loading) && styles.counterButtonTextDisabled
                      ]}>−</Text>
                    </Pressable>
                    
                    <View style={styles.counterDisplay}>
                      <Text style={styles.counterText}>{cardCount}</Text>
                    </View>
                    
                    <Pressable 
                      style={[
                        styles.counterButton,
                        (cardCount >= 25 || loading) && styles.counterButtonDisabled
                      ]} 
                      onPress={incrementCount}
                      disabled={cardCount >= 25 || loading}
                    >
                      <Text style={[
                        styles.counterButtonText,
                        (cardCount >= 25 || loading) && styles.counterButtonTextDisabled
                      ]}>+</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <Pressable 
                    style={[styles.button, styles.cancelButton]} 
                    onPress={handleClose}
                    disabled={loading}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  
                  <Pressable 
                    style={[styles.button, styles.generateButton, loading && styles.disabledButton]} 
                    onPress={handleGenerateDeck}
                    disabled={loading || !deckName.trim() || !topic.trim()}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.generateButtonText}>Generate Deck</Text>
                    )}
                  </Pressable>
                </View>
                
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

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
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
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
    minHeight: 48,
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
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  counterButtonDisabled: {
    backgroundColor: '#f3f4f6',
  },
  counterButtonText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#374151',
  },
  counterButtonTextDisabled: {
    color: '#9ca3af',
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
    justifyContent: 'center',
    minHeight: 48,
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
  generateButton: {
    backgroundColor: '#7c3aed',
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
});