import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function FlipCard({ 
  frontContent, 
  backContent, 
  isFlipped, 
  style,
  frontStyle,
  backStyle,
  duration = 150
}) {
 const flipAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 1 : 0,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }, [isFlipped, duration]);

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  // Add opacity interpolation to hide sides at the right time
  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.49, 0.51, 1],  // Very narrow transition window
    outputRange: [1, 1, 0, 0],
    extrapolate: 'clamp',
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.49, 0.51, 1],  // Very narrow transition window  
    outputRange: [0, 0, 1, 1],
    extrapolate: 'clamp',
 });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
    opacity: frontOpacity,
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
    opacity: backOpacity,
  };

  return (
    <View style={[styles.container, style]}>
      {/* Front Side */}
      <Animated.View style={[
        styles.cardSide, 
        styles.cardFront, 
        frontAnimatedStyle,
        frontStyle
      ]}>
        {frontContent}
      </Animated.View>

      {/* Back Side */}
      <Animated.View style={[
        styles.cardSide, 
        styles.cardBack, 
        backAnimatedStyle,
        backStyle
      ]}>
        {backContent}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardSide: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardFront: {
    // Front side specific styles
  },
  cardBack: {
    // Back side specific styles
  },
});