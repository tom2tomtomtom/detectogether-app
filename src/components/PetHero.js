import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import PetCharacter from './PetCharacter';

const PetHero = ({ healthScore = 50, petType = 'cat' }) => {
  const CONTAINER_SIZE = 190;
  const RING_SIZE = 190;
  const INNER_CIRCLE_SIZE = 170;
  const PET_SIZE = 100;

  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * Math.max(0, Math.min(100, healthScore))) / 100;

  return (
    <View style={styles.container}>
      <Svg width={RING_SIZE} height={RING_SIZE} style={styles.progressRing}>
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#5856D6" />
            <Stop offset="100%" stopColor="#8B5CF6" />
          </LinearGradient>
        </Defs>
        <Circle cx="95" cy="95" r={radius} stroke="rgba(88,86,214,0.1)" strokeWidth="10" fill="none" />
        <Circle cx="95" cy="95" r={radius} stroke="url(#grad)" strokeWidth="10" fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" transform="rotate(-90 95 95)" />
      </Svg>

      <View style={[styles.innerCircle, { width: INNER_CIRCLE_SIZE, height: INNER_CIRCLE_SIZE }]}>
        <View style={styles.petContainer}>
          <PetCharacter petType={petType} healthScore={healthScore} size={PET_SIZE} showAnimation={true} />
        </View>
        <Text style={styles.percentage}>{Math.round(healthScore)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: 190, height: 190, alignItems: 'center', justifyContent: 'center' },
  progressRing: { position: 'absolute' },
  innerCircle: {
    borderRadius: 85,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  petContainer: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center', marginTop: -10 },
  percentage: { position: 'absolute', bottom: 20, fontSize: 24, fontWeight: '700', color: '#5856D6' },
});

export default PetHero;


