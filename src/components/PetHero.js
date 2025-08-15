import React, { useEffect } from 'react';
import { Alert, View, Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { PanGestureHandler, TapGestureHandler, LongPressGestureHandler } from 'react-native-gesture-handler';
import PetCharacter from './PetCharacter';
// import PetEnvironment from './PetEnvironment';
import { useStore } from '../store/useStore';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export default function PetHero({
  healthScore = 50,
  // Outer progress ring diameter
  ringSize = 190,
  // Static white circle background diameter
  circleSize = 180,
  // Pet character size
  petPixel = 140,
  petType,
}) {
  // const envLevel = useStore((s) => s.pet.petEnvironmentLevel || 0);
  const animatedScale = useSharedValue(1);
  const animatedY = useSharedValue(0);
  const rotateZ = useSharedValue(0);

  useEffect(() => {
    animatedY.value = withRepeat(withTiming(-10, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true);
    return () => {
      animatedY.value = 0;
    };
  }, []);

  const onTap = () => {
    animatedScale.value = withSequence(withSpring(1.12), withSpring(1));
  };

  const onSwipeEnd = (event) => {
    const { translationX } = event.nativeEvent;
    if (Math.abs(translationX) > 40) {
      rotateZ.value = 0;
      rotateZ.value = withSequence(withTiming(2 * Math.PI, { duration: 600 }), withTiming(0, { duration: 0 }));
    }
  };

  const onLongPress = () => {
    Alert.alert('Pet menu', 'Coming soon: feed, play, and more!');
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: animatedY.value },
      { scale: animatedScale.value },
      { rotateZ: `${rotateZ.value}rad` },
    ],
  }));

  const derivedMood = (() => {
    const score = clamp(healthScore, 0, 100);
    if (score >= 80) return 'happy';
    if (score >= 60) return 'normal';
    if (score >= 40) return 'sad';
    return 'critical';
  })();

  return (
    <LongPressGestureHandler onActivated={onLongPress} minDurationMs={500}>
      <TapGestureHandler onActivated={onTap}>
        <PanGestureHandler onEnded={onSwipeEnd}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: ringSize, height: ringSize, alignItems: 'center', justifyContent: 'center' }}>
              {/* Circular progress ring - STATIC */}
              {(() => {
                const stroke = 10;
                const r = ringSize / 2 - stroke / 2;
                const cx = ringSize / 2;
                const cy = ringSize / 2;
                const circumference = 2 * Math.PI * r;
                const progress = Math.max(0, Math.min(1, healthScore / 100));
                const dash = `${circumference * progress} ${circumference}`;
                return (
                  <Svg height={ringSize} width={ringSize} style={{ position: 'absolute' }}>
                    <Defs>
                      <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#5856D6" />
                        <Stop offset="100%" stopColor="#8B5CF6" />
                      </LinearGradient>
                    </Defs>
                    <Circle cx={cx} cy={cy} r={r} stroke="rgba(88,86,214,0.1)" strokeWidth={stroke} fill="none" />
                    <Circle cx={cx} cy={cy} r={r} stroke="url(#grad)" strokeWidth={stroke} fill="none" strokeDasharray={dash} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
                  </Svg>
                );
              })()}

              {/* White circle background - STATIC */}
              <View
                style={{
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2,
                  backgroundColor: '#FFFFFF',
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 20,
                  shadowOffset: { width: 0, height: 10 },
                  elevation: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {/* Only animate the inner pet */}
                <Animated.View style={animatedStyle}>
                  <PetCharacter petType={petType} healthScore={healthScore} size={petPixel} />
                </Animated.View>
              {/* Percentage inside the white circle */}
              <Text style={{ position: 'absolute', bottom: 15, fontSize: 24, fontWeight: '700', color: '#5856D6' }}>
                {Math.round(healthScore)}%
              </Text>
              </View>
            </View>
          </View>
        </PanGestureHandler>
      </TapGestureHandler>
    </LongPressGestureHandler>
  );
}


