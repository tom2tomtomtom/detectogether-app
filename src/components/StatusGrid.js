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
        <TouchableOpacity key={r.id} style={styles.cell} activeOpacity={0.8} onPress={() => onPress?.(r.id)}>
          <Text style={styles.cellIcon}>{r.icon}</Text>
          <Text style={styles.cellValue}>{String(data[r.valueKey] ?? '--')}</Text>
          <Text style={styles.cellLabel}>{r.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#E5E7EB',
  },
  cell: {
    width: '50%',
    height: 70,
    padding: 8,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellIcon: { fontSize: 18, marginBottom: 2 },
  cellValue: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  cellLabel: { fontSize: 12, color: colors.textSecondary },
});


