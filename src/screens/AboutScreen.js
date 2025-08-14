import React from 'react';
import { View, ScrollView, Text, StyleSheet, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { colors, typography, spacing } from '../styles/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStore } from '../store/useStore';

export default function AboutScreen({ navigation }) {
  const streakDays = useStore((s) => s.achievements?.streakDays || 0);
  const credits = useStore((s) => s.pet?.careCredits || 0);
  const totalCredits = useStore((s) => s.pet?.totalCreditsEarned || 0);
  const sections = [
    {
      title: '🏠 Welcome to DetecTogether',
      content: 'Your pocket health companion that makes tracking fun! Log daily health habits to keep your virtual pet happy and healthy.'
    },
    {
      title: '🐾 How Your Pet Works',
      content: 'Every health log you make feeds your pet. The more consistent you are, the happier your pet becomes! Watch them grow from 0% to 100%.'
    },
    {
      title: '💰 Earning Care Credits',
      content: 'Each log earns you credits:\n• Hydration: 10 credits\n• Energy: 10 credits\n• Gut check: 15 credits\n• Mind check: 10 credits\n• Skin scan: 25 credits'
    },
    {
      title: '⏳ Health Decay (Tamagotchi-style)',
      content: 'Your pet thrives on daily care. After a 6‑hour grace period, health decays about 2% per hour (up to −50%). Log any module to restore momentum.'
    },
    {
      title: '🏪 Pet Store',
      content: 'Spend your credits on accessories, colors, and special effects for your pet. Tap the credit count on the home screen to visit!'
    },
    {
      title: '🏘️ Neighborhood',
      content: 'See how your community is doing! Work together to reach weekly goals and unlock special rewards.'
    },
    {
      title: '🔔 Smart Reminders',
      content: 'Get gentle nudges throughout the day. Customize notification settings in your Profile.'
    },
    {
      title: '🔒 Your Privacy',
      content: 'All data stays on your device. Photos are auto-deleted. We never share your information.'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About DetecTogether</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick actions */}
        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('Profile', { screen: 'PetStore' })}>
            <Icon name="pricetags" size={20} color={colors.primary} />
            <Text style={styles.quickText}>Pet Store</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('Stats', { screen: 'Neighborhood' })}>
            <Icon name="people" size={20} color={colors.primary} />
            <Text style={styles.quickText}>Neighborhood</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('Profile', { screen: 'NotificationSettings' })}>
            <Icon name="notifications" size={20} color={colors.primary} />
            <Text style={styles.quickText}>Notifications</Text>
          </TouchableOpacity>
        </View>

        {/* Live stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{streakDays}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{credits}</Text>
            <Text style={styles.statLabel}>Credits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalCredits}</Text>
            <Text style={styles.statLabel}>All‑time</Text>
          </View>
        </View>
        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.feedbackButton} onPress={() => Linking.openURL('mailto:hello@detectogether.app?subject=Feedback') }>
          <Icon name="mail" size={20} color={colors.primary} />
          <Text style={styles.feedbackText}>Send Feedback</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  quickCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    paddingVertical: spacing.md,
  },
  quickText: { color: colors.primary, marginTop: 6, fontWeight: '600' },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: typography.lg, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: typography.sm, color: colors.textSecondary },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sectionContent: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  feedbackText: {
    fontSize: typography.md,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  version: {
    textAlign: 'center',
    color: colors.textTertiary,
    fontSize: typography.xs,
    marginBottom: spacing.xl,
  },
});


