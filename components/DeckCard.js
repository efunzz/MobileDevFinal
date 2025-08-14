import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const DeckCard = ({ deck, onPress }) => {
  const totalCards = deck.totalCards || 0;
  const studiedCards = deck.studiedCards || 0;  // Cards with 'good' or 'easy' confidence
  
  // Progress based on confident cards (good + easy)
  const progress = totalCards > 0 ? (studiedCards / totalCards) * 100 : 0;
  
  // Determine progress color
  const getProgressColor = () => {
    if (progress >= 80) return '#10b981';  // Green - excellent
    if (progress >= 60) return '#3b82f6';  // Blue - good
    if (progress >= 40) return '#f59e0b';  // Yellow - okay
    return '#ef4444';  // Red - needs work
  };
  
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.deckName}>{deck.name}</Text>
        <Text style={styles.cardCount}>{totalCards} cards</Text>
      </View>
      
      {/* Progress Bar - Clean and simple */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill, 
            {
              width: `${progress}%`,
              backgroundColor: getProgressColor()
            }
          ]} />
        </View>
        <Text style={styles.progressText}>
          {studiedCards}/{totalCards} confident
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
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default DeckCard;