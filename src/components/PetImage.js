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

  // Positioning with cropped assets (centered math)
  const getAccessoryStyle = (type) => {
    const t = type === 'hat' ? 'tophat' : type === 'glasses' ? 'sunglasses' : type;
    const base = size * 0.33; // slightly larger baseline for visibility
    switch (t) {
      case 'crown': {
        const w = base;
        const h = base * 0.6;
        return { width: w, height: h, position: 'absolute', top: size * 0.08, left: (size - w) / 2, zIndex: 1 };
      }
      case 'tophat': {
        const w = base * 0.9;
        const h = base * 1.05;
        return { width: w, height: h, position: 'absolute', top: size * 0.02, left: (size - w) / 2, zIndex: 1 };
      }
      case 'bowtie': {
        const w = base * 0.7;
        const h = base * 0.5;
        return { width: w, height: h, position: 'absolute', top: size * 0.48, left: (size - w) / 2, zIndex: 2 };
      }
      case 'sunglasses': {
        const w = base;
        const h = base * 0.4;
        return { width: w, height: h, position: 'absolute', top: size * 0.28, left: (size - w) / 2, zIndex: 2 };
      }
      default: {
        const w = base;
        const h = base;
        return { width: w, height: h, position: 'absolute', top: size * 0.25, left: (size - w) / 2, zIndex: 1 };
      }
    }
  };

  const list = [...(accessories && accessories.length ? accessories : accessory ? [accessory] : [])];
  const hatTypes = ['crown', 'tophat', 'hat'];
  const frontTypes = ['bowtie', 'sunglasses', 'glasses'];
  const backs = list.filter((a) => hatTypes.includes(a) && accessoryImages[a]);
  const fronts = list.filter((a) => frontTypes.includes(a) && accessoryImages[a]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Back accessories (hats) */}
      {backs.map((a) => (
        <Image key={`back-${a}`} source={accessoryImages[a]} style={getAccessoryStyle(a)} resizeMode="contain" />
      ))}
      {/* Pet */}
      <Image source={petImages[mood] || petImages.normal} style={styles.petImage} resizeMode="contain" />
      {/* Front accessories */}
      {fronts.map((a) => (
        <Image key={`front-${a}`} source={accessoryImages[a]} style={getAccessoryStyle(a)} resizeMode="contain" />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  petImage: { position: 'absolute' },
  accessoryImage: { position: 'absolute', zIndex: 1 },
});

export default PetImage;


