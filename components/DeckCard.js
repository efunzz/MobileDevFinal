import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Alert,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// Determine progress bar color based on completion percentage
const getProgressColor = (progress) => {
  if (progress >= 80) return '#10b981';
  if (progress >= 60) return '#3b82f6';
  if (progress >= 40) return '#f59e0b';
  return '#ef4444';
};

// Trigger haptic feedback for user interactions
const triggerHaptic = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

const DeckCard = ({ deck, onPress, onDelete }) => {
  const totalCards = deck.totalCards || 0;
  const studiedCards = deck.studiedCards || 0;
  const [isRevealed, setIsRevealed] = useState(false);
  
  const translateX = useSharedValue(0);
  const progress = totalCards > 0 ? (studiedCards / totalCards) * 100 : 0;

  // Show delete confirmation dialog
  const handleDelete = () => {
    Alert.alert(
      'Delete Deck',
      `Are you sure you want to delete "${deck.name}"? This will permanently delete all ${totalCards} cards.`,
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => {
            translateX.value = withSpring(0);
            setIsRevealed(false);
          }
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            onDelete?.(deck.id);
          },
        },
      ]
    );
  };

  // Handle swipe gesture for delete action
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -80);
      }
    })
    .onEnd((event) => {
      const threshold = -40;
      
      if (event.translationX < threshold) {
        translateX.value = withSpring(-70);
        runOnJS(triggerHaptic)();
        runOnJS(setIsRevealed)(true);
      } else {
        translateX.value = withSpring(0);
        runOnJS(setIsRevealed)(false);
      }
    });

  // Animated style for swipe effect
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Handle card tap - close swipe or navigate
  const handleCardPress = () => {
    if (isRevealed) {
      translateX.value = withSpring(0);
      setIsRevealed(false);
      return;
    }
    onPress?.(deck);
  };

  return (
    <View style={styles.container}>
      <View style={styles.deleteBackground}>
        <Pressable style={styles.deleteAction} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Pressable onPress={handleCardPress} style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.deckName}>{deck.name}</Text>
              <Text style={styles.cardCount}>{totalCards} cards</Text>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[
                  styles.progressFill, 
                  {
                    width: `${progress}%`,
                    backgroundColor: getProgressColor(progress)
                  }
                ]} />
              </View>
              <Text style={styles.progressText}>
                {studiedCards}/{totalCards} confident
              </Text>
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    position: 'relative',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  deleteAction: {
    backgroundColor: '#ef4444',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
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
    padding: 20,
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