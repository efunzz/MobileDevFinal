import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert
} from 'react-native';
import * as Haptics from 'expo-haptics';
import StudyCard from '../components/StudyCard';
import { supabase } from '../lib/supabase';
import { calculateNextReviewDate } from '../utils/spacedRep';

export default function StudyScreen({ route, navigation }) {
  const { cards, deckName } = route.params || {};
  
  // Filter out empty cards for studying
  const studyCards = cards.filter(card => card.front?.trim() || card.back?.trim());
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyStats, setStudyStats] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0
  });

  const currentCard = studyCards[currentCardIndex];
  const isLastCard = currentCardIndex === studyCards.length - 1;
  const progress = ((currentCardIndex + 1) / studyCards.length) * 100;

  // Show answer when user taps reveal button
  const handleRevealAnswer = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowAnswer(true);
  };

  // Save user confidence rating to database with spaced repetition
  const saveConfidenceRating = async (cardId, confidenceLevel) => {
    try {
      // Calculate next review date using spaced repetition algorithm
      const currentInterval = currentCard.review_interval || 0;
      const { nextReviewDate, interval } = calculateNextReviewDate(confidenceLevel, currentInterval);
      
      const { error } = await supabase
        .from('cards')
        .update({
          confidence_level: confidenceLevel,
          last_studied: new Date().toISOString(),
          next_review_date: nextReviewDate,
          review_interval: interval,
          study_count: (currentCard.study_count || 0) + 1
        })
        .eq('id', cardId);
  
      if (error) {
        console.error('Error saving confidence rating:', error);
      }
    } catch (err) {
      console.error('Unexpected error saving confidence:', err);
    }
  };

  // Process confidence rating and move to next card
  const handleConfidenceRating = async (rating) => {
    try {
      // Add haptic feedback based on confidence rating
      switch (rating) {
        case 'again':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'hard':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'good':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'easy':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
      }
    } catch (error) {
      console.error('Haptic feedback error:', error);
    }
  
    // Save with spaced repetition algorithm
    await saveConfidenceRating(currentCard.id, rating);
    
    setStudyStats(prev => ({
      ...prev,
      [rating]: prev[rating] + 1
    }));
  
    if (isLastCard) {
      handleFinishStudy();
    } else {
      moveToNextCard();
    }
  };

  // Advance to next card and reset answer visibility
  const moveToNextCard = () => {
    setCurrentCardIndex(prev => prev + 1);
    setShowAnswer(false);
  };

  // Complete study session and navigate to statistics
  const handleFinishStudy = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    navigation.navigate('StudyStatistics', {
      studyStats: {
        ...studyStats,
        easy: studyStats.easy 
      },
      deckName: deckName || 'Study Session',
      cards: studyCards
    });
  };

  // Confirm before ending study session
  const handleGoBack = () => {
    Alert.alert(
      'End Study Session?',
      'Your progress will be lost.',
      [
        { text: 'Continue Studying', style: 'cancel' },
        { 
          text: 'End Session', 
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }
        }
      ]
    );
  };

  if (!studyCards.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No cards to study!</Text>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleGoBack} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{currentCardIndex + 1} / {studyCards.length}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <StudyCard
          card={currentCard}
          showAnswer={showAnswer}
        />
      </View>

      <View style={styles.bottomContainer}>
        {!showAnswer ? (
          <Pressable style={styles.revealButton} onPress={handleRevealAnswer}>
            <Text style={styles.revealButtonText}>Reveal Answer</Text>
          </Pressable>
        ) : (
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceTitle}>How did you find the question?</Text>
            <View style={styles.confidenceButtons}>
              <Pressable 
                style={[styles.confidenceButton, styles.againButton]} 
                onPress={() => handleConfidenceRating('again')}
              >
                <Text style={styles.confidenceButtonText}>Again</Text>
                <Text style={styles.confidenceSubText}>~2h</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.confidenceButton, styles.hardButton]} 
                onPress={() => handleConfidenceRating('hard')}
              >
                <Text style={styles.confidenceButtonText}>Hard</Text>
                <Text style={styles.confidenceSubText}>1d+</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.confidenceButton, styles.goodButton]} 
                onPress={() => handleConfidenceRating('good')}
              >
                <Text style={styles.confidenceButtonText}>Good</Text>
                <Text style={styles.confidenceSubText}>3d+</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.confidenceButton, styles.easyButton]} 
                onPress={() => handleConfidenceRating('easy')}
              >
                <Text style={styles.confidenceButtonText}>Easy</Text>
                <Text style={styles.confidenceSubText}>7d+</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  progressContainer: {
    flex: 1,
    marginLeft: 16,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#111827',
    borderRadius: 2,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  bottomContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  revealButton: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  revealButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  confidenceContainer: {
    alignItems: 'center',
  },
  confidenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  confidenceButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confidenceButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  againButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  hardButton: {
    backgroundColor: '#fefbf2',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  goodButton: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  easyButton: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  confidenceButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  confidenceSubText: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});