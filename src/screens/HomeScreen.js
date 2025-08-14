import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PetHero from '../components/PetHero';
import ModuleCarousel from '../components/ModuleCarousel';
import StatusGrid from '../components/StatusGrid';
import { useNavigation } from '@react-navigation/native';
import CreditAnimation from '../components/CreditAnimation';
import { useStore } from '../store/useStore';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const user = useStore((state) => state.user);
  const pet = useStore((state) => state.pet);
  const [selectedMood, setSelectedMood] = useState(3);
  const overallScore = Math.round((pet.health + pet.energy + pet.happiness) / 3);
  const progressWidth = 260; // visual width for styles only
  const [creditBurst, setCreditBurst] = useState(null);
  
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

  const statusText = useMemo(() => {
    if (overallScore >= 80) return 'Your pet is thriving!';
    if (overallScore >= 60) return 'Your pet is doing well';
    if (overallScore >= 40) return 'Your pet needs some care';
    return 'Your pet needs attention';
  }, [overallScore]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Greeting + mini mood dots */}
          <View style={styles.greetingRow}>
            <Text style={styles.greetingSmall}>Good {getTimeOfDay()}, {user.name || 'Friend'}!</Text>
            <View style={styles.moodDots}>
              {[1,2,3,4,5].map((m) => (
                <TouchableOpacity key={m} onPress={() => setSelectedMood(m)} style={[styles.moodDot, selectedMood === m && styles.moodDotActive]} />
              ))}
            </View>
          </View>

          {/* Pet Hero Section */}
          <View style={styles.heroSection}>
            <PetHero healthScore={overallScore} petType={user.petType || 'dog'} size={240} petSize={200} />
            {/* Care credits badge */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Text style={{ fontSize: 16 }}>🪙</Text>
              <Text style={{ marginLeft: 6, fontSize: 16, fontWeight: '700', color: '#2E7D32' }}>{pet.careCredits || 0}</Text>
            </View>

          {/* Status text */}
          <Text style={[styles.statusText, { marginTop: 16 }]}>{statusText}</Text>
          </View>

          {/* Neighborhood widget */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Stats', { screen: 'Neighborhood' })}
            activeOpacity={0.9}
            style={styles.neighborhoodCard}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.neighborhoodTitle}>Neighborhood</Text>
              {/* For simplicity, omit active count in this version */}
            </View>
            <View style={styles.neighborhoodBarTrack}>
              <View style={[styles.neighborhoodBarFill, { width: '50%' }]} />
            </View>
            <Text style={styles.neighborhoodMeta}>Tap to visit →</Text>
          </TouchableOpacity>

          {/* Module Carousel */}
          <ModuleCarousel modules={modules} />

          {/* Bottom status grid */}
          <StatusGrid
            data={{
              hydration: `${Math.round(overallScore * 0.025 * 100) / 100}L`,
              energy: `${pet.energy}%`,
              mind: selectedMood >= 4 ? 'Good' : selectedMood === 3 ? 'OK' : 'Low',
              mood: selectedMood,
            }}
            onPress={(id) => {
              const route = id === 'hydration' ? 'FluidFlow' : id === 'energy' ? 'Vitality' : id === 'mind' ? 'MindRadar' : 'Gut';
              navigation.navigate('Track', { screen: route });
            }}
          />

          {/* (Moved deeper features to tab navigation) */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C8E6C9',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  greetingRow: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingSmall: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
  moodDots: {
    flexDirection: 'row',
    gap: 6,
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
  },
  moodDotActive: {
    backgroundColor: '#5856D6',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  healthPercent: {
    marginTop: spacing.lg,
    fontSize: 48,
    fontWeight: typography.bold,
    color: '#5856D6',
  },
  // removed linear progress styles
  statusText: {
    marginTop: spacing.sm,
    fontSize: typography.md,
    color: colors.textSecondary,
  },
  neighborhoodCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: spacing.md, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2, marginBottom: spacing.md },
  neighborhoodTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  neighborhoodBarTrack: { height: 8, backgroundColor: '#E0F2F1', borderRadius: 999, overflow: 'hidden', marginTop: 8 },
  neighborhoodBarFill: { height: '100%', backgroundColor: '#10B981' },
  neighborhoodMeta: { marginTop: 6, color: colors.textSecondary, fontWeight: '700' },
  miniRow: {
    marginTop: 24,
  },
});

export default HomeScreen;