import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const PetImage = ({ mood = 'normal', size = 150, accessory = null, accessories = [] }) => {
  const petImages = {
    happy: require('../../assets/pet-happy.png'),
    normal: require('../../assets/pet-normal.png'),
    sad: require('../../assets/pet-angry.png'), // fallback if pet-sad.png not present
    sleeping: require('../../assets/pet-sleeping.png'),
    sick: require('../../assets/pet-sick.png'),
  };

  const accessoryImages = {
    crown: require('../../assets/crown.png'),
    bowtie: require('../../assets/bowtie.png'),
    sunglasses: require('../../assets/sunglasses.png'),
    tophat: require('../../assets/tophat.png'),
    // Back-compat synonyms
    hat: require('../../assets/tophat.png'),
    glasses: require('../../assets/sunglasses.png'),
  };

  // New sizing/positioning rules (more generous sizes and tuned offsets)
  const getAccessoryStyle = (type) => {
    const t = type === 'hat' ? 'tophat' : type === 'glasses' ? 'sunglasses' : type;
    const base = size * 0.4; // 40% of pet size
    switch (t) {
      case 'crown':
        return { width: base, height: base * 0.7, top: -size * 0.05, left: size * 0.3 };
      case 'tophat':
        return { width: base * 0.8, height: base, top: -size * 0.08, left: size * 0.32 };
      case 'bowtie':
        return { width: base * 0.7, height: base * 0.5, top: size * 0.4, left: size * 0.35 };
      case 'sunglasses':
        return { width: base * 0.9, height: base * 0.4, top: size * 0.25, left: size * 0.28 };
      default:
        return { width: base, height: base, top: 0, left: size * 0.3 };
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image source={petImages[mood] || petImages.normal} style={[styles.petImage, { width: size, height: size }]} resizeMode="contain" />
      {[...(accessories && accessories.length ? accessories : (accessory ? [accessory] : []))]
        .filter((a) => !!accessoryImages[a])
        .map((a) => {
          const st = getAccessoryStyle(a);
          return (
            <Image
              key={a}
              source={accessoryImages[a]}
              style={[styles.accessoryImage, st]}
              resizeMode="contain"
            />
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  petImage: { position: 'absolute' },
  accessoryImage: { position: 'absolute', zIndex: 1 },
});

export default PetImage;


