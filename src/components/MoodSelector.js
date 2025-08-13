import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../styles/theme';

const moods = [
  { emoji: '😔', label: 'Sad', value: 1 },
  { emoji: '😐', label: 'Okay', value: 2 },
  { emoji: '😊', label: 'Good', value: 3 },
  { emoji: '😄', label: 'Great', value: 4 },
  { emoji: '🤩', label: 'Amazing', value: 5 },
];

const MoodSelector = ({ selectedMood, onMoodSelect }) => {
  return (
    <View style={styles.container}>
      {moods.map((mood) => (
        <TouchableOpacity
          key={mood.value}
          style={[
            styles.moodOption,
            selectedMood === mood.value && styles.moodOptionActive,
          ]}
          onPress={() => onMoodSelect(mood.value)}
        >
          <Text style={styles.moodEmoji}>{mood.emoji}</Text>
          <Text style={styles.moodLabel}>{mood.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginHorizontal: 2,
  },
  moodOptionActive: {
    backgroundColor: colors.primaryLight,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  moodLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
});

export default MoodSelector;
