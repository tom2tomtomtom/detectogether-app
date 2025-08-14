import React, { useEffect, useMemo, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { Platform } from 'react-native';

// Helper to safely require based on color/mood. Adjust paths to match your assets.
const getSource = (color, mood) => {
  try {
    switch (color) {
      case 'brown':
        return require('../../../assets/lottie/dog/brown/dog_normal.json');
      case 'black':
        return require('../../../assets/lottie/dog/black/dog_normal.json');
      case 'white':
        return require('../../../assets/lottie/dog/white/dog_normal.json');
      case 'golden':
      default:
        return require('../../../assets/lottie/dog/golden/dog_normal.json');
    }
  } catch (e) {
    // Fallback if a specific file is missing
    try {
      return require('../../../assets/lottie/dog/golden/dog_normal.json');
    } catch (err) {
      return null;
    }
  }
};

export default function DogPetLottie({ mood = 'normal', color = 'golden', size = 80, loop = true, speed = 1 }) {
  const ref = useRef(null);
  const source = useMemo(() => getSource(color, mood), [color, mood]);

  useEffect(() => {
    if (ref.current) {
      try {
        ref.current.reset?.();
        ref.current.play?.();
      } catch (e) {}
    }
  }, [source]);

  if (!source) return null;

  return (
    <LottieView
      ref={ref}
      source={source}
      autoPlay
      loop={loop}
      speed={speed}
      style={{ width: size, height: size }}
      // If you export segments/markers, you can control via ref.current.play(startFrame, endFrame)
    />
  );
}


