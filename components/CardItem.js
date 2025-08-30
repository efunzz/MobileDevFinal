import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const CardItem = ({ card, index, onPress }) => {
  const isEmpty = card.isEmpty || (!card.front && !card.back);
  
  // Calculate if card is due and days remaining
  const getDueStatus = (card) => {
    if (!card.next_review_date || isEmpty) return { isDue: true, daysLeft: 0 };
    
    const now = new Date();
    const reviewDate = new Date(card.next_review_date);
    const daysLeft = Math.ceil((reviewDate - now) / (1000 * 60 * 60 * 24));
    
    return {
      isDue: daysLeft <= 0,
      daysLeft: Math.max(0, daysLeft)
    };
  };

  const { isDue, daysLeft } = getDueStatus(card);
  
  return (
    <Pressable 
      style={[
        styles.card,
        !isDue && !isEmpty && styles.cardNotDue, // Add transparency for non-due cards
        isEmpty && styles.cardEmpty
      ]} 
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardNumber}>Card {index + 1}</Text>
          
          {/* Enhanced status badge with due information */}
          {isEmpty ? (
            <View style={[styles.statusBadge, styles.emptyBadge]}>
              <Text style={[styles.statusText, styles.emptyText]}>Empty</Text>
            </View>
          ) : isDue ? (
            <View style={[styles.statusBadge, styles.dueBadge]}>
              <Text style={[styles.statusText, styles.dueText]}>Ready!</Text>
            </View>
          ) : (
            <View style={[styles.statusBadge, styles.scheduledBadge]}>
              <Text style={[styles.statusText, styles.scheduledText]}>
                Due in {daysLeft}d
              </Text>
            </View>
          )}
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
        
        {/* Study progress indicator */}
        {!isEmpty && card.study_count && (
          <View style={styles.studyProgress}>
            <Text style={styles.studyProgressText}>
              Studied {card.study_count} time{card.study_count !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
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
  cardNotDue: {
    opacity: 0.5, // Make non-due cards translucent
    backgroundColor: '#f8f9fa',
  },
  cardEmpty: {
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
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
  dueBadge: {
    backgroundColor: '#d1fae5',
  },
  scheduledBadge: {
    backgroundColor: '#e0e7ff',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyText: {
    color: '#92400e',
  },
  dueText: {
    color: '#065f46',
  },
  scheduledText: {
    color: '#3730a3',
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
  studyProgress: {
    marginTop: 4,
  },
  studyProgressText: {
    fontSize: 11,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});

export default CardItem;