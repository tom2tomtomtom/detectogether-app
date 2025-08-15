import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useStore } from '../store/useStore';
import PetHero from './PetHero';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius, typography } from '../styles/theme';

const { width, height } = Dimensions.get('window');

const TutorialOverlay = ({ visible = false, onClose }) => {
  const completeTutorial = useStore((s) => s.completeTutorial);
  const user = useStore((s) => s.user);
  const [step, setStep] = useState(0);

  const steps = useMemo(
    () => [
      {
        title: 'Meet Your Health Buddy',
        subtitle: 'This is your virtual companion who grows healthier as you do!',
        renderVisual: () => (
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <PetHero healthScore={90} petType={user.petType || 'dog'} ringSize={180} circleSize={150} petPixel={90} />
          </View>
        ),
      },
      {
        title: 'Track Your Fluids',
        subtitle: 'Monitor hydration and notice what your body tells you',
        highlight: 'Fluid',
        icon: 'water',
      },
      {
        title: 'Monitor Your Energy',
        subtitle: 'Log energy levels and caffeine to find your patterns',
        highlight: 'Energy',
        icon: 'flash',
      },
      {
        title: 'Check Your Gut & Mind',
        subtitle: "Track digestion, headaches, and more",
        highlight: 'Gut + Mind',
        emojis: ['💩', '🧠'],
      },
      {
        title: 'Care for Your Skin',
        subtitle: 'Seasonal skin checks made simple',
        highlight: 'Dermal',
        emoji: '🖐️',
      },
    ],
    [user.petType]
  );

  if (!visible) return null;

  const onSkip = () => {
    completeTutorial();
    onClose?.();
  };

  const onNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else {
      completeTutorial();
      onClose?.();
    }
  };

  const onPrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const progressDots = (
    <View style={styles.dotsRow}>
      {steps.map((_, i) => (
        <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
      ))}
    </View>
  );

  const s = steps[step];

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {/* Skip */}
        <TouchableOpacity style={styles.skipButton} onPress={onSkip} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Visual */}
        {s.renderVisual ? (
          s.renderVisual()
        ) : (
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            {Array.isArray(s.emojis) ? (
              <View style={{ flexDirection: 'row' }}>
                {s.emojis.map((e, i) => (
                  <Text key={i} style={styles.emojiLarge}>{e}</Text>
                ))}
              </View>
            ) : s.emoji ? (
              <Text style={styles.emojiLarge}>{s.emoji}</Text>
            ) : s.icon ? (
              <Icon name={s.icon} size={48} color="#6B7280" />
            ) : null}
          </View>
        )}

        {/* Text */}
        <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
          {s.title}
        </Text>
        <Text style={styles.subtitle}>{s.subtitle}</Text>

        {/* Footer */}
        {progressDots}

        <View style={styles.navRow}>
          <TouchableOpacity onPress={onPrev} disabled={step === 0} style={[styles.navButton, step === 0 && styles.navDisabled]}>
            <Text style={[styles.navText, step === 0 && styles.navTextDisabled]}>Previous</Text>
          </TouchableOpacity>
          {step < steps.length - 1 ? (
            <TouchableOpacity onPress={onNext} style={[styles.navButton, styles.navPrimary]}>
              <Text style={[styles.navText, styles.navTextPrimary]}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onNext} style={[styles.navButton, styles.navPrimary]}>
              <Text style={[styles.navText, styles.navTextPrimary]}>Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  skipButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
  },
  skipText: { color: '#6B7280', fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#4B5563', textAlign: 'center', marginBottom: 16 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E5E7EB', marginHorizontal: 4 },
  dotActive: { backgroundColor: '#8B5CF6' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  navButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  navDisabled: { opacity: 0.5 },
  navPrimary: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  navText: { fontWeight: '700', color: '#374151' },
  navTextDisabled: { color: '#9CA3AF' },
  navTextPrimary: { color: 'white' },
  emojiLarge: { fontSize: 44, marginHorizontal: 6 },
});

export default TutorialOverlay;


