import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CardListScreen({ route }) {
  const { deck } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Card List Screen</Text>
      {deck && (
        <Text style={styles.deckName}>Deck: {deck.name}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    color: '#000',
    marginBottom: 10,
  },
  deckName: {
    fontSize: 18,
    color: '#666',
  },
});