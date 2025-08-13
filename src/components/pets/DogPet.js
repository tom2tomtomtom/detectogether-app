import React, { useEffect } from 'react';
import Svg, { G, Circle, Ellipse, Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);

const PALETTES = {
  golden: { main: '#F4B760', dark: '#C27C2D', nose: '#E06AA3', eye: '#2F2F2F', white: '#FFFFFF' },
  brown: { main: '#8B5A2B', dark: '#5C3A1A', nose: '#E06AA3', eye: '#2F2F2F', white: '#FFFFFF' },
  black: { main: '#3A3A3A', dark: '#1F1F1F', nose: '#C65C96', eye: '#FFFFFF', white: '#F5F5F5' },
  white: { main: '#F7F7F7', dark: '#E2E2E2', nose: '#E06AA3', eye: '#2F2F2F', white: '#FFFFFF' },
};

function getPalette(color) {
  return PALETTES[color] || PALETTES.golden;
}

const mouthPaths = {
  happy: 'M30 46 Q40 52 50 46',
  normal: 'M32 48 Q40 50 48 48',
  sad: 'M30 50 Q40 44 50 50',
  celebrating: 'M28 45 Q40 56 52 45',
  sleeping: '',
  critical: 'M31 50 Q40 47 49 50',
  idle: 'M32 48 Q40 50 48 48',
};

const tailPaths = {
  happy: 'M58 48 Q66 42 70 46 Q66 50 58 48',
  normal: 'M56 50 Q64 46 66 50',
  sad: 'M56 54 Q60 58 62 60',
  celebrating: 'M58 46 Q70 40 72 46 Q70 52 58 46',
  sleeping: 'M54 56 Q60 60 58 62',
  critical: 'M56 54 Q60 58 62 60',
  idle: 'M56 50 Q64 46 66 50',
};

const earLeftPaths = {
  happy: 'M22 22 Q18 10 28 16 Z',
  normal: 'M24 20 Q18 12 26 16 Z',
  sad: 'M24 24 Q18 26 26 18 Z',
  celebrating: 'M22 18 Q16 6 28 14 Z',
  sleeping: 'M24 24 Q18 26 26 18 Z',
  critical: 'M24 24 Q18 26 26 18 Z',
  idle: 'M24 20 Q18 12 26 16 Z',
};

const earRightPaths = {
  happy: 'M58 22 Q62 10 52 16 Z',
  normal: 'M56 20 Q62 12 54 16 Z',
  sad: 'M56 24 Q62 26 54 18 Z',
  celebrating: 'M58 18 Q64 6 52 14 Z',
  sleeping: 'M56 24 Q62 26 54 18 Z',
  critical: 'M56 24 Q62 26 54 18 Z',
  idle: 'M56 20 Q62 12 54 16 Z',
};

const DogPet = ({ mood = 'normal', color = 'golden', size = 80, opacity: forcedOpacity }) => {
  const palette = getPalette(color);
  const isHappy = mood === 'happy' || mood === 'celebrating';
  const isCritical = mood === 'critical';
  const isSleeping = mood === 'sleeping';

  // Tail wag animation value (-8deg to 8deg)
  const tailAngle = useSharedValue(0);
  useEffect(() => {
    if (isHappy) {
      tailAngle.value = withRepeat(withTiming(8, { duration: 350, easing: Easing.inOut(Easing.ease) }), -1, true);
    } else {
      tailAngle.value = withTiming(0, { duration: 200 });
    }
  }, [isHappy]);
  const tailAnimatedProps = useAnimatedProps(() => ({
    transform: [{ rotate: `${tailAngle.value}deg` }, { translateX: 0 }, { translateY: 0 }],
  }));

  // Ear perk subtle lift for happy/celebrating
  const earLift = useSharedValue(0);
  useEffect(() => {
    earLift.value = withTiming(isHappy ? -1.5 : 0, { duration: 180 });
  }, [isHappy]);
  const earAnimatedProps = useAnimatedProps(() => ({
    transform: [{ translateY: earLift.value }],
  }));

  const effectiveOpacity = forcedOpacity !== undefined ? forcedOpacity : isCritical ? 0.7 : 1;

  // Eyes
  const Eyes = () => {
    if (isSleeping) {
      return (
        <G>
          <Path d="M33 34 Q36 36 39 34" stroke={palette.eye} strokeWidth={2} fill="none" />
          <Path d="M41 34 Q44 36 47 34" stroke={palette.eye} strokeWidth={2} fill="none" />
        </G>
      );
    }
    if (mood === 'sad' || mood === 'critical') {
      return (
        <G>
          <Ellipse cx="36" cy="34" rx="2" ry="1.5" fill={palette.eye} />
          <Ellipse cx="44" cy="34" rx="2" ry="1.5" fill={palette.eye} />
        </G>
      );
    }
    // happy/normal/celebrating/idle
    return (
      <G>
        <Circle cx="36" cy="34" r="2" fill={palette.eye} />
        <Circle cx="44" cy="34" r="2" fill={palette.eye} />
      </G>
    );
  };

  // Mouth
  const mouthD = mouthPaths[mood] || mouthPaths.normal;

  const tailD = tailPaths[mood] || tailPaths.normal;
  const earLD = earLeftPaths[mood] || earLeftPaths.normal;
  const earRD = earRightPaths[mood] || earRightPaths.normal;

  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      <G opacity={effectiveOpacity}>
        {/* Shadow under body */}
        <Ellipse cx="40" cy="64" rx="18" ry="4" fill="rgba(0,0,0,0.1)" />

        {/* Tail */}
        <AnimatedG animatedProps={tailAnimatedProps} origin="58,50">
          <Path d={tailD} fill={palette.main} />
        </AnimatedG>

        {/* Body */}
        <Ellipse cx="40" cy="52" rx="20" ry="18" fill={palette.main} />

        {/* Legs */}
        <Ellipse cx="30" cy="62" rx="4" ry="6" fill={palette.dark} />
        <Ellipse cx="50" cy="62" rx="4" ry="6" fill={palette.dark} />
        <Ellipse cx="34" cy="60" rx="3.5" ry="5.5" fill={palette.dark} />
        <Ellipse cx="46" cy="60" rx="3.5" ry="5.5" fill={palette.dark} />

        {/* Head */}
        <Circle cx="40" cy="32" r="16" fill={palette.main} />

        {/* Ears */}
        <AnimatedG animatedProps={earAnimatedProps}>
          <Path d={earLD} fill={palette.dark} />
          <Path d={earRD} fill={palette.dark} />
        </AnimatedG>

        {/* Eyes */}
        <Eyes />

        {/* Nose */}
        <Ellipse cx="40" cy="38" rx="3.2" ry="2.4" fill={palette.nose} />

        {/* Mouth / tongue for happy/celebrating */}
        {mood !== 'sleeping' && mouthD ? (
          <>
            <Path d={mouthD} stroke={palette.eye} strokeWidth={2} fill="none" />
            {(mood === 'happy' || mood === 'celebrating') && (
              <Ellipse cx="40" cy="48" rx="3" ry="2" fill="#FF7AA2" />
            )}
          </>
        ) : null}
      </G>
    </Svg>
  );
};

export default React.memo(DogPet);
