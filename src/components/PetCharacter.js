import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { useStore } from '../store/useStore';
import DogPet from './pets/DogPet';
import DogPetLottie from './pets/DogPetLottie';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const getStateFromHealth = (healthScore) => {
  const score = clamp(healthScore || 0, 0, 100);
  if (score >= 80) return 'happy';
  if (score >= 60) return 'normal';
  if (score >= 40) return 'sad';
  return 'critical';
};

const PetCharacter = ({ petType = 'dog', healthScore = 50, mood, isAnimating = true, size = 80 }) => {
  const user = useStore((s) => s.user);
  const derivedState = mood || getStateFromHealth(healthScore);

  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!isAnimating) {
      translateY.value = withTiming(0, { duration: 250 });
      scale.value = withTiming(1, { duration: 250 });
      rotate.value = withTiming(0, { duration: 250 });
      opacity.value = withTiming(1, { duration: 250 });
      return;
    }

    opacity.value = withTiming(1, { duration: 300 });

    if (derivedState === 'happy') {
      translateY.value = withRepeat(withTiming(-8, { duration: 500, easing: Easing.inOut(Easing.quad) }), -1, true);
      scale.value = withRepeat(withSpring(1.08, { damping: 12, stiffness: 120 }), -1, true);
      rotate.value = withTiming(0, { duration: 300 });
    } else if (derivedState === 'normal') {
      translateY.value = withRepeat(withTiming(-4, { duration: 1500, easing: Easing.inOut(Easing.sin) }), -1, true);
      scale.value = withTiming(1, { duration: 300 });
      rotate.value = withTiming(0, { duration: 300 });
    } else if (derivedState === 'sad') {
      translateY.value = withTiming(6, { duration: 400, easing: Easing.out(Easing.quad) });
      scale.value = withTiming(0.95, { duration: 300 });
      rotate.value = withTiming(0, { duration: 300 });
    } else if (derivedState === 'critical') {
      translateY.value = withTiming(10, { duration: 400 });
      scale.value = withTiming(0.85, { duration: 400 });
      opacity.value = withTiming(0.6, { duration: 400 });
      rotate.value = withTiming(0, { duration: 300 });
    } else if (derivedState === 'celebrating') {
      translateY.value = withTiming(0, { duration: 250 });
      scale.value = withSpring(1.1, { damping: 10, stiffness: 140 });
      rotate.value = withRepeat(withTiming(2 * Math.PI, { duration: 1200, easing: Easing.inOut(Easing.linear) }), -1, false);
    } else if (derivedState === 'sleeping') {
      translateY.value = withTiming(2, { duration: 400 });
      scale.value = withTiming(0.98, { duration: 400 });
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
  const petColor = user?.petColor || 'golden';

  const renderPet = () => {
    switch (petType) {
      case 'dog':
        return (
          <>
            <DogPetLottie mood={derivedState} color={petColor} size={size} />
            {/* Fallback SVG in case Lottie asset isn't available */}
            {/* <DogPet mood={derivedState} color={petColor} size={size} /> */}
          </>
        );
      default:
        return <DogPet mood={derivedState} color={petColor} size={size} />;
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.inner, animatedStyle]}>{renderPet()}</Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  inner: { alignItems: 'center', justifyContent: 'center' },
});

export default PetCharacter;
