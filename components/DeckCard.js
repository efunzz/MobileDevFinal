//component used as way to display botht he deck and thecard
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const DeckCard = ({ deck, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <Text style={styles.deckName}>{deck.name}</Text>
        <Text style={styles.cardCount}>{deck.cardCount} cards</Text>
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
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});

export default DeckCard;