import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

const SIZE_MAP = { small: 40, large: 80 };

const AchievementBadge = ({ title, unlocked = false, progress = 0, size = 'large' }) => {
  const s = SIZE_MAP[size] || 80;
  const scale = useSharedValue(unlocked ? 1 : 0.95);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (unlocked) {
    scale.value = withSpring(1, { damping: 12, stiffness: 120 });
  } else {
    scale.value = withTiming(0.95, { duration: 200 });
  }

  return (
    <View style={[styles.container, { width: s, alignItems: 'center' }]}>      <Animated.View
        style={[styles.badge, animatedStyle, { width: s, height: s, borderRadius: s / 2, backgroundColor: unlocked ? '#34D399' : '#E5E7EB' }]}
      >
        {unlocked ? (
          <Icon name="trophy" size={s * 0.5} color="#FFFFFF" />
        ) : (
          <Icon name="lock-closed" size={s * 0.5} color="#9CA3AF" />
        )}
      </Animated.View>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {typeof progress === 'number' && progress > 0 && progress < 1 ? (
        <View style={[styles.progressBar, { width: s }]}>          <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    marginTop: 6,
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
    maxWidth: 100,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#34D399',
  },
});

export default AchievementBadge;
