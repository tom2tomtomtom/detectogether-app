import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import AchievementBadge from '../components/AchievementBadge';
import { ACHIEVEMENTS, ALL_ACHIEVEMENTS, MODULE_KEYS } from '../utils/achievements';
import { useStore } from '../store/useStore';
import Icon from 'react-native-vector-icons/Ionicons';

const AchievementsScreen = () => {
  const achievementsState = useStore((s) => s.achievements);

  const totalPoints = (achievementsState?.unlockedIds || []).reduce((sum, id) => {
    const a = ALL_ACHIEVEMENTS.find((x) => x.id === id);
    return sum + (a?.points || 0);
  }, 0);

  const renderGroup = (title, items) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.grid}>
        {items.map((a) => {
          const unlocked = achievementsState?.unlockedIds?.includes(a.id);
          const progress = achievementsState?.progress?.[a.id] || 0;
          return (
            <View key={a.id} style={styles.gridItem}>
              <AchievementBadge title={a.title} unlocked={unlocked} progress={progress} size="large" />
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Icon name="trophy" size={24} color="#F59E0B" />
          <Text style={styles.headerTitle}>Achievements</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.points}>{totalPoints} pts</Text>
        </View>

        {renderGroup('Streaks', ACHIEVEMENTS.streaks)}
        {renderGroup('Mastery', ACHIEVEMENTS.mastery)}
        {renderGroup('Balance', ACHIEVEMENTS.balance)}
        {renderGroup('Special', ACHIEVEMENTS.special)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  headerTitle: { marginLeft: 8, fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  points: { fontSize: 14, color: '#6B7280' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '33.33%', alignItems: 'center', marginBottom: 12 },
});

export default AchievementsScreen;
