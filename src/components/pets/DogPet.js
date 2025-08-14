import React, { useEffect } from 'react';
import Svg, { G, Circle, Ellipse, Path, Text as SvgText } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);

// Professional palette
const PALETTES = {
  golden: {
    main: '#FFD700',
    secondary: '#FFA500',
    belly: '#FFF8DC',
    nose: '#000000',
    tongue: '#FF69B4',
    eye: '#2C1810',
  },
  brown: {
    main: '#CD853F',
    secondary: '#8B4513',
    belly: '#FAEBD7',
    nose: '#000000',
    tongue: '#FF69B4',
    eye: '#2C1810',
  },
  white: {
    main: '#FFFFFF',
    secondary: '#F5F5F5',
    belly: '#FFFAFA',
    nose: '#000000',
    tongue: '#FF69B4',
    eye: '#2C1810',
  },
  black: {
    main: '#2C2C2C',
    secondary: '#1A1A1A',
    belly: '#4A4A4A',
    nose: '#000000',
    tongue: '#FF69B4',
    eye: '#8B4513',
  },
};

const getPalette = (c) => PALETTES[c] || PALETTES.golden;

const DogPet = ({
  mood = 'normal',
  color = 'golden',
  size = 80,
  opacity: forcedOpacity,
  blink = false,
  earTwitch = false,
}) => {
  const palette = getPalette(color);
  const isHappy = mood === 'happy' || mood === 'celebrating';
  const isCritical = mood === 'critical';
  const isSleeping = mood === 'sleeping';

  // Tail wag animation for happy/celebrating
  const tailAngle = useSharedValue(0);
  useEffect(() => {
    if (isHappy) {
      tailAngle.value = withRepeat(withTiming(12, { duration: 400, easing: Easing.inOut(Easing.ease) }), -1, true);
    } else {
      tailAngle.value = withTiming(0, { duration: 200 });
    }
  }, [isHappy]);
  const tailAnimatedProps = useAnimatedProps(() => ({
    transform: [{ rotate: `${tailAngle.value}deg` }],
  }));

  // Ear perk/twitch
  const earLift = useSharedValue(0);
  useEffect(() => {
    const base = isHappy ? -2 : mood === 'sad' || mood === 'critical' ? 2 : 0;
    const twitch = earTwitch ? -2 : 0;
    earLift.value = withTiming(base + twitch, { duration: 150 });
  }, [isHappy, earTwitch, mood]);
  const earAnimatedProps = useAnimatedProps(() => ({ transform: [{ translateY: earLift.value }] }));

  const effectiveOpacity = forcedOpacity !== undefined ? forcedOpacity : isCritical ? 0.7 : 1;

  // Mood-driven geometry
  const tailPath =
    mood === 'happy'
      ? 'M 55 45 Q 70 35 65 25'
      : mood === 'sad' || mood === 'critical'
      ? 'M 55 50 Q 65 60 60 65'
      : mood === 'celebrating'
      ? 'M 55 44 Q 72 34 68 22'
      : mood === 'sleeping'
      ? 'M 54 52 Q 60 56 58 60'
      : 'M 55 48 Q 68 45 65 40';

  const earLeftPath =
    mood === 'happy' || mood === 'celebrating'
      ? 'M 22 22 Q 15 12 22 18 L 28 25 Q 25 28 22 22'
      : mood === 'sad' || mood === 'critical'
      ? 'M 22 30 Q 15 35 20 32 L 28 28 Q 26 25 22 30'
      : 'M 22 25 Q 16 20 22 23 L 28 26 Q 26 27 22 25';

  const earRightPath =
    mood === 'happy' || mood === 'celebrating'
      ? 'M 58 22 Q 65 12 58 18 L 52 25 Q 55 28 58 22'
      : mood === 'sad' || mood === 'critical'
      ? 'M 58 30 Q 65 35 60 32 L 52 28 Q 54 25 58 30'
      : 'M 58 25 Q 64 20 58 23 L 52 26 Q 54 27 58 25';

  const showMouth = mood === 'happy' || mood === 'celebrating' || mood === 'sad';
  const mouthPath = mood === 'sad' || mood === 'critical' ? 'M 35 42 Q 40 39 45 42' : 'M 35 40 Q 40 44 45 40';
  const showTongue = mood === 'happy' || mood === 'celebrating';

  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      <G opacity={effectiveOpacity}>
        {/* Ground shadow */}
        <Ellipse cx="40" cy="72" rx="25" ry="5" fill="#00000020" />

        {/* Back legs (behind body) */}
        <Ellipse cx="28" cy="60" rx="8" ry="12" fill={palette.main} />
        <Ellipse cx="52" cy="60" rx="8" ry="12" fill={palette.main} />

        {/* Body */}
        <Ellipse cx="40" cy="50" rx="20" ry="18" fill={palette.main} />
        {/* Belly patch */}
        <Ellipse cx="40" cy="52" rx="12" ry="10" fill={palette.belly} />

        {/* Front legs */}
        <Ellipse cx="32" cy="62" rx="6" ry="10" fill={palette.main} />
        <Ellipse cx="48" cy="62" rx="6" ry="10" fill={palette.main} />
        {/* Paw pads */}
        <Ellipse cx="32" cy="68" rx="3" ry="2" fill={palette.secondary} />
        <Ellipse cx="48" cy="68" rx="3" ry="2" fill={palette.secondary} />

        {/* Tail */}
        <AnimatedG origin="55,48" animatedProps={tailAnimatedProps}>
          <Path d={tailPath} stroke={palette.main} strokeWidth="8" strokeLinecap="round" fill="none" />
        </AnimatedG>

        {/* Head */}
        <Circle cx="40" cy="28" r="18" fill={palette.main} />

        {/* Snout and muzzle */}
        <Ellipse cx="40" cy="35" rx="10" ry="8" fill={palette.secondary} />
        <Ellipse cx="40" cy="33" rx="8" ry="6" fill={palette.belly} />

        {/* Ears */}
        <AnimatedG animatedProps={earAnimatedProps}>
          <Path d={earLeftPath} fill={palette.secondary} />
          <Path d={earRightPath} fill={palette.secondary} />
        </AnimatedG>

        {/* Eyes */}
        {isSleeping || blink ? (
          <>
            <Path d="M 30 28 Q 33 30 36 28" stroke={palette.eye} strokeWidth="1.5" fill="none" />
            <Path d="M 44 28 Q 47 30 50 28" stroke={palette.eye} strokeWidth="1.5" fill="none" />
          </>
        ) : mood === 'celebrating' ? (
          <>
            {/* starry big eyes */}
            <Ellipse cx="33" cy="28" rx={5} ry={6} fill="#FFFFFF" />
            <SvgText x="31" y="30" fontSize="7" fill={palette.eye}>★</SvgText>
            <Ellipse cx="47" cy="28" rx={5} ry={6} fill="#FFFFFF" />
            <SvgText x="45" y="30" fontSize="7" fill={palette.eye}>★</SvgText>
          </>
        ) : (
          <>
            <Ellipse cx="33" cy="28" rx={mood === 'happy' ? 4 : 3} ry={mood === 'happy' ? 5 : 4} fill="#FFFFFF" />
            <Circle cx="33" cy="28" r={mood === 'sad' || mood === 'critical' ? 2 : 3} fill={palette.eye} />
            {mood === 'happy' && <Circle cx="34" cy="26" r="1" fill="#FFFFFF" />}

            <Ellipse cx="47" cy="28" rx={mood === 'happy' ? 4 : 3} ry={mood === 'happy' ? 5 : 4} fill="#FFFFFF" />
            <Circle cx="47" cy="28" r={mood === 'sad' || mood === 'critical' ? 2 : 3} fill={palette.eye} />
            {mood === 'happy' && <Circle cx="48" cy="26" r="1" fill="#FFFFFF" />}

            {/* Optional tear for sad */}
            {(mood === 'sad' || mood === 'critical') && (
              <Path d="M 31 32 Q 32 36 30 38" stroke="#76C7F5" strokeWidth="1" fill="none" />
            )}
          </>
        )}

        {/* Nose */}
        <Ellipse cx="40" cy="38" rx="3" ry="2" fill={palette.nose} />

        {/* Mouth and tongue */}
        {showMouth && <Path d={mouthPath} stroke={palette.eye} strokeWidth="1.5" fill="none" strokeLinecap="round" />}
        {showTongue && <Path d="M 40 42 Q 38 48 40 48 Q 42 48 40 42" fill={palette.tongue} />}

        {/* Celebration accents */}
        {mood === 'celebrating' && (
          <>
            <SvgText x="20" y="15" fontSize="8">✨</SvgText>
            <SvgText x="55" y="15" fontSize="8">✨</SvgText>
            <SvgText x="15" y="40" fontSize="8">⭐</SvgText>
            <SvgText x="60" y="40" fontSize="8">⭐</SvgText>
          </>
        )}
      </G>
    </Svg>
  );
};

export default React.memo(DogPet);
