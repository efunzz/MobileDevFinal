import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Pressable, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

//import components
import CardItem from '../components/CardItem';
import EditCardModal from '../components/EditCardModal';

export default function CardListScreen({ route, navigation }) {
  const { deck } = route.params || {};
  const [cards, setCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // =============================================
  // FETCH CARDS FROM SUPABASE
  // =============================================
  const fetchCards = async () => {
    if (!deck?.id) {
      console.error('No deck ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log('Fetching cards for deck:', deck.id);

    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', deck.id)
        .order('position', { ascending: true });

      if (error) {
        console.error('Error fetching cards:', error);
        Alert.alert('Error', 'Failed to load cards');
        setCards([]);
      } else {
        console.log('Fetched cards:', data);
        
        // If no cards exist, create empty ones based on deck.card_count
        if (data.length === 0) {
          await createEmptyCards();
        } else {
          // Map your database fields to the app's expected fields
          const mappedCards = data.map(card => ({
            ...card,
            front: card.question || '',
            back: card.answer || ''
          }));
          setCards(mappedCards);
        }
      }
    } catch (err) {
      console.error('Unexpected error fetching cards:', err);
      Alert.alert('Error', 'Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // CREATE EMPTY CARDS WHEN DECK IS FIRST ACCESSED
  // =============================================
  const createEmptyCards = async () => {
    const cardCount = deck.card_count || 5;
    const emptyCards = [];

    for (let i = 0; i < cardCount; i++) {
      emptyCards.push({
        deck_id: deck.id,
        question: '', // Your DB uses 'question' instead of 'front'
        answer: '',   // Your DB uses 'answer' instead of 'back'
        position: i
      });
    }

    try {
      const { data, error } = await supabase
        .from('cards')
        .insert(emptyCards)
        .select();

      if (error) {
        console.error('Error creating empty cards:', error);
        Alert.alert('Error', 'Failed to create cards');
      } else {
        console.log('Created empty cards:', data);
        // Map the response to match app expectations
        const mappedCards = data.map(card => ({
          ...card,
          front: card.question || '',
          back: card.answer || ''
        }));
        setCards(mappedCards);
      }
    } catch (err) {
      console.error('Unexpected error creating cards:', err);
    }
  };

  // =============================================
  // SAVE CARD TO SUPABASE
  // =============================================
  const saveCardToSupabase = async (cardData) => {
    try {
      const updateData = {
        question: cardData.front || '', // Map 'front' to 'question'
        answer: cardData.back || '',    // Map 'back' to 'answer'
      };

      const { data, error } = await supabase
        .from('cards')
        .update(updateData)
        .eq('id', cardData.id)
        .select()
        .single();

      if (error) {
        console.error('Error saving card:', error);
        Alert.alert('Error', 'Failed to save card');
        return false;
      }

      console.log('Card saved successfully:', data);
      // Return mapped data for the app
      return {
        ...data,
        front: data.question || '',
        back: data.answer || ''
      };
    } catch (err) {
      console.error('Unexpected error saving card:', err);
      Alert.alert('Error', 'Failed to save card');
      return false;
    }
  };

  // =============================================
  // COMPONENT LIFECYCLE
  // =============================================
  useEffect(() => {
    fetchCards();
  }, [deck?.id]);

  // =============================================
  // EVENT HANDLERS
  // =============================================
  const handleCardPress = (card, index) => {
    setEditingCard({ ...card, index });
    setModalVisible(true);
  };

  const handleSaveCard = async (updatedCard) => {
    console.log('Saving card:', updatedCard);
    
    const savedCard = await saveCardToSupabase(updatedCard);
    
    if (savedCard) {
      // Update local state
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

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingCard(null);
  };

  // =============================================
  // COMPUTED VALUES
  // =============================================
  const filledCards = cards.filter(card => card.front?.trim() || card.back?.trim()).length;
  const totalCards = cards.length;

  // =============================================
  // RENDER LOADING STATE
  // =============================================
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading cards...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // =============================================
  // RENDER MAIN CONTENT
  // =============================================
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Stats */}
      <View style={styles.header}>
        <Text style={styles.deckName}>{deck?.name || 'Unknown Deck'}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filledCards}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalCards}</Text>
            <Text style={styles.statLabel}>Total Cards</Text>
          </View>
        </View>
      </View>

      {/* Cards List */}
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <CardItem
            card={item}
            index={index}
            onPress={() => handleCardPress(item, index)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Study Button */}
      {filledCards > 0 && (
        <View style={styles.bottomContainer}>
          <Pressable 
            style={styles.studyButton}
            onPress={() => navigation.navigate('StudyScreen', { 
              cards: cards.filter(card => card.front?.trim() || card.back?.trim()),
              deckName: deck.name 
            })}
          >
            <Text style={styles.studyButtonText}>Start Studying ({filledCards} cards)</Text>
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
  studyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});