import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const PetImage = ({ mood = 'normal', size = 150, accessory = null }) => {
  const petImages = {
    happy: require('../../assets/pet-happy.png'),
    normal: require('../../assets/pet-normal.png'),
    sad: require('../../assets/pet-sad.png'),
    sleeping: require('../../assets/pet-sleeping.png'),
    sick: require('../../assets/pet-sick.png'),
  };

  const accessoryImages = {
    crown: require('../../assets/crown.png'),
    bowtie: require('../../assets/bowtie.png'),
    sunglasses: require('../../assets/sunglasses.png'),
    tophat: require('../../assets/tophat.png'),
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image source={petImages[mood] || petImages.normal} style={[styles.petImage, { width: size, height: size }]} resizeMode="contain" />
      {accessory && accessoryImages[accessory] && (
        <Image
          source={accessoryImages[accessory]}
          style={[
            styles.accessoryImage,
            {
              width: size * 0.3,
              height: size * 0.3,
              top: accessory === 'bowtie' ? size * 0.45 : size * 0.05,
            },
          ]}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  petImage: { position: 'absolute' },
  accessoryImage: { position: 'absolute', zIndex: 1 },
});

export default PetImage;


