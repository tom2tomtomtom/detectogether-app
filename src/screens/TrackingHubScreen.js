import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';

const TrackingHubScreen = () => {
  const navigation = useNavigation();

  const modules = [
    {
      id: 'hydration',
      title: 'Fluid Flow & Balance',
      subtitle: 'Track your hydration',
      icon: 'water',
      color: colors.hydration,
      lightColor: colors.hydrationLight,
      route: 'FluidFlow',
      lastLog: '2 hours ago',
    },
    {
      id: 'energy',
      title: 'Vitality Compass',
      subtitle: 'Energy & caffeine',
      icon: 'flash',
      color: colors.energy,
      lightColor: colors.energyLight,
      route: 'Vitality',
      lastLog: 'This morning',
    },
    {
      id: 'gut',
      title: 'Gut Intelligence',
      subtitle: 'Digestive health',
      icon: 'nutrition',
      color: colors.gut,
      lightColor: colors.gutLight,
      route: 'Gut',
      lastLog: 'Yesterday',
    },
    {
      id: 'mind',
      title: "Mind's Radar",
      subtitle: 'Mood & stress',
      icon: 'eye',
      color: colors.mind,
      lightColor: colors.mindLight,
      route: 'MindRadar',
      lastLog: '3 days ago',
    },
    {
      id: 'skin',
      title: 'Dermal Map',
      subtitle: 'Skin observations',
      icon: 'body',
      color: colors.skin,
      lightColor: colors.skinLight,
      route: 'DermalMap',
      lastLog: 'Not logged yet',
    },
  ];

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Health Tracking</Text>
          <Text style={styles.subtitle}>Tap any module to log your data</Text>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {modules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleCard}
              onPress={() => navigation.navigate('Track', { screen: module.route })}
              activeOpacity={0.9}
            >
              <View style={[styles.iconContainer, { backgroundColor: module.lightColor }]}>
                <Icon name={module.icon} size={28} color={module.color} />
              </View>
              <View style={styles.moduleContent}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
                <Text style={styles.lastLog}>Last log: {module.lastLog}</Text>
              </View>
              <Icon name="chevron-forward" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.xxxl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  moduleCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  moduleSubtitle: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  lastLog: {
    fontSize: typography.xs,
    color: colors.textLight,
  },
});

export default TrackingHubScreen;
