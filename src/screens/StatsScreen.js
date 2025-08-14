import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../store/useStore';

const ProgressBar = ({ value = 0, target = 1 }) => {
  const pct = Math.min(1, (value || 0) / (target || 1));
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
    </View>
  );
};

const StatsScreen = () => {
  const navigation = useNavigation();
  const pet = useStore((s) => s.pet);
  const achievements = useStore((s) => s.achievements);
  const activeMissions = useStore((s) => s.activeMissions) || [];
  const missionProgress = useStore((s) => s.missionProgress) || {};
  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Progress</Text>
            <Text style={styles.subtitle}>Achievements & Statistics</Text>
          </View>

          {/* Credits summary */}
          <View style={styles.card}> 
            <Text style={styles.cardTitle}>Care Credits</Text>
            <View style={styles.rowBetween}>
              <Text style={styles.bigNumber}>🪙 {pet.careCredits || 0}</Text>
              <Text style={styles.muted}>Lifetime: {pet.totalCreditsEarned || 0}</Text>
            </View>
          </View>

          {/* Streaks */}
          <View style={styles.card}> 
            <Text style={styles.cardTitle}>Streak</Text>
            <View style={styles.rowBetween}>
              <Text style={styles.bigNumber}>{achievements.streakDays || 0} days</Text>
              <Text style={styles.muted}>Balanced days: {achievements.balancedDays || 0}</Text>
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.card}> 
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>Achievements</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Achievements')}>
                <Text style={styles.link}>View All</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.bigNumber}>{(achievements.unlockedIds || []).length}</Text>
            <Text style={styles.muted}>Unlocked</Text>
          </View>

          {/* Weekly Missions */}
          <View style={styles.card}> 
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>Weekly Missions</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Missions')}>
                <Text style={styles.link}>Open</Text>
              </TouchableOpacity>
            </View>
            {(activeMissions.slice(0, 3)).map((m) => (
              <View key={m.id} style={{ marginTop: 10 }}>
                <Text style={styles.missionTitle}>{m.icon} {m.title}</Text>
                <Text style={styles.muted}>{m.description}</Text>
                <ProgressBar value={missionProgress[m.id] || 0} target={m.target} />
                <View style={styles.rowBetween}>
                  <Text style={styles.muted}>{missionProgress[m.id] || 0}/{m.target}</Text>
                  <Text style={styles.rewardText}>🪙 {m.reward?.credits || 0}</Text>
                </View>
              </View>
            ))}
            {activeMissions.length === 0 && (
              <Text style={styles.muted}>No active missions yet. Tap Open to refresh.</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: typography.xxxl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
  card: { backgroundColor: '#FFFFFF', marginTop: spacing.md, marginHorizontal: spacing.lg, borderRadius: 14, padding: spacing.md, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bigNumber: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  muted: { color: colors.textSecondary, marginTop: 4 },
  link: { color: colors.primary, fontWeight: '700' },
  missionTitle: { fontWeight: '800', color: colors.textPrimary },
  rewardText: { fontWeight: '800', color: '#1B5E20' },
  progressTrack: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 999, overflow: 'hidden', marginTop: 6 },
  progressFill: { height: '100%', backgroundColor: colors.primary },
});

export default StatsScreen;
