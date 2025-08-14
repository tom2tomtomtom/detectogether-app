import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

export default function CreditAnimation({ amount = 10, x = 0, y = 0, combo = false, onEnd }) {
  const ty = useSharedValue(0);
  const op = useSharedValue(1);

  useEffect(() => {
    ty.value = withTiming(-50, { duration: 1000 });
    op.value = withTiming(0, { duration: 1000 });
    const timer = setTimeout(() => {
      try { onEnd?.(); } catch (_) {}
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }], opacity: op.value }));

  return (
    <Animated.View style={[{ position: 'absolute', left: x, top: y }, style]}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: combo ? '#E11D48' : '#16A34A' }}>
        {combo ? 'COMBO! ' : ''}+{amount}
      </Text>
    </Animated.View>
  );
}


