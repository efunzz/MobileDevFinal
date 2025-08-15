import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';


//import component
import AddDeckModal from '../components/AddDeckModal';
import DeckCard from '../components/DeckCard';
import AiCreateModal from '../components/AiCreateModal';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  
  // Modal Functions
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const handleOpenAIModal = () => {
    setAiModalVisible(true);
  };
  
  const handleCloseAIModal = () => {
    setAiModalVisible(false);
  };

  // Fetch decks and cards from database
  const fetchDecks = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User not authenticated:', userError);
      setDecks([]);
      setLoading(false);
      return;
    }
  
    try {
      // Get decks with their cards and confidence levels
      const { data, error } = await supabase
        .from('decks')
        .select(`
          *,
          cards (
            id,
            question,
            answer,
            confidence_level,
            last_studied
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
  
      if (error) {
        console.error('Error fetching decks:', error);
        setDecks([]);
      } else {
        // Calculate study statistics for each deck
        const decksWithStats = data.map(deck => {
          const cards = deck.cards || [];
          const totalCards = cards.length;
          
          // Count cards with content
          const filledCards = cards.filter(card => 
            card.question?.trim() || card.answer?.trim()
          ).length;
          
          // Count cards user is confident with (good or easy)
          const studiedCards = cards.filter(card => 
            card.confidence_level === 'good' || card.confidence_level === 'easy'
          ).length;
          
          // Count cards that need review (again or hard)
          const needReviewCards = cards.filter(card => 
            card.confidence_level === 'again' || card.confidence_level === 'hard'
          ).length;
          
          return {
            ...deck,
            totalCards,
            filledCards,
            studiedCards,        
            needReviewCards,     
            studyProgress: totalCards > 0 ? (studiedCards / totalCards) * 100 : 0
          };
        });
        
        setDecks(decksWithStats);
      }
    } catch (err) {
      console.error('Unexpected error fetching decks:', err);
      setDecks([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchDecks();
    }, [])
  );

  // Handle creating new deck
  const handleCreateDeck = async (newDeck) => {
    console.log('Deck created:', newDeck);
    // Refresh deck list to show new deck
    await fetchDecks();
  };

  // Navigate to card list screen
  const handleDeckPress = (deck) => {
    navigation.navigate('CardList', { deck });
  };

  // Render individual deck card
  const renderDeckItem = ({ item }) => (
    <DeckCard 
      deck={item} 
      onPress={() => handleDeckPress(item)}
    />
  );

  // Show loading screen
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Flashcards</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Loading your decks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show empty state when no decks
  if (decks.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Flashcards</Text>
        </View>
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Welcome to Flashcards!</Text>
          <Text style={styles.emptySubtitle}>
            Create your first deck to start learning
          </Text>
          <Pressable style={styles.centerButton} onPress={handleOpenModal}>
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
        </View>

        <AddDeckModal
          visible={modalVisible}
          hideModal={handleCloseModal}
          onCreateDeck={handleCreateDeck}
        />
      </SafeAreaView>
    );
  }

  // Main screen with deck list
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Flashcards</Text>
        <Text style={styles.headerSubtitle}>
          {decks.length} deck{decks.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Decks List */}
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id}
        renderItem={renderDeckItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.floatingButtonContainer}>
  {/* Regular Create Deck Button */}
  <Pressable style={[styles.floatingButton, styles.regularButton]} onPress={handleOpenModal}>
    <Ionicons name="add" size={24} color="white" />
  </Pressable>
  
  {/* AI Generate Button */}
  <Pressable style={[styles.floatingButton, styles.aiButton]} onPress={handleOpenAIModal}>
    <Ionicons name="sparkles" size={20} color="white" />
    <Text style={styles.aiButtonText}>AI</Text>
  </Pressable>
  
    <AiCreateModal
      visible={aiModalVisible}
      onClose={handleCloseAIModal}
      onDeckCreated={fetchDecks} // Refresh deck list after AI generation
    />
</View>

      {/* Add Button */}
      <Pressable style={styles.floatingButton} onPress={handleOpenModal}>
        <Text style={styles.buttonText}>+</Text>
      </Pressable>

      {/* Create Deck Modal */}
      <AddDeckModal
        visible={modalVisible}
        hideModal={handleCloseModal}
        onCreateDeck={handleCreateDeck}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  centerButton: {
    backgroundColor: '#111827',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 100,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#111827',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '300',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    gap: 12,
  },
  regularButton: {
    backgroundColor: '#111827',
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  aiButton: {
    backgroundColor: '#7c3aed', // Purple for AI
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 6,
  },
  aiButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});