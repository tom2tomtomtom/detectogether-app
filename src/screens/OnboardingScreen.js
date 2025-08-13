import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useStore } from '../store/useStore';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const PETS = [
  { id: 'dog', name: 'Buddy', emoji: '🐕' },
  { id: 'cat', name: 'Whiskers', emoji: '🐱' },
  { id: 'bird', name: 'Chirpy', emoji: '🐦' },
  { id: 'bunny', name: 'Hoppy', emoji: '🐰' },
  { id: 'dragon', name: 'Spark', emoji: '🐉' },
];

const SLIDES = [
  { key: 'welcome' },
  { key: 'benefits' },
  { key: 'pet' },
  { key: 'name' },
];

const OnboardingScreen = () => {
  const scrollRef = useRef(null);
  const [page, setPage] = useState(0);
  const [selectedPet, setSelectedPet] = useState('dog');
  const [petName, setPetName] = useState('');

  const setPetType = useStore((s) => s.setPetType);
  const setPetNameStore = useStore((s) => s.setPetName);
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const handleMomentumScrollEnd = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setPage(idx);
  };

  const goNext = () => {
    const next = Math.min(page + 1, SLIDES.length - 1);
    scrollRef.current?.scrollTo({ x: next * width, animated: true });
    setPage(next);
  };

  const bounceValues = useRef(Object.fromEntries(PETS.map((p) => [p.id, useSharedValue(0)]))).current;

  const onSelectPet = (id) => {
    setSelectedPet(id);
    const sv = bounceValues[id];
    sv.value = withSpring(-8, { damping: 10, stiffness: 120 }, () => {
      sv.value = withSpring(0, { damping: 10, stiffness: 120 });
    });
  };

  const getDotStyle = (i) => [styles.dot, page === i ? styles.dotActive : null];

  const onFinish = () => {
    setPetType(selectedPet);
    if (petName.trim().length > 0) {
      setPetNameStore(petName.trim());
    }
    completeOnboarding();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {/* Slide 1: Welcome */}
        <View style={styles.slide}>
          <Text style={styles.title}>Welcome to DetecTogether!</Text>
          <Text style={styles.subtitle}>Your pocket-sized health buddy</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={goNext}>
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Slide 2: Benefits */}
        <View style={styles.slide}>
          <Text style={styles.title}>Track What Matters</Text>
          <View style={styles.benefitsGrid}>
            <View style={styles.benefitItem}>
              <Icon name="water" size={28} color="#3B82F6" />
              <Text style={styles.benefitText}>Hydration</Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="flash" size={28} color="#F59E0B" />
              <Text style={styles.benefitText}>Energy</Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="nutrition" size={28} color="#10B981" />
              <Text style={styles.benefitText}>Gut</Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="eye" size={28} color="#8B5CF6" />
              <Text style={styles.benefitText}>Mind</Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="body" size={28} color="#EC4899" />
              <Text style={styles.benefitText}>Skin</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={goNext}>
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Slide 3: Pet Selection */}
        <View style={styles.slide}>
          <Text style={styles.title}>Choose Your Companion</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petsRow}>
            {PETS.map((p) => {
              const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bounceValues[p.id].value }] }));
              const selected = selectedPet === p.id;
              return (
                <TouchableOpacity key={p.id} style={[styles.petCard, selected && styles.petCardSelected]} onPress={() => onSelectPet(p.id)}>
                  <Animated.Text style={[styles.petEmoji, animatedStyle]}>{p.emoji}</Animated.Text>
                  <Text style={styles.petName}>{p.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity style={styles.primaryButton} onPress={goNext}>
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Slide 4: Name Pet */}
        <View style={styles.slide}>
          <Text style={styles.title}>Name your pet</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a name"
            placeholderTextColor="#9CA3AF"
            value={petName}
            onChangeText={setPetName}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={onFinish}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View key={i} style={getDotStyle(i)} />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  slide: {
    width,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  benefitsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  benefitItem: {
    width: '30%',
    alignItems: 'center',
    marginVertical: 12,
  },
  benefitText: {
    marginTop: 8,
    color: '#1F2937',
    fontWeight: '600',
  },
  petsRow: {
    paddingVertical: 20,
  },
  petCard: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  petCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  petEmoji: {
    fontSize: 48,
  },
  petName: {
    marginTop: 8,
    fontWeight: '600',
    color: '#1F2937',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#1F2937',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#3B82F6',
  },
});

export default OnboardingScreen;
