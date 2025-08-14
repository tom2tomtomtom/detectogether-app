import React, { useMemo } from 'react';
import { SvgXml } from 'react-native-svg';
import pixelPetSVG from './PixelPetSVG';

const moodToState = {
  normal: 'default',
  happy: 'happy',
  sad: 'sad',
  sleeping: 'tired',
  celebrating: 'happy',
  critical: 'sad',
};

export default function PixelPet({ type = 'pup8', mood = 'normal', size = 150 }) {
  const stateClass = moodToState[mood] || 'default';

  const xml = useMemo(() => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="${size}" height="${size}" class="state-${stateClass}">
      ${pixelPetSVG}
      <use href="#${type}" x="0" y="0" width="16" height="16" />
    </svg>
  `, [size, stateClass, type]);

  return <SvgXml xml={xml} />;
}


