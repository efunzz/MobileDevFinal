import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Pressable, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { getDueCards } from '../utils/spacedRep';

//import components
import CardItem from '../components/CardItem';
import EditCardModal from '../components/EditCardModal';

export default function CardListScreen({ route, navigation }) {
  const { deck } = route.params || {};
  const [cards, setCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    if (!deck?.id) {
      setLoading(false);
      return;
    }
  
    setLoading(true);
  
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', deck.id)
        .order('position', { ascending: true });
  
      if (error) {
        Alert.alert('Error', 'Failed to load cards');
        setCards([]);
      } else {
        if (data.length === 0) {
          await createEmptyCards();
        } else {
          const mappedCards = data.map(card => ({
            ...card,
            front: card.question || '',
            back: card.answer || '',
            frontImage: card.front_image, 
            backImage: card.back_image    
          }));
          setCards(mappedCards);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  // Create empty cards for new deck
  const createEmptyCards = async () => {
    const cardCount = deck.card_count || 5;
    const emptyCards = [];

    for (let i = 0; i < cardCount; i++) {
      emptyCards.push({
        deck_id: deck.id,
        question: '',
        answer: '',
        position: i,
      });
    }

    try {
      const { data, error } = await supabase
        .from('cards')
        .insert(emptyCards)
        .select();

      if (error) {
        Alert.alert('Error', 'Failed to create cards');
      } else {
        const mappedCards = data.map(card => ({
          ...card,
          front: card.question || '',
          back: card.answer || ''
        }));
        setCards(mappedCards);
      }
    } catch (err) {
      console.error('Error creating cards:', err);
    }
  };

  // Save card changes to database
  const saveCardToSupabase = async (cardData) => {
    try {
      const updateData = {
        question: cardData.front || '',
        answer: cardData.back || '',
        front_image: cardData.frontImage,
        back_image: cardData.backImage
      };
  
      const { data, error } = await supabase
        .from('cards')
        .update(updateData)
        .eq('id', cardData.id)
        .select()
        .single();
  
      if (error) {
        Alert.alert('Error', 'Failed to save card');
        return false;
      }
  
      return {
        ...data,
        front: data.question || '',
        back: data.answer || '',
        frontImage: data.front_image,
        backImage: data.back_image
      };
    } catch (err) {
      Alert.alert('Error', 'Failed to save card');
      return false;
    }
  };

  // Load cards when component mounts
  useEffect(() => {
    fetchCards();
  }, [deck?.id]);

  // Handle card press to edit
  const handleCardPress = (card, index) => {
    setEditingCard({ ...card, index });
    setModalVisible(true);
  };

  // Handle saving edited card
  const handleSaveCard = async (updatedCard) => {
    const savedCard = await saveCardToSupabase(updatedCard);
    
    if (savedCard) {
      const newCards = [...cards];
      const cardIndex = newCards.findIndex(c => c.id === savedCard.id);
      if (cardIndex !== -1) {
        newCards[cardIndex] = savedCard;
        setCards(newCards);
      }
    }
    
    setModalVisible(false);
    setEditingCard(null);
  };

  // Close modal without saving
  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingCard(null);
  };

  // Handle study button with due cards filtering
  const handleStartStudy = () => {
    const filledCards = cards.filter(card => card.front?.trim() || card.back?.trim());
    
    if (filledCards.length === 0) {
      Alert.alert('No Cards', 'Please add some flashcards first!');
      return;
    }

    // Check for due cards
    const dueCards = getDueCards(filledCards);
    
    if (dueCards.length === 0) {
      Alert.alert(
        'No Cards Due! 🎉', 
        'All cards are scheduled for future review. Study all cards anyway?',
        [
          { 
            text: 'Study All Anyway', 
            onPress: () => navigation.navigate('StudyScreen', { 
              cards: filledCards, 
              deckName: deck.name 
            })
          },
          { text: 'Maybe Later', style: 'cancel' }
        ]
      );
      return;
    }

    // Study only due cards
    navigation.navigate('StudyScreen', { 
      cards: dueCards, 
      deckName: deck.name 
    });
  };

  // Calculate card statistics
  const filledCards = cards.filter(card => card.front?.trim() || card.back?.trim());
  const dueCards = getDueCards(filledCards);
  const totalCards = cards.length;

  // Show loading screen
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading cards...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with deck stats */}
      <View style={styles.header}>
        <Text style={styles.deckName}>{deck?.name || 'Unknown Deck'}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: dueCards.length > 0 ? '#10b981' : '#6b7280' }]}>
              {dueCards.length}
            </Text>
            <Text style={styles.statLabel}>Due Now</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filledCards.length}</Text>
            <Text style={styles.statLabel}>Ready</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalCards}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Cards List */}
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <EnhancedCardItem
            card={item}
            index={index}
            onPress={() => handleCardPress(item, index)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Study Button */}
      {filledCards.length > 0 && (
        <View style={styles.bottomContainer}>
          <Pressable 
            style={[
              styles.studyButton,
              dueCards.length === 0 && styles.studyButtonInactive
            ]}
            onPress={handleStartStudy}
          >
            <Text style={[
              styles.studyButtonText,
              dueCards.length === 0 && styles.studyButtonTextInactive
            ]}>
              {dueCards.length > 0 
                ? `Study Now (${dueCards.length} due)` 
                : 'All Studied! 🎉 Tap to study anyway'}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Edit Card Modal */}
      <EditCardModal
        visible={modalVisible}
        card={editingCard}
        onSave={handleSaveCard}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
}

