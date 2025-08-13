import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store/useStore';

const { width } = Dimensions.get('window');

const Vista = ({ tabName, healthScore }) => {
  const vistaState = useStore((state) => state.vistaStates[tabName]);
  const pet = useStore((state) => state.pet);
  
  const animationValue = useRef(new Animated.Value(0)).current;
  const petPosition = useRef(new Animated.ValueXY({ x: width / 2 - 25, y: 50 })).current;

  useEffect(() => {
    // Gentle animation loop
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
  const renderPet = () => {
    const petScale = animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.05],
    });

    const score = Math.max(0, Math.min(100, typeof healthScore === 'number' ? healthScore : pet.health));
    const bodyColor = score >= 70 ? '#4ade80' : score >= 40 ? '#fbbf24' : '#f87171';
    const petOpacity = score / 100;

    return (
      <Animated.View
        style={[
          styles.petContainer,
          {
            transform: [
              { translateX: petPosition.x },
              { translateY: petPosition.y },
              { scale: petScale },
            ],
            opacity: petOpacity,
          },
        ]}
      >
        <View style={styles.pet}>
          {/* Simple pet representation - will be replaced with actual graphics */}
          <View style={[styles.petBody, { backgroundColor: bodyColor }]} />
          <View style={styles.petEyes}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
        </View>
      </Animated.View>
    );
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getVistaColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Environment elements based on tab */}
        {tabName === 'fluidFlow' && (
          <View style={styles.environmentElements}>
            {/* Water/Garden elements */}
            <View style={[styles.plant, { left: 20 }]} />
            <View style={[styles.plant, { right: 20 }]} />
          </View>
        )}
        
        {tabName === 'gut' && (
          <View style={styles.environmentElements}>
            {/* Garden/Soil elements */}
            <View style={styles.soil} />
          </View>
        )}

        {/* Pet */}
        {renderPet()}
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
  petContainer: {
    position: 'absolute',
  },
  pet: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petBody: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
  },
  petEyes: {
    flexDirection: 'row',
    position: 'absolute',
    top: 12,
  },
  eye: {
    width: 6,
    height: 6,
    backgroundColor: '#000',
    borderRadius: 3,
    marginHorizontal: 3,
  },
});

export default Vista;