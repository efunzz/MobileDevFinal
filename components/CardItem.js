import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const CardItem = ({ card, index, onPress }) => {
  const isEmpty = card.isEmpty || (!card.front && !card.back);
  
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardNumber}>Card {index + 1}</Text>
          <View style={[styles.statusBadge, isEmpty ? styles.emptyBadge : styles.filledBadge]}>
            <Text style={[styles.statusText, isEmpty ? styles.emptyText : styles.filledText]}>
              {isEmpty ? 'Empty' : 'Filled'}
            </Text>
          </View>
        </View>
        
        <View style={styles.cardPreview}>
          <Text style={styles.previewLabel}>Front:</Text>
          <Text style={[styles.previewText, isEmpty && styles.emptyPreviewText]} numberOfLines={1}>
            {card.front || 'Tap to add content...'}
          </Text>
          
          {!isEmpty && (
            <>
              <Text style={styles.previewLabel}>Back:</Text>
              <Text style={styles.previewText} numberOfLines={1}>
                {card.back || 'No back content'}
              </Text>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
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
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyBadge: {
    backgroundColor: '#fef3c7',
  },
  filledBadge: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyText: {
    color: '#92400e',
  },
  filledText: {
    color: '#065f46',
  },
  cardPreview: {
    gap: 4,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '400',
  },
  emptyPreviewText: {
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});

export default CardItem;