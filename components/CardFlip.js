import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

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

  // Animate card flip when isFlipped changes
  useEffect(() => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 1 : 0,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }, [isFlipped, duration]);

  // Front side rotation animation
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Back side rotation animation
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  // Front side opacity animation
  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.49, 0.51, 1],
    outputRange: [1, 1, 0, 0],
    extrapolate: 'clamp',
  });

  // Back side opacity animation
  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.49, 0.51, 1],
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
      <Animated.View style={[
        styles.cardSide,
        frontAnimatedStyle,
        frontStyle
      ]}>
        {frontContent}
      </Animated.View>

      <Animated.View style={[
        styles.cardSide,
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
});