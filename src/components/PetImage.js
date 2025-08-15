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
    // Sizes tuned for a 100px pet; scale relative to current size
    const t = type === 'hat' ? 'tophat' : type === 'glasses' ? 'sunglasses' : type;
    const scale = size / 100;
    switch (t) {
      case 'crown':
        return { position: 'absolute', width: 50 * scale, height: 40 * scale, top: -4 * scale, left: (size - 50 * scale) / 2, zIndex: 1 };
      case 'tophat':
        return { position: 'absolute', width: 46 * scale, height: 52 * scale, top: -6 * scale, left: (size - 46 * scale) / 2, zIndex: 1 };
      case 'bowtie':
        return { position: 'absolute', width: 40 * scale, height: 25 * scale, top: 62 * scale, left: (size - 40 * scale) / 2, zIndex: 2 };
      case 'sunglasses':
        return { position: 'absolute', width: 52 * scale, height: 22 * scale, top: 24 * scale, left: (size - 52 * scale) / 2, zIndex: 2 };
      default:
        return { position: 'absolute' };
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


