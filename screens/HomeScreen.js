import React, {useState} from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView,FlatList, } from 'react-native';
import { useNavigation } from '@react-navigation/native';

//import component
import AddDeckModal from '../components/AddDeckModal';
import DeckCard from '../components/DeckCard';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [decks, setDecks] = useState([]);

  const handleOpenModal = () => {
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const handleCreateDeck = (deckName, cardCount) => {
    // Generate placeholder cards
  const placeholderCards = Array.from({ length: parseInt(cardCount) }, (_, index) => ({
    id: `${Date.now()}_${index}`,
    front: '',
    back: '',
    isEmpty: true
  }));

    const newDeck = {
      id: Date.now().toString(),
      name: deckName,
      cardCount: parseInt(cardCount),
      cards: placeholderCards, // Will store actual cards later
      createdAt: Date.now(),
    };
    
    setDecks(prevDecks => [...prevDecks, newDeck]);
    setModalVisible(false);
  };

  const handleDeckPress = (deck) => {
    navigation.navigate('CardList', { deck: deck });
  };


  if (decks.length === 0) {
    // Show centered + button when no decks
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Create Your First Deck</Text>
          <Text style={styles.emptySubtitle}>Tap the + button to get started</Text>
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

  // Show deck list with floating + button
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Decks</Text>
      </View>
      
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DeckCard 
            deck={item} 
            onPress={() => handleDeckPress(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={true}
      />

      {/* Floating Action Button */}
      <Pressable style={styles.floatingButton} onPress={handleOpenModal}>
        <Text style={styles.buttonText}>+</Text>
      </Pressable>

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
  listContainer: {
    paddingBottom: 100, // Space for floating button
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
});
