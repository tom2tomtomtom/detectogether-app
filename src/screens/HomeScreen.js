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
import TutorialOverlay from '../components/TutorialOverlay';
import Icon from 'react-native-vector-icons/Ionicons';
// Removed carousel and bottom grid in favor of compact module cards
import { useStore } from '../store/useStore';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const user = useStore((state) => state.user);
  const tutorialCompleted = useStore((s) => s.user?.tutorialCompleted);
  const pet = useStore((state) => state.pet);
  const [selectedMood, setSelectedMood] = useState(3);
  const overallScore = Math.round((pet.health + pet.energy + pet.happiness) / 3);
  
  // Debug: Log UI state
  console.log('🖥️ UI pet stats:', { health: pet.health, energy: pet.energy, happiness: pet.happiness, overallScore });
  console.log('🎯 PetHero receiving healthScore:', overallScore);
  const progressWidth = 260; // visual width for styles only
  const [creditBurst, setCreditBurst] = useState(null);

  // Real-time pet health updates for demo
  useEffect(() => {
    console.log('🕐 Setting up 1-minute health decay interval');

    // Update pet health every minute for demo
    const interval = setInterval(() => {
      console.log('⏰ 1-minute interval triggered - updating pet health');
      const updatePetHealthOnFocus = useStore.getState().updatePetHealthOnFocus;
      updatePetHealthOnFocus();
    }, 60000); // 60 seconds

    return () => {
      console.log('🛑 Clearing health decay interval');
      clearInterval(interval);
    };
  }, []);


  
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const modules = [
    { id: 'hydration', title: 'Fluid Flow', icon: 'water', color: colors.hydration, lightColor: colors.hydrationLight, route: 'FluidFlow' },
    { id: 'energy', title: 'Vitality', icon: 'flash', color: colors.energy, lightColor: colors.energyLight, route: 'Vitality' },
    { id: 'gut', title: 'Gut Intelligence', icon: 'nutrition', emoji: '💩', color: colors.gut, lightColor: colors.gutLight, route: 'Gut' },
    { id: 'mind', title: "Mind's Radar", icon: 'eye', emoji: '🧠', color: colors.mind, lightColor: colors.mindLight, route: 'MindRadar' },
    { id: 'skin', title: 'Dermal Map', icon: 'sparkles', emoji: '🖐️', color: colors.skin, lightColor: colors.skinLight, route: 'DermalMap' },
    { id: 'about', title: 'About', icon: 'information-circle', color: '#8B5CF6', lightColor: '#E9D5FF', route: 'About' },
  ];

  const statusText = useMemo(() => {
    if (overallScore >= 80) return 'Your pet is thriving!';
    if (overallScore >= 60) return 'Your pet is doing well';
    if (overallScore >= 40) return 'Your pet needs some care';
    return 'Your pet needs attention';
  }, [overallScore]);

  // Helpers for module stats
  const healthLogs = useStore((s) => s.healthLogs);
  const streakDays = useStore((s) => s.achievements?.streakDays || 0);

  const friendlyTime = (isoTs) => {
    if (!isoTs) return 'No recent activity';
    const d = new Date(isoTs);
    const now = Date.now();
    const diff = now - d.getTime();
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return 'Just now';
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return '1d ago';
    return `${days}d ago`;
  };

  const latestByTimestamp = (arr = []) => {
    if (!arr.length) return null;
    // Logs are appended, but sort defensively by timestamp
    return arr.reduce((latest, item) =>
      !latest || new Date(item.timestamp) > new Date(latest.timestamp) ? item : latest,
    null);
  };

  // No totals on card; show latest event (intake amount OR urine color)

  const isSevereHydration = (log) => {
    if (!log) return false;
    if (typeof log.value === 'number' && log.value >= 8) return true; // highest severity in mock scale
    const txt = `${log.label || ''} ${log.interpretation || ''}`.toLowerCase();
    return /(medical|doctor|seek|attention|consult)/.test(txt);
  };

  const oneWordUrineColor = (text = '') => {
    const t = text.toLowerCase();
    if (t.includes('yellow')) return 'yellow';
    if (t.includes('dark')) return 'dark';
    if (t.includes('red') || t.includes('pink')) return 'red';
    if (t.includes('foamy')) return 'foamy';
    if (t.includes('cloudy')) return 'cloudy';
    if (t.includes('clear')) return 'clear';
    if (t.includes('golden')) return 'golden';
    if (t.includes('light')) return 'light';
    if (t.includes('unsure') || t.includes("didn't notice")) return 'unsure';
    // fallbacks for hydration levels
    if (t.includes('severe')) return 'dark';
    if (t.includes('moderate')) return 'dark';
    if (t.includes('mild')) return 'dark';
    if (t.includes('good') || t.includes('excellent') || t.includes('adequate')) return 'yellow';
    return 'color';
  };

  const displayForHydration = (log) => {
    if (!log) return null;
    if (log.type === 'intake') return `+${log.amount || 0} oz`;
    if (log.type === 'color' || log.type === 'color_photo') {
      if (isSevereHydration(log)) return 'Warning!';
      const token = oneWordUrineColor(`${log.label || ''} ${log.interpretation || ''}`);
      return token;
    }
    return 'Hydration update';
  };

  const urineDotColor = (log) => {
    if (!log) return null;
    return log.colorHex || null;
  };
  const displayForEnergy = (log) => {
    if (!log) return null;
    if (log.type === 'status') return log.label || 'Energy check';
    if (log.type === 'brew') {
      const brewMap = { usual: 'usual', more: 'more', none: 'none' };
      const brewText = brewMap[log.brew] || 'brew';
      return `Brew ${brewText}`;
    }
    return 'Energy update';
  };
  const displayForGut = (log) => {
    if (!log) return null;
    if (log.type === 'status') return log.label || 'Gut check';
    if (log.type === 'meal') {
      const timingMap = { before: 'Before', after: 'After', snack: 'Snack' };
      return `Meal: ${timingMap[log.timing] || 'Log'}`;
    }
    if (log.type === 'stool_photo') {
      const txt = `${log.label || ''} ${log.interpretation || ''}`.toLowerCase();
      const warn = /medical|doctor|seek|attention|consult|concern/i.test(txt) || (typeof log.bristolType === 'number' && (log.bristolType === 1 || log.bristolType === 7));
      return warn ? 'Warning!' : (log.label || 'Photo analysis');
    }
    return 'Gut update';
  };
  const displayForMind = (log) => {
    if (!log) return null;
    if (log.type === 'status') return log.label || 'Mood check';
    if (log.type === 'checkin') {
      return 'Check-in';
    }
    return 'Mind update';
  };
  const displayForSkin = (log) => {
    if (!log) return null;
    if (log.type === 'status') return log.label || 'Skin check';
    if (log.type === 'observation') {
      return 'Observation';
    }
    if (log.type === 'skin_photo') {
      const warn = (typeof log.score === 'number' && log.score <= 2) || /medical|doctor|seek|attention|consult|concern/i.test(`${log.label || ''} ${log.interpretation || ''}`.toLowerCase());
      return warn ? 'Warning!' : (log.label || 'Photo analysis');
    }
    return 'Skin update';
  };

  const getModuleSummary = (id) => {
    const key = id === 'mind' ? 'headVision' : id;
    const logs = healthLogs[key] || [];
    const latest = latestByTimestamp(logs);
    if (!latest) return { main: 'Get started', sub: 'No recent activity' };
    let main = 'Update';
    if (key === 'hydration') {
      if (latest.type === 'intake') {
        main = `${Math.max(0, Math.round(latest.amount || 0))} oz`;
      } else if (latest.type === 'color' || latest.type === 'color_photo') {
        main = isSevereHydration(latest) ? 'Warning!' : oneWordUrineColor(`${latest.label || ''} ${latest.interpretation || ''}`);
      } else {
        main = 'Update';
      }
    }
    else if (key === 'energy') main = displayForEnergy(latest) || main;
    else if (key === 'gut') main = displayForGut(latest) || main;
    else if (key === 'headVision') main = displayForMind(latest) || main;
    else if (key === 'skin') main = displayForSkin(latest) || main;
    const sub = `${friendlyTime(latest.timestamp)}${streakDays ? ` • Streak ${streakDays}d` : ''}`;
    return { main, sub };
  };

  const moduleShortNames = {
    'Fluid Flow': 'Fluid',
    "Mind's Radar": 'Mind',
    'Gut Intelligence': 'Gut',
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
            <Text style={styles.greetingSmall}>Good {getTimeOfDay()}, {user.name || 'Dom'}!</Text>
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
              const summary = !isAbout ? getModuleSummary(m.id) : null;
              const isFluid = m.id === 'hydration';
              const name = moduleShortNames[m.title] || m.title;
              return (
                <View key={m.id} style={styles.moduleWrapper}>
                  <TouchableOpacity style={[styles.cardBase, styles.moduleCard, isAbout && styles.aboutCard]} onPress={() => handleModulePress(m)} activeOpacity={0.9}>
                    {/* Icon or Emoji */}
                    {m.emoji ? (
                      <Text style={styles.moduleEmoji}>{m.emoji}</Text>
                    ) : (
                      <Icon name={m.icon} size={24} color={m.color} style={styles.moduleIcon} />
                    )}
                    {/* Name */}
                    <Text style={styles.moduleName} numberOfLines={1}>{name}</Text>
                    {/* Stat */}
                    {isAbout ? (
                      <Text style={styles.aboutSubtext}>How it works</Text>
                    ) : (
                      <>
                        <Text style={styles.moduleStats} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>{summary.main}</Text>
                        <Text style={styles.lastLogged} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>{summary.sub}</Text>
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
        {/* Tutorial overlay on first launch */}
        {!tutorialCompleted && (
          <TutorialOverlay 
            visible={true} 
            onClose={() => {
              // Tutorial completion is handled by the overlay
            }} 
          />
        )}
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
  moduleEmoji: { fontSize: 22, marginBottom: 4, textAlign: 'center' },
  moduleName: { fontSize: 13, fontWeight: '600', color: '#1F2937', textAlign: 'center', marginBottom: 2 },
  moduleStats: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 2 },
  lastLogged: { fontSize: 11, color: '#6B7280', textAlign: 'center' },
  subRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  dotSmall: { width: 8, height: 8, borderRadius: 4, marginLeft: 6, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  aboutCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderStyle: 'dashed',
  },
  aboutSubtext: { fontSize: 11, color: '#6B7280', textAlign: 'center', marginTop: 8 },
});

export default HomeScreen;