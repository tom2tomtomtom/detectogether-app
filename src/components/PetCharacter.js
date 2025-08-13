import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const PET_EMOJIS = {
  dog: '🐕',
  cat: '🐱',
  bird: '🐦',
  bunny: '🐰',
  dragon: '🐉',
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const getStateFromHealth = (healthScore) => {
  const score = clamp(healthScore || 0, 0, 100);
  if (score >= 80) return 'happy';
  if (score >= 60) return 'normal';
  if (score >= 40) return 'sad';
  return 'critical';
};

const PetCharacter = ({ petType = 'dog', healthScore = 50, mood, isAnimating = true, size = 80 }) => {
  const derivedState = mood || getStateFromHealth(healthScore);

  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  const fontSize = useMemo(() => size * 0.7, [size]);

  useEffect(() => {
    if (!isAnimating) {
      translateY.value = withTiming(0, { duration: 250 });
      scale.value = withTiming(1, { duration: 250 });
      rotate.value = withTiming(0, { duration: 250 });
      opacity.value = withTiming(1, { duration: 250 });
      return;
    }

    // Reset base
    opacity.value = withTiming(1, { duration: 300 });

    if (derivedState === 'happy') {
      // Bounce
      translateY.value = withRepeat(
        withTiming(-8, { duration: 500, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      );
      scale.value = withRepeat(
        withSpring(1.08, { damping: 12, stiffness: 120 }),
        -1,
        true
      );
      rotate.value = withTiming(0, { duration: 300 });
    } else if (derivedState === 'normal') {
      // Gentle float
      translateY.value = withRepeat(
        withTiming(-4, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
      scale.value = withTiming(1, { duration: 300 });
      rotate.value = withTiming(0, { duration: 300 });
    } else if (derivedState === 'sad') {
      // Droop down
      translateY.value = withTiming(6, { duration: 400, easing: Easing.out(Easing.quad) });
      scale.value = withTiming(0.95, { duration: 300 });
      rotate.value = withTiming(0, { duration: 300 });
    } else if (derivedState === 'critical') {
      // Shrink and fade
      translateY.value = withTiming(10, { duration: 400 });
      scale.value = withTiming(0.85, { duration: 400 });
      opacity.value = withTiming(0.6, { duration: 400 });
      rotate.value = withTiming(0, { duration: 300 });
    } else if (derivedState === 'celebrating') {
      // Spin celebration
      translateY.value = withTiming(0, { duration: 250 });
      scale.value = withSpring(1.1, { damping: 10, stiffness: 140 });
      rotate.value = withRepeat(
        withTiming(2 * Math.PI, { duration: 1200, easing: Easing.inOut(Easing.linear) }),
        -1,
        false
      );
    }
  }, [derivedState, isAnimating]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}rad` },
    ],
    opacity: opacity.value,
  }));

  const containerStyle = useMemo(() => [{ width: size, height: size }], [size]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.Text style={[styles.emoji, animatedStyle, { fontSize }]}>
        {PET_EMOJIS[petType] || PET_EMOJIS.dog}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    textAlign: 'center',
  },
});

export default PetCharacter;
