import React, { useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../store/useStore';
import { colors, borderRadius, spacing, typography, shadows } from '../styles/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 280;
const CARD_HEIGHT = 160;
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
        snapToInterval={290}
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
                  <Icon name={m.icon} size={32} color={m.color} />
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
  container: { marginTop: spacing.xl },
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
  iconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  timeText: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  vistaTop: { height: 60 },
  logBtnFull: { height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  logBtnText: { color: colors.textWhite, fontWeight: '700', fontSize: 14 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.sm },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#DAD8F8', marginHorizontal: 4 },
  dotActive: { backgroundColor: colors.primary },
});


