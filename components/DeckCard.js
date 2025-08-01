import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const DeckCard = ({ deck, onPress }) => {
  const studiedCards = deck.studiedCards || 0;
  const totalCards = deck.cardCount;
  const progress = totalCards > 0 ? (studiedCards / totalCards) * 100 : 0;
  
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.deckName}>{deck.name}</Text>
        <Text style={styles.cardCount}>{totalCards} cards</Text>
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {studiedCards}/{totalCards} studied
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deckName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  cardCount: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  progressContainer: {
    gap: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default DeckCard;