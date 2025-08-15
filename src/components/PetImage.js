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
    
    // Precise positioning for 120px pet
    switch (t) {
      case 'crown':
        return { 
          position: 'absolute', 
          width: 80,      
          height: 64,     
          top: 10,        // Bottom of crown sits on top of head
          left: (size - 80) / 2, 
          zIndex: 1 
        };
      case 'tophat':
        return { 
          position: 'absolute', 
          width: 72,      
          height: 80,     
          top: 5,         // Bottom of hat sits on top of head
          left: (size - 72) / 2, 
          zIndex: 1 
        };
      case 'bowtie':
        return { 
          position: 'absolute', 
          width: 64,      
          height: 40,     
          top: size * 0.5 - 20,  // Center of pet (50% minus half height)
          left: (size - 64) / 2, 
          zIndex: 2 
        };
      case 'sunglasses':
        return { 
          position: 'absolute', 
          width: 86,      
          height: 36,     
          top: size * 0.3,  // Over eyes (30% down)
          left: (size - 86) / 2, 
          zIndex: 2 
        };
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
      <Image
        source={petImages[mood] || petImages.normal}
        style={[styles.petImage, { width: size, height: size }]}
        resizeMode="contain"
      />
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


