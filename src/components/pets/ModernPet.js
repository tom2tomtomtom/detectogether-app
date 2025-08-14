import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle, G, Ellipse, Path } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const PALETTES = {
  dog: {
    start: '#FFE4B5',
    end: '#FFDAB9',
    accent: '#C08A5A',
    ear: '#E6B98A',
  },
  cat: {
    start: '#E6E8F0',
    end: '#D7D9E6',
    accent: '#8E94A4',
    ear: '#C3C6D2',
  },
  bunny: {
    start: '#FFFFFF',
    end: '#F7EAF2',
    accent: '#D6B6C9',
    ear: '#F5CEDC',
  },
};

function useBlink() {
  const eyeOpen = useSharedValue(1);
  const intervalRef = useRef(null);
  useEffect(() => {
    const blinkNow = () => {
      eyeOpen.value = withSequence(
        withTiming(0, { duration: 80 }),
        withTiming(1, { duration: 120 })
      );
    };
    const schedule = () => {
      const delayMs = 3000 + Math.random() * 2000;
      intervalRef.current = setTimeout(() => {
        blinkNow();
        schedule();
      }, delayMs);
    };
    schedule();
    return () => intervalRef.current && clearTimeout(intervalRef.current);
  }, []);
  return eyeOpen;
}

export default function ModernPet({ petType = 'dog', mood = 'normal', size = 200, onPress }) {
  const palette = PALETTES[petType] || PALETTES.dog;

  // Animations
  const breath = useSharedValue(0);
  const wag = useSharedValue(0);
  // Removed separate ear tilt; ears are part of body group to avoid detachment
  const droop = useSharedValue(0);
  const opacity = useSharedValue(1);
  const wiggle = useSharedValue(0);
  const eyeOpen = useBlink();

  useEffect(() => {
    // Base breathing
    breath.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  useEffect(() => {
    // Mood-driven params
    if (mood === 'happy' || mood === 'celebrating') {
      wag.value = withRepeat(withTiming(15, { duration: 500, easing: Easing.inOut(Easing.ease) }), -1, true);
      droop.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    } else if (mood === 'normal') {
      wag.value = withRepeat(withTiming(8, { duration: 1100, easing: Easing.inOut(Easing.ease) }), -1, true);
      droop.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    } else if (mood === 'sad') {
      wag.value = withRepeat(withTiming(5, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
      droop.value = withTiming(6, { duration: 300 });
      opacity.value = withTiming(0.9, { duration: 300 });
    } else if (mood === 'critical') {
      wag.value = withRepeat(withTiming(3, { duration: 1600, easing: Easing.inOut(Easing.ease) }), -1, true);
      droop.value = withTiming(10, { duration: 300 });
      opacity.value = withTiming(0.75, { duration: 300 });
    } else if (mood === 'sleeping') {
      wag.value = withRepeat(withTiming(2, { duration: 1800, easing: Easing.inOut(Easing.ease) }), -1, true);
      droop.value = withTiming(4, { duration: 300 });
      opacity.value = withTiming(0.9, { duration: 300 });
    }
  }, [mood]);

  const onTap = () => {
    wiggle.value = withSequence(
      withTiming(1, { duration: 80 }),
      withTiming(-1, { duration: 80 }),
      withTiming(0.6, { duration: 80 }),
      withTiming(0, { duration: 120 })
    );
    onPress?.();
  };

  // Animated styles/props
  const bodyAnimatedStyle = useAnimatedStyle(() => {
    const breathScale = 1 + 0.02 * breath.value;
    const wiggleRot = wiggle.value * 4; // degrees
    return {
      transform: [
        { translateY: droop.value },
        { scale: breathScale },
        { rotate: `${wiggleRot}deg` },
      ],
      opacity: opacity.value,
    };
  });

  const tailAnimatedProps = useAnimatedProps(() => {
    const angle = wag.value; // degrees
    return { transform: [{ rotate: `${angle}deg` }] };
  });

  // No separate ear transform

  const eyeAnimatedProps = useAnimatedProps(() => ({ transform: [{ scaleY: Math.max(0.1, eyeOpen.value) }] }));

  // Layout sizes
  const w = 200; // svg base width
  const h = 200;
  const bodyX = 40;
  const bodyY = 40;
  const bodyW = 120;
  const bodyH = 110;
  const tailBaseX = bodyX + bodyW; // 160
  const tailBaseY = bodyY + bodyH / 2; // 95

  return (
    <Pressable onPress={onTap} hitSlop={16}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox={`0 0 ${w} ${h}`}>
          <Defs>
            <LinearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={palette.start} />
              <Stop offset="100%" stopColor={palette.end} />
            </LinearGradient>
            <LinearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Soft ground shadow */}
          <Ellipse cx={w / 2} cy={h - 12} rx={56} ry={10} fill="#000" opacity={0.06} />

          {/* Body group */}
          <AnimatedG style={bodyAnimatedStyle}>
            {/* Tail (behind body, anchored at body edge). transform origin set to connection point */}
            <AnimatedG origin={`${tailBaseX},${tailBaseY}`} animatedProps={tailAnimatedProps}>
              {/* longer, thicker tail with slight overlap */}
              <Path d={`M ${tailBaseX} ${tailBaseY} q 34 -12 40 10 q -12 26 -40 20`} fill={palette.ear} opacity={0.92} />
              {/* overlap patch to hide seam */}
              <Ellipse cx={tailBaseX - 4} cy={tailBaseY + 3} rx={10} ry={12} fill="url(#bodyGrad)" opacity={0.95} />
            </AnimatedG>
            {/* Rounded body */}
            <Rect x={40} y={40} width={120} height={110} rx={55} fill="url(#bodyGrad)" />
            {/* Shine */}
            <Path d={`M 60 58 q 20 -16 40 -8 q 30 12 0 28 q -24 14 -40 8`} fill="url(#shine)" opacity={0.18} />

            {/* Ears (part of body group; no independent transforms) */}
            <G>
              <Path d="M80 42 q -22 -24 -30 -8 q 10 18 22 24 z" fill={palette.ear} />
              <Path d="M120 42 q 22 -24 30 -8 q -10 18 -22 24 z" fill={palette.ear} />
            </G>

            {/* Eyes */}
            <G>
              <Circle cx={85} cy={88} r={10} fill="#fff" />
              <AnimatedCircle cx={85} cy={88} r={6} fill="#2B2B2B" animatedProps={eyeAnimatedProps} />
              <Circle cx={115} cy={88} r={10} fill="#fff" />
              <AnimatedCircle cx={115} cy={88} r={6} fill="#2B2B2B" animatedProps={eyeAnimatedProps} />
            </G>

            {/* Nose/Mouth */}
            <Circle cx={100} cy={106} r={3.5} fill="#333" />
            <Path d="M96 112 q 4 4 8 0" stroke="#333" strokeWidth={3} strokeLinecap="round" fill="none" />
          </AnimatedG>
        </Svg>
      </View>
    </Pressable>
  );
}


