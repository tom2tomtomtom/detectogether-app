import React, { useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../store/useStore';
import { colors, borderRadius, spacing, typography, shadows } from '../styles/theme';

const { width, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenHeight < 700;
const CARD_HEIGHT = isSmallScreen ? 120 : 140;
const CARD_WIDTH = Math.round((width - 32 - 20) / 2.2);
const GAP = 10;

const moduleIdToStoreKey = {
  hydration: 'hydration',
  energy: 'energy',
  gut: 'gut',
  mind: 'headVision',
  skin: 'skin',
};

export default function ModuleCarousel({ modules }) {
  const navigation = useNavigation();
  const healthLogs = useStore((s) => s.healthLogs);
  const updateVistaState = useStore((s) => s.updateVistaState);
  const [page, setPage] = useState(0);
  const scrollRef = useRef(null);

  const data = useMemo(() => modules.map((m) => {
    const key = moduleIdToStoreKey[m.id] || m.id;
    const logs = healthLogs[key] || [];
    const last = logs.length ? logs[logs.length - 1] : null;
    const when = (() => {
      if (!last) return 'No logs yet';
      const diffMs = Date.now() - new Date(last.timestamp).getTime();
      const hrs = Math.max(1, Math.floor(diffMs / 3600000));
      return `Last logged: ${hrs}h ago`;
    })();
    return { ...m, lastText: last?.status || last?.value || m.status || '—', when };
  }), [modules, healthLogs]);

  const onPressLog = (m) => {
    const key = moduleIdToStoreKey[m.id] || m.id;
    try { updateVistaState(key); } catch (e) {}
    navigation.navigate('Track', { screen: m.route });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + GAP}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: spacing.lg }}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          const p = Math.round(x / (CARD_WIDTH + GAP));
          setPage(p);
        }}
        scrollEventThrottle={16}
      >
        {data.map((m) => (
          <View key={m.id} style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT, marginRight: GAP }]}> 
            {/* Subtle full-card gradient overlay */}
            <LinearGradient colors={[m.lightColor, '#ffffff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardGradient} />

            {/* Content */}
            <View style={styles.cardInner}>
               <View style={styles.rowCenter}>
                <View style={[styles.iconWrap, { backgroundColor: m.lightColor }]}> 
                  <Icon name={m.icon} size={24} color={m.color} />
                </View>
                <Text style={styles.cardTitle}>{m.title}</Text>
              </View>
              <Text style={styles.timeText}>{m.when}</Text>
              <View style={{ flex: 1 }} />
              {/* Bottom full-width CTA */}
              <TouchableOpacity onPress={() => onPressLog(m)} style={styles.logBtnFull} activeOpacity={0.9}>
                <Text style={styles.logBtnText}>Log Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Page indicators */}
      <View style={styles.dots}>
        {data.map((_, i) => (
          <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
    borderRadius: 20,
  },
  cardInner: { flex: 1, padding: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  timeText: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  vistaTop: { height: 50 },
  logBtnFull: { height: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  logBtnText: { color: colors.textWhite, fontWeight: '700', fontSize: 13 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#DAD8F8', marginHorizontal: 4 },
  dotActive: { backgroundColor: colors.primary },
});


