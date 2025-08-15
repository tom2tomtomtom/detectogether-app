import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useStore } from '../store/useStore';

const ProgressBar = ({ value, target }) => {
  const pct = Math.min(1, (value || 0) / (target || 1));
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
    </View>
  );
};

export default function MissionsScreen() {
  const active = useStore((s) => s.activeMissions);
  const progress = useStore((s) => s.missionProgress);
  const refresh = useStore((s) => s.refreshWeeklyMissions);
  const complete = useStore((s) => s.completeMission);

  useEffect(() => {
    if (!active || active.length === 0) refresh();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>Weekly Missions</Text>
        <Text style={styles.subtitle}>Complete goals to earn Care Credits and unlocks</Text>

        {(active || []).slice(0, 3).map((m) => {
          const cur = progress?.[m.id] || 0;
          const done = cur >= m.target;
          return (
            <View key={m.id} style={styles.card}>
              <Text style={styles.icon}>{m.icon}</Text>
              <Text style={styles.cardTitle}>{m.title}</Text>
              <Text style={styles.cardDesc}>{m.description}</Text>
              <ProgressBar value={cur} target={m.target} />
              <View style={styles.rowBetween}>
                <Text style={styles.meta}>{cur}/{m.target}</Text>
                <Text style={styles.reward}>🪙 {m.reward?.credits || 0} PetPennies</Text>
              </View>
              <TouchableOpacity
                disabled={!done}
                onPress={() => complete(m.id)}
                style={[styles.claimBtn, done ? styles.claimReady : styles.claimDisabled]}
              >
                <Text style={styles.claimText}>{done ? 'Claim Reward' : 'In Progress'}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAF9' },
  title: { fontSize: 24, fontWeight: '800', color: '#1F2937' },
  subtitle: { color: '#6B7280', marginBottom: 12 },
  card: { backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  icon: { fontSize: 22 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginTop: 6 },
  cardDesc: { color: '#4B5563', marginVertical: 6 },
  progressTrack: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 999, overflow: 'hidden', marginVertical: 8 },
  progressFill: { height: '100%', backgroundColor: '#7C3AED' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta: { color: '#374151', fontWeight: '700' },
  reward: { color: '#1B5E20', fontWeight: '800' },
  claimBtn: { marginTop: 10, paddingVertical: 10, borderRadius: 999, alignItems: 'center' },
  claimReady: { backgroundColor: '#10B981' },
  claimDisabled: { backgroundColor: '#9CA3AF' },
  claimText: { color: '#FFF', fontWeight: '800' },
});


