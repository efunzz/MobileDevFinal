import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

import AddDeckModal from '../components/AddDeckModal';
import DeckCard from '../components/DeckCard';
import AiCreateModal from '../components/AiCreateModal';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiModalVisible, setAiModalVisible] = useState(false);
  
  // FAB animation values
  const fabExpanded = useSharedValue(0);
  const [isFabOpen, setIsFabOpen] = useState(false);

  // Modal handlers
  const handleOpenModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(true);
    toggleFAB();
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOpenAIModal = () => {
    setAiModalVisible(true);
    toggleFAB();
  };
  
  const handleCloseAIModal = () => {
    setAiModalVisible(false);
  };

  // FAB toggle function
  const toggleFAB = () => {
    const newState = !isFabOpen;
    setIsFabOpen(newState);
    fabExpanded.value = withSpring(newState ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  };

  // Backdrop animation
  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(fabExpanded.value * 0.5, { duration: 200 }),
      pointerEvents: fabExpanded.value > 0 ? 'auto' : 'none',
    };
  });

  // Main FAB rotation animation
  const mainFabStyle = useAnimatedStyle(() => {
    const rotation = interpolate(fabExpanded.value, [0, 1], [0, 45]);
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  // Sub-button animations
  const createSubButtonStyle = useAnimatedStyle(() => {
    const translateY = interpolate(fabExpanded.value, [0, 1], [0, -80]);
    const opacity = interpolate(fabExpanded.value, [0, 0.5, 1], [0, 0, 1]);
    const scale = interpolate(fabExpanded.value, [0, 1], [0.3, 1]);
    
    return {
      transform: [
        { translateY },
        { scale },
      ],
      opacity,
    };
  });

  const aiSubButtonStyle = useAnimatedStyle(() => {
    const translateY = interpolate(fabExpanded.value, [0, 1], [0, -140]);
    const opacity = interpolate(fabExpanded.value, [0, 0.5, 1], [0, 0, 1]);
    const scale = interpolate(fabExpanded.value, [0, 1], [0.3, 1]);
    
    return {
      transform: [
        { translateY },
        { scale },
      ],
      opacity,
    };
  });

  // Fetch decks from database
  const fetchDecks = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User not authenticated:', userError);
      setDecks([]);
      setLoading(false);
      return;
    }
  
    try {
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
        const decksWithStats = data.map(deck => {
          const cards = deck.cards || [];
          const totalCards = cards.length;
          
          const filledCards = cards.filter(card => 
            card.question?.trim() || card.answer?.trim()
          ).length;
          
          const studiedCards = cards.filter(card => 
            card.confidence_level === 'good' || card.confidence_level === 'easy'
          ).length;
          
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
    await fetchDecks();
  };

  // Handle deleting deck
  const handleDeleteDeck = async (deckId) => {
    try {
      const { error: cardsError } = await supabase
        .from('cards')
        .delete()
        .eq('deck_id', deckId);
  
      if (cardsError) {
        console.error('Error deleting cards:', cardsError);
        throw cardsError;
      }
  
      const { error: deckError } = await supabase
        .from('decks')
        .delete()
        .eq('id', deckId);
  
      if (deckError) {
        console.error('Error deleting deck:', deckError);
        throw deckError;
      }
  
      setDecks(prev => prev.filter(deck => deck.id !== deckId));
    } catch (error) {
      console.error('Error deleting deck:', error);
      Alert.alert('Error', 'Failed to delete deck. Please try again.');
    }
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
      onDelete={handleDeleteDeck}
    />
  );

  // Loading screen
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

  // Empty state screen
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

  // Main screen with expandable FAB
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Flashcards</Text>
        <Text style={styles.headerSubtitle}>
          {decks.length} deck{decks.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={decks}
        keyExtractor={(item) => item.id}
        renderItem={renderDeckItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Backdrop overlay */}
      <Animated.View style={[styles.backdrop, backdropStyle]} pointerEvents="auto">
        <Pressable style={styles.backdropPressable} onPress={toggleFAB} />
      </Animated.View>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        {/* AI Create Sub-button */}
        <Animated.View style={[styles.subButton, aiSubButtonStyle]}>
          <Pressable style={[styles.fabButton, styles.aiButton]} onPress={handleOpenAIModal}>
            <Ionicons name="sparkles" size={20} color="white" />
          </Pressable>
        </Animated.View>

        {/* Create Deck Sub-button */}
        <Animated.View style={[styles.subButton, createSubButtonStyle]}>
          <Pressable style={[styles.fabButton, styles.createButton]} onPress={handleOpenModal}>
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
        </Animated.View>

        {/* Main FAB */}
        <Pressable style={styles.mainFab} onPress={toggleFAB}>
          <Animated.View style={mainFabStyle}>
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </Animated.View>
        </Pressable>
      </View>

      {/* Modals */}
      <AddDeckModal
        visible={modalVisible}
        hideModal={handleCloseModal}
        onCreateDeck={handleCreateDeck}
      />
      
      <AiCreateModal
        visible={aiModalVisible}
        onClose={handleCloseAIModal}
        onDeckCreated={fetchDecks}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
  buttonText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '300',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropPressable: {
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'center',
  },
  subButton: {
    alignItems: 'center',
    marginBottom: -55,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 24,
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
  createButton: {
    backgroundColor: '#111827',
  },
  aiButton: {
    backgroundColor: '#111827',
  },
  mainFab: {
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
});