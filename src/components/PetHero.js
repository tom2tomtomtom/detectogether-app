import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import PetCharacter from './PetCharacter';

const PetHero = ({ healthScore = 50, petType = 'cat' }) => {
  const size = 190;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (circumference * Math.max(0, Math.min(100, healthScore))) / 100;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={styles.progressRing}>
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#5856D6" />
            <Stop offset="100%" stopColor="#8B5CF6" />
          </LinearGradient>
        </Defs>
        <Circle stroke="rgba(88,86,214,0.1)" fill="none" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
        <Circle
          stroke="url(#grad)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>

      <View style={styles.innerCircle}>
        <PetCharacter petType={petType} healthScore={Math.round(healthScore)} size={80} showAnimation={true} />
        <Text style={styles.percentage}>{Math.round(healthScore)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: 190, height: 190, alignItems: 'center', justifyContent: 'center' },
  progressRing: { position: 'absolute' },
  innerCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  percentage: { marginTop: 5, fontSize: 24, fontWeight: '700', color: '#5856D6' },
});

export default PetHero;