// Enhanced CardItem component that shows due status
const EnhancedCardItem = ({ card, index, onPress }) => {
  // Calculate if card is due and days remaining
  const getDueStatus = (card) => {
    if (!card.next_review_date) return { isDue: true, daysLeft: 0 };
    
    const now = new Date();
    const reviewDate = new Date(card.next_review_date);
    const daysLeft = Math.ceil((reviewDate - now) / (1000 * 60 * 60 * 24));
    
    return {
      isDue: daysLeft <= 0,
      daysLeft: Math.max(0, daysLeft)
    };
  };

  const { isDue, daysLeft } = getDueStatus(card);
  const isEmpty = !card.front?.trim() && !card.back?.trim();

  return (
    <Pressable 
      style={[
        styles.cardItem,
        !isDue && !isEmpty && styles.cardNotDue, // Add transparency for non-due cards
        isEmpty && styles.cardEmpty
      ]}
      onPress={() => onPress(card, index)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardIndex}>#{index + 1}</Text>
        
        {isEmpty ? (
          <Text style={styles.emptyCardText}>Tap to add content</Text>
        ) : (
          <View style={styles.cardPreview}>
            <Text style={styles.cardFront} numberOfLines={2}>
              {card.front || 'No question'}
            </Text>
            <Text style={styles.cardBack} numberOfLines={1}>
              {card.back || 'No answer'}
            </Text>
          </View>
        )}
        
        {/* Due status indicator */}
        {!isEmpty && !isDue && (
          <View style={styles.dueIndicator}>
            <Text style={styles.dueText}>Due in {daysLeft}d</Text>
          </View>
        )}
        
        {!isEmpty && isDue && (
          <View style={styles.readyIndicator}>
            <Text style={styles.readyText}>Ready!</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  deckName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
  },
  listContainer: {
    paddingVertical: 8,
    paddingBottom: 100,
  },
  
  // Card Item Styles
  cardItem: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardNotDue: {
    opacity: 0.4, // Make non-due cards translucent
    backgroundColor: '#f8f9fa',
  },
  cardEmpty: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  cardContent: {
    position: 'relative',
  },
  cardIndex: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptyCardText: {
    fontSize: 16,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  cardPreview: {
    gap: 8,
  },
  cardFront: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 22,
  },
  cardBack: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  
  // Due Status Indicators
  dueIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  dueText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92400e',
  },
  readyIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#d1fae5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  readyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#065f46',
  },

  // Bottom Container
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  studyButton: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studyButtonInactive: {
    backgroundColor: '#6b7280',
  },
  studyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  studyButtonTextInactive: {
    color: '#d1d5db',
  },
});