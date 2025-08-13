import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import { useStore } from './src/store/useStore';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { View } from 'react-native';

export default function App() {
  const initializeApp = useStore((state) => state.initializeApp);
  const onboardingComplete = useStore((state) => state.user.onboardingComplete);

  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        {onboardingComplete ? (
          <MainTabNavigator />
        ) : (
          <OnboardingScreen />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}