import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';

const rows = [
  { id: 'hydration', label: 'Hydration', color: '#45B7D1', icon: '💧', valueKey: 'hydration' },
  { id: 'energy', label: 'Energy', color: '#F7B731', icon: '⚡', valueKey: 'energy' },
  { id: 'mind', label: 'Mental', color: '#5F27CD', icon: '🧠', valueKey: 'mind' },
  { id: 'mood', label: 'Mood', color: '#FFD166', icon: '😊', valueKey: 'mood' },
];

export default function StatusGrid({ data = {}, onPress }) {
  return (
    <View style={styles.grid}>
      {rows.map((r) => (
        <TouchableOpacity key={r.id} style={styles.card} activeOpacity={0.9} onPress={() => onPress?.(r.id)}>
          <View style={[styles.iconCircle, { backgroundColor: r.color }]}>
            <Text style={styles.icon}>{r.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.value}>{String(data[r.valueKey] ?? '--')}</Text>
            <Text style={styles.label}>{r.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  card: {
    width: '48%',
    height: 80,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: { fontSize: 28 },
  value: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  label: { fontSize: 14, color: colors.textSecondary },
});


