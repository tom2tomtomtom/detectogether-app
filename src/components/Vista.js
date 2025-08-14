import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store/useStore';
import PetCharacter from './PetCharacter';
import Svg, { Defs, LinearGradient as SvgGrad, Stop, Circle, G, Path, Rect, Ellipse } from 'react-native-svg';

const { width } = Dimensions.get('window');

const Vista = ({ tabName, healthScore, moduleType = 'home' }) => {
  const vistaState = useStore((state) => state.vistaStates[tabName]);
  const pet = useStore((state) => state.pet);
  const user = useStore((state) => state.user);
  
  const animationValue = useRef(new Animated.Value(0)).current;
  const petPosition = useRef(new Animated.ValueXY({ x: width / 2 - 25, y: 50 })).current;

  useEffect(() => {
    // Gentle animation loop (kept for potential environment effects)
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  const getVistaColors = () => {
    switch (tabName) {
      case 'home':
        return vistaState.colors || ['#e0f2fe', '#bae6fd'];
      case 'fluidFlow':
        const hydrationColors = [
          ['#fef3c7', '#fde68a'], // Very dehydrated
          ['#e0f2fe', '#bae6fd'], // Hydrated
          ['#a7f3d0', '#6ee7b7'], // Well hydrated
        ];
        return hydrationColors[Math.max(0, 3 - vistaState.hydrationLevel)] || hydrationColors[1];
      case 'vitality':
        const energyColors = {
          drained: ['#e5e7eb', '#9ca3af'],
          neutral: ['#fef3c7', '#fde68a'],
          charged: ['#fbbf24', '#f59e0b'],
        };
        return energyColors[vistaState.energyLevel] || energyColors.neutral;
      case 'gut':
        const gutColors = {
          troubled: ['#fecaca', '#f87171'],
          wilting: ['#fde68a', '#fbbf24'],
          sprouting: ['#d9f99d', '#bef264'],
          blooming: ['#86efac', '#4ade80'],
        };
        return gutColors[vistaState.gardenGrowth] || gutColors.sprouting;
      case 'mindRadar':
        const skyColors = {
          stormy: ['#4c1d95', '#581c87'],
          cloudy: ['#e0e7ff', '#c7d2fe'],
          clear: ['#93c5fd', '#3b82f6'],
        };
        return skyColors[vistaState.atmosphere] || skyColors.cloudy;
      case 'dermalMap':
        const skinColors = {
          desert: ['#fecaca', '#f87171'],
          balanced: ['#fde68a', '#bef264'],
          sunshine: ['#fde68a', '#facc15'],
        };
        return skinColors[vistaState.seasonalState] || ['#fce7f3', '#fbcfe8'];
      default:
        return ['#f3f4f6', '#e5e7eb'];
    }
  };

  const overallScore = typeof healthScore === 'number' ? healthScore : pet.health;
  const petType = user.petType || 'dog';

  const renderModuleVista = () => {
    const score = typeof healthScore === 'number' ? healthScore : pet.health;
    switch (moduleType) {
      case 'fluid': {
        const intensity = Math.max(0.3, Math.min(1, score / 100));
        return (
          <Svg width="100%" height="100%" viewBox="0 0 320 150" preserveAspectRatio="none">
            <Defs>
              <SvgGrad id="fluidBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#E8F5F3" />
                <Stop offset="100%" stopColor="#D4EDEA" />
              </SvgGrad>
            </Defs>
            <Rect x="0" y="0" width="320" height="150" fill="url(#fluidBg)" />
            {/* drops */}
            {[40, 120, 200, 260].map((x, i) => (
              <Circle key={i} cx={x} cy={30 + (i % 2) * 10} r={4 + (i % 3)} fill="#72D1C6" opacity={0.6} />
            ))}
            {/* waves */}
            <Path d="M0 120 Q 40 110 80 120 T 160 120 T 240 120 T 320 120 L 320 150 L 0 150 Z" fill="#BFE8E1" opacity={0.6 * intensity} />
            {/* plants */}
            <G opacity={0.8 * intensity}>
              <Path d="M30 120 q10 -30 20 0" stroke="#6CC7B9" strokeWidth="6" strokeLinecap="round" />
              <Path d="M290 120 q-10 -30 -20 0" stroke="#6CC7B9" strokeWidth="6" strokeLinecap="round" />
            </G>
          </Svg>
        );
      }
      case 'vitality': {
        return (
          <Svg width="100%" height="100%" viewBox="0 0 320 150" preserveAspectRatio="none">
            <Defs>
              <SvgGrad id="vitBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFF5E6" />
                <Stop offset="100%" stopColor="#FFE4CC" />
              </SvgGrad>
            </Defs>
            <Rect x="0" y="0" width="320" height="150" fill="url(#vitBg)" />
            <Circle cx="60" cy="40" r="18" fill="#FFD27A" opacity={0.9} />
            {[...Array(8)].map((_, i) => (
              <Rect key={i} x={58} y={8} width={4} height={10} transform={`rotate(${i * 45} 60 40)`} fill="#FFC14D" />
            ))}
            {[...Array(6)].map((_, i) => (
              <Circle key={i} cx={140 + i * 24} cy={90 - (i % 2) * 10} r={2} fill="#FFB74D" opacity={0.7} />
            ))}
          </Svg>
        );
      }
      case 'gut': {
        const healthy = vistaState?.gardenGrowth === 'blooming' || vistaState?.gardenGrowth === 'sprouting';
        return (
          <Svg width="100%" height="100%" viewBox="0 0 320 150" preserveAspectRatio="none">
            <Defs>
              <SvgGrad id="gutBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#F5F0E8" />
                <Stop offset="100%" stopColor="#E8DFD3" />
              </SvgGrad>
            </Defs>
            <Rect x="0" y="0" width="320" height="150" fill="url(#gutBg)" />
            <Rect x="0" y="120" width="320" height="30" fill="#C8B7A6" opacity={0.45} />
            <Path d="M60 120 q10 -30 20 0" stroke="#7AC275" strokeWidth="6" strokeLinecap="round" opacity={healthy ? 1 : 0.5} />
            <Path d="M260 120 q-10 -30 -20 0" stroke="#7AC275" strokeWidth="6" strokeLinecap="round" opacity={healthy ? 1 : 0.5} />
          </Svg>
        );
      }
      case 'mind': {
        return (
          <Svg width="100%" height="100%" viewBox="0 0 320 150" preserveAspectRatio="none">
            <Defs>
              <SvgGrad id="mindBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#F0E8FF" />
                <Stop offset="100%" stopColor="#E8E0FF" />
              </SvgGrad>
            </Defs>
            <Rect x="0" y="0" width="320" height="150" fill="url(#mindBg)" />
            <Ellipse cx="90" cy="60" rx="30" ry="12" fill="#FFFFFF" opacity={0.7} />
            <Ellipse cx="180" cy="50" rx="36" ry="14" fill="#FFFFFF" opacity={0.65} />
            <Ellipse cx="250" cy="70" rx="28" ry="11" fill="#FFFFFF" opacity={0.7} />
          </Svg>
        );
      }
      case 'skin': {
        return (
          <Svg width="100%" height="100%" viewBox="0 0 320 150" preserveAspectRatio="none">
            <Defs>
              <SvgGrad id="skinBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFF0F5" />
                <Stop offset="100%" stopColor="#FFE8EE" />
              </SvgGrad>
            </Defs>
            <Rect x="0" y="0" width="320" height="150" fill="url(#skinBg)" />
            <Rect x="110" y="30" width="100" height="70" rx="12" fill="#FFFFFF" opacity={0.8} />
            <Rect x="118" y="36" width="84" height="3" rx="1.5" fill="#FFFFFF" opacity={0.7} />
            <Rect x="118" y="88" width="84" height="6" rx="3" fill="#FFFFFF" opacity={0.4} />
            <Path d="M40 110 q12 -10 24 0" stroke="#A7D49B" strokeWidth="6" strokeLinecap="round" />
          </Svg>
        );
      }
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getVistaColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {renderModuleVista()}

        {/* Pet */}
        <View style={styles.petWrapper}>
          <PetCharacter petType={petType} healthScore={overallScore} isAnimating={true} />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: '100%',
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  environmentElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  plant: {
    position: 'absolute',
    bottom: 0,
    width: 30,
    height: 40,
    backgroundColor: '#86efac',
    borderRadius: 15,
  },  soil: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 30,
    backgroundColor: '#92400e',
    opacity: 0.3,
  },
  petWrapper: {
    position: 'absolute',
    left: '50%',
    marginLeft: -40,
    top: 50,
  },
});

export default Vista;