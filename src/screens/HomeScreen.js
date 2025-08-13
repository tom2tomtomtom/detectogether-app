import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/Ionicons';
import MoodSelector from '../components/MoodSelector';
import PetCharacter from '../components/PetCharacter';
import { useStore } from '../store/useStore';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const user = useStore((state) => state.user);
  const pet = useStore((state) => state.pet);
  const [selectedMood, setSelectedMood] = useState(3);

  const overallScore = Math.round((pet.health + pet.energy + pet.happiness) / 3);
  
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const modules = [
    {
      id: 'hydration',
      title: 'Fluid Flow',
      icon: 'water',
      color: colors.hydration,
      lightColor: colors.hydrationLight,
      route: 'FluidFlow',
      status: 'Well hydrated',
    },
    {
      id: 'energy',
      title: 'Vitality',
      icon: 'flash',
      color: colors.energy,
      lightColor: colors.energyLight,
      route: 'Vitality',
      status: 'High energy',
    },
    {
      id: 'gut',
      title: 'Gut Health',
      icon: 'nutrition',
      color: colors.gut,
      lightColor: colors.gutLight,
      route: 'Gut',
      status: 'Balanced',
    },
    {
      id: 'mind',
      title: "Mind's Radar",
      icon: 'eye',
      color: colors.mind,
      lightColor: colors.mindLight,
      route: 'MindRadar',
      status: 'Calm',
    },
    {
      id: 'skin',
      title: 'Dermal Map',
      icon: 'sparkles',
      color: colors.skin,
      lightColor: colors.skinLight,
      route: 'DermalMap',
      status: 'Clear',
    },
  ];

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Greeting Card */}
          <View style={[styles.card, styles.greetingCard]}>
            <Text style={styles.greeting}>
              Good {getTimeOfDay()}, {user.name || 'Friend'}!
            </Text>
            <Text style={styles.question}>How are you feeling today?</Text>
            <MoodSelector
              selectedMood={selectedMood}
              onMoodSelect={setSelectedMood}
            />
          </View>

          {/* Hero Progress Card */}
          <View style={[styles.card, styles.heroCard]}>
            <AnimatedCircularProgress
              size={200}
              width={15}
              fill={overallScore}
              tintColor={colors.primary}
              backgroundColor={colors.border}
              lineCap="round"
              rotation={0}
            >
              {() => (
                <View style={styles.progressContent}>
                  <Text style={styles.progressNumber}>{overallScore}%</Text>
                  <View style={styles.petContainer}>
                    <PetCharacter 
                      petType={user.petType || 'cat'} 
                      healthScore={overallScore}
                      size={60}
                      isAnimating={true}
                    />
                  </View>
                </View>
              )}
            </AnimatedCircularProgress>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: colors.hydrationLight }]}>
                  <Text>💧</Text>
                </View>
                <Text style={styles.statValue}>{Math.round(overallScore * 0.025 * 100) / 100}L</Text>
                <Text style={styles.statLabel}>Hydration</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: colors.energyLight }]}>
                  <Text>⚡</Text>
                </View>
                <Text style={styles.statValue}>{pet.energy}%</Text>
                <Text style={styles.statLabel}>Energy</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: colors.mindLight }]}>
                  <Text>🧠</Text>
                </View>
                <Text style={styles.statValue}>{selectedMood >= 4 ? 'Great' : selectedMood === 3 ? 'Good' : 'Okay'}</Text>
                <Text style={styles.statLabel}>Mood</Text>
              </View>
            </View>
          </View>

          {/* Track Your Health Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Track Your Health</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.modulesScroll}
          >
            {modules.map((module) => (
              <TouchableOpacity
                key={module.id}
                style={[styles.card, styles.moduleCard]}
                onPress={() => navigation.navigate('Track', { screen: module.route })}
              >
                <View style={[styles.moduleIcon, { backgroundColor: module.lightColor }]}>
                  <Icon name={module.icon} size={24} color={module.color} />
                </View>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleStatus}>{module.status}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Insights Card */}
          <LinearGradient
            colors={[colors.primary, colors.mind]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, styles.insightsCard]}
          >
            <Text style={styles.insightsEmoji}>✨</Text>
            <Text style={styles.insightsTitle}>Today's Insight</Text>
            <Text style={styles.insightsText}>
              Your hydration levels have been consistently good this week! 
              Keep up the great work. {user.petName || 'Your buddy'} is extra happy today! 🎉
            </Text>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  greetingCard: {
    marginTop: spacing.md,
  },
  greeting: {
    fontSize: typography.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  question: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  progressContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressNumber: {
    fontSize: typography.huge,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    lineHeight: typography.huge,
    marginBottom: -10,
  },
  petContainer: {
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: typography.sm,
    color: colors.primary,
  },
  modulesScroll: {
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  moduleCard: {
    width: 140,
    marginRight: spacing.md,
    marginBottom: spacing.sm,
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  moduleTitle: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  moduleStatus: {
    fontSize: typography.xs,
    color: colors.textSecondary,
  },
  insightsCard: {
    position: 'relative',
    overflow: 'hidden',
  },
  insightsEmoji: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.lg,
    fontSize: 40,
    opacity: 0.3,
  },
  insightsTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textWhite,
    marginBottom: spacing.sm,
  },
  insightsText: {
    fontSize: typography.sm,
    color: colors.textWhite,
    opacity: 0.9,
    lineHeight: 20,
  },
});

export default HomeScreen;