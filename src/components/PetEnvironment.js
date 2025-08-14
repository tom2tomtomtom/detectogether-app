import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Circle, Path, G, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';
import PetCharacter from './PetCharacter';

export default function PetEnvironment({ level = 0, size = 240, petSize = 200, petType, healthScore }) {
  const w = size;
  const h = size;

  const renderScene = () => {
    if (level <= 0) return null;
    if (level === 1) {
      return (
        <G>
          <Path d={`M0 ${h - 30} Q ${w / 2} ${h - 60} ${w} ${h - 30} L ${w} ${h} L 0 ${h} Z`} fill="#C8E6C9" />
          <Circle cx={w * 0.3} cy={h - 40} r={4} fill="#FFB3C1" />
          <Circle cx={w * 0.7} cy={h - 38} r={4} fill="#FFD166" />
        </G>
      );
    }
    if (level === 2) {
      return (
        <G>
          <Path d={`M0 ${h - 30} Q ${w / 2} ${h - 70} ${w} ${h - 30} L ${w} ${h} L 0 ${h} Z`} fill="#B2DFDB" />
          <G>
            <Path d={`M${w * 0.2} ${h - 30} q10 -40 20 0`} stroke="#7CB342" strokeWidth={8} strokeLinecap="round" />
            <Circle cx={w * 0.2 + 10} cy={h - 62} r={10} fill="#A5D6A7" />
          </G>
          <Circle cx={w * 0.8} cy={h * 0.25} r={12} fill="#FFEB3B" opacity={0.9} />
          {[0.25, 0.5, 0.75, 0.6].map((p, i) => (
            <Circle key={i} cx={w * p} cy={h - 38 - i * 4} r={4} fill={i % 2 ? '#FFB3C1' : '#FFD166'} />
          ))}
        </G>
      );
    }
    if (level === 3) {
      return (
        <G>
          <Rect x={0} y={h - 36} width={w} height={36} fill="#C8E6C9" />
          <Path d={`M0 ${h - 18} Q ${w / 2} ${h - 28} ${w} ${h - 18}`} stroke="#A5D6A7" strokeWidth={8} />
          <G>
            <Path d={`M${w * 0.2} ${h - 30} q10 -40 20 0`} stroke="#7CB342" strokeWidth={8} strokeLinecap="round" />
            <Circle cx={w * 0.2 + 10} cy={h - 62} r={12} fill="#A5D6A7" />
            <Path d={`M${w * 0.75} ${h - 30} q-10 -36 -20 0`} stroke="#7CB342" strokeWidth={8} strokeLinecap="round" />
            <Circle cx={w * 0.75 - 10} cy={h - 60} r={12} fill="#A5D6A7" />
          </G>
          {/* simple butterflies */}
          <Path d={`M${w * 0.6} ${h - 70} q8 -8 16 0`} stroke="#FF8A80" strokeWidth={2} />
          <Path d={`M${w * 0.6} ${h - 70} q8 8 16 0`} stroke="#FF8A80" strokeWidth={2} />
        </G>
      );
    }
    // level 4
    return (
      <G>
        <Rect x={0} y={h - 36} width={w} height={36} fill="#B2DFDB" />
        <Circle cx={w * 0.15} cy={h - 18} r={6} fill="#90A4AE" />
        <Circle cx={w * 0.2} cy={h - 20} r={8} fill="#90A4AE" />
        <Circle cx={w * 0.25} cy={h - 16} r={5} fill="#90A4AE" />
        <Path d={`M${w * 0.6} ${h - 30} q16 -50 32 0`} stroke="#7CB342" strokeWidth={10} strokeLinecap="round" />
        <Circle cx={w * 0.6 + 16} cy={h - 70} r={14} fill="#A5D6A7" />
        <Path d={`M${w * 0.35} ${h - 28} h60 v10 h-60 z`} fill="#BDBDBD" opacity={0.6} />
        {/* rainbow */}
        <Path d={`M${w * 0.1} ${h - 60} q40 -40 80 0`} stroke="#F44336" strokeWidth={6} fill="none" />
        <Path d={`M${w * 0.1} ${h - 54} q40 -40 80 0`} stroke="#FFEB3B" strokeWidth={6} fill="none" />
        <Path d={`M${w * 0.1} ${h - 48} q40 -40 80 0`} stroke="#4CAF50" strokeWidth={6} fill="none" />
      </G>
    );
  };

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${w} ${h}`}> 
        {/* background circle */}
        <Circle cx={w / 2} cy={h / 2} r={w / 2} fill="#FFFFFF" />
        {renderScene()}
      </Svg>
      <View style={{ position: 'absolute', left: 0, top: 0, width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <PetCharacter petType={petType} healthScore={healthScore} size={petSize} isAnimating={true} />
      </View>
    </View>
  );
}


