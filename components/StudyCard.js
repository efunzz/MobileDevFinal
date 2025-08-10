import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import  FlipCard from './CardFlip';

export default function StudyCard({ card, showAnswer, style }) {
  const frontContent = (
    <View style={styles.cardContent}>
      <Text style={styles.cardLabel}>Question</Text>
      <Text style={styles.cardText}>{card.front}</Text>
    </View>
  );

  const backContent = (
    <View style={styles.cardContent}>
      <Text style={styles.cardLabel}>Answer</Text>
      <Text style={styles.cardText}>{card.back}</Text>
    </View>
  );

  return (
    <FlipCard
      frontContent={frontContent}
      backContent={backContent}
      isFlipped={showAnswer}
      style={[styles.cardContainer, style]}
    />
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    minHeight: 300,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 28,
  },
});