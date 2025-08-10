import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Pressable } from 'react-native';
//import components
import CardItem from '../components/CardItem';
import EditCardModal from '../components/EditCardModal';

export default function CardListScreen({ route }) {
  const { deck } = route.params || {};
  const [cards, setCards] = useState(deck?.cards || []);
  const [editingCard, setEditingCard] = useState(null);
  //handle state in EditCardModal
  const [modalVisible, setModalVisible] = useState(false);

  const handleCardPress = (card, index) => {
    setEditingCard({ ...card, index });
    setModalVisible(true);
  };

  const handleSaveCard = (updatedCard) => {
    const newCards = [...cards];
    newCards[updatedCard.index] = {
      ...updatedCard,
      isEmpty: !updatedCard.front && !updatedCard.back
    };
    setCards(newCards);
    setModalVisible(false);
    setEditingCard(null);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingCard(null);
  };

  const filledCards = cards.filter(card => !card.isEmpty && (card.front || card.back)).length;
  const totalCards = cards.length;

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
        keyExtractor={(item, index) => `${item.id}_${index}`}
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
          <Pressable style={styles.studyButton}>
            <Text style={styles.studyButtonText}>Start Studying</Text>
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