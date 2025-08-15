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
import Icon from 'react-native-vector-icons/Ionicons';
// Removed carousel and bottom grid in favor of compact module cards
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
    { id: 'hydration', title: 'Fluid Flow', icon: 'water', color: colors.hydration, lightColor: colors.hydrationLight, route: 'FluidFlow', status: 'Well hydrated' },
    { id: 'energy', title: 'Vitality', icon: 'flash', color: colors.energy, lightColor: colors.energyLight, route: 'Vitality', status: 'High energy' },
    { id: 'gut', title: 'Gut Health', icon: 'nutrition', color: colors.gut, lightColor: colors.gutLight, route: 'Gut', status: 'Balanced' },
    { id: 'mind', title: "Mind's Radar", icon: 'eye', color: colors.mind, lightColor: colors.mindLight, route: 'MindRadar', status: 'Calm' },
    { id: 'skin', title: 'Dermal Map', icon: 'sparkles', color: colors.skin, lightColor: colors.skinLight, route: 'DermalMap', status: 'Clear' },
    { id: 'about', title: 'About', icon: 'information-circle', color: '#8B5CF6', lightColor: '#E9D5FF', route: 'About', status: '' },
  ];

  const statusText = useMemo(() => {
    if (overallScore >= 80) return 'Your pet is thriving!';
    if (overallScore >= 60) return 'Your pet is doing well';
    if (overallScore >= 40) return 'Your pet needs some care';
    return 'Your pet needs attention';
  }, [overallScore]);

  // Helpers for module stats
  const healthLogs = useStore((s) => s.healthLogs);
  const formatSince = (key) => {
    const logs = healthLogs[key] || [];
    if (!logs.length) return '—';
    const ts = logs[logs.length - 1].timestamp;
    const diffMs = Date.now() - new Date(ts).getTime();
    const hours = diffMs / 3600000;
    if (hours < 1) return 'Now';
    if (hours < 24) return `${Math.floor(hours)}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };
  const getToday = () => new Date().toDateString();
  const getHydrationToday = () => {
    const logs = (healthLogs.hydration || []).filter((l) => new Date(l.timestamp).toDateString() === getToday() && l.type === 'intake');
    const totalOz = logs.reduce((sum, l) => sum + (l.amount || 0), 0);
    const liters = Math.round((totalOz * 0.0295735) * 100) / 100;
    return `${liters}L`;
  };
  const moduleStatValue = (id) => {
    switch (id) {
      case 'hydration':
        return getHydrationToday();
      case 'energy':
        return `${pet.energy}%`;
      case 'gut': {
        const today = (healthLogs.gut || []).filter((l) => new Date(l.timestamp).toDateString() === getToday());
        return `${today.length} logs`;
      }
      case 'mind':
        return selectedMood >= 4 ? 'Good' : selectedMood === 3 ? 'OK' : 'Low';
      case 'skin':
        return '—';
      default:
        return '—';
    }
  };

  const moduleShortNames = {
    'Fluid Flow': 'Fluid',
    "Mind's Radar": 'Mind',
    'Gut Health': 'Gut',
    'Dermal Map': 'Dermal',
    'Vitality': 'Energy',
  };

  const formatTimeKey = (key) => {
    const logs = healthLogs[key] || [];
    if (!logs.length) return 'Start';
    const ts = logs[logs.length - 1].timestamp;
    const diffMs = Date.now() - new Date(ts).getTime();
    const hours = diffMs / 3600000;
    if (hours < 1) return 'Now';
    if (hours < 24) return `${Math.floor(hours)}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const handleModulePress = (m) => {
    if (m.id === 'about' || m.route === 'About') {
      navigation.navigate('Stats', { screen: 'About' });
    } else {
      navigation.navigate('Track', { screen: m.route });
    }
  };

  const { height: screenHeight } = Dimensions.get('window');
  const isSmallScreen = screenHeight < 700;
  const ringSize = isSmallScreen ? 210 : 230;
  const circleSize = isSmallScreen ? 180 : 200;
  // Keep pet proportionate to inner circle to avoid oversizing
  const petPixel = Math.round(circleSize * 0.6);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={styles.scrollContent}>
          {/* Greeting + mini mood dots */}
          <View style={[styles.greetingRow, { marginBottom: 12 }]}>
            <Text style={styles.greetingSmall}>Good {getTimeOfDay()}, {user.name || 'Friend'}!</Text>
            <View style={styles.moodDots}>
              {[1,2,3,4,5].map((m) => (
                <TouchableOpacity key={m} onPress={() => setSelectedMood(m)} style={[styles.moodDot, selectedMood === m && styles.moodDotActive]} />
              ))}
            </View>
          </View>

          {/* Pet Hero Section */}
          <View style={[styles.heroSection, { marginBottom: 16 }]}>
            <PetHero healthScore={overallScore} petType={user.petType || 'dog'} ringSize={ringSize} circleSize={circleSize} petPixel={petPixel} />
            {/* Care credits badge */}
            <TouchableOpacity
              style={styles.creditsButton}
              onPress={() => navigation.navigate('Profile', { screen: 'PetStore' })}
              activeOpacity={0.9}
            >
              <Icon name="wallet" size={16} color="#666" />
              <Text style={styles.creditsText}>{pet.careCredits || 0}</Text>
            </TouchableOpacity>

          {/* Status text */}
          <Text style={[styles.statusText, { marginTop: 12 }]}>{statusText}</Text>
          </View>

          {/* Neighborhood widget (same height as cards) */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Stats', { screen: 'Neighborhood' })}
            activeOpacity={0.9}
            style={[styles.cardBase, styles.neighborhoodCard]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.neighborhoodTitle}>Neighborhood</Text>
              <Icon name="chevron-forward" size={18} color="#6B7280" />
            </View>
            <View style={styles.neighborhoodBarTrack}>
              <View style={[styles.neighborhoodBarFill, { width: '50%' }]} />
            </View>
            <Text style={[styles.neighborhoodMeta, { fontSize: 14 }]}>Community goal progress</Text>
          </TouchableOpacity>

          {/* Module Cards Grid (2x2) */}
          <View style={[styles.moduleGrid, { marginTop: 12 }] }>
            {modules.map((m) => {
              const key = m.id === 'mind' ? 'headVision' : m.id;
              const isAbout = m.id === 'about';
              const name = moduleShortNames[m.title] || m.title;
              return (
                <View key={m.id} style={styles.moduleWrapper}>
                  <TouchableOpacity style={[styles.cardBase, styles.moduleCard, isAbout && styles.aboutCard]} onPress={() => handleModulePress(m)} activeOpacity={0.9}>
                    {/* Icon */}
                    <Icon name={m.icon} size={24} color={m.color} style={styles.moduleIcon} />
                    {/* Name */}
                    <Text style={styles.moduleName} numberOfLines={1}>{name}</Text>
                    {/* Stat */}
                    {isAbout ? (
                      <Text style={styles.aboutSubtext}>How it works</Text>
                    ) : (
                      <>
                        <Text style={styles.moduleStats} numberOfLines={1}>{moduleStatValue(m.id) || '—'}</Text>
                        <Text style={styles.lastLogged} numberOfLines={1}>{formatTimeKey(key)}</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* Removed bottom status grid; stats are now inside module cards */}

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
    paddingBottom: 32,
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
  heroSection: { alignItems: 'center', marginTop: 0, marginBottom: 12 },
  healthPercent: {
    marginTop: spacing.lg,
    fontSize: 48,
    fontWeight: typography.bold,
    color: '#5856D6',
  },
  // removed linear progress styles
  statusText: { marginTop: 8, marginBottom: 12, fontSize: 16, color: colors.textSecondary },
  // Shared translucent card base
  cardBase: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  neighborhoodCard: { marginBottom: 12, height: 105 },
  neighborhoodTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  neighborhoodBarTrack: { height: 8, backgroundColor: '#E0F2F1', borderRadius: 999, overflow: 'hidden', marginTop: 8 },
  neighborhoodBarFill: { height: '100%', backgroundColor: '#10B981' },
  neighborhoodMeta: { marginTop: 6, color: colors.textSecondary, fontWeight: '700' },
  miniRow: {
    marginTop: 24,
  },
  creditsButton: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  creditsText: { marginLeft: 6, fontSize: 16, fontWeight: '700', color: '#1F2937' },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 0 },
  moduleWrapper: { width: '31%', marginBottom: 12 },
  moduleCard: {
    height: 105,
    width: '100%',
    overflow: 'hidden',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleIcon: { fontSize: 24, marginBottom: 4, textAlign: 'center' },
  moduleName: { fontSize: 13, fontWeight: '600', color: '#1F2937', textAlign: 'center', marginBottom: 2 },
  moduleStats: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 2 },
  lastLogged: { fontSize: 11, color: '#6B7280', textAlign: 'center' },
  aboutCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderStyle: 'dashed',
  },
  aboutSubtext: { fontSize: 11, color: '#6B7280', textAlign: 'center', marginTop: 8 },
});

export default HomeScreen;