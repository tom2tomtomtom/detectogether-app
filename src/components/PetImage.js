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

  // Larger sizing/positioning rules for visibility
  const getAccessoryStyle = (type) => {
    const t = type === 'hat' ? 'tophat' : type === 'glasses' ? 'sunglasses' : type;
    switch (t) {
      case 'crown':
        return { width: size * 0.6, height: size * 0.4, top: size * 0.05, left: size * 0.2 };
      case 'tophat':
        return { width: size * 0.5, height: size * 0.5, top: 0, left: size * 0.25 };
      case 'bowtie':
        return { width: size * 0.4, height: size * 0.3, top: size * 0.5, left: size * 0.3 };
      case 'sunglasses':
        return { width: size * 0.5, height: size * 0.25, top: size * 0.3, left: size * 0.25 };
      default:
        return { width: size * 0.5, height: size * 0.5, top: size * 0.25, left: size * 0.25 };
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
        <Image key={`back-${a}`} source={accessoryImages[a]} style={[styles.accessoryImage, getAccessoryStyle(a)]} resizeMode="contain" />
      ))}
      {/* Pet */}
      <Image source={petImages[mood] || petImages.normal} style={[styles.petImage, { width: size, height: size }]} resizeMode="contain" />
      {/* Front accessories */}
      {fronts.map((a) => (
        <Image key={`front-${a}`} source={accessoryImages[a]} style={[styles.accessoryImage, getAccessoryStyle(a), { zIndex: 2 }]} resizeMode="contain" />
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


