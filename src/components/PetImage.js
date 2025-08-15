import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const PetImage = ({ mood = 'normal', size = 150, accessory = null, accessories = [] }) => {
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
  
  // Blinking animation (always blink unless sleeping)
  useEffect(() => {
    if (mood === 'sleeping') {
      setIsBlinking(false);
      return;
    }

    let timers = [];
    let isMounted = true;
    const scheduledRef = { current: false };

    const scheduleNextBlink = () => {
      if (scheduledRef.current) return;
      let baseDelay = 2000;
      if (mood === 'happy') baseDelay = 1400;
      else if (mood === 'normal') baseDelay = 1600;
      else if (mood === 'sad') baseDelay = 1700;
      else if (mood === 'sick') baseDelay = 2100;
      else if (mood === 'critical') baseDelay = 2200;
      else if (mood === 'celebrating') baseDelay = 1500;
      const jitter = 200;
      const delay = baseDelay + (Math.random() * jitter - jitter / 2);

      scheduledRef.current = true;
      const t1 = setTimeout(() => {
        if (!isMounted) return;
        setIsBlinking(true);

        const t2 = setTimeout(() => {
          if (!isMounted) return;
          setIsBlinking(false);

          // 20% chance of quick double blink
          if (Math.random() < 0.2) {
            const t3 = setTimeout(() => {
              if (!isMounted) return;
              setIsBlinking(true);
              const t4 = setTimeout(() => {
                if (!isMounted) return;
                setIsBlinking(false);
                scheduledRef.current = false;
                scheduleNextBlink();
              }, 220);
              timers.push(t4);
            }, 220);
            timers.push(t3);
          } else {
            scheduledRef.current = false;
            scheduleNextBlink();
          }
        }, 220);
        timers.push(t2);
      }, delay);
      timers.push(t1);
    };

    const initial = setTimeout(scheduleNextBlink, 400);
    timers.push(initial);

    return () => {
      isMounted = false;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [mood]);
  
  // Normalize mood keys to available assets
  const normalizeMood = (m) => (m === 'critical' ? 'sick' : m);
  
  // Since all images are same size and pre-positioned, just overlay at full size
  const imageStyle = {
    position: 'absolute',
    width: size,
    height: size,
  };
  
  const baseKey = normalizeMood(mood);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Render both images; toggle with opacity to avoid caching glitches */}
      <Image
        source={petImages[baseKey] || petImages.normal}
        style={[imageStyle, { opacity: isBlinking ? 0 : 1, zIndex: 1 }]}
        resizeMode="contain"
      />
      <Image
        source={petImagesBlinking[baseKey]}
        style={[imageStyle, { opacity: isBlinking ? 1 : 0, zIndex: 2 }]}
        resizeMode="contain"
      />

      {/* Accessories */}
      {Array.isArray(accessories) && accessories.length > 0
        ? accessories.filter(Boolean).map((a) => (
            accessoryImages[a] ? (
              <Image key={`acc_${a}`} source={accessoryImages[a]} style={[imageStyle, { zIndex: 3 }]} resizeMode="contain" />
            ) : null
          ))
        : accessory && accessoryImages[accessory] && (
            <Image source={accessoryImages[accessory]} style={[imageStyle, { zIndex: 3 }]} resizeMode="contain" />
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
