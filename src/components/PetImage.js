import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const PetImage = ({ mood = 'normal', size = 150, accessory = null }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  
  // Regular pet images
  const petImages = {
    happy: require('../../assets/pets/happy.png'),
    normal: require('../../assets/pets/normal.png'),
    sad: require('../../assets/pets/sad.png'),
    sleeping: require('../../assets/pets/sleep.png'),
    sick: require('../../assets/pets/sick.png'),
  };
  
  // Blinking versions
  const petImagesBlinking = {
    happy: require('../../assets/pets/happy-blink.png'),
    normal: require('../../assets/pets/normal-blink.png'),
    sad: require('../../assets/pets/sad-blink.png'),
    sick: require('../../assets/pets/sick-blink.png'),
  };
  
  // Accessory images - same size as pet, pre-positioned
  const accessoryImages = {
    crown: require('../../assets/pets/crown.png'),
    bowtie: require('../../assets/pets/bowtie.png'),
    sunglasses: require('../../assets/pets/sunnies.png'),
    tophat: require('../../assets/pets/tophat.png'),
  };
  
  // Blinking animation
  useEffect(() => {
    if (mood === 'sleeping') {
      setIsBlinking(false);
      return;
    }
    
    let blinkTimer;
    
    const scheduleNextBlink = () => {
      const delay = 2000 + Math.random() * 3000;
      
      blinkTimer = setTimeout(() => {
        setIsBlinking(true);
        
        setTimeout(() => {
          setIsBlinking(false);
          
          if (Math.random() < 0.2) {
            setTimeout(() => {
              setIsBlinking(true);
              setTimeout(() => {
                setIsBlinking(false);
                scheduleNextBlink();
              }, 150);
            }, 200);
          } else {
            scheduleNextBlink();
          }
        }, 150);
      }, delay);
    };
    
    scheduleNextBlink();
    
    return () => {
      if (blinkTimer) clearTimeout(blinkTimer);
    };
  }, [mood]);
  
  // Choose which image to show
  const getImage = () => {
    if (isBlinking && petImagesBlinking[mood]) {
      return petImagesBlinking[mood];
    }
    return petImages[mood] || petImages.normal;
  };
  
  // Since all images are same size and pre-positioned, just overlay at full size
  const imageStyle = {
    position: 'absolute',
    width: size,
    height: size,
  };
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Pet base image with blinking */}
      <Image 
        source={getImage()} 
        style={imageStyle} 
        resizeMode="contain" 
      />
      
      {/* Accessory overlay - same size, pre-positioned */}
      {accessory && accessoryImages[accessory] && (
        <Image 
          source={accessoryImages[accessory]} 
          style={imageStyle} 
          resizeMode="contain" 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PetImage;
