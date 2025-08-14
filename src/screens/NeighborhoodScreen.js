import React, { useMemo } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useStore } from '../store/useStore';

const { width } = Dimensions.get('window');

const HouseCard = ({ item, isYou }) => {
  const petIcon = item.petType === 'dog' ? '🐶' : item.petType === 'cat' ? '🐱' : item.petType === 'bunny' ? '🐰' : '🦎';
  return (
    <View style={[styles.houseCard, isYou && styles.houseYou]}> 
      <View style={styles.roof} />
      <View style={styles.houseBody}>
        <Text style={styles.petIcon}>{petIcon}</Text>
      </View>
      <View style={styles.healthBarTrack}>
        <View style={[styles.healthBarFill, { width: `${Math.min(100, Math.max(0, item.health))}%` }]} />
      </View>
      <View style={styles.rowBetween}>
        <Text style={styles.healthText}>{item.health}%</Text>
        <Text style={styles.streakText}>🔥 {item.streakDays}d</Text>
      </View>
      {item.activeToday && <View style={styles.activeDot} />}
    </View>
  );
};

export default function NeighborhoodScreen() {
  const neighbors = useStore((s) => s.neighborhoodData) || [];
  const stats = useStore((s) => s.communityStats) || { totalLogs: 0, weeklyGoal: 1000 };
  const you = useStore((s) => s.pet);
  const progressPct = Math.min(1, (stats.totalLogs || 0) / (stats.weeklyGoal || 1));

  const youHouse = useMemo(() => ({ id: 'you', petType: you?.user?.petType || 'dog', health: you?.health || 50, streakDays: (useStore.getState().achievements?.streakDays) || 0, activeToday: true }), [you]);

  const data = [youHouse, ...neighbors];

  return (
    <SafeAreaView style={styles.container}>
      {/* Community goal */}
      <View style={styles.goalCard}>
        <Text style={styles.goalTitle}>Neighborhood Goal: {stats.weeklyGoal} logs this week</Text>
        <View style={styles.goalTrack}><View style={[styles.goalFill, { width: `${progressPct * 100}%` }]} /></View>
        <Text style={styles.goalMeta}>{stats.totalLogs || 0}/{stats.weeklyGoal} - Keep going!</Text>
        {stats.unlocked && <Text style={styles.unlockedText}>🎉 Dog Park Unlocked!</Text>}
      </View>

      {/* Street view */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {data.map((n) => (
          <HouseCard key={n.id} item={n} isYou={n.id === 'you'} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F8F6' },
  goalCard: { backgroundColor: '#FFFFFF', margin: 16, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  goalTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937' },
  goalTrack: { height: 10, backgroundColor: '#E0F2F1', borderRadius: 999, overflow: 'hidden', marginTop: 8 },
  goalFill: { height: '100%', backgroundColor: '#10B981' },
  goalMeta: { marginTop: 6, color: '#374151', fontWeight: '700' },
  unlockedText: { marginTop: 6, color: '#7C3AED', fontWeight: '800' },
  houseCard: { width: 120, height: 150, marginRight: 12, alignItems: 'center', justifyContent: 'flex-end', position: 'relative' },
  houseYou: { transform: [{ scale: 1.05 }] },
  roof: { width: 110, height: 20, backgroundColor: '#A7C4BC', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  houseBody: { width: 110, height: 80, backgroundColor: '#DCEFEA', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, alignItems: 'center', justifyContent: 'center' },
  petIcon: { fontSize: 40 },
  healthBarTrack: { width: 110, height: 6, backgroundColor: '#E5E7EB', borderRadius: 999, overflow: 'hidden', marginTop: 8 },
  healthBarFill: { height: '100%', backgroundColor: '#10B981' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', width: 110, marginTop: 4 },
  healthText: { fontWeight: '700', color: '#111827' },
  streakText: { color: '#6B7280', fontWeight: '700' },
  activeDot: { position: 'absolute', top: 8, right: 20, width: 10, height: 10, borderRadius: 5, backgroundColor: '#22C55E' },
});


